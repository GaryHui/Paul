const { parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { recordMistakeReview } = require("../_lib/mistake-engine");
const { loadSnapshot } = require("../_lib/paul");
const { fetchMatchResult } = require("../_lib/results");
const { getEvidenceCache, getMistakeMemory, getPredictions, getResults, setResult } = require("../_lib/store");

const resultSyncDelayHours = Number(process.env.RESULT_SYNC_DELAY_HOURS || 2.17);
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

function predictionAnalysis(prediction) {
  return prediction?.analysis || prediction?.proof?.payload?.prediction || null;
}

function winnerForResult(match, result) {
  if (result?.winnerCode) return String(result.winnerCode).toUpperCase();
  if (Number(result?.homeScore) === Number(result?.awayScore)) return "DRAW";
  return Number(result?.homeScore) > Number(result?.awayScore)
    ? String(match.teamA?.code || "").toUpperCase()
    : String(match.teamB?.code || "").toUpperCase();
}

function scoreParts(score) {
  const match = String(score || "").match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function buildPostMatchReview(match, result, prediction, evidence) {
  const analysis = predictionAnalysis(prediction);
  if (!analysis) return null;
  const predictedWinner = String(analysis.winnerCode || analysis.winner || "").toUpperCase();
  const actualWinner = winnerForResult(match, result);
  const predictedScore = scoreParts(analysis.predictedScore || analysis.score);
  const actualScore = {
    home: Number(result.homeScore),
    away: Number(result.awayScore)
  };
  const directionHit = Boolean(predictedWinner && actualWinner && predictedWinner === actualWinner);
  const scoreHit = Boolean(predictedScore && predictedScore.home === actualScore.home && predictedScore.away === actualScore.away);
  const goalDiff = predictedScore
    ? Math.abs(predictedScore.home - actualScore.home) + Math.abs(predictedScore.away - actualScore.away)
    : null;
  const marketFavorite = evidence?.baselines?.marketFavorite?.winnerCode || prediction?.evidence?.baselines?.marketFavorite?.winnerCode || null;
  const marketHit = marketFavorite ? String(marketFavorite).toUpperCase() === actualWinner : null;
  const notes = [];

  if (directionHit && scoreHit) {
    notes.push("PAUL 同时命中胜负方向和比分，本场可作为正向样本保留。");
  } else if (directionHit) {
    notes.push("PAUL 命中胜负方向，但比分未中，说明强弱判断有效，进球数和节奏判断需要复盘。");
  } else {
    notes.push("PAUL 胜负方向未命中，需要复盘赛前证据是否低估了冷门、平局或临场变量。");
  }

  if (predictedScore && !scoreHit) {
    const predictedTotal = predictedScore.home + predictedScore.away;
    const actualTotal = actualScore.home + actualScore.away;
    if (Math.abs(actualTotal - predictedTotal) >= 2) {
      notes.push("总进球数偏差较大，后续应降低比分精确度权重，更多参考 over/under、射门质量和临场效率。");
    } else {
      notes.push("比分偏差较小，方向模型可保留，比分层做轻微校准即可。");
    }
  }

  if (marketHit !== null) {
    if (directionHit && !marketHit) notes.push("本场 PAUL 跑赢市场热门，增强 PAUL Edge 但仍保持保守加权。");
    if (!directionHit && marketHit) notes.push("本场市场热门正确而 PAUL 未中，PAUL Edge 应向市场基准回缩。");
    if (directionHit && marketHit) notes.push("PAUL 与市场同向且命中，说明共识判断可靠，但不算独立优势样本。");
  }

  return {
    generatedAt: new Date().toISOString(),
    directionHit,
    scoreHit,
    goalDiff,
    predictedWinner,
    actualWinner,
    predictedScore: analysis.predictedScore || analysis.score || null,
    actualScore: `${result.homeScore}-${result.awayScore}`,
    marketFavorite,
    marketHit,
    summaryZh: notes.join(" "),
    calibrationHints: {
      keepPredictionModel: true,
      adjustOnlyCalibration: true,
      edgeTrustDelta: directionHit ? (scoreHit ? 0.015 : 0.005) : -0.02,
      scoreModelDelta: scoreHit ? 0.02 : -0.01,
      marketShrinkDelta: marketHit === true && !directionHit ? 0.03 : 0
    }
  };
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
    const [predictions, results, evidenceCache, mistakeMemory] = await Promise.all([
      getPredictions(),
      getResults(),
      getEvidenceCache(),
      getMistakeMemory()
    ]);
    const now = new Date();
    const events = [];
    let attempted = 0;
    let synced = 0;
    let reviewed = 0;
    let eligible = 0;
    const resolvedMatches = resolveMatches(snapshot.matches || [], results);

    for (const match of resolvedMatches) {
      if (!match.teamA?.code || !match.teamB?.code) continue;
      const existingResult = results[match.id] || results[String(match.id)] || null;
      const prediction = predictions?.[match.id] || predictions?.[String(match.id)] || null;
      const evidence = evidenceCache?.[match.id] || evidenceCache?.[String(match.id)] || prediction?.evidence || null;
      const memoryReview = mistakeMemory?.matches?.[match.id] || mistakeMemory?.matches?.[String(match.id)] || null;
      if (existingResult) {
        if (existingResult.postMatchReview && memoryReview) continue;
        if (!prediction) {
          events.push({ type: "review", matchId: match.id, status: "skipped", reason: "missing locked prediction" });
          continue;
        }
        eligible += 1;
        if (attempted >= limit) {
          events.push({ type: "review", matchId: match.id, status: "skipped", reason: "limit reached" });
          continue;
        }
        attempted += 1;
        try {
          const baseReview = existingResult.postMatchReview || buildPostMatchReview(match, existingResult, prediction, evidence);
          const postMatchReview = await recordMistakeReview({ match, result: existingResult, prediction, evidence, baseReview }) || baseReview;
          await setResult(match.id, { ...existingResult, postMatchReview });
          reviewed += 1;
          events.push({
            type: "review",
            matchId: match.id,
            status: "ok",
            score: `${existingResult.homeScore}-${existingResult.awayScore}`,
            winnerCode: resultWinnerCode(match, existingResult),
            postMatchReviewed: Boolean(postMatchReview)
          });
        } catch (error) {
          events.push({ type: "review", matchId: match.id, status: "error", error: error.message });
        }
        continue;
      }
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
          const baseReview = buildPostMatchReview(match, result, prediction, evidence);
          let postMatchReview = baseReview;
          try {
            postMatchReview = await recordMistakeReview({ match, result, prediction, evidence, baseReview }) || baseReview;
          } catch (error) {
            postMatchReview = {
              ...baseReview,
              mistakeEngineError: error.message
            };
          }
          const reviewedResult = {
            ...result,
            postMatchReview
          };
          await setResult(match.id, reviewedResult);
          synced += 1;
          events.push({
            type: "result",
            matchId: match.id,
            status: "ok",
            source: result.source || null,
            score: `${result.homeScore}-${result.awayScore}`,
            winnerCode: resultWinnerCode(match, result),
            postMatchReviewed: Boolean(reviewedResult.postMatchReview),
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
      reviewed,
      existingResults: Object.keys(results).length,
      events
    });
  } catch (error) {
    return json(res, error.status || 500, { error: error.message || "Result sync failed." });
  }
};
