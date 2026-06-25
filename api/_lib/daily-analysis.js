const { callPaul } = require("./paul");
const { parseMatchTime } = require("./bracket");
const { getDailyAnalysis, getPredictions, setDailyAnalysisEntry } = require("./store");

const defaultHorizonDays = Number(process.env.DAILY_ANALYSIS_HORIZON_DAYS || 45);
const defaultLimit = Number(process.env.DAILY_ANALYSIS_MAX_MATCHES || 8);
const defaultDueGraceMinutes = Number(process.env.DAILY_ANALYSIS_DUE_GRACE_MINUTES || 90);
const defaultPostKickoffHours = Number(process.env.DAILY_ANALYSIS_POST_KICKOFF_HOURS || 3);
const defaultProtectedMaxMatches = Number(process.env.DAILY_ANALYSIS_PROTECTED_MAX_MATCHES || 4);
const defaultForceSearchHours = Number(process.env.QWEN_DAILY_SEARCH_HOURS || 24);
const defaultPriorityWindowHours = Number(
  process.env.DAILY_ANALYSIS_PRIORITY_WINDOW_HOURS ||
  process.env.PREDICTION_LEAD_HOURS ||
  72
);

function shouldForceDailySearch(state = {}, options = {}) {
  if (options.forceSearch === true) return true;
  if (options.forceSearch === false) return false;
  const hoursToKickoff = Number(state.priority?.hoursToKickoff ?? state.hoursToKickoff);
  return Number.isFinite(hoursToKickoff) && hoursToKickoff >= 0 && hoursToKickoff <= defaultForceSearchHours;
}

function eligibleForDailyAnalysis(match, now = new Date(), horizonDays = defaultHorizonDays, options = {}) {
  if (!match?.teamA?.code || !match?.teamB?.code) return false;
  const matchTime = parseMatchTime(match);
  if (!matchTime) return false;
  const diffMs = matchTime.getTime() - now.getTime();
  if (diffMs < 0) {
    const postKickoffHours = Number(options.postKickoffHours ?? defaultPostKickoffHours);
    return Boolean(options.allowPostKickoff) && Math.abs(diffMs) <= postKickoffHours * 60 * 60 * 1000;
  }
  return diffMs <= horizonDays * 24 * 60 * 60 * 1000;
}

