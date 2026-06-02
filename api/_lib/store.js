const predictionKey = "paul:predictions:v2";
const resultKey = "paul:results:v1";
const auditKey = "paul:audit:v1";

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

module.exports = {
  getAuditLog,
  getPredictions,
  getResults,
  isSharedStoreConfigured,
  setAuditEntry,
  setPrediction,
  setResult
};
