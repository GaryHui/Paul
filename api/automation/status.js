const fs = require("fs");
const path = require("path");
const { collectPredictionEvidence, loadSnapshot } = require("../_lib/paul");
const { auditSnapshot } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, resolveMatches, stageAccuracySnapshot } = require("../_lib/bracket");
const { hasResultsProvider, providerName } = require("../_lib/results");
const { getDailyAnalysis, getEvidenceCache, getPredictions, getResults, isSharedStoreConfigured } = require("../_lib/store");

function sideFromMarket(probabilities = {}) {
  const sides = ["home", "draw", "away"];
  const available = sides.filter((side) => Number.isFinite(Number(probabilities[side])));
  if (!available.length) return null;
  return available.sort((a, b) => Number(probabilities[b]) - Number(probabilities[a]))[0];
}

function sideTeam(match, side) {
  if (side === "draw") return { code: "DRAW", name: "Draw" };
  if (side === "home") return match?.teamA ? { code: match.teamA.code, name: match.teamA.name } : null;
  if (side === "away") return match?.teamB ? { code: match.teamB.code, name: match.teamB.name } : null;
  return null;
}

function marketTraceEntry(match, evidence) {
  const market = evidence?.market;
  if (!market?.probabilities) return null;
  const side = sideFromMarket(market.probabilities);
  const winner = sideTeam(match, side);
  return {
    matchId: match.id,
    provider: market.provider || market.source || null,
    updatedAt: market.updatedAt || evidence.generatedAt || null,
    bookmakerCount: market.bookmakerCount || null,
    favoriteSide: side,
    favoriteCode: winner?.code || null,
    favoriteName: winner?.name || null,
    probabilities: {
      home: market.probabilities.home ?? null,
      draw: market.probabilities.draw ?? null,
      away: market.probabilities.away ?? null
    }
  };
}

module.exports = async function handler(req, res) {
  const snapshot = loadSnapshot();
  const predictions = await getPredictions();
  const results = await getResults();
  const evidenceCache = await getEvidenceCache();
  const dailyAnalysis = await getDailyAnalysis();
  const evidenceEntries = Object.values(evidenceCache || {});
  const dailyEntries = Object.values(dailyAnalysis || {});
  const latestEvidenceAt = evidenceEntries
    .map((entry) => entry?.market?.updatedAt || entry?.updatedAt || entry?.generatedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  const latestDailyReadAt = dailyEntries
    .map((entry) => entry?.generatedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  const dataDir = path.join(__dirname, "..", "..", "data");
  const resolvedMatches = resolveMatches(snapshot.matches, results);
  const resolvedById = Object.fromEntries(resolvedMatches.map((match) => [String(match.id), match]));
  const marketTrace = Object.fromEntries(Object.entries(evidenceCache || {})
    .map(([matchId, evidence]) => {
      const match = resolvedById[String(matchId)];
      if (!match) return null;
      const entry = marketTraceEntry(match, evidence);
      return entry ? [String(matchId), entry] : null;
    })
    .filter(Boolean));
  const auditEntries = await auditSnapshot();
  const firstResolved = resolvedMatches.find((match) => match.teamA?.code && match.teamB?.code);
  const first = firstResolved ? await collectPredictionEvidence(firstResolved, { liveOdds: false }) : null;
  res.status(200).json({
    totalMatches: snapshot.matches.length,
    predictionCount: Object.keys(predictions).length,
    auditCount: auditEntries.length,
    resultCount: Object.keys(results).length,
    nextPrediction: nextPredictionDue(snapshot.matches, predictions, results),
    accuracy: accuracySnapshot(predictions, results),
    stageAccuracy: stageAccuracySnapshot(predictions, results, resolvedMatches),
    predictions,
    results,
    dailyAnalysis,
    marketTrace,
    resolvedMatches: resolvedMatches.map((match) => ({
      id: match.id,
      teamA: match.teamA || null,
      teamB: match.teamB || null
    })),
    dataReadiness: {
      marketOdds: fs.existsSync(path.join(dataDir, "market-odds.json")),
      teamRatings: fs.existsSync(path.join(dataDir, "team-ratings.json")),
      recentForm: fs.existsSync(path.join(dataDir, "recent-form.json")),
      liveOddsProvider: process.env.ODDS_API_IO_KEY
        ? "odds-api.io"
        : process.env.THE_ODDS_API_KEY
          ? "theoddsapi.com"
          : null,
      evidenceCacheCount: evidenceEntries.length,
      latestEvidenceAt,
      oddsRefreshHorizonDays: Number(process.env.ODDS_REFRESH_HORIZON_DAYS || 60),
      dailyAnalysisCount: dailyEntries.length,
      latestDailyReadAt,
      dailyAnalysisMaxMatches: Number(process.env.DAILY_ANALYSIS_MAX_MATCHES || 4),
      dailyAnalysisHorizonDays: Number(process.env.DAILY_ANALYSIS_HORIZON_DAYS || 45),
      firstMatchEvidence: first
    },
    hasQwenKey: Boolean(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY),
    hasResultsApi: hasResultsProvider(),
    resultsProvider: providerName(),
    hasSharedStore: isSharedStoreConfigured()
  });
};
