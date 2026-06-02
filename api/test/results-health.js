const { configuredProviders, fetchMatchResult, providerName } = require("../_lib/results");
const { loadSnapshot } = require("../_lib/paul");

function requestToken(req) {
  const auth = req.headers?.authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  if (req.headers?.["x-verify-token"]) return String(req.headers["x-verify-token"]).trim();
  try {
    const url = new URL(req.url || "", "https://paul.local");
    return url.searchParams.get("token") || url.searchParams.get("verify") || "";
  } catch {
    return "";
  }
}

function verifyAccess(req) {
  const expected = process.env.VERIFY_TOKEN;
  if (!expected) {
    const error = new Error("VERIFY_TOKEN is not configured.");
    error.status = 403;
    throw error;
  }
  if (requestToken(req) !== expected) {
    const error = new Error("Unauthorized verify request.");
    error.status = 401;
    throw error;
  }
}

async function checkWorldcup26() {
  const startedAt = Date.now();
  const response = await fetch("https://worldcup26.ir/get/games");
  const elapsedMs = Date.now() - startedAt;
  if (!response.ok) {
    return { provider: "worldcup26", ok: false, status: response.status, elapsedMs };
  }
  const data = await response.json();
  const games = data.games || data.data || [];
  return {
    provider: "worldcup26",
    ok: games.length >= 100,
    status: response.status,
    elapsedMs,
    matchCount: games.length,
    firstMatchFinished: games[0]?.finished || null
  };
}

async function checkZafronix() {
  if (!process.env.ZAFRONIX_API_KEY) {
    return { provider: "zafronix", ok: false, skipped: true, reason: "ZAFRONIX_API_KEY is not configured." };
  }
  const baseUrl = process.env.ZAFRONIX_BASE_URL || "https://api.zafronix.com/fifa/worldcup/v1";
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/tournaments/2026`, {
    headers: { "X-API-Key": process.env.ZAFRONIX_API_KEY }
  });
  const elapsedMs = Date.now() - startedAt;
  return {
    provider: "zafronix",
    ok: response.ok,
    status: response.status,
    elapsedMs
  };
}

async function checkFootballData() {
  return {
    provider: "football-data",
    ok: Boolean(process.env.FOOTBALL_DATA_API_KEY),
    skipped: !process.env.FOOTBALL_DATA_API_KEY,
    reason: process.env.FOOTBALL_DATA_API_KEY ? "Configured." : "FOOTBALL_DATA_API_KEY is not configured."
  };
}

async function checkGeneric() {
  return {
    provider: "generic",
    ok: Boolean(process.env.RESULTS_API_URL),
    skipped: !process.env.RESULTS_API_URL,
    reason: process.env.RESULTS_API_URL ? "Configured." : "RESULTS_API_URL is not configured."
  };
}

async function providerHealth(provider) {
  try {
    if (provider === "worldcup26") return await checkWorldcup26();
    if (provider === "zafronix") return await checkZafronix();
    if (provider === "football-data") return await checkFootballData();
    if (provider === "generic") return await checkGeneric();
    return { provider, ok: false, reason: "Unknown provider." };
  } catch (error) {
    return { provider, ok: false, error: error.message };
  }
}

module.exports = async function handler(req, res) {
  try {
    verifyAccess(req);
    const snapshot = loadSnapshot();
    const firstPlayable = snapshot.matches.find((match) => match.teamA?.code && match.teamB?.code);
    const providers = configuredProviders();
    const checks = await Promise.all(providers.map((provider) => providerHealth(provider)));
    const firstMatchResult = firstPlayable ? await fetchMatchResult(firstPlayable) : null;
    const safeBeforeKickoff = firstMatchResult === null;

    res.status(200).json({
      status: checks.some((check) => check.ok) && safeBeforeKickoff ? "pass" : "fail",
      generatedAt: new Date().toISOString(),
      providerName: providerName(),
      providers,
      checks,
      firstPlayable: firstPlayable
        ? {
            id: firstPlayable.id,
            label: `${firstPlayable.teamA.name} vs ${firstPlayable.teamB.name}`,
            round: firstPlayable.round,
            date: firstPlayable.date
          }
        : null,
      safeBeforeKickoff,
      firstMatchResult,
      writesProductionData: false
    });
  } catch (error) {
    res.status(error.status || 500).json({ status: "fail", error: error.message });
  }
};
