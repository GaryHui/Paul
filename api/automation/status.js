const fs = require("fs");
const path = require("path");
const { collectPredictionEvidence, loadSnapshot } = require("../_lib/paul");

module.exports = function handler(req, res) {
  const snapshot = loadSnapshot();
  const dataDir = path.join(__dirname, "..", "..", "data");
  const first = snapshot.matches[0] ? collectPredictionEvidence(snapshot.matches[0]) : null;
  res.status(200).json({
    totalMatches: snapshot.matches.length,
    predictionCount: 0,
    resultCount: 0,
    nextPrediction: snapshot.matches[0]
      ? { id: snapshot.matches[0].id, label: `${snapshot.matches[0].teamA.name} vs ${snapshot.matches[0].teamB.name}`, dueAt: null }
      : null,
    accuracy: { completed: 0, graded: 0, correct: 0, accuracy: 0 },
    predictions: {},
    results: {},
    dataReadiness: {
      marketOdds: fs.existsSync(path.join(dataDir, "market-odds.json")),
      teamRatings: fs.existsSync(path.join(dataDir, "team-ratings.json")),
      recentForm: fs.existsSync(path.join(dataDir, "recent-form.json")),
      firstMatchEvidence: first
    },
    hasQwenKey: Boolean(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY),
    hasResultsApi: Boolean(process.env.RESULTS_API_URL)
  });
};
