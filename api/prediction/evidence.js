const { collectPredictionEvidence, loadSnapshot } = require("../_lib/paul");

module.exports = function handler(req, res) {
  const matchId = req.query.matchId;
  const snapshot = loadSnapshot();
  const match = snapshot.matches.find((item) => String(item.id) === String(matchId));
  if (!match) {
    res.status(404).json({ error: "Match not found." });
    return;
  }
  res.status(200).json(collectPredictionEvidence(match));
};
