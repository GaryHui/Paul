const { createAuditEntry, sha256 } = require("../_lib/audit");
const { runBacktest } = require("../_lib/backtest");
const { accuracySnapshot, nextPredictionDue, parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { loadSnapshot } = require("../_lib/paul");
const { configuredProviders, fetchMatchResult, hasResultsProvider, providerName } = require("../_lib/results");

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

function requestMode(req) {
  try {
    const url = new URL(req.url || "", "https://paul.local");
    return url.searchParams.get("mode") || "";
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

function teamLabel(team) {
  return team ? `${team.name} (${team.code})` : "TBD";
}

function matchTrace(match, result) {
  const winner = resultWinnerCode(match, result);
  return {
    id: match.id,
    round: match.round,
    date: match.date,
    home: teamLabel(match.teamA),
    away: teamLabel(match.teamB),
    score: result ? `${result.homeScore}-${result.awayScore}` : "TBD",
    winner: winner || "TBD",
    source: result?.source || "dry-run"
  };
}

function groupStandingsTrace(snapshot, results) {
  const tables = {};
  const groupMatches = snapshot.matches.filter((match) => match.round === "Group Stage");
  groupMatches.forEach((match) => {
    [match.teamA, match.teamB].forEach((team) => {
      tables[team.group] ||= {};
      tables[team.group][team.code] ||= { code: team.code, name: team.name, played: 0, points: 0, gf: 0, ga: 0, gd: 0 };
    });
  });
  groupMatches.forEach((match) => {
    const result = results[match.id];
    if (!result) return;
    const home = tables[match.teamA.group][match.teamA.code];
    const away = tables[match.teamB.group][match.teamB.code];
    home.played += 1;
    away.played += 1;
    home.gf += result.homeScore;
    home.ga += result.awayScore;
    away.gf += result.awayScore;
    away.ga += result.homeScore;
    if (result.homeScore === result.awayScore) {
      home.points += 1;
      away.points += 1;
    } else if (result.homeScore > result.awayScore) {
      home.points += 3;
    } else {
      away.points += 3;
    }
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;
  });
  return Object.fromEntries(
    Object.entries(tables).map(([group, table]) => [
      group,
      Object.values(table).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    ])
  );
}

function buildTrace(snapshot, results, resolved) {
  const rounds = Object.fromEntries(
    ["Group Stage", ...roundOrder].map((round) => [
      round,
      resolved
        .filter((match) => match.round === round)
        .map((match) => matchTrace(match, results[match.id]))
    ])
  );
  const final = resolved.find((match) => match.id === 104);
  const champion = final ? resultWinnerCode(final, results[104]) : null;
  return {
    explanation: "Synthetic scores are generated by comparing team power ratings. The trace validates bracket mechanics, not real-world outcomes.",
    groups: groupStandingsTrace(snapshot, results),
    rounds,
    champion
  };
}

async function checkWorldcup26() {
  const startedAt = Date.now();
  const response = await fetch("https://worldcup26.ir/get/games");
  const elapsedMs = Date.now() - startedAt;
  if (!response.ok) {
    return { provider: "worldcup26", ok: false, status: response.status, elapsedMs };
  }
  const data = await response.json();
  const games = data.games || data.data || [];
  return {
    provider: "worldcup26",
    ok: games.length >= 100,
    status: response.status,
    elapsedMs,
    matchCount: games.length,
    firstMatchFinished: games[0]?.finished || null
  };
}

async function checkZafronix() {
  if (!process.env.ZAFRONIX_API_KEY) {
    return { provider: "zafronix", ok: false, skipped: true, reason: "ZAFRONIX_API_KEY is not configured." };
  }
  const baseUrl = process.env.ZAFRONIX_BASE_URL || "https://api.zafronix.com/fifa/worldcup/v1";
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/tournaments/2026`, {
    headers: { "X-API-Key": process.env.ZAFRONIX_API_KEY }
  });
  return {
    provider: "zafronix",
    ok: response.ok,
    status: response.status,
    elapsedMs: Date.now() - startedAt
  };
}

async function providerHealth(provider) {
  try {
    if (provider === "worldcup26") return await checkWorldcup26();
    if (provider === "zafronix") return await checkZafronix();
    if (provider === "football-data") {
      return {
        provider,
        ok: Boolean(process.env.FOOTBALL_DATA_API_KEY),
        skipped: !process.env.FOOTBALL_DATA_API_KEY,
        reason: process.env.FOOTBALL_DATA_API_KEY ? "Configured." : "FOOTBALL_DATA_API_KEY is not configured."
      };
    }
    if (provider === "generic") {
      return {
        provider,
        ok: Boolean(process.env.RESULTS_API_URL),
        skipped: !process.env.RESULTS_API_URL,
        reason: process.env.RESULTS_API_URL ? "Configured." : "RESULTS_API_URL is not configured."
      };
    }
    return { provider, ok: false, reason: "Unknown provider." };
  } catch (error) {
    return { provider, ok: false, error: error.message };
  }
}

async function resultsHealth(snapshot) {
  const firstPlayable = snapshot.matches.find((match) => match.teamA?.code && match.teamB?.code);
  const providers = configuredProviders();
  const checks = await Promise.all(providers.map((provider) => providerHealth(provider)));
  const firstMatchResult = firstPlayable ? await fetchMatchResult(firstPlayable) : null;
  const safeBeforeKickoff = firstMatchResult === null;

  return {
    status: checks.some((check) => check.ok) && safeBeforeKickoff ? "pass" : "fail",
    generatedAt: new Date().toISOString(),
    providerName: providerName(),
    providers,
    checks,
    firstPlayable: firstPlayable
      ? {
          id: firstPlayable.id,
          label: `${firstPlayable.teamA.name} vs ${firstPlayable.teamB.name}`,
          round: firstPlayable.round,
          date: firstPlayable.date
        }
      : null,
    safeBeforeKickoff,
    firstMatchResult,
    writesProductionData: false
  };
}

module.exports = async function handler(req, res) {
  try {
    verifyAccess(req);
    const snapshot = loadSnapshot();
    if (requestMode(req) === "results-health") {
      res.status(200).json(await resultsHealth(snapshot));
      return;
    }
    if (requestMode(req) === "backtest") {
      res.status(200).json(await runBacktest());
      return;
    }
    const { results, roundStats, resolved } = simulateTournament(snapshot);
    const proofMatch = snapshot.matches.find((match) => match.id === 1);
    const prediction = fakePrediction(proofMatch);
    const proof = createAuditEntry(proofMatch, prediction);
    const hashVerified = sha256(proof.canonical) === proof.hash;
    const predictions = { [proofMatch.id]: { ...prediction, proof } };
    const final = resolved.find((match) => match.id === 104);
    const finalResult = results[104];
    const championCode = resultWinnerCode(final, finalResult);
    const trace = buildTrace(snapshot, results, resolved);

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
          id: proof.id,
          version: proof.version,
          matchId: proof.matchId,
          match: proof.match,
          round: proof.round,
          hash: proof.hash,
          algorithm: proof.algorithm,
          lockedAt: proof.lockedAt,
          kickoffAt: proof.kickoffAt,
          canonical: proof.canonical,
          payload: proof.payload,
          externalProof: { demo: { provider: "dry-run", note: "No OpenTimestamps receipt is created during dry-run, so this test does not consume calendar resources." } },
          verified: hashVerified
        }
      },
      trace
    });
  } catch (error) {
    res.status(error.status || 500).json({ status: "fail", error: error.message });
  }
};
