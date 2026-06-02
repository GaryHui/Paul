const fs = require("fs");
const path = require("path");
const { collectPredictionEvidence, loadSnapshot } = require("../_lib/paul");
const { auditSnapshot } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, resolveMatches } = require("../_lib/bracket");
const { getPredictions, getResults, isSharedStoreConfigured } = require("../_lib/store");

module.exports = async function handler(req, res) {
  const snapshot = loadSnapshot();
  const predictions = await getPredictions();
  const results = await getResults();
  const dataDir = path.join(__dirname, "..", "..", "data");
  const resolvedMatches = resolveMatches(snapshot.matches, results);
  const auditEntries = await auditSnapshot();
  const firstResolved = resolvedMatches.find((match) => match.teamA?.code && match.teamB?.code);
  const first = firstResolved ? collectPredictionEvidence(firstResolved) : null;
  res.status(200).json({
    totalMatches: snapshot.matches.length,
    predictionCount: Object.keys(predictions).length,
    auditCount: auditEntries.length,
    resultCount: Object.keys(results).length,
    nextPrediction: nextPredictionDue(snapshot.matches, predictions, results),
    accuracy: accuracySnapshot(predictions, results),
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
      firstMatchEvidence: first
    },
    hasQwenKey: Boolean(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY),
    hasResultsApi: Boolean(process.env.RESULTS_API_URL),
    hasSharedStore: isSharedStoreConfigured()
  });
};
