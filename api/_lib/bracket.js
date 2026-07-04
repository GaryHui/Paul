const fs = require("fs");
const path = require("path");

const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 36);
const dataDir = path.join(__dirname, "..", "..", "data");

let ratingCache = null;

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function parseMatchTime(match) {
  const date = match?.kickoffAt ? new Date(match.kickoffAt) : new Date(`${match.date} 20:00:00 GMT+0000`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resultWinnerCode(match, result, wantLoser = false) {
  if (!result || result.status !== "final") return null;
  if (result.winnerCode) return wantLoser ? result.loserCode || null : result.winnerCode;
  if (!match.teamA?.code || !match.teamB?.code) return null;
  if (Number(result.homeScore) === Number(result.awayScore)) return null;
  const winner = Number(result.homeScore) > Number(result.awayScore) ? match.teamA.code : match.teamB.code;
  const loser = Number(result.homeScore) > Number(result.awayScore) ? match.teamB.code : match.teamA.code;
  return wantLoser ? loser : winner;
}

function buildTeamMap(matches) {
  const teams = {};
  matches.forEach((match) => {
    if (match.teamA?.code) teams[match.teamA.code] = match.teamA;
    if (match.teamB?.code) teams[match.teamB.code] = match.teamB;
  });
  return teams;
}

function groupStandings(matches, results, teams) {
  const table = {};
  Object.values(teams).forEach((team) => {
    table[team.code] = { code: team.code, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  matches
    .filter((match) => match.round === "Group Stage" && match.teamA?.code && match.teamB?.code)
    .forEach((match) => {
      const result = results[match.id];
      if (result?.status !== "final") return;
      const a = table[match.teamA.code];
      const b = table[match.teamB.code];
      const aGoals = Number(result.homeScore);
      const bGoals = Number(result.awayScore);
      a.p += 1;
      b.p += 1;
      a.gf += aGoals;
      a.ga += bGoals;
      b.gf += bGoals;
      b.ga += aGoals;
      if (aGoals === bGoals) {
        a.d += 1;
        b.d += 1;
        a.pts += 1;
        b.pts += 1;
      } else if (aGoals > bGoals) {
        a.w += 1;
        b.l += 1;
        a.pts += 3;
      } else {
        b.w += 1;
        a.l += 1;
        b.pts += 3;
      }
      a.gd = a.gf - a.ga;
      b.gd = b.gf - b.ga;
    });

  const groups = {};
  Object.values(teams).forEach((team) => {
    groups[team.group] ||= [];
    groups[team.group].push(table[team.code]);
  });
  Object.keys(groups).forEach((group) => {
    groups[group].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || (teams[b.code]?.power || 0) - (teams[a.code]?.power || 0));
  });
  return groups;
}

function groupIsComplete(matches, results, group) {
  return matches.filter((match) => match.round === "Group Stage" && match.group === group && results[match.id]?.status === "final").length === 6;
}

function allGroupsComplete(matches, results) {
  const groups = [...new Set(matches.filter((match) => match.round === "Group Stage").map((match) => match.group))];
  return groups.every((group) => groupIsComplete(matches, results, group));
}

function thirdPlaceAssignments(matches, results, standings, teams) {
  if (!allGroupsComplete(matches, results)) return {};
  const thirds = Object.keys(standings)
    .map((group) => standings[group]?.[2])
    .filter(Boolean)
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || (teams[b.code]?.power || 0) - (teams[a.code]?.power || 0))
    .slice(0, 8);
  const used = new Set();
  const assignments = {};
  matches
    .filter((match) => match.round === "Round of 32")
    .forEach((match) => {
      [match.aSlot, match.bSlot].filter((slot) => slot?.type === "bestThird").forEach((slot) => {
        if (assignments[slot.label]) return;
        const chosen = thirds.find((row) => slot.groups.includes(teams[row.code]?.group) && !used.has(row.code)) || thirds.find((row) => !used.has(row.code));
        if (chosen) {
          assignments[slot.label] = chosen.code;
          used.add(chosen.code);
        }
      });
    });
  return assignments;
}

function resolveSlot(slot, context) {
  if (!slot) return null;
  const { matches, results, teams, standings, thirdAssignments } = context;
  if (slot.type === "groupRank") {
    if (!groupIsComplete(matches, results, slot.group)) return null;
    return standings[slot.group]?.[slot.rank - 1]?.code || null;
  }
  if (slot.type === "bestThird") return thirdAssignments[slot.label] || null;
  if (slot.type === "winner" || slot.type === "loser") {
    const source = matches.find((match) => match.id === slot.matchId);
    const resolvedSource = source ? resolveMatch(source, context) : null;
    return resolvedSource ? resultWinnerCode(resolvedSource, results[slot.matchId], slot.type === "loser") : null;
  }
  return null;
}

function resolveMatch(match, context) {
  if (match.teamA?.code && match.teamB?.code) return match;
  const aCode = resolveSlot(match.aSlot, context);
  const bCode = resolveSlot(match.bSlot, context);
  if (!aCode || !bCode) return match;
  return { ...match, teamA: context.teams[aCode], teamB: context.teams[bCode] };
}

function resolveMatches(matches, results) {
  const teams = buildTeamMap(matches);
  const standings = groupStandings(matches, results, teams);
  const context = { matches, results, teams, standings, thirdAssignments: {} };
  context.thirdAssignments = thirdPlaceAssignments(matches, results, standings, teams);
  return matches.map((match) => resolveMatch(match, context));
}

function compactStandingRow(row, teams, extra = {}) {
  if (!row) return null;
  const team = teams[row.code] || {};
  return {
    code: row.code,
    name: team.name || row.code,
    group: team.group || null,
    rank: extra.rank || null,
    status: extra.status || null,
    played: row.p,
    points: row.pts,
    goalDifference: row.gd,
    goalsFor: row.gf
  };
}

function qualificationContext(matches, results, focusMatch = null) {
  const teams = buildTeamMap(matches);
  const standings = groupStandings(matches, results, teams);
  const groupNames = Object.keys(standings).sort();
  const completeGroups = groupNames.filter((group) => groupIsComplete(matches, results, group));
  const groupSnapshots = groupNames.map((group) => ({
    group,
    complete: completeGroups.includes(group),
    rows: (standings[group] || []).slice(0, 4).map((row, index) =>
      compactStandingRow(row, teams, {
        rank: index + 1,
        status: completeGroups.includes(group)
          ? index < 2 ? "locked-top-two" : index === 2 ? "third-place-candidate" : "eliminated"
          : "live-table"
      })
    )
  }));
  const lockedTopTwo = completeGroups.flatMap((group) =>
    (standings[group] || []).slice(0, 2).map((row, index) =>
      compactStandingRow(row, teams, { rank: index + 1, status: "locked-top-two" })
    )
  ).filter(Boolean);
  const thirdCandidates = completeGroups
    .map((group) => compactStandingRow(standings[group]?.[2], teams, { rank: 3, status: allGroupsComplete(matches, results) ? "best-third-final" : "best-third-candidate" }))
    .filter(Boolean)
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
  const context = { matches, results, teams, standings, thirdAssignments: {} };
  context.thirdAssignments = thirdPlaceAssignments(matches, results, standings, teams);
  const describeSlot = (slot) => {
    if (!slot) return null;
    const code = resolveSlot(slot, context);
    const team = code ? teams[code] : null;
    return {
      label: slot.label || null,
      type: slot.type || null,
      group: slot.group || null,
      rank: slot.rank || null,
      groups: slot.groups || null,
      matchId: slot.matchId || null,
      resolvedCode: code || null,
      resolvedName: team?.name || null
    };
  };
  const slotContext = focusMatch
    ? {
        round: focusMatch.round || null,
        matchId: focusMatch.id || null,
        teamA: focusMatch.teamA?.code || null,
        teamB: focusMatch.teamB?.code || null,
        aSlot: describeSlot(focusMatch.aSlot),
        bSlot: describeSlot(focusMatch.bSlot)
      }
    : null;
  return {
    version: "qualification-context-v1",
    completeGroups,
    groupSnapshots,
    lockedTopTwoCount: lockedTopTwo.length,
    lockedTopTwo: lockedTopTwo.slice(0, 32),
    thirdPlacePoolStatus: allGroupsComplete(matches, results) ? "final" : "partial",
    thirdPlaceCandidates: thirdCandidates.slice(0, 12),
    slotContext,
    note: "Use locked qualifiers and current bracket slots to judge rotation, motivation, rest, matchup path, and knockout opponent-pool strength."
  };
}

function nextPredictionDue(matches, predictions, results, now = new Date()) {
  return resolveMatches(matches, results)
    .map((match) => {
      const matchTime = parseMatchTime(match);
      if (!matchTime || predictions[match.id] || results[match.id]?.status === "final" || !match.teamA?.code || !match.teamB?.code) return null;
      if (matchTime <= now) return null;
      return {
        id: match.id,
        label: `${match.teamA.name} vs ${match.teamB.name}`,
        dueAt: new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000).toISOString(),
        kickoffAt: matchTime.toISOString(),
        overdue: now >= new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000)
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))[0] || null;
}

function accuracySnapshot(predictions, results) {
  const completed = Object.entries(results).filter(([, result]) => result.status === "final");
  const graded = completed.filter(([matchId, result]) => predictions[result.matchId || matchId]);
  const correct = graded.filter(([matchId, result]) => {
    const prediction = predictions[result.matchId || matchId].analysis || {};
    const pick = prediction.winnerCode || prediction.winner || prediction.winnerName;
    const winner = result.winnerCode || (Number(result.homeScore) === Number(result.awayScore) ? "DRAW" : Number(result.homeScore) > Number(result.awayScore) ? result.aCode : result.bCode);
    return String(pick).toUpperCase() === String(winner).toUpperCase();
  });
  return {
    completed: completed.length,
    graded: graded.length,
    correct: correct.length,
    accuracy: graded.length ? Math.round((correct.length / graded.length) * 100) : 0
  };
}

function predictedCode(prediction) {
  return prediction?.analysis?.winnerCode || prediction?.analysis?.winner || prediction?.analysis?.winnerName || null;
}

function winnerCodeFor(result) {
  return result.winnerCode || (Number(result.homeScore) === Number(result.awayScore) ? "DRAW" : Number(result.homeScore) > Number(result.awayScore) ? result.aCode : result.bCode);
}

function isCorrectPick(pick, winner) {
  return String(pick || "").toUpperCase() === String(winner || "").toUpperCase();
}

function retroRatings() {
  if (!ratingCache) ratingCache = readJson(path.join(dataDir, "team-ratings.json"), {});
  return ratingCache;
}

function findRatingRecord(code) {
  const ratings = retroRatings();
  if (!code) return null;
  if (Array.isArray(ratings)) return ratings.find((item) => item.code === code || item.teamCode === code) || null;
  return ratings[code] || null;
}

function normalize3Way(probs) {
  const home = Number(probs?.home || probs?.a || 0);
  const draw = Number(probs?.draw || 0);
  const away = Number(probs?.away || probs?.b || 0);
  const sum = home + draw + away;
  if (!sum) return null;
  return { home: home / sum, draw: draw / sum, away: away / sum };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function eloProbabilities(aRating, bRating, allowDraw) {
  const diff = Number(aRating) - Number(bRating);
  const homeRaw = 1 / (1 + 10 ** (-diff / 400));
  const draw = allowDraw ? clamp(0.28 - Math.abs(diff) / 2400, 0.12, 0.3) : 0;
  return normalize3Way({
    home: homeRaw * (1 - draw),
    draw,
    away: (1 - homeRaw) * (1 - draw)
  });
}

function poisson(k, lambda) {
  let factorial = 1;
  for (let i = 2; i <= k; i += 1) factorial *= i;
  return (Math.exp(-lambda) * lambda ** k) / factorial;
}

function poissonProbabilities(aLambda, bLambda, allowDraw) {
  let home = 0;
  let draw = 0;
  let away = 0;
  for (let a = 0; a <= 7; a += 1) {
    for (let b = 0; b <= 7; b += 1) {
      const p = poisson(a, aLambda) * poisson(b, bLambda);
      if (a > b) home += p;
      else if (a === b) draw += p;
      else away += p;
    }
  }
  if (!allowDraw) {
    home += draw / 2;
    away += draw / 2;
    draw = 0;
  }
  return normalize3Way({ home, draw, away });
}

function blendModelProbabilities(models) {
  const usable = models.filter((model) => model.probabilities && model.weight > 0);
  const totalWeight = usable.reduce((sum, model) => sum + model.weight, 0);
  if (!totalWeight) return null;
  return normalize3Way({
    home: usable.reduce((sum, model) => sum + model.probabilities.home * model.weight, 0) / totalWeight,
    draw: usable.reduce((sum, model) => sum + model.probabilities.draw * model.weight, 0) / totalWeight,
    away: usable.reduce((sum, model) => sum + model.probabilities.away * model.weight, 0) / totalWeight
  });
}

function favoriteCodeFromProbabilities(match, probabilities) {
  if (!match?.teamA?.code || !match?.teamB?.code || !probabilities) return null;
  const candidates = [
    { side: "home", code: match.teamA.code, probability: probabilities.home },
    { side: "away", code: match.teamB.code, probability: probabilities.away }
  ];
  if (match.round === "Group Stage") candidates.push({ side: "draw", code: "DRAW", probability: probabilities.draw });
  candidates.sort((a, b) => Number(b.probability || 0) - Number(a.probability || 0));
  return candidates[0]?.code || null;
}

function retroModelProbabilities(match) {
  if (!match?.teamA?.code || !match?.teamB?.code) return { rating: null, poisson: null };
  const ratingA = findRatingRecord(match.teamA.code);
  const ratingB = findRatingRecord(match.teamB.code);
  const allowDraw = match.round === "Group Stage";
  const rating = ratingA?.elo && ratingB?.elo ? eloProbabilities(ratingA.elo, ratingB.elo, allowDraw) : null;
  let score = null;
  if (ratingA?.attack && ratingA?.defense && ratingB?.attack && ratingB?.defense) {
    const base = allowDraw ? 1.22 : 1.28;
    const aLambda = clamp(base * Number(ratingA.attack) / Math.max(0.1, Number(ratingB.defense)), 0.25, 3.5);
    const bLambda = clamp(base * Number(ratingB.attack) / Math.max(0.1, Number(ratingA.defense)), 0.25, 3.5);
    score = poissonProbabilities(aLambda, bLambda, allowDraw);
  }
  return { rating, poisson: score };
}

function evidenceObject(prediction) {
  return prediction?.evidence || prediction?.proof?.payload?.evidence || {};
}

function baselineCode(prediction, key, match) {
  const evidence = evidenceObject(prediction);
  const stored = evidence?.baselines?.[key]?.winnerCode || null;
  if (stored) return stored;
  const models = retroModelProbabilities(match);
  if (key === "ratingFavorite") return favoriteCodeFromProbabilities(match, models.rating);
  if (key === "poissonFavorite") return favoriteCodeFromProbabilities(match, models.poisson);
  if (key === "blendedFavorite") {
    const blended = blendModelProbabilities([
      { probabilities: normalize3Way(evidence?.market?.probabilities), weight: 55 },
      { probabilities: models.rating, weight: 25 },
      { probabilities: models.poisson, weight: 20 }
    ]);
    return favoriteCodeFromProbabilities(match, blended);
  }
  return null;
}

function confidenceBand(confidence) {
  const value = Number(confidence);
  if (!Number.isFinite(value)) return null;
  if (value < 60) return "50-59";
  if (value < 70) return "60-69";
  if (value < 80) return "70-79";
  return "80+";
}

function createAccuracyBucket(extra = {}) {
  return { completed: 0, graded: 0, correct: 0, accuracy: 0, status: "pending", ...extra };
}

const trackedRoundLabels = {
  "Round of 32": "Round of 32",
  "Round of 16": "Round of 16",
  Quarterfinal: "Quarterfinal",
  Semifinal: "Semifinal",
  "Third Place": "Third Place",
  Final: "Final"
};

function roundAccuracyBuckets() {
  return Object.fromEntries(Object.entries(trackedRoundLabels).map(([round, label]) => [
    round,
    createAccuracyBucket({ round, label })
  ]));
}

function finalizeAccuracyBucket(bucket) {
  bucket.accuracy = bucket.graded ? Math.round((bucket.correct / bucket.graded) * 100) : 0;
  if (bucket.graded) bucket.status = "graded";
  else if (bucket.completed) bucket.status = "ungraded";
  else bucket.status = "pending";
  return bucket;
}

function stageAccuracySnapshot(predictions, results, matches) {
  const byId = new Map(matches.map((match) => [Number(match.id), match]));
  const stats = {
    group: createAccuracyBucket({ round: "Group Stage", label: "Group Stage" }),
    knockout: createAccuracyBucket({ round: "Knockout", label: "Knockout" }),
    rounds: roundAccuracyBuckets(),
    upsets: { called: 0, hit: 0 },
    proofVerified: 0,
    baselines: {
      market: createAccuracyBucket(),
      rating: createAccuracyBucket(),
      poisson: createAccuracyBucket(),
      blended: createAccuracyBucket(),
      paulVsMarket: { paulOnlyCorrect: 0, marketOnlyCorrect: 0, bothCorrect: 0, bothMissed: 0, edge: 0 }
    },
    calibration: {
      graded: 0,
      averageConfidence: 0,
      actualAccuracy: 0,
      gap: 0,
      buckets: {
        "50-59": createAccuracyBucket(),
        "60-69": createAccuracyBucket(),
        "70-79": createAccuracyBucket(),
        "80+": createAccuracyBucket()
      }
    }
  };

  Object.values(predictions).forEach((prediction) => {
    if (prediction.proof?.hash) stats.proofVerified += 1;
  });

  Object.entries(results)
    .filter(([, result]) => result.status === "final")
    .forEach(([matchId, result]) => {
      const resolvedMatchId = result.matchId || matchId;
      const match = byId.get(Number(resolvedMatchId));
      const bucket = match?.round === "Group Stage" ? stats.group : stats.knockout;
      bucket.completed += 1;
      const roundBucket = stats.rounds[match?.round];
      if (roundBucket) roundBucket.completed += 1;
      const prediction = predictions[resolvedMatchId];
      if (!prediction) return;
      bucket.graded += 1;
      if (roundBucket) roundBucket.graded += 1;
      const pick = predictedCode(prediction);
      const winner = winnerCodeFor(result);
      const correct = isCorrectPick(pick, winner);
      if (correct) bucket.correct += 1;
      if (correct && roundBucket) roundBucket.correct += 1;

      const marketPick = baselineCode(prediction, "marketFavorite", match);
      const baselineMap = [
        ["market", marketPick],
        ["rating", baselineCode(prediction, "ratingFavorite", match)],
        ["poisson", baselineCode(prediction, "poissonFavorite", match)],
        ["blended", baselineCode(prediction, "blendedFavorite", match)]
      ];
      baselineMap.forEach(([name, baselinePick]) => {
        if (!baselinePick) return;
        stats.baselines[name].graded += 1;
        if (isCorrectPick(baselinePick, winner)) stats.baselines[name].correct += 1;
      });

      if (marketPick) {
        const marketCorrect = isCorrectPick(marketPick, winner);
        if (correct && marketCorrect) stats.baselines.paulVsMarket.bothCorrect += 1;
        else if (correct && !marketCorrect) stats.baselines.paulVsMarket.paulOnlyCorrect += 1;
        else if (!correct && marketCorrect) stats.baselines.paulVsMarket.marketOnlyCorrect += 1;
        else stats.baselines.paulVsMarket.bothMissed += 1;
      }

      const confidence = Number(prediction.analysis?.confidence);
      const band = confidenceBand(confidence);
      if (band) {
        stats.calibration.graded += 1;
        stats.calibration.averageConfidence += confidence;
        stats.calibration.buckets[band].graded += 1;
        if (correct) stats.calibration.buckets[band].correct += 1;
      }

      const homePower = Number(match?.teamA?.power || 0);
      const awayPower = Number(match?.teamB?.power || 0);
      const underdog = homePower === awayPower ? null : homePower < awayPower ? match.teamA?.code : match.teamB?.code;
      if (underdog && String(pick).toUpperCase() === String(underdog).toUpperCase()) {
        stats.upsets.called += 1;
        if (correct) stats.upsets.hit += 1;
      }
    });

  [stats.group, stats.knockout, ...Object.values(stats.rounds)].forEach(finalizeAccuracyBucket);
  Object.values(stats.baselines)
    .filter((bucket) => typeof bucket.graded === "number")
    .forEach((bucket) => {
      finalizeAccuracyBucket(bucket);
    });
  stats.baselines.paulVsMarket.edge = stats.baselines.paulVsMarket.paulOnlyCorrect - stats.baselines.paulVsMarket.marketOnlyCorrect;
  Object.values(stats.calibration.buckets).forEach((bucket) => {
    bucket.accuracy = bucket.graded ? Math.round((bucket.correct / bucket.graded) * 100) : 0;
  });
  if (stats.calibration.graded) {
    stats.calibration.averageConfidence = Math.round(stats.calibration.averageConfidence / stats.calibration.graded);
    const totalCorrect = stats.group.correct + stats.knockout.correct;
    const totalGraded = stats.group.graded + stats.knockout.graded;
    stats.calibration.actualAccuracy = totalGraded ? Math.round((totalCorrect / totalGraded) * 100) : 0;
    stats.calibration.gap = Math.abs(stats.calibration.actualAccuracy - stats.calibration.averageConfidence);
  }
  return stats;
}

module.exports = {
  accuracySnapshot,
  nextPredictionDue,
  parseMatchTime,
  qualificationContext,
  resolveMatches,
  resultWinnerCode,
  stageAccuracySnapshot
};
