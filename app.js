const teams = {
  MEX: { name: "Mexico", flag: "🇲🇽", group: "A", pos: 1, languages: "Spanish", power: 80, attack: 79, defense: 78, form: 6, confed: "CONCACAF" },
  RSA: { name: "South Africa", flag: "🇿🇦", group: "A", pos: 2, languages: "Zulu, Xhosa, Afrikaans, English + official languages", power: 68, attack: 67, defense: 69, form: 3, confed: "CAF" },
  KOR: { name: "Korea Republic", flag: "🇰🇷", group: "A", pos: 3, languages: "Korean", power: 78, attack: 78, defense: 76, form: 5, confed: "AFC" },
  CZE: { name: "Czechia", flag: "🇨🇿", group: "A", pos: 4, languages: "Czech", power: 76, attack: 75, defense: 77, form: 4, confed: "UEFA" },

  CAN: { name: "Canada", flag: "🇨🇦", group: "B", pos: 1, languages: "English, French", power: 77, attack: 78, defense: 74, form: 5, confed: "CONCACAF" },
  BIH: { name: "Bosnia and Herzegovina", flag: "🇧🇦", group: "B", pos: 2, languages: "Bosnian, Croatian, Serbian", power: 73, attack: 73, defense: 72, form: 4, confed: "UEFA" },
  QAT: { name: "Qatar", flag: "🇶🇦", group: "B", pos: 3, languages: "Arabic", power: 70, attack: 70, defense: 69, form: 3, confed: "AFC" },
  SUI: { name: "Switzerland", flag: "🇨🇭", group: "B", pos: 4, languages: "German, French, Italian, Romansh", power: 82, attack: 80, defense: 84, form: 6, confed: "UEFA" },

  BRA: { name: "Brazil", flag: "🇧🇷", group: "C", pos: 1, languages: "Portuguese", power: 91, attack: 92, defense: 87, form: 7, confed: "CONMEBOL" },
  MAR: { name: "Morocco", flag: "🇲🇦", group: "C", pos: 2, languages: "Arabic, Amazigh", power: 84, attack: 82, defense: 86, form: 7, confed: "CAF" },
  HAI: { name: "Haiti", flag: "🇭🇹", group: "C", pos: 3, languages: "Haitian Creole, French", power: 64, attack: 64, defense: 62, form: 3, confed: "CONCACAF" },
  SCO: { name: "Scotland", flag: "🏴", group: "C", pos: 4, languages: "English, Scots, Scottish Gaelic", power: 75, attack: 73, defense: 76, form: 4, confed: "UEFA" },

  USA: { name: "United States", flag: "🇺🇸", group: "D", pos: 1, languages: "English", power: 81, attack: 82, defense: 78, form: 6, confed: "CONCACAF" },
  PAR: { name: "Paraguay", flag: "🇵🇾", group: "D", pos: 2, languages: "Spanish, Guarani", power: 75, attack: 73, defense: 77, form: 4, confed: "CONMEBOL" },
  AUS: { name: "Australia", flag: "🇦🇺", group: "D", pos: 3, languages: "English", power: 74, attack: 73, defense: 75, form: 4, confed: "AFC" },
  TUR: { name: "Turkiye", flag: "🇹🇷", group: "D", pos: 4, languages: "Turkish", power: 79, attack: 81, defense: 76, form: 5, confed: "UEFA" },

  GER: { name: "Germany", flag: "🇩🇪", group: "E", pos: 1, languages: "German", power: 89, attack: 88, defense: 86, form: 7, confed: "UEFA" },
  CUW: { name: "Curacao", flag: "🇨🇼", group: "E", pos: 2, languages: "Papiamentu, Dutch, English", power: 63, attack: 63, defense: 62, form: 4, confed: "CONCACAF" },
  CIV: { name: "Cote d'Ivoire", flag: "🇨🇮", group: "E", pos: 3, languages: "French", power: 78, attack: 79, defense: 76, form: 6, confed: "CAF" },
  ECU: { name: "Ecuador", flag: "🇪🇨", group: "E", pos: 4, languages: "Spanish, Kichwa, Shuar", power: 82, attack: 80, defense: 83, form: 6, confed: "CONMEBOL" },

  NED: { name: "Netherlands", flag: "🇳🇱", group: "F", pos: 1, languages: "Dutch", power: 88, attack: 87, defense: 87, form: 7, confed: "UEFA" },
  JPN: { name: "Japan", flag: "🇯🇵", group: "F", pos: 2, languages: "Japanese", power: 83, attack: 84, defense: 81, form: 7, confed: "AFC" },
  SWE: { name: "Sweden", flag: "🇸🇪", group: "F", pos: 3, languages: "Swedish", power: 77, attack: 76, defense: 78, form: 4, confed: "UEFA" },
  TUN: { name: "Tunisia", flag: "🇹🇳", group: "F", pos: 4, languages: "Arabic", power: 72, attack: 70, defense: 74, form: 4, confed: "CAF" },

  BEL: { name: "Belgium", flag: "🇧🇪", group: "G", pos: 1, languages: "Dutch, French, German", power: 85, attack: 86, defense: 82, form: 6, confed: "UEFA" },
  EGY: { name: "Egypt", flag: "🇪🇬", group: "G", pos: 2, languages: "Arabic", power: 77, attack: 78, defense: 75, form: 5, confed: "CAF" },
  IRN: { name: "IR Iran", flag: "🇮🇷", group: "G", pos: 3, languages: "Persian", power: 76, attack: 75, defense: 77, form: 5, confed: "AFC" },
  NZL: { name: "New Zealand", flag: "🇳🇿", group: "G", pos: 4, languages: "English, Maori, New Zealand Sign Language", power: 67, attack: 66, defense: 68, form: 4, confed: "OFC" },

  ESP: { name: "Spain", flag: "🇪🇸", group: "H", pos: 1, languages: "Spanish", power: 92, attack: 91, defense: 90, form: 8, confed: "UEFA" },
  CPV: { name: "Cape Verde", flag: "🇨🇻", group: "H", pos: 2, languages: "Portuguese, Cape Verdean Creole", power: 69, attack: 70, defense: 67, form: 5, confed: "CAF" },
  KSA: { name: "Saudi Arabia", flag: "🇸🇦", group: "H", pos: 3, languages: "Arabic", power: 71, attack: 70, defense: 71, form: 4, confed: "AFC" },
  URU: { name: "Uruguay", flag: "🇺🇾", group: "H", pos: 4, languages: "Spanish", power: 86, attack: 85, defense: 86, form: 7, confed: "CONMEBOL" },

  FRA: { name: "France", flag: "🇫🇷", group: "I", pos: 1, languages: "French", power: 93, attack: 94, defense: 90, form: 8, confed: "UEFA" },
  SEN: { name: "Senegal", flag: "🇸🇳", group: "I", pos: 2, languages: "French, Wolof", power: 80, attack: 79, defense: 81, form: 6, confed: "CAF" },
  IRQ: { name: "Iraq", flag: "🇮🇶", group: "I", pos: 3, languages: "Arabic, Kurdish", power: 68, attack: 68, defense: 67, form: 5, confed: "AFC" },
  NOR: { name: "Norway", flag: "🇳🇴", group: "I", pos: 4, languages: "Norwegian", power: 82, attack: 86, defense: 77, form: 6, confed: "UEFA" },

  ARG: { name: "Argentina", flag: "🇦🇷", group: "J", pos: 1, languages: "Spanish", power: 94, attack: 93, defense: 91, form: 9, confed: "CONMEBOL" },
  ALG: { name: "Algeria", flag: "🇩🇿", group: "J", pos: 2, languages: "Arabic, Tamazight", power: 76, attack: 77, defense: 74, form: 5, confed: "CAF" },
  AUT: { name: "Austria", flag: "🇦🇹", group: "J", pos: 3, languages: "German", power: 81, attack: 80, defense: 81, form: 6, confed: "UEFA" },
  JOR: { name: "Jordan", flag: "🇯🇴", group: "J", pos: 4, languages: "Arabic", power: 66, attack: 66, defense: 65, form: 4, confed: "AFC" },

  POR: { name: "Portugal", flag: "🇵🇹", group: "K", pos: 1, languages: "Portuguese", power: 90, attack: 91, defense: 86, form: 8, confed: "UEFA" },
  COD: { name: "DR Congo", flag: "🇨🇩", group: "K", pos: 2, languages: "French, Lingala, Kikongo, Swahili, Tshiluba", power: 72, attack: 73, defense: 71, form: 5, confed: "CAF" },
  UZB: { name: "Uzbekistan", flag: "🇺🇿", group: "K", pos: 3, languages: "Uzbek", power: 70, attack: 69, defense: 71, form: 5, confed: "AFC" },
  COL: { name: "Colombia", flag: "🇨🇴", group: "K", pos: 4, languages: "Spanish", power: 84, attack: 84, defense: 82, form: 7, confed: "CONMEBOL" },

  ENG: { name: "England", flag: "🏴", group: "L", pos: 1, languages: "English", power: 90, attack: 90, defense: 88, form: 7, confed: "UEFA" },
  CRO: { name: "Croatia", flag: "🇭🇷", group: "L", pos: 2, languages: "Croatian", power: 83, attack: 81, defense: 84, form: 6, confed: "UEFA" },
  GHA: { name: "Ghana", flag: "🇬🇭", group: "L", pos: 3, languages: "English, Akan, Ewe, Ga, Dagbani", power: 75, attack: 76, defense: 73, form: 4, confed: "CAF" },
  PAN: { name: "Panama", flag: "🇵🇦", group: "L", pos: 4, languages: "Spanish", power: 69, attack: 68, defense: 69, form: 4, confed: "CONCACAF" }
};

