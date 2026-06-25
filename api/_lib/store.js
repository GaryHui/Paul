const predictionKey = "paul:predictions:v2";
const resultKey = "paul:results:v1";
const auditKey = "paul:audit:v1";
const evidenceKey = "paul:evidence:v1";
const dailyAnalysisKey = "paul:daily-analysis:v1";
const mistakeMemoryKey = "paul:mistake-memory:v1";
const qwenUsageKey = "paul:qwen-usage:v1";
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
  const previous = cache[matchId] || cache[String(matchId)] || {};
  const historyItem = {
    generatedAt: record.generatedAt,
    pick: record.pick || null,
    probabilities: record.probabilities || null,
    freshness: record.freshness || null
  };
  const history = Array.isArray(previous.history) ? previous.history.slice(-89) : [];
  if (!history.some((entry) => entry.generatedAt === historyItem.generatedAt)) {
    history.push(historyItem);
  }
  cache[matchId] = { ...record, history };
  await redisCommand(["SET", dailyAnalysisKey, JSON.stringify(cache)]);
  return true;
}

async function getMistakeMemory() {
  if (!isSharedStoreConfigured()) return {};
  const value = await redisCommand(["GET", mistakeMemoryKey]);
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function setMistakeMemory(record) {
  if (!isSharedStoreConfigured()) return false;
  await redisCommand(["SET", mistakeMemoryKey, JSON.stringify(record || {})]);
  return true;
}

async function setMistakeEntry(matchId, review) {
  if (!isSharedStoreConfigured()) return false;
  const memory = await getMistakeMemory();
  memory.matches ||= {};
  memory.matches[matchId] = review;
  memory.updatedAt = new Date().toISOString();
  await redisCommand(["SET", mistakeMemoryKey, JSON.stringify(memory)]);
  return true;
}

async function getQwenUsage() {
  if (!isSharedStoreConfigured()) return { version: "paul-qwen-usage-v1", events: [], byDate: {} };
  const value = await redisCommand(["GET", qwenUsageKey]);
  if (!value) return { version: "paul-qwen-usage-v1", events: [], byDate: {} };
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return { version: "paul-qwen-usage-v1", events: [], byDate: {} };
  }
}

function numericUsage(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

async function recordQwenUsage(entry = {}) {
  if (!isSharedStoreConfigured()) return false;
  const usage = entry.usage || {};
  const createdAt = entry.createdAt || new Date().toISOString();
  const date = createdAt.slice(0, 10);
  const record = {
    id: entry.id || `${createdAt}:${entry.source || "qwen"}:${entry.matchId || "na"}`,
    createdAt,
    date,
    source: entry.source || "qwen",
    matchId: entry.matchId || null,
    model: entry.model || null,
    promptTokens: numericUsage(usage.prompt_tokens ?? usage.promptTokens ?? usage.input_tokens ?? usage.inputTokens),
    completionTokens: numericUsage(usage.completion_tokens ?? usage.completionTokens ?? usage.output_tokens ?? usage.outputTokens),
    totalTokens: numericUsage(usage.total_tokens ?? usage.totalTokens ?? usage.total)
  };
  if (!record.totalTokens) record.totalTokens = record.promptTokens + record.completionTokens;
  const ledger = await getQwenUsage();
  ledger.version = "paul-qwen-usage-v1";
  ledger.updatedAt = new Date().toISOString();
  ledger.events = Array.isArray(ledger.events) ? ledger.events.filter((item) => item.id !== record.id).slice(-999) : [];
  ledger.events.push(record);
  ledger.byDate ||= {};
  ledger.byDate[date] ||= { calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0, sources: {}, models: {} };
  const day = ledger.byDate[date];
  day.sources ||= {};
  day.models ||= {};
  day.calls += 1;
  day.promptTokens += record.promptTokens;
  day.completionTokens += record.completionTokens;
  day.totalTokens += record.totalTokens;
  day.sources[record.source] ||= { calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  day.sources[record.source].calls += 1;
  day.sources[record.source].promptTokens += record.promptTokens;
  day.sources[record.source].completionTokens += record.completionTokens;
  day.sources[record.source].totalTokens += record.totalTokens;
  const modelKey = record.model || "unknown";
  day.models[modelKey] ||= { calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  day.models[modelKey].calls += 1;
  day.models[modelKey].promptTokens += record.promptTokens;
  day.models[modelKey].completionTokens += record.completionTokens;
  day.models[modelKey].totalTokens += record.totalTokens;
  await redisCommand(["SET", qwenUsageKey, JSON.stringify(ledger)]);
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
  getMistakeMemory,
  getPoll,
  getQwenUsage,
  getRateLimit,
  getAuditLog,
  getPredictions,
  getResults,
  isSharedStoreConfigured,
  setAuditEntry,
  setDailyAnalysisEntry,
  setEvidenceEntry,
  setMistakeEntry,
  setMistakeMemory,
  setPollVote,
  setPrediction,
  recordQwenUsage,
  setRateLimit,
  setResult
};
