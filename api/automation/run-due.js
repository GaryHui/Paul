const { callPaul, loadSnapshot } = require("../_lib/paul");
const { attachAuditProof } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { fetchMatchResult } = require("../_lib/results");
const { getPredictions, getResults, setPrediction, setResult } = require("../_lib/store");

const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 24);
const resultSyncDelayHours = Number(process.env.RESULT_SYNC_DELAY_HOURS || 3);

function automationSummary(matches, predictions, results) {
  return {
    totalMatches: matches.length,
    predictionCount: Object.keys(predictions).length,
    resultCount: Object.keys(results).length,
    nextPrediction: nextPredictionDue(matches, predictions, results),
    accuracy: accuracySnapshot(predictions, results)
  };
}

module.exports = async function handler(req, res) {
  try {
    const force = req.method === "POST" && Boolean(req.body?.force);
    const snapshot = loadSnapshot();
    const predictions = await getPredictions();
    const results = await getResults();
    const now = new Date();
    const events = [];

    for (const sourceMatch of resolveMatches(snapshot.matches, results)) {
      const matchTime = parseMatchTime(sourceMatch);
      if (!matchTime || !sourceMatch.teamA?.code || !sourceMatch.teamB?.code) {
        if (sourceMatch.round !== "Group Stage") {
          events.push({ type: "bracket", matchId: sourceMatch.id, status: "waiting", reason: "slot not resolved" });
        }
        continue;
      }

      const predictAt = new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000);
      const shouldPredict = force || (now >= predictAt && now < matchTime);
      if (shouldPredict && !predictions[sourceMatch.id]) {
        try {
          const record = await attachAuditProof(sourceMatch, {
            matchId: sourceMatch.id,
            generatedAt: now.toISOString(),
            ...await callPaul(sourceMatch)
          });
          predictions[sourceMatch.id] = record;
          await setPrediction(sourceMatch.id, record);
          events.push({ type: "prediction", matchId: sourceMatch.id, status: "ok" });
        } catch (error) {
          events.push({ type: "prediction", matchId: sourceMatch.id, status: "error", error: error.message });
        }
      }

      const resultAt = new Date(matchTime.getTime() + resultSyncDelayHours * 60 * 60 * 1000);
      const shouldSyncResult = force || now >= resultAt;
      if (shouldSyncResult && !results[sourceMatch.id]) {
        try {
          const result = await fetchMatchResult(sourceMatch);
          if (result) {
            results[sourceMatch.id] = result;
            await setResult(sourceMatch.id, result);
            events.push({ type: "result", matchId: sourceMatch.id, status: "ok", winnerCode: resultWinnerCode(sourceMatch, result) });
          }
        } catch (error) {
          events.push({ type: "result", matchId: sourceMatch.id, status: "error", error: error.message });
        }
      }
    }

    res.status(200).json({
      events,
      summary: automationSummary(snapshot.matches, predictions, results)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
