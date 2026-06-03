const fs = require("fs");
const path = require("path");
const { collectPredictionEvidence, loadSnapshot } = require("../_lib/paul");
const { auditSnapshot } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, resolveMatches, stageAccuracySnapshot } = require("../_lib/bracket");
const { hasResultsProvider, providerName } = require("../_lib/results");
const { getEvidenceCache, getPredictions, getResults, isSharedStoreConfigured } = require("../_lib/store");

module.exports = async function handler(req, res) {
  const snapshot = loadSnapshot();
  const predictions = await getPredictions();
  const results = await getResults();
  const evidenceCache = await getEvidenceCache();
  const evidenceEntries = Object.values(evidenceCache || {});
  const latestEvidenceAt = evidenceEntries
    .map((entry) => entry?.market?.updatedAt || entry?.updatedAt || entry?.generatedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  const dataDir = path.join(__dirname, "..", "..", "data");
  const resolvedMatches = resolveMatches(snapshot.matches, results);
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
      firstMatchEvidence: first
    },
    hasQwenKey: Boolean(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY),
    hasResultsApi: hasResultsProvider(),
    resultsProvider: providerName(),
    hasSharedStore: isSharedStoreConfigured()
  });
};