function normalizeProbability(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function bestProbabilityEntries(match, probabilities = {}) {
  const sides = [
    { side: "home", name: match.teamA?.name || "Home", value: Number(probabilities.home || 0) },
    { side: "away", name: match.teamB?.name || "Away", value: Number(probabilities.away || 0) }
  ];
  if (match.round === "Group Stage") {
    sides.push({ side: "draw", name: "Draw", value: Number(probabilities.draw || 0) });
  }
  return sides
    .filter((item) => Number.isFinite(item.value))
    .sort((a, b) => b.value - a.value);
}

function buildWinnerVolatility(match, probabilities = {}) {
  const ordered = bestProbabilityEntries(match, probabilities);
  if (!ordered.length) return null;
  const leader = ordered[0];
  const challenger = ordered[1] || null;
  const gap = challenger ? leader.value - challenger.value : leader.value;
  return {
    leaderSide: leader.side,
    leaderName: leader.name,
    leaderProbability: normalizeProbability(leader.value),
    challengerSide: challenger?.side || null,
    challengerName: challenger?.name || null,
    challengerProbability: challenger ? normalizeProbability(challenger.value) : null,
    gap: normalizeProbability(gap),
    label: gap <= 0.04 ? "volatile" : gap <= 0.09 ? "watch" : "stable"
  };
}

function buildLabSnapshot(match, result) {
  const evidence = result.evidence || {};
  const analysis = result.analysis || {};
  const probabilities = analysis.probabilities || {};
  const scenarioSource = Array.isArray(analysis.scoreScenarios) && analysis.scoreScenarios.length
    ? analysis.scoreScenarios
    : evidence.poisson?.topScorelines;
  const scoreScenarios = Array.isArray(scenarioSource)
    ? scenarioSource.slice(0, 5).map((item) => ({
        score: item.score,
        probability: normalizeProbability(Number(item.probability || 0) * 100)
      }))
    : [];
  const upset = evidence.paulEdge || {};
  const rehearsal = evidence.preLockRehearsal || {};
  return {
    winnerVolatility: buildWinnerVolatility(match, probabilities),
    scoreScenarios,
    upsetWatch: upset.name
      ? {
          engine: upset.name,
          tier: upset.upsetTier || null,
          score: normalizeProbability(upset.upsetScore),
          underdogCode: upset.underdogCode || null,
          underdogName: upset.underdogName || null,
          signals: Array.isArray(upset.signals) ? upset.signals.slice(0, 5) : [],
          recommendation: upset.recommendation || null
        }
      : null,
    rehearsal: rehearsal.status
      ? {
          status: rehearsal.status,
          searchRequired: Boolean(rehearsal.searchPlan?.required),
          focus: Array.isArray(rehearsal.searchPlan?.focus) ? rehearsal.searchPlan.focus.slice(0, 4) : [],
          teamNewsAvailable: Boolean(rehearsal.teamNews?.available),
          optaReferenceReady: Boolean(rehearsal.optaReference?.localAdvancedData),
          suggestedQueries: Array.isArray(rehearsal.searchPlan?.suggestedQueries) ? rehearsal.searchPlan.suggestedQueries.slice(0, 3) : []
        }
      : null
  };
}

function dailyReadUpdatedAt(entry) {
  const value = entry?.generatedAt || entry?.freshness?.evidenceGeneratedAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function dailyAnalysisCadence(match, now = new Date(), options = {}) {
  const matchTime = parseMatchTime(match);
  if (!matchTime) return null;
  const hoursToKickoff = (matchTime.getTime() - now.getTime()) / (60 * 60 * 1000);
  if (hoursToKickoff < 0) {
    const postKickoffHours = Number(options.postKickoffHours ?? defaultPostKickoffHours);
    if (options.locked && Math.abs(hoursToKickoff) <= postKickoffHours) {
      return { hours: 0.25, label: "15m-locked-live-drift-window" };
    }
    return null;
  }
  if (options.locked) {
    if (hoursToKickoff <= 1) return { hours: 0.25, label: "15m-locked-final-hour" };
    if (hoursToKickoff <= 6) return { hours: 0.5, label: "30m-locked-final-six-hours" };
    if (hoursToKickoff <= 24) return { hours: 2, label: "2h-locked-final-day" };
    if (hoursToKickoff <= 72) return { hours: 4, label: "4h-locked-final-72h" };
  }
  if (hoursToKickoff <= 1) return { hours: 0.25, label: "15m-final-hour-news-check" };
  if (hoursToKickoff <= 3) return { hours: 0.5, label: "30m-final-three-hours-news-check" };
  if (hoursToKickoff <= 12) return { hours: 1, label: "1h-final-12-hours-news-check" };
  if (hoursToKickoff <= 24) return { hours: 2, label: "2h-final-day-news-check" };
  if (hoursToKickoff <= 48) return { hours: 4, label: "4h-final-48-hours-news-check" };
  return { hours: 24, label: "24h-daily-read" };
}

function dueForDailyAnalysis(match, entry, now = new Date(), options = {}) {
  if (options.force) return { due: true, cadenceHours: 0, cadence: "force" };
  const cadence = dailyAnalysisCadence(match, now, options);
  if (!cadence) return { due: false, cadenceHours: null, cadence: "not-playable", locked: Boolean(options.locked) };
  const updatedAt = dailyReadUpdatedAt(entry);
  if (!updatedAt) return { due: true, cadenceHours: cadence.hours, cadence: cadence.label, locked: Boolean(options.locked) };
  const ageHours = (now.getTime() - updatedAt.getTime()) / (60 * 60 * 1000);
  const configuredGraceHours = Math.max(0, Number(options.dueGraceMinutes ?? defaultDueGraceMinutes)) / 60;
  const cadenceGraceHours = Math.min(configuredGraceHours, cadence.hours * 0.1);
  const dueThresholdHours = Math.max(0, cadence.hours - cadenceGraceHours);
  return {
    due: ageHours >= dueThresholdHours,
    cadenceHours: cadence.hours,
    cadence: cadence.label,
    locked: Boolean(options.locked),
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
  if (state?.locked && hoursToKickoff <= 6) bucket = -2;
  else if (state?.locked && hoursToKickoff <= 24) bucket = -1;
  else if (state?.locked && hoursToKickoff <= 72) bucket = 0;
  else if (hoursToKickoff <= 6) bucket = 1;
  else if (hoursToKickoff <= 24) bucket = 2;
  else if (hoursToKickoff <= 72) bucket = 3;
  else if (hoursToKickoff <= 168) bucket = 4;
  else bucket = 4;

  return {
    bucket,
    hoursToKickoff,
    ageHours,
    cadence: state?.cadence || null
  };
}

function dailyAnalysisQueue(matches, dailyCache = {}, predictions = {}, options = {}) {
  const now = options.now || new Date();
  const horizonDays = Number(options.horizonDays ?? defaultHorizonDays);
  const eligible = matches
    .filter((match) => {
      const locked = Boolean(predictions[match.id] || predictions[String(match.id)]);
      return eligibleForDailyAnalysis(match, now, horizonDays, {
        ...options,
        locked,
        allowPostKickoff: Boolean(options.allowPostKickoff ?? locked)
      });
    })
    .sort((a, b) => parseMatchTime(a) - parseMatchTime(b));
  const dueCandidates = eligible
    .map((match) => {
      const entry = dailyCache[match.id] || dailyCache[String(match.id)];
      const locked = Boolean(predictions[match.id] || predictions[String(match.id)]);
      const state = dueForDailyAnalysis(match, entry, now, { ...options, locked });
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
  return { eligible, dueCandidates };
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
      upsetRisk: analysis.upsetRisk || null,
      calibrationLayer: analysis.calibrationLayer || null
    },
    probabilities: {
      home: normalizeProbability(probabilities.home),
      draw: normalizeProbability(probabilities.draw),
      away: normalizeProbability(probabilities.away)
    },
    evidenceUsed: Array.isArray(analysis.evidenceUsed) ? analysis.evidenceUsed.slice(0, 8) : [],
    summary: analysis.reasoning || analysis.calibrationNote || "",
    lab: buildLabSnapshot(match, result),
    freshness: {
      evidenceGeneratedAt: result.evidence?.generatedAt || null,
      searchFallback: Boolean(result.evidence?.searchFallback),
      marketUpdatedAt: result.evidence?.market?.updatedAt || null
    },
    qwenUsage: result.evidence?.qwenUsage || null
  };
}

async function refreshDailyAnalysis(matches, options = {}) {
  const now = options.now || new Date();
  const horizonDays = Number(options.horizonDays ?? defaultHorizonDays);
  const limit = Number(options.limit ?? defaultLimit);
  const priorityWindowHours = Number(options.priorityWindowHours ?? defaultPriorityWindowHours);
  const protectedMaxMatches = Math.max(0, Number(options.protectedMaxMatches ?? defaultProtectedMaxMatches));
  const [dailyCache, predictions] = await Promise.all([getDailyAnalysis(), getPredictions()]);
  const { eligible, dueCandidates } = dailyAnalysisQueue(matches, dailyCache, predictions, {
    ...options,
    now,
    horizonDays
  });
  const protectedCandidates = limit > 0
    ? dueCandidates
      .filter((item) => item.priority.hoursToKickoff <= priorityWindowHours)
      .slice(0, Math.min(limit, protectedMaxMatches || limit))
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
      const forceSearch = shouldForceDailySearch(state, options);
      const result = await callPaul(match, {
        forceSearch,
        source: "daily-read",
        hoursToKickoff: state.priority?.hoursToKickoff ?? state.hoursToKickoff ?? null
      });
      const record = compactDailyRead(match, result);
      await setDailyAnalysisEntry(match.id, record);
      events.push({
        type: "daily-analysis",
        matchId: match.id,
        status: "ok",
        winnerCode: record.pick.winnerCode,
        confidence: record.pick.confidence,
        searchFallback: record.freshness.searchFallback,
        forceSearch,
        lockedRefresh: Boolean(state.locked),
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
    protectedMaxMatches,
    priorityWindowHours,
    forceSearchHours: defaultForceSearchHours,
    events
  };
}

module.exports = {
  eligibleForDailyAnalysis,
  dailyAnalysisCadence,
  dailyAnalysisQueue,
  dailyAnalysisPriority,
  dueForDailyAnalysis,
  refreshDailyAnalysis
};
