const predictionKey = "paul:predictions:v2";
const resultKey = "paul:results:v1";
const auditKey = "paul:audit:v1";
const evidenceKey = "paul:evidence:v1";
const dailyAnalysisKey = "paul:daily-analysis:v1";
const pollKey = "paul:polls:v1";
const rateLimitPrefix = "paul:rate:";

function storeConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

function isSharedStoreConfigured() {
  const { url, token } = storeConfig();
  return Boolean(url && token);
}

async function redisCommand(command) {
  const { url, token } = storeConfig();
  if (!url || !token) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Shared prediction store failed: ${response.status} ${text.slice(0, 200)}`);
  }
  return text ? JSON.parse(text).result : null;
}

async function getPredictions() {
  if (!isSharedStoreConfigured()) return {};
  const value = await redisCommand(["GET", predictionKey]);
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function setPrediction(matchId, record) {
  if (!isSharedStoreConfigured()) return false;
  const predictions = await getPredictions();
  if (predictions[matchId]) return true;
  predictions[matchId] = record;
  await redisCommand(["SET", predictionKey, JSON.stringify(predictions)]);
  return true;
}

async function getResults() {
  if (!isSharedStoreConfigured()) return {};
  const value = await redisCommand(["GET", resultKey]);
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function setResult(matchId, record) {
  if (!isSharedStoreConfigured()) return false;
  const results = await getResults();
  results[matchId] = record;
  await redisCommand(["SET", resultKey, JSON.stringify(results)]);
  return true;
}

async function getAuditLog() {
  if (!isSharedStoreConfigured()) return {};
  const value = await redisCommand(["GET", auditKey]);
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function setAuditEntry(entry) {
  if (!isSharedStoreConfigured()) return false;
  const log = await getAuditLog();
  log[entry.id] = entry;
  await redisCommand(["SET", auditKey, JSON.stringify(log)]);
  return true;
}

async function getEvidenceCache() {
  if (!isSharedStoreConfigured()) return {};
  const value = await redisCommand(["GET", evidenceKey]);
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function setEvidenceEntry(matchId, record) {
  if (!isSharedStoreConfigured()) return false;
  const cache = await getEvidenceCache();
  cache[matchId] = record;
  await redisCommand(["SET", evidenceKey, JSON.stringify(cache)]);
  return true;
}

async function getDailyAnalysis() {
  if (!isSharedStoreConfigured()) return {};
  const value = await redisCommand(["GET", dailyAnalysisKey]);
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function setDailyAnalysisEntry(matchId, record) {
  if (!isSharedStoreConfigured()) return false;
  const cache = await getDailyAnalysis();
  cache[matchId] = record;
  await redisCommand(["SET", dailyAnalysisKey, JSON.stringify(cache)]);
  return true;
}

async function getPolls() {
  if (!isSharedStoreConfigured()) return {};
  const value = await redisCommand(["GET", pollKey]);
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function publicPoll(record = {}) {
  const votes = {
    home: Number(record.votes?.home || 0),
    draw: Number(record.votes?.draw || 0),
    away: Number(record.votes?.away || 0)
  };
  return {
    votes,
    total: votes.home + votes.draw + votes.away,
    updatedAt: record.updatedAt || null
  };
}

async function getPoll(matchId) {
  const polls = await getPolls();
  return publicPoll(polls[matchId] || polls[String(matchId)]);
}

async function setPollVote(matchId, voterId, side) {
  if (!isSharedStoreConfigured()) return publicPoll();
  const allowed = new Set(["home", "draw", "away"]);
  if (!allowed.has(side)) throw new Error("Invalid poll side.");
  const polls = await getPolls();
  const key = String(matchId);
  const record = polls[key] || { votes: { home: 0, draw: 0, away: 0 }, voters: {}, updatedAt: null };
  record.votes ||= { home: 0, draw: 0, away: 0 };
  record.voters ||= {};
  const previous = record.voters[voterId];
  if (previous && allowed.has(previous) && record.votes[previous] > 0) record.votes[previous] -= 1;
  record.voters[voterId] = side;
  record.votes[side] = Number(record.votes[side] || 0) + 1;
  record.updatedAt = new Date().toISOString();
  polls[key] = record;
  await redisCommand(["SET", pollKey, JSON.stringify(polls)]);
  return publicPoll(record);
}

async function getRateLimit(key) {
  if (!isSharedStoreConfigured()) return null;
  const value = await redisCommand(["GET", `${rateLimitPrefix}${key}`]);
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function setRateLimit(key, record, ttlSeconds = 3600) {
  if (!isSharedStoreConfigured()) return false;
  await redisCommand(["SET", `${rateLimitPrefix}${key}`, JSON.stringify(record), "EX", ttlSeconds]);
  return true;
}

module.exports = {
  getDailyAnalysis,
  getEvidenceCache,
  getPoll,
  getRateLimit,
  getAuditLog,
  getPredictions,
  getResults,
  isSharedStoreConfigured,
  setAuditEntry,
  setDailyAnalysisEntry,
  setEvidenceEntry,
  setPollVote,
  setPrediction,
  setRateLimit,
  setResult
};
