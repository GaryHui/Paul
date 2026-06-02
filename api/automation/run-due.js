const { callPaul, loadSnapshot } = require("../_lib/paul");
const { accuracySnapshot, nextPredictionDue, parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { getPredictions, getResults, setPrediction, setResult } = require("../_lib/store");

const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 24);
const resultSyncDelayHours = Number(process.env.RESULT_SYNC_DELAY_HOURS || 3);

async function fetchMatchResult(match) {
  const baseUrl = process.env.RESULTS_API_URL;
  if (!baseUrl || !match.teamA?.code || !match.teamB?.code) return null;
  const url = new URL(baseUrl);
  url.searchParams.set("matchId", match.id);
  url.searchParams.set("teamA", match.teamA.code);
  url.searchParams.set("teamB", match.teamB.code);
  const headers = {};
  if (process.env.RESULTS_API_KEY) headers.Authorization = `Bearer ${process.env.RESULTS_API_KEY}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Result API failed for match ${match.id}: ${response.status}`);
  const data = await response.json();
  if (data.status !== "final") return null;
  const homeScore = Number(data.homeScore);
  const awayScore = Number(data.awayScore);
  const winnerCode = data.winnerCode || (homeScore === awayScore ? null : homeScore > awayScore ? match.teamA.code : match.teamB.code);
  const loserCode = data.loserCode || (homeScore === awayScore ? null : homeScore > awayScore ? match.teamB.code : match.teamA.code);
  return {
    matchId: match.id,
    aCode: match.teamA.code,
    bCode: match.teamB.code,
    homeScore,
    awayScore,
    winnerCode,
    loserCode,
    status: "final",
    source: baseUrl,
    syncedAt: new Date().toISOString()
  };
}

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
          const record = {
            matchId: sourceMatch.id,
            generatedAt: now.toISOString(),
            ...await callPaul(sourceMatch)
          };
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
