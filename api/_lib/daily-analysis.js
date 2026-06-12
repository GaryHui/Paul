const { callPaul } = require("./paul");
const { parseMatchTime } = require("./bracket");
const { getDailyAnalysis, setDailyAnalysisEntry } = require("./store");

const defaultHorizonDays = Number(process.env.DAILY_ANALYSIS_HORIZON_DAYS || 45);
const defaultLimit = Number(process.env.DAILY_ANALYSIS_MAX_MATCHES || 8);
const defaultDueGraceMinutes = Number(process.env.DAILY_ANALYSIS_DUE_GRACE_MINUTES || 90);
const defaultPriorityWindowHours = Number(
  process.env.DAILY_ANALYSIS_PRIORITY_WINDOW_HOURS ||
  process.env.PREDICTION_LEAD_HOURS ||
  72
);

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

function dailyAnalysisPriority(match, entry, now, state) {
  const matchTime = parseMatchTime(match);
  const hoursToKickoff = matchTime
    ? (matchTime.getTime() - now.getTime()) / (60 * 60 * 1000)
    : Number.POSITIVE_INFINITY;
  const updatedAt = dailyReadUpdatedAt(entry);
  const ageHours = updatedAt
    ? (now.getTime() - updatedAt.getTime()) / (60 * 60 * 1000)
    : Number.POSITIVE_INFINITY;
  let bucket = 5;
  if (hoursToKickoff <= 6) bucket = 0;
  else if (hoursToKickoff <= 24) bucket = 1;
  else if (hoursToKickoff <= 72) bucket = 2;
  else if (hoursToKickoff <= 168) bucket = 3;
  else bucket = 4;

  return {
    bucket,
    hoursToKickoff,
    ageHours,
    cadence: state?.cadence || null
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
  const priorityWindowHours = Number(options.priorityWindowHours ?? defaultPriorityWindowHours);
  const dailyCache = await getDailyAnalysis();
  const eligible = matches
    .filter((match) => eligibleForDailyAnalysis(match, now, horizonDays))
    .sort((a, b) => parseMatchTime(a) - parseMatchTime(b));
  const dueCandidates = eligible
    .map((match) => {
      const entry = dailyCache[match.id] || dailyCache[String(match.id)];
      const state = dueForDailyAnalysis(match, entry, now, options);
      return {
        match,
        state,
        priority: dailyAnalysisPriority(match, entry, now, state)
      };
    })
    .filter((item) => item.state.due)
    .sort((a, b) => {
      if (a.priority.bucket !== b.priority.bucket) return a.priority.bucket - b.priority.bucket;
      if (a.priority.hoursToKickoff !== b.priority.hoursToKickoff) {
        return a.priority.hoursToKickoff - b.priority.hoursToKickoff;
      }
      return b.priority.ageHours - a.priority.ageHours;
    });
  const protectedCandidates = limit > 0
    ? dueCandidates.filter((item) => item.priority.hoursToKickoff <= priorityWindowHours)
    : [];
  const selectedIds = new Set(protectedCandidates.map((item) => String(item.match.id)));
  const remainingSlots = Math.max(0, limit - protectedCandidates.length);
  const candidates = limit > 0
    ? [
      ...protectedCandidates,
      ...dueCandidates
        .filter((item) => !selectedIds.has(String(item.match.id)))
        .slice(0, remainingSlots)
    ]
    : [];
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
    due: dueCandidates.length,
    protected: protectedCandidates.length,
    skipped: Math.max(0, dueCandidates.length - candidates.length),
    ok: events.filter((event) => event.status === "ok").length,
    errors: events.filter((event) => event.status === "error").length,
    horizonDays,
    limit,
    priorityWindowHours,
    events
  };
}

module.exports = {
  eligibleForDailyAnalysis,
  dailyAnalysisCadence,
  dailyAnalysisPriority,
  dueForDailyAnalysis,
  refreshDailyAnalysis
};
