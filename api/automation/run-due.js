const { callPaul, loadSnapshot } = require("../_lib/paul");
const { attachAuditProof } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { refreshDailyAnalysis } = require("../_lib/daily-analysis");
const { refreshMarketEvidence } = require("../_lib/evidence-refresh");
const { recordMistakeReview } = require("../_lib/mistake-engine");
const { fetchMatchResult } = require("../_lib/results");
const { getEvidenceCache, getPredictions, getResults, setPrediction, setResult } = require("../_lib/store");

const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 72);
const resultSyncDelayHours = Number(process.env.RESULT_SYNC_DELAY_HOURS || 2);
const cronOddsRefreshMaxMatches = Number(process.env.CRON_ODDS_REFRESH_MAX_MATCHES || 0);
const cronDailyAnalysisMaxMatches = Number(process.env.CRON_DAILY_ANALYSIS_MAX_MATCHES || 0);
const cronPredictionMaxMatches = Number(process.env.CRON_PREDICTION_MAX_MATCHES || 8);
const cronResultSyncMaxMatches = Number(process.env.CRON_RESULT_SYNC_MAX_MATCHES || 4);

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

function storedKickoffAt(match, predictions, evidenceCache) {
  const prediction = predictions?.[match.id] || predictions?.[String(match.id)] || null;
  const evidence = evidenceCache?.[match.id] || evidenceCache?.[String(match.id)] || null;
  const candidates = [
    match?.kickoffAt,
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

async function attachPostMatchReview(match, result, prediction, evidence) {
  if (!result || result.postMatchReview || !prediction) return result;
  try {
    const postMatchReview = await recordMistakeReview({ match, result, prediction, evidence });
    return postMatchReview ? { ...result, postMatchReview } : result;
  } catch (error) {
    return {
      ...result,
      postMatchReview: {
        generatedAt: new Date().toISOString(),
        mistakeEngineError: error.message
      }
    };
  }
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") assertOwner(req);
    if (req.method === "GET") assertCron(req);
    const force = req.method === "POST" && Boolean(req.body?.force);
    const snapshot = loadSnapshot();
    const predictions = await getPredictions();
    const results = await getResults();
    const evidenceCache = await getEvidenceCache();
    const now = new Date();
    const events = [];
    const cronRun = req.method === "GET" && !force;
    const resolvedMatches = resolveMatches(snapshot.matches, results);
    const evidenceRefresh = process.env.ODDS_REFRESH_DISABLED === "1"
      ? { checked: 0, eligible: 0, skipped: 0, ok: 0, missing: 0, errors: 0, disabled: true, events: [] }
      : await refreshMarketEvidence(resolvedMatches, {
        now,
        force,
        limit: cronRun ? cronOddsRefreshMaxMatches : undefined
      });
    events.push({
      type: "evidence-refresh",
      status: evidenceRefresh.errors ? "partial" : "ok",
      checked: evidenceRefresh.checked,
      eligible: evidenceRefresh.eligible,
      skipped: evidenceRefresh.skipped,
      ok: evidenceRefresh.ok,
      missing: evidenceRefresh.missing,
      errors: evidenceRefresh.errors
    });

    const dailyAnalysis = process.env.DAILY_ANALYSIS_DISABLED === "1" || !(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY)
      ? { checked: 0, eligible: 0, skipped: 0, ok: 0, errors: 0, disabled: true, events: [] }
      : await refreshDailyAnalysis(resolvedMatches, {
        now,
        force,
        limit: cronRun ? cronDailyAnalysisMaxMatches : undefined
      });
    events.push({
      type: "daily-analysis",
      status: dailyAnalysis.errors ? "partial" : "ok",
      checked: dailyAnalysis.checked,
      eligible: dailyAnalysis.eligible,
      skipped: dailyAnalysis.skipped,
      ok: dailyAnalysis.ok,
      errors: dailyAnalysis.errors,
      disabled: Boolean(dailyAnalysis.disabled)
    });

    let predictionAttempts = 0;
    let resultAttempts = 0;

    for (const sourceMatch of resolvedMatches) {
      const matchTime = storedKickoffAt(sourceMatch, predictions, evidenceCache);
      const prediction = predictions[sourceMatch.id] || predictions[String(sourceMatch.id)] || null;
      const evidence = evidenceCache[sourceMatch.id] || evidenceCache[String(sourceMatch.id)] || prediction?.evidence || null;
      const existingResult = results[sourceMatch.id] || results[String(sourceMatch.id)] || null;
      if (!matchTime || !sourceMatch.teamA?.code || !sourceMatch.teamB?.code) {
        if (sourceMatch.round !== "Group Stage") {
          events.push({ type: "bracket", matchId: sourceMatch.id, status: "waiting", reason: "slot not resolved" });
        }
        continue;
      }

      const predictAt = new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000);
      const shouldPredict = force || (now >= predictAt && now < matchTime);
      const canAttemptPrediction = force || predictionAttempts < cronPredictionMaxMatches;
      if (shouldPredict && !predictions[sourceMatch.id] && canAttemptPrediction) {
        predictionAttempts += 1;
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

      const canAttemptReview = force || resultAttempts < cronResultSyncMaxMatches;
      if (existingResult && !existingResult.postMatchReview && prediction && canAttemptReview) {
        resultAttempts += 1;
        const reviewedResult = await attachPostMatchReview(sourceMatch, existingResult, prediction, evidence);
        await setResult(sourceMatch.id, reviewedResult);
        results[sourceMatch.id] = reviewedResult;
        events.push({
          type: "post-match-review",
          matchId: sourceMatch.id,
          status: reviewedResult.postMatchReview?.mistakeEngineError ? "partial" : "ok",
          postMatchReviewed: Boolean(reviewedResult.postMatchReview)
        });
      }

      const resultAt = new Date(matchTime.getTime() + resultSyncDelayHours * 60 * 60 * 1000);
      const shouldSyncResult = force || now >= resultAt;
      const canAttemptResult = force || resultAttempts < cronResultSyncMaxMatches;
      if (shouldSyncResult && !results[sourceMatch.id] && canAttemptResult) {
        resultAttempts += 1;
        try {
          const result = await fetchMatchResult(sourceMatch);
          if (result) {
            const reviewedResult = await attachPostMatchReview(sourceMatch, result, prediction, evidence);
            results[sourceMatch.id] = reviewedResult;
            await setResult(sourceMatch.id, reviewedResult);
            events.push({
              type: "result",
              matchId: sourceMatch.id,
              status: "ok",
              winnerCode: resultWinnerCode(sourceMatch, result),
              postMatchReviewed: Boolean(reviewedResult.postMatchReview)
            });
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
