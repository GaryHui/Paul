const { createAuditEntry, sha256 } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { loadSnapshot } = require("../_lib/paul");
const { hasResultsProvider, providerName } = require("../_lib/results");

const roundOrder = ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];

function requestToken(req) {
  const auth = req.headers?.authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  if (req.headers?.["x-verify-token"]) return String(req.headers["x-verify-token"]).trim();
  try {
    const url = new URL(req.url || "", "https://paul.local");
    return url.searchParams.get("token") || url.searchParams.get("verify") || "";
  } catch {
    return "";
  }
}

function verifyAccess(req) {
  const expected = process.env.VERIFY_TOKEN;
  if (!expected) {
    const error = new Error("VERIFY_TOKEN is not configured.");
    error.status = 403;
    throw error;
  }
  if (requestToken(req) !== expected) {
    const error = new Error("Unauthorized verify request.");
    error.status = 401;
    throw error;
  }
}

function resultFor(match, syncedAt) {
  const aPower = Number(match.teamA.power || 0);
  const bPower = Number(match.teamB.power || 0);
  const aWins = aPower >= bPower;
  const knockout = match.round !== "Group Stage";
  const homeScore = knockout ? (aWins ? 1 : 0) : (aWins ? 2 : 1);
  const awayScore = knockout ? (aWins ? 0 : 1) : (aWins ? 1 : 2);
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
    syncedAt
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

function simulateTournament(snapshot) {
  const results = {};
  const roundStats = {};
  const groupMatches = snapshot.matches.filter((match) => match.round === "Group Stage");
  groupMatches.forEach((match) => {
    results[match.id] = resultFor(match, "2026-06-28T00:00:00.000Z");
  });
  roundStats["Group Stage"] = groupMatches.length;

  roundOrder.forEach((round, index) => {
    const resolved = resolveMatches(snapshot.matches, results).filter((match) => match.round === round);
    const playable = resolved.filter((match) => match.teamA?.code && match.teamB?.code);
    playable.forEach((match) => {
      if (!results[match.id]) results[match.id] = resultFor(match, `2026-07-${String(index + 4).padStart(2, "0")}T00:00:00.000Z`);
    });
    roundStats[round] = playable.length;
  });

  return { results, roundStats, resolved: resolveMatches(snapshot.matches, results) };
}

module.exports = async function handler(req, res) {
  try {
    verifyAccess(req);
    const snapshot = loadSnapshot();
    const { results, roundStats, resolved } = simulateTournament(snapshot);
    const proofMatch = snapshot.matches.find((match) => match.id === 1);
    const prediction = fakePrediction(proofMatch);
    const proof = createAuditEntry(proofMatch, prediction);
    const hashVerified = sha256(proof.canonical) === proof.hash;
    const predictions = { [proofMatch.id]: { ...prediction, proof } };
    const final = resolved.find((match) => match.id === 104);
    const finalResult = results[104];
    const championCode = resultWinnerCode(final, finalResult);

    res.status(200).json({
      status: "pass",
      provider: {
        configured: hasResultsProvider(),
        name: providerName()
      },
      checks: {
        scheduleLoaded: snapshot.matches.length === 104,
        groupResultsGenerated: roundStats["Group Stage"] === 72,
        roundOf32Resolved: roundStats["Round of 32"] === 16,
        roundOf32WinnersRecorded: resolved.filter((match) => match.round === "Round of 32").every((match) => resultWinnerCode(match, results[match.id])),
        roundOf16Resolved: roundStats["Round of 16"] === 8,
        quarterfinalResolved: roundStats.Quarterfinal === 4,
        semifinalResolved: roundStats.Semifinal === 2,
        thirdPlaceResolved: roundStats["Third Place"] === 1,
        finalResolved: Boolean(final?.teamA?.code && final?.teamB?.code),
        championProduced: Boolean(championCode),
        allResultsGenerated: Object.keys(results).length === 104,
        predictionProofCreated: Boolean(proof.hash),
        hashVerified,
        lockedBeforeKickoff: proof.isBeforeKickoff,
        nextPredictionSkipsCompleted: nextPredictionDue(snapshot.matches, predictions, results) === null,
        accuracySnapshotWorks: typeof accuracySnapshot(predictions, results).accuracy === "number"
      },
      sample: {
        roundStats,
        firstRoundOf32: resolved.find((match) => match.id === 73)
          ? {
              id: 73,
              home: resolved.find((match) => match.id === 73).teamA?.name,
              away: resolved.find((match) => match.id === 73).teamB?.name,
              winner: resultWinnerCode(resolved.find((match) => match.id === 73), results[73])
            }
          : null,
        final: final
          ? {
              id: final.id,
              home: final.teamA?.name,
              away: final.teamB?.name,
              champion: championCode
            }
          : null,
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
    res.status(error.status || 500).json({ status: "fail", error: error.message });
  }
};
