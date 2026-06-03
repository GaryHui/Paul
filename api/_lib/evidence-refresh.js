const { collectPredictionEvidence } = require("./paul");
const { parseMatchTime } = require("./bracket");

const defaultHorizonDays = Number(process.env.ODDS_REFRESH_HORIZON_DAYS || 60);
const defaultLimit = Number(process.env.ODDS_REFRESH_MAX_MATCHES || 12);

function eligibleForEvidenceRefresh(match, now = new Date(), horizonDays = defaultHorizonDays) {
  if (!match?.teamA?.code || !match?.teamB?.code) return false;
  const matchTime = parseMatchTime(match);
  if (!matchTime) return false;
  if (matchTime < now) return false;
  return matchTime.getTime() - now.getTime() <= horizonDays * 24 * 60 * 60 * 1000;
}

async function refreshMarketEvidence(matches, options = {}) {
  const now = options.now || new Date();
  const horizonDays = Number(options.horizonDays || defaultHorizonDays);
  const limit = Number(options.limit || defaultLimit);
  const candidates = matches
    .filter((match) => eligibleForEvidenceRefresh(match, now, horizonDays))
    .sort((a, b) => parseMatchTime(a) - parseMatchTime(b))
    .slice(0, limit);
  const events = [];

  for (const match of candidates) {
    try {
      const evidence = await collectPredictionEvidence(match, {
        forceLiveOdds: true,
        cache: false
      });
      events.push({
        type: "evidence",
        matchId: match.id,
        status: evidence.market ? "ok" : "missing",
        provider: evidence.market?.provider || null,
        bookmakerCount: evidence.market?.bookmakerCount || 0,
        updatedAt: evidence.market?.updatedAt || evidence.generatedAt
      });
    } catch (error) {
      events.push({
        type: "evidence",
        matchId: match.id,
        status: "error",
        error: error.message
      });
    }
  }

  return {
    checked: candidates.length,
    ok: events.filter((event) => event.status === "ok").length,
    missing: events.filter((event) => event.status === "missing").length,
    errors: events.filter((event) => event.status === "error").length,
    horizonDays,
    events
  };
}

module.exports = {
  eligibleForEvidenceRefresh,
  refreshMarketEvidence
};
