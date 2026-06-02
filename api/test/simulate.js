const { createAuditEntry, sha256 } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { loadSnapshot } = require("../_lib/paul");
const { hasResultsProvider, providerName } = require("../_lib/results");

function groupResult(match) {
  const aPower = Number(match.teamA.power || 0);
  const bPower = Number(match.teamB.power || 0);
  const aWins = aPower >= bPower;
  const homeScore = aWins ? 2 : 1;
  const awayScore = aWins ? 1 : 2;
  return {
    matchId: match.id,
    aCode: match.teamA.code,
    bCode: match.teamB.code,
    homeScore,
    awayScore,
    winnerCode: aWins ? match.teamA.code : match.teamB.code,
    loserCode: aWins ? match.teamB.code : match.teamA.code,
    status: "final",
    source: "dry-run",
    syncedAt: "2026-06-28T00:00:00.000Z"
  };
}

function knockoutResult(match) {
  const aPower = Number(match.teamA.power || 0);
  const bPower = Number(match.teamB.power || 0);
  const aWins = aPower >= bPower;
  const homeScore = aWins ? 1 : 0;
  const awayScore = aWins ? 0 : 1;
  return {
    matchId: match.id,
    aCode: match.teamA.code,
    bCode: match.teamB.code,
    homeScore,
    awayScore,
    winnerCode: aWins ? match.teamA.code : match.teamB.code,
    loserCode: aWins ? match.teamB.code : match.teamA.code,
    status: "final",
    source: "dry-run",
    syncedAt: "2026-07-04T00:00:00.000Z"
  };
}

function fakePrediction(match) {
  const winner = Number(match.teamA.power || 0) >= Number(match.teamB.power || 0) ? match.teamA : match.teamB;
  return {
    matchId: match.id,
    generatedAt: "2026-06-10T20:00:00.000Z",
    model: "PAUL-DRY-RUN",
    analysis: {
      winnerCode: winner.code,
      winnerName: winner.name,
      confidence: 61,
      predictedScore: "2-1",
      probabilities: { home: 52, draw: 23, away: 25 },
      upsetRisk: "Dry-run only",
      reasoning: "Synthetic test prediction used to verify proof hashing without writing production data.",
      evidenceUsed: ["dry-run fixture"]
    }
  };
}

module.exports = async function handler(req, res) {
  try {
    const snapshot = loadSnapshot();
    const results = {};
    const groupMatches = snapshot.matches.filter((match) => match.round === "Group Stage");
    groupMatches.forEach((match) => {
      results[match.id] = groupResult(match);
    });

    const afterGroups = resolveMatches(snapshot.matches, results);
    const roundOf32 = afterGroups.filter((match) => match.round === "Round of 32");
    roundOf32.forEach((match) => {
      if (match.teamA?.code && match.teamB?.code) results[match.id] = knockoutResult(match);
    });

    const afterR32 = resolveMatches(snapshot.matches, results);
    const roundOf16 = afterR32.filter((match) => match.round === "Round of 16");
    const proofMatch = groupMatches[0];
    const prediction = fakePrediction(proofMatch);
    const proof = createAuditEntry(proofMatch, prediction);
    const hashVerified = sha256(proof.canonical) === proof.hash;
    const predictions = { [proofMatch.id]: { ...prediction, proof } };

    res.status(200).json({
      status: "pass",
      provider: {
        configured: hasResultsProvider(),
        name: providerName()
      },
      checks: {
        scheduleLoaded: snapshot.matches.length === 104,
        groupResultsGenerated: Object.keys(results).filter((id) => Number(id) <= 72).length === 72,
        roundOf32Resolved: roundOf32.length === 16 && roundOf32.every((match) => match.teamA?.code && match.teamB?.code),
        roundOf32WinnersRecorded: roundOf32.every((match) => resultWinnerCode(match, results[match.id])),
        roundOf16Resolved: roundOf16.length === 8 && roundOf16.every((match) => match.teamA?.code && match.teamB?.code),
        predictionProofCreated: Boolean(proof.hash),
        hashVerified,
        lockedBeforeKickoff: proof.isBeforeKickoff,
        nextPredictionSkipsCompleted: nextPredictionDue(snapshot.matches, predictions, results) !== null,
        accuracySnapshotWorks: typeof accuracySnapshot(predictions, results).accuracy === "number"
      },
      sample: {
        firstRoundOf32: {
          id: roundOf32[0]?.id,
          home: roundOf32[0]?.teamA?.name,
          away: roundOf32[0]?.teamB?.name,
          winner: resultWinnerCode(roundOf32[0], results[roundOf32[0]?.id])
        },
        firstRoundOf16: {
          id: roundOf16[0]?.id,
          home: roundOf16[0]?.teamA?.name,
          away: roundOf16[0]?.teamB?.name
        },
        proof: {
          matchId: proof.matchId,
          hash: proof.hash,
          lockedAt: proof.lockedAt,
          kickoffAt: proof.kickoffAt,
          verified: hashVerified
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "fail", error: error.message });
  }
};
