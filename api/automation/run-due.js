const { callPaul, loadSnapshot } = require("../_lib/paul");
const { attachAuditProof } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { refreshDailyAnalysis } = require("../_lib/daily-analysis");
const { refreshMarketEvidence } = require("../_lib/evidence-refresh");
const { fetchMatchResult } = require("../_lib/results");
const { getPredictions, getResults, setPrediction, setResult } = require("../_lib/store");

const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 24);
const resultSyncDelayHours = Number(process.env.RESULT_SYNC_DELAY_HOURS || 3);

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

function assertOwner(req) {
  const expected = process.env.VERIFY_TOKEN;
  if (!expected) {
    const error = new Error("VERIFY_TOKEN is not configured.");
    error.status = 403;
    throw error;
  }
  if (requestToken(req) !== expected) {
    const error = new Error("Unauthorized force run.");
    error.status = 401;
    throw error;
  }
}

function assertCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    const error = new Error("CRON_SECRET is not configured.");
    error.status = 403;
    throw error;
  }
  const auth = req.headers?.authorization || "";
  if (auth !== `Bearer ${secret}` && requestToken(req) !== secret && requestToken(req) !== process.env.VERIFY_TOKEN) {
    const error = new Error("Unauthorized cron run.");
    error.status = 401;
    throw error;
  }
}

function automationSummary(matches, predictions, results) {
  return {
    totalMatches: matches.length,
    predictionCount: Object.keys(predictions).length,
    resultCount: Object.keys(results).length,
    nextPrediction: nextPredictionDue(matches, predictions, results),
    accuracy: accuracySnapshot(predictions, results)
  };
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") assertOwner(req);
    if (req.method === "GET") assertCron(req);
    const force = req.method === "POST" && Boolean(req.body?.force);
    const snapshot = loadSnapshot();
    const predictions = await getPredictions();
    const results = await getResults();
    const now = new Date();
    const events = [];
    const resolvedMatches = resolveMatches(snapshot.matches, results);
    const evidenceRefresh = process.env.ODDS_REFRESH_DISABLED === "1"
      ? { checked: 0, ok: 0, missing: 0, errors: 0, disabled: true, events: [] }
      : await refreshMarketEvidence(resolvedMatches, { now });
    events.push({
      type: "evidence-refresh",
      status: evidenceRefresh.errors ? "partial" : "ok",
      checked: evidenceRefresh.checked,
      ok: evidenceRefresh.ok,
      missing: evidenceRefresh.missing,
      errors: evidenceRefresh.errors
    });

    const dailyAnalysis = process.env.DAILY_ANALYSIS_DISABLED === "1" || !(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY)
      ? { checked: 0, ok: 0, errors: 0, disabled: true, events: [] }
      : await refreshDailyAnalysis(resolvedMatches, { now });
    events.push({
      type: "daily-analysis",
      status: dailyAnalysis.errors ? "partial" : "ok",
      checked: dailyAnalysis.checked,
      ok: dailyAnalysis.ok,
      errors: dailyAnalysis.errors,
      disabled: Boolean(dailyAnalysis.disabled)
    });

    for (const sourceMatch of resolvedMatches) {
      const matchTime = parseMatchTime(sourceMatch);
      if (!matchTime || !sourceMatch.teamA?.code || !sourceMatch.teamB?.code) {
        if (sourceMatch.round !== "Group Stage") {
          events.push({ type: "bracket", matchId: sourceMatch.id, status: "waiting", reason: "slot not resolved" });
        }
        continue;
      }

      const predictAt = new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000);
      const shouldPredict = force || (now >= predictAt && now < matchTime);
      if (shouldPredict && !predictions[sourceMatch.id]) {
        try {
          const record = await attachAuditProof(sourceMatch, {
            matchId: sourceMatch.id,
            generatedAt: now.toISOString(),
            ...await callPaul(sourceMatch)
          });
          predictions[sourceMatch.id] = record;
          await setPrediction(sourceMatch.id, record);
          events.push({ type: "prediction", matchId: sourceMatch.id, status: "ok" });
        } catch (error) {
          events.push({ type: "prediction", matchId: sourceMatch.id, status: "error", error: error.message });
        }
      }

      const resultAt = new Date(matchTime.getTime() + resultSyncDelayHours * 60 * 60 * 1000);
      const shouldSyncResult = force || now >= resultAt;
      if (shouldSyncResult && !results[sourceMatch.id]) {
        try {
          const result = await fetchMatchResult(sourceMatch);
          if (result) {
            results[sourceMatch.id] = result;
            await setResult(sourceMatch.id, result);
            events.push({ type: "result", matchId: sourceMatch.id, status: "ok", winnerCode: resultWinnerCode(sourceMatch, result) });
          }
        } catch (error) {
          events.push({ type: "result", matchId: sourceMatch.id, status: "error", error: error.message });
        }
      }
    }

    res.status(200).json({
      events,
      evidenceRefresh,
      dailyAnalysis,
      summary: automationSummary(snapshot.matches, predictions, results)
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
