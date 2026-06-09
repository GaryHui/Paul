const { callPaul } = require("./paul");
const { parseMatchTime } = require("./bracket");
const { getDailyAnalysis, setDailyAnalysisEntry } = require("./store");

const defaultHorizonDays = Number(process.env.DAILY_ANALYSIS_HORIZON_DAYS || 45);
const defaultLimit = Number(process.env.DAILY_ANALYSIS_MAX_MATCHES || 4);
const defaultDueGraceMinutes = Number(process.env.DAILY_ANALYSIS_DUE_GRACE_MINUTES || 90);

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

function dailyReadUpdatedAt(entry) {
  const value = entry?.generatedAt || entry?.freshness?.evidenceGeneratedAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function dailyAnalysisCadence(match, now = new Date()) {
  const matchTime = parseMatchTime(match);
  if (!matchTime) return null;
  const hoursToKickoff = (matchTime.getTime() - now.getTime()) / (60 * 60 * 1000);
  if (hoursToKickoff < 0) return null;
  if (hoursToKickoff <= 6) return { hours: 1, label: "1h-final-six-hours" };
  if (hoursToKickoff <= 48) return { hours: 6, label: "6h-final-48-hours" };
  return { hours: 24, label: "24h-daily-read" };
}

function dueForDailyAnalysis(match, entry, now = new Date(), options = {}) {
  if (options.force) return { due: true, cadenceHours: 0, cadence: "force" };
  const cadence = dailyAnalysisCadence(match, now);
  if (!cadence) return { due: false, cadenceHours: null, cadence: "not-playable" };
  const updatedAt = dailyReadUpdatedAt(entry);
  if (!updatedAt) return { due: true, cadenceHours: cadence.hours, cadence: cadence.label };
  const ageHours = (now.getTime() - updatedAt.getTime()) / (60 * 60 * 1000);
  const configuredGraceHours = Math.max(0, Number(options.dueGraceMinutes ?? defaultDueGraceMinutes)) / 60;
  const cadenceGraceHours = Math.min(configuredGraceHours, cadence.hours * 0.1);
  const dueThresholdHours = Math.max(0, cadence.hours - cadenceGraceHours);
  return {
    due: ageHours >= dueThresholdHours,
    cadenceHours: cadence.hours,
    cadence: cadence.label,
    dueThresholdHours: Number(dueThresholdHours.toFixed(2)),
    ageHours: Math.max(0, Number(ageHours.toFixed(2))),
    updatedAt: updatedAt.toISOString()
  };
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
  const horizonDays = Number(options.horizonDays ?? defaultHorizonDays);
  const limit = Number(options.limit ?? defaultLimit);
  const dailyCache = await getDailyAnalysis();
  const eligible = matches
    .filter((match) => eligibleForDailyAnalysis(match, now, horizonDays))
    .sort((a, b) => parseMatchTime(a) - parseMatchTime(b));
  const candidates = eligible
    .map((match) => ({
      match,
      state: dueForDailyAnalysis(match, dailyCache[match.id] || dailyCache[String(match.id)], now, options)
    }))
    .filter((item) => item.state.due)
    .slice(0, limit);
  const events = [];

  for (const { match, state } of candidates) {
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
        searchFallback: record.freshness.searchFallback,
        cadence: state.cadence,
        cadenceHours: state.cadenceHours
      });
    } catch (error) {
      events.push({
        type: "daily-analysis",
        matchId: match.id,
        status: "error",
        error: error.message,
        cadence: state.cadence,
        cadenceHours: state.cadenceHours
      });
    }
  }

  return {
    checked: candidates.length,
    eligible: eligible.length,
    skipped: Math.max(0, eligible.length - candidates.length),
    ok: events.filter((event) => event.status === "ok").length,
    errors: events.filter((event) => event.status === "error").length,
    horizonDays,
    limit,
    events
  };
}

module.exports = {
  eligibleForDailyAnalysis,
  dailyAnalysisCadence,
  dueForDailyAnalysis,
  refreshDailyAnalysis
};
