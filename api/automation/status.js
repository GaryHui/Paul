const fs = require("fs");
const path = require("path");
const { collectPredictionEvidence, loadSnapshot } = require("../_lib/paul");

const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 24);

function parseMatchTime(match) {
  const date = new Date(`${match.date} 20:00:00 GMT+0000`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function nextPredictionDue(matches, now = new Date()) {
  return matches
    .map((match) => {
      const matchTime = parseMatchTime(match);
      if (!matchTime) return null;
      return {
        id: match.id,
        label: `${match.teamA.name} vs ${match.teamB.name}`,
        dueAt: new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000).toISOString()
      };
    })
    .filter(Boolean)
    .filter((item) => new Date(item.dueAt) >= now)
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))[0] || null;
}

module.exports = function handler(req, res) {
  const snapshot = loadSnapshot();
  const dataDir = path.join(__dirname, "..", "..", "data");
  const first = snapshot.matches[0] ? collectPredictionEvidence(snapshot.matches[0]) : null;
  res.status(200).json({
    totalMatches: snapshot.matches.length,
    predictionCount: 0,
    resultCount: 0,
    nextPrediction: nextPredictionDue(snapshot.matches),
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