const groupOrder = "ABCDEFGHIJKL".split("");
const roundOptions = ["All", "Group Stage", "Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];
const roundLabels = {
  All: "All",
  "Group Stage": "Group Stage"
};
const groupLabels = { All: "All" };
const groupDates = {
  A: ["Jun 11", "Jun 11", "Jun 18", "Jun 18", "Jun 24", "Jun 24"],
  B: ["Jun 12", "Jun 13", "Jun 18", "Jun 18", "Jun 24", "Jun 24"],
  C: ["Jun 13", "Jun 13", "Jun 19", "Jun 19", "Jun 24", "Jun 24"],
  D: ["Jun 12", "Jun 13", "Jun 19", "Jun 19", "Jun 25", "Jun 25"],
  E: ["Jun 14", "Jun 14", "Jun 20", "Jun 20", "Jun 25", "Jun 25"],
  F: ["Jun 14", "Jun 14", "Jun 20", "Jun 20", "Jun 25", "Jun 25"],
  G: ["Jun 15", "Jun 15", "Jun 21", "Jun 21", "Jun 26", "Jun 26"],
  H: ["Jun 15", "Jun 15", "Jun 21", "Jun 21", "Jun 26", "Jun 26"],
  I: ["Jun 16", "Jun 16", "Jun 22", "Jun 22", "Jun 26", "Jun 26"],
  J: ["Jun 16", "Jun 16", "Jun 22", "Jun 22", "Jun 27", "Jun 27"],
  K: ["Jun 17", "Jun 17", "Jun 23", "Jun 23", "Jun 27", "Jun 27"],
  L: ["Jun 17", "Jun 17", "Jun 23", "Jun 23", "Jun 27", "Jun 27"]
};

const cityRoute = {
  A: "Mexico City / Guadalajara / Atlanta",
  B: "Toronto / Bay Area / Los Angeles",
  C: "New York-New Jersey / Boston / Miami",
  D: "Los Angeles / Vancouver / Seattle",
  E: "Philadelphia / Houston / New York-New Jersey",
  F: "Dallas / Monterrey / Kansas City",
  G: "Seattle / Los Angeles / Vancouver",
  H: "Atlanta / Miami / Houston",
  I: "New York-New Jersey / Boston / Toronto",
  J: "Kansas City / Bay Area / Dallas",
  K: "Houston / Mexico City / Miami",
  L: "Dallas / Toronto / Philadelphia"
};

const pairPattern = [[1, 2], [3, 4], [4, 2], [1, 3], [4, 1], [2, 3]];
const modelNames = ["EloPulse", "FormNet", "TacticalLens", "OracleSynth"];

function teamByGroupPos(group, pos) {
  return Object.entries(teams).find(([, team]) => team.group === group && team.pos === pos)?.[0];
}

function hashText(text) {
  return [...text].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 9973, 17);
}

function logistic(x) {
  return 1 / (1 + Math.exp(-x / 11));
}

function modelVote(model, aCode, bCode, round) {
  const a = teams[aCode];
  const b = teams[bCode];
  const homeBoost = ["MEX", "CAN", "USA"].includes(aCode) ? 1.8 : ["MEX", "CAN", "USA"].includes(bCode) ? -1.8 : 0;
  const knockoutBoost = round === "Group Stage" ? 0 : 1.25;
  let diff = a.power - b.power + homeBoost;
  let reason = "内置 power 评分 + 东道主地区加成";

  if (model === "FormNet") {
    diff = (a.attack - b.defense) * 0.65 + (a.form - b.form) * 1.9 + (a.power - b.power) * 0.55;
    reason = "内置 attack/defense/form 评分组合";
  }
  if (model === "TacticalLens") {
    diff = (a.defense - b.defense) * 0.8 + (a.power - b.power) * 0.62 + knockoutBoost * (a.confed === "UEFA" || a.confed === "CONMEBOL" ? 1 : 0) - knockoutBoost * (b.confed === "UEFA" || b.confed === "CONMEBOL" ? 1 : 0);
    reason = "内置 defense/power 评分 + 淘汰赛稳定性权重";
  }
  if (model === "OracleSynth") {
    const noise = ((hashText(`${aCode}-${bCode}-${round}`) % 15) - 7) * 0.65;
    diff = (a.power - b.power) * 0.72 + (a.form - b.form) + noise;
    reason = "内置强度评分 + 固定冷门扰动";
  }

  const confidence = Math.round((logistic(Math.abs(diff)) * 52 + 38));
  return {
    model,
    pick: diff >= 0 ? aCode : bCode,
    confidence: Math.min(92, Math.max(51, confidence)),
    reason
  };
}

