const { collectPredictionEvidence } = require("./paul");
const { parseMatchTime } = require("./bracket");
const { getEvidenceCache } = require("./store");

const defaultHorizonDays = Number(process.env.ODDS_REFRESH_HORIZON_DAYS || 60);
const defaultLimit = Number(process.env.ODDS_REFRESH_MAX_MATCHES || 12);

function eligibleForEvidenceRefresh(match, now = new Date(), horizonDays = defaultHorizonDays) {
  if (!match?.teamA?.code || !match?.teamB?.code) return false;
  const matchTime = parseMatchTime(match);
  if (!matchTime) return false;
  if (matchTime < now) return false;
  return matchTime.getTime() - now.getTime() <= horizonDays * 24 * 60 * 60 * 1000;
}

function evidenceUpdatedAt(entry) {
  const value = entry?.market?.updatedAt || entry?.updatedAt || entry?.generatedAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function refreshCadence(match, now = new Date()) {
  const matchTime = parseMatchTime(match);
  if (!matchTime) return null;
  const hoursToKickoff = (matchTime.getTime() - now.getTime()) / (60 * 60 * 1000);
  if (hoursToKickoff < 0) return null;
  if (hoursToKickoff <= 1) return { hours: 0.25, label: "15m-final-hour" };
  if (hoursToKickoff <= 6) return { hours: 1, label: "1h-final-six-hours" };
  if (hoursToKickoff <= 48) return { hours: 6, label: "6h-final-48-hours" };
  if (hoursToKickoff <= 7 * 24) return { hours: 12, label: "12h-final-week" };
  if (hoursToKickoff <= 30 * 24) return { hours: 24, label: "24h-final-month" };
  return { hours: 48, label: "48h-long-range" };
}

function dueForEvidenceRefresh(match, entry, now = new Date(), options = {}) {
  if (options.force) return { due: true, cadenceHours: 0, cadence: "force" };
  const cadence = refreshCadence(match, now);
  if (!cadence) return { due: false, cadenceHours: null, cadence: "not-playable" };
  const updatedAt = evidenceUpdatedAt(entry);
  if (!updatedAt) return { due: true, cadenceHours: cadence.hours, cadence: cadence.label };
  const ageHours = (now.getTime() - updatedAt.getTime()) / (60 * 60 * 1000);
  return {
    due: ageHours >= cadence.hours,
    cadenceHours: cadence.hours,
    cadence: cadence.label,
    ageHours: Math.max(0, Number(ageHours.toFixed(2))),
    updatedAt: updatedAt.toISOString()
  };
}

async function refreshMarketEvidence(matches, options = {}) {
  const now = options.now || new Date();
  const horizonDays = Number(options.horizonDays || defaultHorizonDays);
  const limit = Number(options.limit || defaultLimit);
  const evidenceCache = await getEvidenceCache();
  const eligible = matches
    .filter((match) => eligibleForEvidenceRefresh(match, now, horizonDays))
    .sort((a, b) => parseMatchTime(a) - parseMatchTime(b));
  const dueCandidates = eligible
    .map((match) => ({
      match,
      state: dueForEvidenceRefresh(match, evidenceCache[match.id] || evidenceCache[String(match.id)], now, options)
    }))
    .filter((item) => item.state.due)
    .slice(0, limit);
  const events = [];

  for (const { match, state } of dueCandidates) {
    try {
      const evidence = await collectPredictionEvidence(match, {
        forceLiveOdds: true,
        cache: false
      });
      const hasEvidence = Boolean(evidence.market || evidence.intelligence);
      events.push({
        type: "evidence",
        matchId: match.id,
        status: hasEvidence ? "ok" : "missing",
        provider: evidence.market?.provider || evidence.intelligence?.source || null,
        hasOdds: Boolean(evidence.market),
        hasIntelligence: Boolean(evidence.intelligence),
        bookmakerCount: evidence.market?.bookmakerCount || 0,
        updatedAt: evidence.market?.updatedAt || evidence.generatedAt,
        cadence: state.cadence,
        cadenceHours: state.cadenceHours
      });
    } catch (error) {
      events.push({
        type: "evidence",
        matchId: match.id,
        status: "error",
        error: error.message,
        cadence: state.cadence,
        cadenceHours: state.cadenceHours
      });
    }
  }

  return {
    checked: dueCandidates.length,
    eligible: eligible.length,
    skipped: Math.max(0, eligible.length - dueCandidates.length),
    ok: events.filter((event) => event.status === "ok").length,
    missing: events.filter((event) => event.status === "missing").length,
    errors: events.filter((event) => event.status === "error").length,
    horizonDays,
    limit,
    events
  };
}

module.exports = {
  eligibleForEvidenceRefresh,
  refreshCadence,
  dueForEvidenceRefresh,
  refreshMarketEvidence
};
