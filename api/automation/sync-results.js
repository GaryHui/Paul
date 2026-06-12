const { parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { loadSnapshot } = require("../_lib/paul");
const { fetchMatchResult } = require("../_lib/results");
const { getEvidenceCache, getPredictions, getResults, setResult } = require("../_lib/store");

const resultSyncDelayHours = Number(process.env.RESULT_SYNC_DELAY_HOURS || 2);
const defaultMaxMatches = Number(process.env.RESULT_SYNC_MAX_MATCHES || 12);

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

function assertAllowed(req) {
  const cronSecret = process.env.CRON_SECRET;
  const verifyToken = process.env.VERIFY_TOKEN;
  const auth = req.headers?.authorization || "";
  const token = requestToken(req);
  if ((cronSecret && (auth === `Bearer ${cronSecret}` || token === cronSecret)) || (verifyToken && token === verifyToken)) return;
  const error = new Error("Unauthorized result sync.");
  error.status = 401;
  throw error;
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload, null, 2));
}

function storedKickoffAt(match, predictions, evidenceCache) {
  const prediction = predictions?.[match.id] || predictions?.[String(match.id)] || null;
  const evidence = evidenceCache?.[match.id] || evidenceCache?.[String(match.id)] || null;
  const candidates = [
    prediction?.evidence?.market?.intelligence?.kickoffAt,
    prediction?.proof?.payload?.evidence?.market?.intelligence?.kickoffAt,
    evidence?.market?.intelligence?.kickoffAt,
    evidence?.market?.kickoffAt,
    evidence?.kickoffAt
  ].filter(Boolean);
  for (const value of candidates) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return parseMatchTime(match);
}

module.exports = async function handler(req, res) {
  try {
    if (!["GET", "POST"].includes(req.method)) {
      res.setHeader("Allow", "GET, POST");
      return json(res, 405, { error: "Method not allowed." });
    }
    assertAllowed(req);
    const url = new URL(req.url || "", "https://paul.local");
    const force = req.method === "POST" && (req.body?.force || url.searchParams.get("force") === "1");
    const limit = Math.max(1, Math.min(72, Number(url.searchParams.get("limit") || defaultMaxMatches)));
    const snapshot = loadSnapshot();
    const [predictions, results, evidenceCache] = await Promise.all([
      getPredictions(),
      getResults(),
      getEvidenceCache()
    ]);
    const now = new Date();
    const events = [];
    let attempted = 0;
    let synced = 0;
    let eligible = 0;
    const resolvedMatches = resolveMatches(snapshot.matches || [], results);

    for (const match of resolvedMatches) {
      if (!match.teamA?.code || !match.teamB?.code || results[match.id] || results[String(match.id)]) continue;
      const kickoffAt = storedKickoffAt(match, predictions, evidenceCache);
      if (!kickoffAt || Number.isNaN(kickoffAt.getTime())) continue;
      const resultAt = new Date(kickoffAt.getTime() + resultSyncDelayHours * 60 * 60 * 1000);
      if (!force && now < resultAt) continue;
      eligible += 1;
      if (attempted >= limit) {
        events.push({ type: "result", matchId: match.id, status: "skipped", reason: "limit reached", dueAt: resultAt.toISOString() });
        continue;
      }
      attempted += 1;
      try {
        const result = await fetchMatchResult(match);
        if (result) {
          await setResult(match.id, result);
          synced += 1;
          events.push({
            type: "result",
            matchId: match.id,
            status: "ok",
            source: result.source || null,
            score: `${result.homeScore}-${result.awayScore}`,
            winnerCode: resultWinnerCode(match, result),
            kickoffAt: kickoffAt.toISOString()
          });
        } else {
          events.push({ type: "result", matchId: match.id, status: "missing", kickoffAt: kickoffAt.toISOString() });
        }
      } catch (error) {
        events.push({ type: "result", matchId: match.id, status: "error", error: error.message, kickoffAt: kickoffAt.toISOString() });
      }
    }

    return json(res, 200, {
      status: "ok",
      generatedAt: now.toISOString(),
      resultSyncDelayHours,
      eligible,
      attempted,
      synced,
      existingResults: Object.keys(results).length,
      events
    });
  } catch (error) {
    return json(res, error.status || 500, { error: error.message || "Result sync failed." });
  }
};
