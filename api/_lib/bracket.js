const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 24);

function parseMatchTime(match) {
  const date = new Date(`${match.date} 20:00:00 GMT+0000`);
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

function nextPredictionDue(matches, predictions, results, now = new Date()) {
  return resolveMatches(matches, results)
    .map((match) => {
      const matchTime = parseMatchTime(match);
      if (!matchTime || predictions[match.id] || !match.teamA?.code || !match.teamB?.code) return null;
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

function accuracySnapshot(predictions, results) {
  const completed = Object.values(results).filter((result) => result.status === "final");
  const graded = completed.filter((result) => predictions[result.matchId]);
  const correct = graded.filter((result) => {
    const prediction = predictions[result.matchId].analysis || {};
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

module.exports = {
  accuracySnapshot,
  nextPredictionDue,
  parseMatchTime,
  resolveMatches,
  resultWinnerCode
};