function predict(aCode, bCode, round) {
  const votes = modelNames.map((model) => modelVote(model, aCode, bCode, round));
  const tallies = votes.reduce((acc, vote) => {
    acc[vote.pick] = (acc[vote.pick] || 0) + vote.confidence;
    return acc;
  }, {});
  const rawDiff = (tallies[aCode] || 0) - (tallies[bCode] || 0);
  const a = teams[aCode];
  const b = teams[bCode];
  const allowDraw = round === "Group Stage";
  const drawZone = allowDraw && Math.abs(rawDiff) < 28;
  const winner = drawZone ? "DRAW" : rawDiff >= 0 ? aCode : bCode;
  const confidence = drawZone ? 52 : Math.min(94, Math.round(58 + Math.abs(rawDiff) / 8));
  const goalBase = round === "Group Stage" ? 1 : 1.2;
  let aGoals = Math.max(0, Math.round(goalBase + (a.attack - b.defense) / 18 + ((hashText(aCode + bCode + round) % 3) - 1) * 0.35));
  let bGoals = Math.max(0, Math.round(goalBase + (b.attack - a.defense) / 18 + ((hashText(bCode + aCode + round) % 3) - 1) * 0.35));

  if (winner === "DRAW") {
    const drawGoals = Math.max(0, Math.min(2, Math.round((aGoals + bGoals) / 2)));
    aGoals = drawGoals;
    bGoals = drawGoals;
  } else if (winner === aCode && aGoals <= bGoals) {
    aGoals = bGoals + 1;
  } else if (winner === bCode && bGoals <= aGoals) {
    bGoals = aGoals + 1;
  }

  return {
    aCode,
    bCode,
    winner,
    score: `${aGoals}-${bGoals}`,
    aGoals,
    bGoals,
    confidence,
    votes
  };
}

function buildGroupMatches() {
  const matches = [];
  let id = 1;
  groupOrder.forEach((group) => {
    pairPattern.forEach(([left, right], idx) => {
      const aCode = teamByGroupPos(group, left);
      const bCode = teamByGroupPos(group, right);
      matches.push({
        id: id++,
        round: "Group Stage",
        group,
        date: `${groupDates[group][idx]}, 2026`,
        venue: cityRoute[group],
        aCode,
        bCode,
        slot: `Group ${group}`
      });
    });
  });
  return matches;
}

function rankSlot(group, rank) {
  const rankName = rank === 1 ? "winner" : rank === 2 ? "runner-up" : "third place";
  return { type: "groupRank", group, rank, label: `Group ${group} ${rankName}` };
}

function bestThirdSlot(groups) {
  return { type: "bestThird", groups, label: `Best 3rd place (${groups.join("/")})` };
}

function winnerSlot(matchId) {
  return { type: "winner", matchId, label: `Winner Match ${matchId}` };
}

function loserSlot(matchId) {
  return { type: "loser", matchId, label: `Loser Match ${matchId}` };
}

function knockoutMatch(id, round, date, venue, leftSlot, rightSlot) {
  return { id, round, date, venue, aSlot: leftSlot, bSlot: rightSlot, slot: round };
}

function buildKnockoutMatches() {
  return [
    knockoutMatch(73, "Round of 32", "Jun 28, 2026", "Los Angeles / Inglewood", rankSlot("A", 2), rankSlot("B", 2)),
    knockoutMatch(74, "Round of 32", "Jun 29, 2026", "Boston / Foxborough", rankSlot("E", 1), bestThirdSlot(["A", "B", "C", "D", "F"])),
    knockoutMatch(75, "Round of 32", "Jun 29, 2026", "Monterrey / Guadalupe", rankSlot("F", 1), rankSlot("C", 2)),
    knockoutMatch(76, "Round of 32", "Jun 29, 2026", "Houston", rankSlot("C", 1), rankSlot("F", 2)),
    knockoutMatch(77, "Round of 32", "Jun 30, 2026", "New York-New Jersey", rankSlot("I", 1), bestThirdSlot(["C", "D", "F", "G", "H"])),
    knockoutMatch(78, "Round of 32", "Jun 30, 2026", "Dallas / Arlington", rankSlot("E", 2), rankSlot("I", 2)),
    knockoutMatch(79, "Round of 32", "Jun 30, 2026", "Mexico City", rankSlot("A", 1), bestThirdSlot(["C", "E", "F", "H", "I"])),
    knockoutMatch(80, "Round of 32", "Jul 1, 2026", "Atlanta", rankSlot("L", 1), bestThirdSlot(["E", "H", "I", "J", "K"])),
    knockoutMatch(81, "Round of 32", "Jul 1, 2026", "San Francisco Bay Area", rankSlot("D", 1), bestThirdSlot(["B", "E", "F", "I", "J"])),
    knockoutMatch(82, "Round of 32", "Jul 1, 2026", "Seattle", rankSlot("G", 1), bestThirdSlot(["A", "E", "H", "I", "J"])),
    knockoutMatch(83, "Round of 32", "Jul 2, 2026", "Toronto", rankSlot("K", 2), rankSlot("L", 2)),
    knockoutMatch(84, "Round of 32", "Jul 2, 2026", "Los Angeles / Inglewood", rankSlot("H", 1), rankSlot("J", 2)),
    knockoutMatch(85, "Round of 32", "Jul 2, 2026", "Vancouver", rankSlot("B", 1), bestThirdSlot(["E", "F", "G", "I", "J"])),
    knockoutMatch(86, "Round of 32", "Jul 3, 2026", "Miami", rankSlot("J", 1), rankSlot("H", 2)),
    knockoutMatch(87, "Round of 32", "Jul 3, 2026", "Kansas City", rankSlot("K", 1), bestThirdSlot(["D", "E", "I", "J", "L"])),
    knockoutMatch(88, "Round of 32", "Jul 3, 2026", "Dallas / Arlington", rankSlot("D", 2), rankSlot("G", 2)),
    knockoutMatch(89, "Round of 16", "Jul 4, 2026", "Philadelphia", winnerSlot(74), winnerSlot(77)),
    knockoutMatch(90, "Round of 16", "Jul 4, 2026", "Houston", winnerSlot(73), winnerSlot(75)),
    knockoutMatch(91, "Round of 16", "Jul 5, 2026", "New York-New Jersey", winnerSlot(76), winnerSlot(78)),
    knockoutMatch(92, "Round of 16", "Jul 5, 2026", "Mexico City", winnerSlot(79), winnerSlot(80)),
    knockoutMatch(93, "Round of 16", "Jul 6, 2026", "Dallas / Arlington", winnerSlot(83), winnerSlot(84)),
    knockoutMatch(94, "Round of 16", "Jul 6, 2026", "Seattle", winnerSlot(81), winnerSlot(82)),
    knockoutMatch(95, "Round of 16", "Jul 7, 2026", "Atlanta", winnerSlot(86), winnerSlot(88)),
    knockoutMatch(96, "Round of 16", "Jul 7, 2026", "Vancouver", winnerSlot(85), winnerSlot(87)),
    knockoutMatch(97, "Quarterfinal", "Jul 9, 2026", "Boston / Foxborough", winnerSlot(89), winnerSlot(90)),
    knockoutMatch(98, "Quarterfinal", "Jul 10, 2026", "Los Angeles / Inglewood", winnerSlot(93), winnerSlot(94)),
    knockoutMatch(99, "Quarterfinal", "Jul 11, 2026", "Miami", winnerSlot(91), winnerSlot(92)),
    knockoutMatch(100, "Quarterfinal", "Jul 11, 2026", "Kansas City", winnerSlot(95), winnerSlot(96)),
    knockoutMatch(101, "Semifinal", "Jul 14, 2026", "Dallas / Arlington", winnerSlot(97), winnerSlot(98)),
    knockoutMatch(102, "Semifinal", "Jul 15, 2026", "Atlanta", winnerSlot(99), winnerSlot(100)),
    knockoutMatch(103, "Third Place", "Jul 18, 2026", "Miami", loserSlot(101), loserSlot(102)),
    knockoutMatch(104, "Final", "Jul 19, 2026", "New York-New Jersey", winnerSlot(101), winnerSlot(102))
  ];
}

