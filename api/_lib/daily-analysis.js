const { callPaul } = require("./paul");
const { parseMatchTime } = require("./bracket");
const { setDailyAnalysisEntry } = require("./store");

const defaultHorizonDays = Number(process.env.DAILY_ANALYSIS_HORIZON_DAYS || 45);
const defaultLimit = Number(process.env.DAILY_ANALYSIS_MAX_MATCHES || 4);

function eligibleForDailyAnalysis(match, now = new Date(), horizonDays = defaultHorizonDays) {
  if (!match?.teamA?.code || !match?.teamB?.code) return false;
  const matchTime = parseMatchTime(match);
  if (!matchTime) return false;
  if (matchTime < now) return false;
  return matchTime.getTime() - now.getTime() <= horizonDays * 24 * 60 * 60 * 1000;
}

function normalizeProbability(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function compactDailyRead(match, result) {
  const analysis = result.analysis || {};
  const probabilities = analysis.probabilities || {};
  return {
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    model: "PAUL Daily Read",
    teams: {
      home: { code: match.teamA.code, name: match.teamA.name },
      away: { code: match.teamB.code, name: match.teamB.name }
    },
    pick: {
      winnerCode: analysis.winnerCode || analysis.winner || null,
      winnerName: analysis.winnerName || null,
      confidence: normalizeProbability(analysis.confidence),
      predictedScore: analysis.predictedScore || analysis.score || null,
      upsetRisk: analysis.upsetRisk || null
    },
    probabilities: {
      home: normalizeProbability(probabilities.home),
      draw: normalizeProbability(probabilities.draw),
      away: normalizeProbability(probabilities.away)
    },
    summary: analysis.reasoning || analysis.calibrationNote || "",
    freshness: {
      evidenceGeneratedAt: result.evidence?.generatedAt || null,
      searchFallback: Boolean(result.evidence?.searchFallback),
      marketUpdatedAt: result.evidence?.market?.updatedAt || null
    }
  };
}

async function refreshDailyAnalysis(matches, options = {}) {
  const now = options.now || new Date();
  const horizonDays = Number(options.horizonDays || defaultHorizonDays);
  const limit = Number(options.limit || defaultLimit);
  const candidates = matches
    .filter((match) => eligibleForDailyAnalysis(match, now, horizonDays))
    .sort((a, b) => parseMatchTime(a) - parseMatchTime(b))
    .slice(0, limit);
  const events = [];

  for (const match of candidates) {
    try {
      const result = await callPaul(match);
      const record = compactDailyRead(match, result);
      await setDailyAnalysisEntry(match.id, record);
      events.push({
        type: "daily-analysis",
        matchId: match.id,
        status: "ok",
        winnerCode: record.pick.winnerCode,
        confidence: record.pick.confidence,
        searchFallback: record.freshness.searchFallback
      });
    } catch (error) {
      events.push({
        type: "daily-analysis",
        matchId: match.id,
        status: "error",
        error: error.message
      });
    }
  }

  return {
    checked: candidates.length,
    ok: events.filter((event) => event.status === "ok").length,
    errors: events.filter((event) => event.status === "error").length,
    horizonDays,
    events
  };
}

module.exports = {
  eligibleForDailyAnalysis,
  refreshDailyAnalysis
};