function standingsFrom(matches) {
  const table = {};
  Object.keys(teams).forEach((code) => {
    table[code] = { code, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  matches.forEach((match) => {
    const pred = match.prediction;
    const a = table[match.aCode];
    const b = table[match.bCode];
    a.p += 1;
    b.p += 1;
    a.gf += pred.aGoals;
    a.ga += pred.bGoals;
    b.gf += pred.bGoals;
    b.ga += pred.aGoals;
    if (pred.winner === "DRAW") {
      a.d += 1;
      b.d += 1;
      a.pts += 1;
      b.pts += 1;
    } else if (pred.winner === match.aCode) {
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

  const byGroup = {};
  groupOrder.forEach((group) => {
    byGroup[group] = Object.values(table)
      .filter((row) => teams[row.code].group === group)
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || teams[b.code].power - teams[a.code].power);
  });
  return byGroup;
}

function completedGroupMatches(group) {
  return tournament.matches.filter((match) => match.round === "Group Stage" && match.group === group && officialResult(match)?.status === "final");
}

function actualStandingsFromResults() {
  const table = {};
  Object.keys(teams).forEach((code) => {
    table[code] = { code, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  tournament.matches
    .filter((match) => match.round === "Group Stage")
    .forEach((match) => {
      const result = officialResult(match);
      if (result?.status !== "final") return;
      const a = table[match.aCode];
      const b = table[match.bCode];
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

  const byGroup = {};
  groupOrder.forEach((group) => {
    byGroup[group] = Object.values(table)
      .filter((row) => teams[row.code].group === group)
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || teams[b.code].power - teams[a.code].power);
  });
  return byGroup;
}

function groupIsComplete(group) {
  return completedGroupMatches(group).length === 6;
}

function allGroupsComplete() {
  return groupOrder.every((group) => groupIsComplete(group));
}

function bestThirdTeams(standings) {
  if (!allGroupsComplete()) return [];
  return groupOrder
    .map((group) => standings[group]?.[2])
    .filter(Boolean)
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || teams[b.code].power - teams[a.code].power)
    .slice(0, 8);
}

function thirdPlaceAssignments(standings) {
  const pool = bestThirdTeams(standings);
  const used = new Set();
  const assignments = {};
  tournament.matches
    .filter((match) => match.round === "Round of 32")
    .forEach((match) => {
      [match.aSlot, match.bSlot].filter((slot) => slot?.type === "bestThird").forEach((slot) => {
        const key = slot.label;
        if (assignments[key]) return;
        const chosen = pool.find((row) => slot.groups.includes(teams[row.code].group) && !used.has(row.code)) || pool.find((row) => !used.has(row.code));
        if (chosen) {
          assignments[key] = chosen.code;
          used.add(chosen.code);
        }
      });
    });
  return assignments;
}

function knockoutWinnerCode(match, wantLoser = false) {
  const result = officialResult(match);
  if (result?.status !== "final") return null;
  if (Number(result.homeScore) === Number(result.awayScore)) {
    return wantLoser ? result.loserCode || null : result.winnerCode || null;
  }
  const winner = Number(result.homeScore) > Number(result.awayScore) ? resolvedTeamCode(match, "a") : resolvedTeamCode(match, "b");
  const loser = Number(result.homeScore) > Number(result.awayScore) ? resolvedTeamCode(match, "b") : resolvedTeamCode(match, "a");
  return wantLoser ? loser : winner;
}

function resolveSlot(slot) {
  if (!slot) return null;
  const standings = actualStandingsFromResults();
  if (slot.type === "groupRank") {
    if (!groupIsComplete(slot.group)) return null;
    return standings[slot.group]?.[slot.rank - 1]?.code || null;
  }
  if (slot.type === "bestThird") {
    return thirdPlaceAssignments(standings)[slot.label] || null;
  }
  if (slot.type === "winner" || slot.type === "loser") {
    const source = tournament.matches.find((match) => match.id === slot.matchId);
    return source ? knockoutWinnerCode(source, slot.type === "loser") : null;
  }
  return null;
}

function resolvedTeamCode(match, side) {
  if (side === "a") return match.aCode || resolveSlot(match.aSlot);
  return match.bCode || resolveSlot(match.bSlot);
}

function resolvedTeams(match) {
  return {
    aCode: resolvedTeamCode(match, "a"),
    bCode: resolvedTeamCode(match, "b")
  };
}

function slotLabel(match, side) {
  return side === "a" ? match.aSlot?.label || teams[match.aCode]?.name || "TBD" : match.bSlot?.label || teams[match.bCode]?.name || "TBD";
}

function buildTournament() {
  const groupMatches = buildGroupMatches().map((match) => ({
    ...match,
    prediction: predict(match.aCode, match.bCode, "Group Stage")
  }));
  const knockoutMatches = buildKnockoutMatches();
  const standings = standingsFrom(groupMatches);

  return { matches: [...groupMatches, ...knockoutMatches], standings, bestThird: [] };
}

const tournament = buildTournament();
let activeMatchId = 1;
let automationState = {
  predictions: {},
  results: {},
  accuracy: { accuracy: 0, completed: 0, graded: 0, correct: 0 }
};
const storedPredictionKey = "paul.manualPredictions.v2";

function loadStoredPredictions() {
  try {
    return JSON.parse(localStorage.getItem(storedPredictionKey) || "{}");
  } catch {
    return {};
  }
}

function saveStoredPrediction(matchId, record) {
  try {
    const predictions = loadStoredPredictions();
    predictions[matchId] = record;
    localStorage.setItem(storedPredictionKey, JSON.stringify(predictions));
  } catch {
    // Local storage is optional; the current page state still updates.
  }
}

function nextPredictionFromMatches(predictions, leadHours = 24, now = new Date()) {
  return tournament.matches
    .map((match) => {
      if (predictions[match.id]) return null;
      if (officialResult(match)?.status === "final") return null;
      const resolved = resolvedTeams(match);
      if (!resolved.aCode || !resolved.bCode) return null;
      const matchTime = new Date(`${match.date} 20:00:00 GMT+0000`);
      if (Number.isNaN(matchTime.getTime())) return null;
      return {
        id: match.id,
        label: `${teams[resolved.aCode].name} vs ${teams[resolved.bCode].name}`,
        dueAt: new Date(matchTime.getTime() - leadHours * 60 * 60 * 1000).toISOString()
      };
    })
    .filter(Boolean)
    .filter((item) => new Date(item.dueAt) >= now)
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))[0] || null;
}

function matchKickoffTime(match) {
  return new Date(`${match.date} 20:00:00 GMT+0000`);
}

function compactDuration(ms) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function matchCountdown(match, now = new Date()) {
  const kickoff = matchKickoffTime(match);
  if (Number.isNaN(kickoff.getTime())) return "Kickoff time TBA";
  const diff = kickoff.getTime() - now.getTime();
  if (diff > 0) return `Starts in ${compactDuration(diff)}`;
  if (diff > -130 * 60000) return "Live now";
  return "Full time window passed";
}

const flagIds = {
  MEX: "mx",
  RSA: "za",
  KOR: "kr",
  CZE: "cz",
  CAN: "ca",
  BIH: "ba",
  QAT: "qa",
  SUI: "ch",
  BRA: "br",
  MAR: "ma",
  HAI: "ht",
  SCO: "gb-sct",
  USA: "us",
  PAR: "py",
  AUS: "au",
  TUR: "tr",
  GER: "de",
  CUW: "cw",
  CIV: "ci",
  ECU: "ec",
  NED: "nl",
  JPN: "jp",
  SWE: "se",
  TUN: "tn",
  BEL: "be",
  EGY: "eg",
  IRN: "ir",
  NZL: "nz",
  ESP: "es",
  CPV: "cv",
  KSA: "sa",
  URU: "uy",
  FRA: "fr",
  SEN: "sn",
  IRQ: "iq",
  NOR: "no",
  ARG: "ar",
  ALG: "dz",
  AUT: "at",
  JOR: "jo",
  POR: "pt",
  COD: "cd",
  UZB: "uz",
  COL: "co",
  ENG: "gb-eng",
  CRO: "hr",
  GHA: "gh",
  PAN: "pa"
};

const teamLocales = {
  MEX: { language: "Español", phrase: "Predicción de PAUL para México" },
  RSA: { language: "isiZulu / English / Afrikaans", phrase: "Isibikezelo sika PAUL seNingizimu Afrika" },
  KOR: { language: "한국어", phrase: "대한민국을 위한 PAUL 예측" },
  CZE: { language: "Čeština", phrase: "PAULova předpověď pro Česko" },
  CAN: { language: "English / Français", phrase: "PAUL prediction for Canada / Prédiction de PAUL pour le Canada" },
  BIH: { language: "Bosanski / Hrvatski / Srpski", phrase: "PAUL predviđa za Bosnu i Hercegovinu" },
  QAT: { language: "العربية", phrase: "توقع PAUL لقطر" },
  SUI: { language: "Deutsch / Français / Italiano / Rumantsch", phrase: "PAUL-Prognose für die Schweiz" },
  BRA: { language: "Português", phrase: "Previsão de PAUL para o Brasil" },
  MAR: { language: "العربية / ⵜⴰⵎⴰⵣⵉⵖⵜ", phrase: "توقع PAUL للمغرب" },
  HAI: { language: "Kreyòl ayisyen / Français", phrase: "Prediksyon PAUL pou Ayiti" },
  SCO: { language: "English / Scots / Gàidhlig", phrase: "PAUL prediction for Scotland" },
  USA: { language: "English", phrase: "PAUL prediction for the United States" },
  PAR: { language: "Español / Guaraní", phrase: "Predicción de PAUL para Paraguay" },
  AUS: { language: "English", phrase: "PAUL prediction for Australia" },
  TUR: { language: "Türkçe", phrase: "PAUL'un Türkiye tahmini" },
  GER: { language: "Deutsch", phrase: "PAUL-Prognose für Deutschland" },
  CUW: { language: "Papiamentu / Nederlands / English", phrase: "Pronostiko di PAUL pa Kòrsou" },
  CIV: { language: "Français", phrase: "Pronostic de PAUL pour la Côte d'Ivoire" },
  ECU: { language: "Español / Kichwa / Shuar", phrase: "Predicción de PAUL para Ecuador" },
  NED: { language: "Nederlands", phrase: "PAULs voorspelling voor Nederland" },
  JPN: { language: "日本語", phrase: "日本のためのPAUL予測" },
  SWE: { language: "Svenska", phrase: "PAULs prognos för Sverige" },
  TUN: { language: "العربية", phrase: "توقع PAUL لتونس" },
  BEL: { language: "Nederlands / Français / Deutsch", phrase: "PAULs voorspelling voor België" },
  EGY: { language: "العربية", phrase: "توقع PAUL لمصر" },
  IRN: { language: "فارسی", phrase: "پیش‌بینی PAUL برای ایران" },
  NZL: { language: "English / Māori", phrase: "PAUL prediction for Aotearoa New Zealand" },
  ESP: { language: "Español", phrase: "Predicción de PAUL para España" },
  CPV: { language: "Português / Kriolu", phrase: "Previsão de PAUL para Cabo Verde" },
  KSA: { language: "العربية", phrase: "توقع PAUL للسعودية" },
  URU: { language: "Español", phrase: "Predicción de PAUL para Uruguay" },
  FRA: { language: "Français", phrase: "Pronostic de PAUL pour la France" },
  SEN: { language: "Français / Wolof", phrase: "Pronostic de PAUL pour le Sénégal" },
  IRQ: { language: "العربية / کوردی", phrase: "توقع PAUL للعراق" },
  NOR: { language: "Norsk", phrase: "PAULs spådom for Norge" },
  ARG: { language: "Español", phrase: "Predicción de PAUL para Argentina" },
  ALG: { language: "العربية / Tamazight", phrase: "توقع PAUL للجزائر" },
  AUT: { language: "Deutsch", phrase: "PAUL-Prognose für Österreich" },
  JOR: { language: "العربية", phrase: "توقع PAUL للأردن" },
  POR: { language: "Português", phrase: "Previsão de PAUL para Portugal" },
  COD: { language: "Français / Lingála / Kiswahili", phrase: "Pronostic de PAUL pour la RD Congo" },
  UZB: { language: "O‘zbekcha", phrase: "PAULning O‘zbekiston uchun bashorati" },
  COL: { language: "Español", phrase: "Predicción de PAUL para Colombia" },
  ENG: { language: "English", phrase: "PAUL prediction for England" },
  CRO: { language: "Hrvatski", phrase: "PAULova prognoza za Hrvatsku" },
  GHA: { language: "English / Akan / Ewe / Ga", phrase: "PAUL prediction for Ghana" },
  PAN: { language: "Español", phrase: "Predicción de PAUL para Panamá" }
};

function flagImage(code, className = "flag-frame") {
  const team = teams[code];
  const flagId = flagIds[code];
  const alt = `${team.name} flag`;
  if (!flagId) return `<span class="${className} flag-frame--emoji" aria-label="${alt}">${team.flag}</span>`;
  return `
    <span class="${className}" aria-label="${alt}">
      <img src="https://flagcdn.com/w160/${flagId}.png" srcset="https://flagcdn.com/w320/${flagId}.png 2x" alt="${alt}" loading="lazy" />
    </span>
  `;
}

function teamLocaleMarkup(code) {
  const locale = teamLocales[code];
  if (!locale) return "";
  return `
    <p class="local-language">
      <strong>Local language:</strong>
      <span>${locale.language}</span>
      <em>${locale.phrase}</em>
    </p>
  `;
}

function teamMarkup(code) {
  const team = teams[code];
  return `
    <div class="team-card-heading">
      ${flagImage(code)}
      <div>
        <div class="team-name">${team.name}</div>
        <div class="team-code">${code} · Group ${team.group}</div>
      </div>
    </div>
    <p class="language"><strong>Primary languages:</strong><br>${team.languages}</p>
  `;
}

function slotMarkup(label) {
  return `
    <div class="team-card-heading">
      <span class="flag-frame flag-frame--slot">TBD</span>
      <div>
        <div class="team-name">${label}</div>
        <div class="team-code">Awaiting official result</div>
      </div>
    </div>
    <p class="language"><strong>Bracket status:</strong><br>This slot will be filled automatically after earlier results are synced.</p>
  `;
}

function officialPrediction(match) {
  return automationState.predictions?.[match.id] || null;
}

function officialResult(match) {
  return automationState.results?.[match.id] || null;
}

function resultWinner(result) {
  if (!result) return null;
  if (result.winnerCode) return result.winnerCode;
  if (Number(result.homeScore) === Number(result.awayScore)) return "DRAW";
  return Number(result.homeScore) > Number(result.awayScore) ? result.aCode : result.bCode;
}

function officialPickCode(record) {
  if (!record?.analysis) return null;
  return record.analysis.winnerCode || record.analysis.winner || null;
}

function predictionStatus(match) {
  const record = officialPrediction(match);
  const result = officialResult(match);
  if (result?.status === "final" && record) {
    return String(officialPickCode(record)).toUpperCase() === String(resultWinner(result)).toUpperCase() ? "Correct" : "Missed";
  }
  if (result?.status === "final") return "Final";
  if (record) return "Locked";
  return "Pending";
}

function resultLabel(match) {
  const result = officialResult(match);
  if (result?.status === "final") {
    const winner = result.winnerCode || resultWinner(result);
    const winnerName = winner === "DRAW" ? "Draw" : teams[winner]?.name || "Final";
    return `${winnerName} ${result.homeScore}-${result.awayScore}`;
  }
  const record = officialPrediction(match);
  if (!record) return "Pending";
  const pick = officialPickCode(record);
  if (!pick || pick === "DRAW") return "Draw";
  return teams[pick]?.name || record.analysis.winnerName || "Locked";
}

function updateChampionLabel() {
  document.getElementById("championName").textContent = "Awaiting groups";
}

function renderMatchList() {
  const round = document.getElementById("roundFilter").value;
  const group = document.getElementById("groupFilter").value;
  const query = document.getElementById("searchBox").value.trim().toLowerCase();
  const list = document.getElementById("matchList");

  const filtered = tournament.matches.filter((match) => {
    const resolved = resolvedTeams(match);
    const aLabel = resolved.aCode ? teams[resolved.aCode].name : slotLabel(match, "a");
    const bLabel = resolved.bCode ? teams[resolved.bCode].name : slotLabel(match, "b");
    const haystack = `${match.id} ${match.round} ${match.group || ""} ${aLabel} ${bLabel} ${match.venue}`.toLowerCase();
    return (round === "All" || match.round === round) && (group === "All" || match.group === group) && (!query || haystack.includes(query));
  });

  list.innerHTML = filtered
    .map((match) => {
      const resolved = resolvedTeams(match);
      const aLabel = resolved.aCode ? teams[resolved.aCode].name : slotLabel(match, "a");
      const bLabel = resolved.bCode ? teams[resolved.bCode].name : slotLabel(match, "b");
      const flags = resolved.aCode && resolved.bCode
        ? `${flagImage(resolved.aCode, "flag-frame match-flag")} ${flagImage(resolved.bCode, "flag-frame match-flag")}`
        : `<span class="slot-badge">TBD</span>`;
      return `
        <button class="match-card ${match.id === activeMatchId ? "is-active" : ""}" data-id="${match.id}">
          <span class="match-no">#${match.id}</span>
        <span>
          <span class="match-title">
            <span class="match-flags">${flags}</span>
            <span>${aLabel} vs ${bLabel}</span>
          </span>
          <span class="match-sub">${roundLabels[match.round] || match.round} · ${match.date} · ${match.venue}</span>
          <span class="match-countdown">${matchCountdown(match)}</span>
        </span>
        <span class="winner-pill">${predictionStatus(match)} · ${resultLabel(match)}</span>
      </button>
    `;
    })
    .join("");

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-list">
        Knockout fixtures will appear only after real group-stage results and the official bracket are available.
      </div>
    `;
  }

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeMatchId = Number(button.dataset.id);
      renderMatchList();
      renderPK();
    });
  });
}

function renderPK() {
  const match = tournament.matches.find((item) => item.id === activeMatchId);
  const resolved = resolvedTeams(match);
  const official = officialPrediction(match);
  const officialPick = officialPickCode(official);
  const finalResult = officialResult(match);
  const leftWon = officialPick === resolved.aCode;
  const rightWon = officialPick === resolved.bCode;
  const lane = document.getElementById("octopusLane");
  const crawler = document.getElementById("crawler");
  const crawlX = leftWon ? "-34%" : rightWon ? "34%" : "0%";
  const crawlerAsset = "assets/real-paul-side-cutout.png";

  document.getElementById("pkMeta").textContent = `Match ${match.id} · ${roundLabels[match.round] || match.round} · ${match.date} · ${match.venue}`;
  document.getElementById("pkConfidence").textContent = official
    ? `Official confidence ${official.analysis?.confidence || "N/A"}% · ${matchCountdown(match)}`
    : `${resolved.aCode && resolved.bCode ? "Official prediction pending" : "Bracket slot pending"} · ${matchCountdown(match)}`;
  document.getElementById("leftTeam").innerHTML = resolved.aCode ? teamMarkup(resolved.aCode) + teamLocaleMarkup(resolved.aCode) : slotMarkup(slotLabel(match, "a"));
  document.getElementById("rightTeam").innerHTML = resolved.bCode ? teamMarkup(resolved.bCode) + teamLocaleMarkup(resolved.bCode) : slotMarkup(slotLabel(match, "b"));
  lane.style.setProperty("--crawl-x", crawlX);
  lane.dataset.direction = leftWon ? "left" : rightWon ? "right" : "center";
  if (!crawler.getAttribute("src")?.includes(crawlerAsset)) {
    crawler.setAttribute("src", crawlerAsset);
  }
  crawler.style.animation = "none";
  crawler.offsetHeight;
  crawler.style.animation = "";

  if (official) {
    const pickName = officialPick === "DRAW" ? "Draw" : teams[officialPick]?.name || official.analysis?.winnerName || "N/A";
    const verdict = officialPick === "DRAW" ? "PAUL officially predicts a draw" : `PAUL officially crawls toward ${pickName}`;
    const resultCopy = finalResult?.status === "final"
      ? `Final score: ${teams[resolved.aCode]?.name || slotLabel(match, "a")} ${finalResult.homeScore}-${finalResult.awayScore} ${teams[resolved.bCode]?.name || slotLabel(match, "b")}. Status: ${predictionStatus(match)}.`
      : "Final score has not synced yet. Accuracy will update after full time.";
    document.getElementById("predictionCopy").innerHTML = `
      <p><strong>${verdict}</strong> · Predicted score: <strong>${official.analysis?.predictedScore || official.analysis?.score || "N/A"}</strong>.</p>
      <p>${official.analysis?.reasoning || "PAUL has locked this pick without a detailed explanation."}</p>
      <p>${resultCopy}</p>
    `;
  } else {
    document.getElementById("predictionCopy").innerHTML = `
      <p><strong>${resolved.aCode && resolved.bCode ? "Official PAUL prediction is not locked yet." : "This bracket slot is not resolved yet."}</strong></p>
      <p class="countdown-detail">Kickoff countdown: <strong>${matchCountdown(match)}</strong></p>
    `;
  }

  document.getElementById("modelGrid").innerHTML = official
    ? `
      <article class="model-card">
        <h3>Official PAUL Pick</h3>
        <div class="vote">${official.analysis?.winnerName || resultLabel(match)} · ${official.analysis?.confidence || "N/A"}%</div>
        <p>${official.analysis?.reasoning || "PAUL has returned an official prediction."}</p>
      </article>
      <article class="model-card">
        <h3>Predicted Score</h3>
        <div class="vote">${official.analysis?.predictedScore || official.analysis?.score || "N/A"}</div>
        <p>Generated at ${new Date(official.generatedAt).toLocaleString()}</p>
      </article>
      <article class="model-card">
        <h3>Upset Risk</h3>
        <div class="vote">${official.analysis?.upsetRisk || "N/A"}</div>
        <p>Final scores will verify this pick after the match.</p>
      </article>
    `
    : `
      <article class="model-card model-card--wide">
        <h3>Awaiting Official PAUL Prediction</h3>
        <div class="vote">${resolved.aCode && resolved.bCode ? "Not locked" : "Waiting for bracket results"}</div>
        <p>${resolved.aCode && resolved.bCode ? "No simulated reference is shown before the official lock." : "This match will become predictable after the earlier winners are known."}</p>
      </article>
    `;

  const qwenResult = document.getElementById("qwenResult");
  if (qwenResult) {
    qwenResult.className = "qwen-result";
    qwenResult.textContent = "";
  }
}

function qwenPayload(match) {
  const resolved = resolvedTeams(match);
  if (!resolved.aCode || !resolved.bCode) return null;
  const prediction = match.prediction || predict(resolved.aCode, resolved.bCode, match.round);
  const makeTeam = (code) => ({
    code,
    name: teams[code].name,
    group: teams[code].group,
    languages: teams[code].languages,
    power: teams[code].power,
    attack: teams[code].attack,
    defense: teams[code].defense,
    form: teams[code].form,
    confed: teams[code].confed
  });

  return {
    id: match.id,
    round: match.round,
    group: match.group,
    date: match.date,
    venue: match.venue,
    slot: match.slot,
    teamA: makeTeam(resolved.aCode),
    teamB: makeTeam(resolved.bCode),
    localPrediction: {
      winnerCode: prediction.winner,
      winnerName: prediction.winner === "DRAW" ? "Draw" : teams[prediction.winner].name,
      score: prediction.score,
      confidence: prediction.confidence,
      votes: prediction.votes.map((vote) => ({
        model: vote.model,
        pickCode: vote.pick,
        pickName: teams[vote.pick].name,
        confidence: vote.confidence,
        reason: vote.reason
      }))
    }
  };
}

async function askQwen() {
  const match = tournament.matches.find((item) => item.id === activeMatchId);
  const button = document.getElementById("qwenButton");
  const result = document.getElementById("qwenResult");
  if (!match || !button || !result) return;
  const payload = qwenPayload(match);
  if (!payload) {
    result.className = "qwen-result is-error";
    result.textContent = "This bracket slot is not resolved yet.";
    return;
  }

  button.disabled = true;
  result.className = "qwen-result is-loading";
  result.textContent = "PAUL is reading this matchup...";

  try {
    const response = await fetch("/api/qwen-predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "PAUL request failed.");
    }

    const analysis = data.analysis || {};
    const winnerName = analysis.winnerName || analysis.winner || "No decision yet";
    const confidence = analysis.confidence ? `${analysis.confidence}%` : "N/A";
    const score = analysis.predictedScore || analysis.score || "N/A";
    const upsetRisk = analysis.upsetRisk || "Normal";
    const reasoning = analysis.reasoning || "PAUL did not return analysis text.";

    result.className = "qwen-result";
    result.innerHTML = `
      <p><strong>PAUL pick:</strong> ${winnerName} · confidence ${confidence} · score ${score}</p>
      <p><strong>Upset risk:</strong> ${upsetRisk}</p>
      <p>${reasoning}</p>
    `;

    const record = {
      matchId: match.id,
      generatedAt: data.generatedAt || new Date().toISOString(),
      model: "PAUL",
      analysis
    };
    automationState.predictions[match.id] = record;
    saveStoredPrediction(match.id, record);
    renderMatchList();
    renderPK();
  } catch (error) {
    result.className = "qwen-result is-error";
    result.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

async function syncAutomationSnapshot() {
  const matches = tournament.matches.map((match) => qwenPayload(match) || {
    id: match.id,
    round: match.round,
    group: match.group,
    date: match.date,
    venue: match.venue,
    slot: match.slot,
    aSlot: match.aSlot,
    bSlot: match.bSlot
  });
  try {
    await fetch("/api/automation/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matches })
    });
  } catch {
    // The static-only mode still works without the local automation server.
  }
}

function formatNextPrediction(nextPrediction) {
  if (!nextPrediction) return "None";
  if (!nextPrediction.dueAt) return `${nextPrediction.label} · Time pending`;
  const dueAt = new Date(nextPrediction.dueAt);
  if (Number.isNaN(dueAt.getTime())) return `${nextPrediction.label} · Time pending`;
  return `${nextPrediction.label} · ${dueAt.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
}

async function loadAutomationStatus() {
  const statusText = document.getElementById("automationStatus");
  try {
    const response = await fetch("/api/automation/status");
    const status = await response.json();
    if (!response.ok) throw new Error(status.error || "Failed to load automation status.");

    const mergedPredictions = status.predictions || {};
    const nextPrediction = nextPredictionFromMatches(mergedPredictions, status.predictionLeadHours || 24) || status.nextPrediction;

    document.getElementById("autoPredicted").textContent = Object.keys(mergedPredictions).length;
    document.getElementById("autoResults").textContent = status.resultCount || 0;
    document.getElementById("autoAccuracy").textContent = `${status.accuracy?.accuracy || 0}%`;
    document.getElementById("autoNext").textContent = formatNextPrediction(nextPrediction);
    automationState = {
      predictions: mergedPredictions,
      results: status.results || {},
      accuracy: status.accuracy || automationState.accuracy
    };
    updateChampionLabel();
    renderMatchList();
    renderPK();

    const qwenState = status.hasQwenKey ? "PAUL AI ready" : "PAUL AI not connected";
    const resultState = status.hasResultsApi ? "Results API ready" : "Results API not connected";
    const readiness = status.dataReadiness || {};
    const oddsState = readiness.marketOdds ? "market odds loaded" : "market odds missing";
    const ratingState = readiness.teamRatings ? "team ratings loaded" : "team ratings missing";
    statusText.textContent = `${qwenState}; ${oddsState}; ${ratingState}; ${resultState}; ${status.totalMatches || 0} fixtures loaded.`;
  } catch (error) {
    statusText.textContent = error.message;
  }
}

function shortHash(hash) {
  return hash ? `${hash.slice(0, 14)}...${hash.slice(-10)}` : "N/A";
}

function formatProofTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function renderProofs(entries) {
  const grid = document.getElementById("proofGrid");
  if (!grid) return;
  if (!entries.length) {
    grid.innerHTML = `
      <article class="proof-card">
        <h3>No locked proofs yet</h3>
        <p>Proof records will appear here as soon as PAUL locks an official prediction.</p>
      </article>
    `;
    return;
  }

  grid.innerHTML = entries
    .map((entry) => {
      const external = entry.externalProof?.commitUrl
        ? `<a href="${entry.externalProof.commitUrl}" target="_blank" rel="noreferrer">GitHub commit</a>`
        : entry.externalProof?.error
          ? `<span>GitHub proof pending</span>`
          : `<span>KV proof only</span>`;
      return `
        <article class="proof-card">
          <div class="proof-card__top">
            <span class="winner-pill">${entry.verified ? "Hash verified" : "Hash mismatch"}</span>
            <span class="winner-pill ${entry.isBeforeKickoff ? "" : "winner-pill--warn"}">${entry.isBeforeKickoff ? "Before kickoff" : "Check time"}</span>
          </div>
          <h3>#${entry.matchId} ${entry.match}</h3>
          <dl>
            <div><dt>Locked</dt><dd>${formatProofTime(entry.lockedAt)}</dd></div>
            <div><dt>Kickoff</dt><dd>${formatProofTime(entry.kickoffAt)}</dd></div>
            <div><dt>SHA-256</dt><dd><code>${shortHash(entry.hash)}</code></dd></div>
            <div><dt>External proof</dt><dd>${external}</dd></div>
          </dl>
        </article>
      `;
    })
    .join("");
}

async function loadAuditProofs() {
  try {
    const response = await fetch("/api/audit");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load proof records.");
    renderProofs(data.entries || []);
  } catch (error) {
    renderProofs([]);
    const grid = document.getElementById("proofGrid");
    if (grid) {
      grid.innerHTML = `
        <article class="proof-card">
          <h3>Proof service unavailable</h3>
          <p>${error.message}</p>
        </article>
      `;
    }
  }
}

function renderVerifyReport(data) {
  const report = document.getElementById("verifyReport");
  if (!report) return;
  const checks = Object.entries(data.checks || {});
  report.innerHTML = `
    <div class="verify-summary ${data.status === "pass" ? "is-pass" : "is-fail"}">
      <strong>${String(data.status || "unknown").toUpperCase()}</strong>
      <span>Results provider: ${data.provider?.name || "none"} (${data.provider?.configured ? "configured" : "not configured"})</span>
    </div>
    <div class="verify-checks">
      ${checks
        .map(([key, value]) => `
          <div class="verify-check ${value ? "is-pass" : "is-fail"}">
            <span>${value ? "PASS" : "FAIL"}</span>
            <strong>${key}</strong>
          </div>
        `)
        .join("")}
    </div>
    <pre>${JSON.stringify(data.sample || {}, null, 2)}</pre>
  `;
}

function verifyTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("verify") || params.get("verify_token") || "";
}

function storedVerifyToken() {
  try {
    return sessionStorage.getItem("paul.verifyToken") || "";
  } catch {
    return "";
  }
}

function currentVerifyToken() {
  return document.getElementById("verifyTokenInput")?.value.trim() || storedVerifyToken() || "";
}

function setupVerifyAccess() {
  const section = document.getElementById("verify");
  const input = document.getElementById("verifyTokenInput");
  const status = document.getElementById("verifyStatus");
  if (!section || !input) return;
  const token = verifyTokenFromUrl() || storedVerifyToken();
  if (!token && window.location.hash !== "#verify") return;
  section.hidden = false;
  if (token) {
    input.value = token;
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    if (status) status.textContent = "Owner verification unlocked for this browser session.";
  }
}

async function runDryVerification() {
  const button = document.getElementById("runVerifyButton");
  const status = document.getElementById("verifyStatus");
  if (!button || !status) return;
  const token = currentVerifyToken();
  if (!token) {
    status.textContent = "Enter the owner verify token first.";
    return;
  }
  button.disabled = true;
  status.textContent = "Running dry-run simulation...";
  try {
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    const response = await fetch("/api/test/simulate", {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Dry-run failed.");
    renderVerifyReport(data);
    status.textContent = "Dry-run complete. Production data was not modified.";
  } catch (error) {
    status.textContent = error.message;
    renderVerifyReport({ status: "fail", checks: { dryRunRequest: false }, sample: { error: error.message } });
  } finally {
    button.disabled = false;
  }
}

async function runDueAutomation() {
  const button = document.getElementById("runAutomationButton");
  const statusText = document.getElementById("automationStatus");
  if (!button || !statusText) return;

  button.disabled = true;
  statusText.textContent = "Running due prediction and result sync tasks...";
  try {
    const response = await fetch("/api/automation/run-due", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Automation task failed.");
    const okEvents = data.events.filter((event) => event.status === "ok").length;
    const errors = data.events.filter((event) => event.status === "error").length;
    statusText.textContent = `Automation complete: ${okEvents} updates, ${errors} errors.`;
    await loadAutomationStatus();
    await loadAuditProofs();
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

function renderGroups() {
  const grid = document.getElementById("groupGrid");
  grid.innerHTML = groupOrder
    .map((group) => {
      const groupTeams = Object.entries(teams)
        .filter(([, team]) => team.group === group)
        .sort((a, b) => a[1].pos - b[1].pos);
      return `
        <article class="group-card">
          <h3>Group ${group}</h3>
          ${groupTeams
            .map(([code, team]) => `
              <div class="team-row">
                ${flagImage(code, "flag-frame flag-frame--small")}
                <strong>${team.name}</strong>
                <span>${code}</span>
              </div>
            `)
            .join("")}
        </article>
      `;
    })
    .join("");
}

function populateFilters() {
  const roundFilter = document.getElementById("roundFilter");
  const groupFilter = document.getElementById("groupFilter");
  roundFilter.innerHTML = roundOptions.map((round) => `<option value="${round}">${roundLabels[round] || round}</option>`).join("");
  groupFilter.innerHTML = ["All", ...groupOrder].map((group) => `<option value="${group}">${groupLabels[group] || `Group ${group}`}</option>`).join("");
  roundFilter.addEventListener("change", renderMatchList);
  groupFilter.addEventListener("change", renderMatchList);
  document.getElementById("searchBox").addEventListener("input", renderMatchList);
}

function init() {
  populateFilters();
  setupVerifyAccess();
  renderGroups();
  renderMatchList();
  renderPK();
  document.getElementById("qwenButton")?.addEventListener("click", askQwen);
  document.getElementById("runAutomationButton")?.addEventListener("click", runDueAutomation);
  document.getElementById("runVerifyButton")?.addEventListener("click", runDryVerification);
  updateChampionLabel();
  syncAutomationSnapshot().then(loadAutomationStatus);
  loadAuditProofs();
  window.setInterval(() => {
    renderMatchList();
    renderPK();
  }, 60000);
}

init();
