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
  accuracy: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
  stageAccuracy: {
    group: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
    knockout: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
    upsets: { called: 0, hit: 0 },
    proofVerified: 0
  }
};
const storedPredictionKey = "paul.manualPredictions.v2";
let publicProofEntries = [];
let proofLedgerExpanded = false;
const proofLedgerLimit = 12;

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

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function matchMode(match) {
  return match.round === "Group Stage" ? "Group-stage record" : "Knockout Oracle Mode";
}

function modeClass(match) {
  return match.round === "Group Stage" ? "mode-pill--group" : "mode-pill--knockout";
}

function compactDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function matchCountdown(match, now = new Date()) {
  const kickoff = matchKickoffTime(match);
  if (Number.isNaN(kickoff.getTime())) return "Kickoff time TBA";
  const diff = kickoff.getTime() - now.getTime();
  if (diff > 0) return `Starts in ${compactDuration(diff)}`;
  if (diff > -130 * 60000) return "Live now";
  return "Full time window passed";
}

function countdownMarkup(match) {
  return `<span data-countdown-match="${match.id}">${matchCountdown(match)}</span>`;
}

function refreshCountdowns() {
  const now = new Date();
  document.querySelectorAll("[data-countdown-match]").forEach((element) => {
    const match = tournament.matches.find((item) => String(item.id) === String(element.dataset.countdownMatch));
    if (match) element.textContent = matchCountdown(match, now);
  });
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

function officialModelCards(official, match) {
  const baselines = official.evidence?.baselines || official.proof?.payload?.evidence?.baselines || {};
  const edge = official.evidence?.paulEdge || official.proof?.payload?.evidence?.paulEdge || {};
  const baselineLabel = (favorite) => favorite?.winnerName ? `${favorite.winnerName} · ${Math.round((favorite.probability || 0) * 100)}%` : "N/A";
  return `
    <article class="model-card">
      <h3>Official PAUL Pick</h3>
      <div class="vote">${official.analysis?.winnerName || resultLabel(match)} · ${official.analysis?.confidence || "N/A"}%</div>
      <p>${official.analysis?.reasoning || "PAUL has returned an official prediction."}</p>
    </article>
    <article class="model-card">
      <h3>Market Baseline</h3>
      <div class="vote">${baselineLabel(baselines.marketFavorite)}</div>
      <p>${official.analysis?.marketBaseline || "Consensus odds anchor for PAUL's calibrated pick."}</p>
    </article>
    <article class="model-card">
      <h3>Rating Baseline</h3>
      <div class="vote">${baselineLabel(baselines.ratingFavorite || baselines.blendedFavorite)}</div>
      <p>${official.analysis?.ratingBaseline || "Elo and score-model baseline used for comparison."}</p>
    </article>
    <article class="model-card">
      <h3>PAUL Edge</h3>
      <div class="vote">${edge.upsetScore ?? "N/A"} · ${edge.upsetTier || official.analysis?.upsetRisk || "N/A"}</div>
      <p>${official.analysis?.upsetCase || edge.signals?.join(", ") || "Final scores will verify this pick after the match."}</p>
    </article>
    <article class="model-card model-card--wide">
      <h3>Calibration</h3>
      <div class="vote">${official.analysis?.predictedScore || official.analysis?.score || "N/A"}</div>
      <p>${official.analysis?.calibrationNote || `Generated at ${new Date(official.generatedAt).toLocaleString()}.`}</p>
    </article>
  `;
}

function updateChampionLabel() {
  setText("championName", "Awaiting groups");
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
          <span class="match-countdown">${countdownMarkup(match)}</span>
          <span class="mode-pill ${modeClass(match)}">${matchMode(match)}</span>
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
  const leftWon = Boolean(official && resolved.aCode && officialPick === resolved.aCode);
  const rightWon = Boolean(official && resolved.bCode && officialPick === resolved.bCode);
  const mode = matchMode(match);
  const lane = document.getElementById("octopusLane");
  const crawler = document.getElementById("crawler");
  const crawlX = leftWon ? "-34%" : rightWon ? "34%" : "0%";
  const shouldCrawl = leftWon || rightWon;
  const crawlerAsset = "assets/real-paul-side-cutout.png";

  document.getElementById("pkPanel").dataset.mode = match.round === "Group Stage" ? "group" : "knockout";
  document.getElementById("pkMeta").textContent = `${mode} · Match ${match.id} · ${roundLabels[match.round] || match.round} · ${match.date} · ${match.venue}`;
  document.getElementById("pkConfidence").innerHTML = official
    ? `Official confidence ${official.analysis?.confidence || "N/A"}% · ${countdownMarkup(match)}`
    : `${resolved.aCode && resolved.bCode ? "Official prediction pending" : "Bracket slot pending"} · ${countdownMarkup(match)}`;
  document.getElementById("leftTeam").innerHTML = resolved.aCode ? teamMarkup(resolved.aCode) + teamLocaleMarkup(resolved.aCode) : slotMarkup(slotLabel(match, "a"));
  document.getElementById("rightTeam").innerHTML = resolved.bCode ? teamMarkup(resolved.bCode) + teamLocaleMarkup(resolved.bCode) : slotMarkup(slotLabel(match, "b"));
  lane.style.setProperty("--crawl-x", crawlX);
  lane.dataset.direction = leftWon ? "left" : rightWon ? "right" : "center";
  if (!crawler.getAttribute("src")?.includes(crawlerAsset)) {
    crawler.setAttribute("src", crawlerAsset);
  }
  crawler.style.animation = "none";
  crawler.offsetHeight;
  crawler.style.animation = shouldCrawl ? "" : "none";

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
    const pendingCopy = resolved.aCode && resolved.bCode
      ? match.round === "Group Stage"
        ? "This group-stage pick will be proof-locked before kickoff and counted in PAUL's public baseline record."
        : "Knockout Oracle Mode will lock this win-or-go-home pick before kickoff, with upset risk and bracket-path reasoning."
      : "This knockout slot will become predictable after earlier real results fill the official bracket.";
    document.getElementById("predictionCopy").innerHTML = `
      <p><strong>${resolved.aCode && resolved.bCode ? "Official PAUL prediction is not locked yet." : "This bracket slot is not resolved yet."}</strong></p>
      <p>${pendingCopy}</p>
      <p class="countdown-detail">Kickoff countdown: <strong>${countdownMarkup(match)}</strong></p>
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
        <h3>${match.round === "Group Stage" ? "Awaiting Group-stage PAUL Pick" : "Awaiting Knockout Oracle Pick"}</h3>
        <div class="vote">${resolved.aCode && resolved.bCode ? "Not locked" : "Waiting for bracket results"}</div>
        <p>${resolved.aCode && resolved.bCode ? "No simulated reference is shown before the official lock." : "This match will become predictable after the earlier winners are known."}</p>
      </article>
    `;

  if (official) {
    document.getElementById("modelGrid").innerHTML = officialModelCards(official, match);
  }

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

    const stageAccuracy = status.stageAccuracy || automationState.stageAccuracy;
    setText("autoPredicted", Object.keys(mergedPredictions).length);
    setText("autoResults", status.resultCount || 0);
    setText("autoAccuracy", `${status.accuracy?.accuracy || 0}%`);
    setText("autoNext", formatNextPrediction(nextPrediction));
    setText("groupAccuracyStat", `${stageAccuracy.group?.accuracy || 0}%`);
    setText("knockoutAccuracyStat", `${stageAccuracy.knockout?.accuracy || 0}%`);
    setText("upsetHitsStat", `${stageAccuracy.upsets?.hit || 0}/${stageAccuracy.upsets?.called || 0}`);
    setText("proofVerifiedStat", stageAccuracy.proofVerified || status.auditCount || 0);
    const baselines = stageAccuracy.baselines || {};
    setText("marketBaselineStat", baselines.market?.graded ? `${baselines.market.accuracy}%` : "Pending");
    setText("ratingBaselineStat", baselines.rating?.graded ? `${baselines.rating.accuracy}%` : "Pending");
    const edge = baselines.paulVsMarket?.edge;
    setText("paulEdgeStat", Number.isFinite(edge) ? `${edge >= 0 ? "+" : ""}${edge}` : "Pending");
    const calibration = stageAccuracy.calibration || {};
    setText(
      "calibrationStat",
      calibration.graded ? `${calibration.actualAccuracy}% / ${calibration.averageConfidence}%` : "Pending"
    );
    automationState = {
      predictions: mergedPredictions,
      results: status.results || {},
      accuracy: status.accuracy || automationState.accuracy,
      stageAccuracy
    };
    updateChampionLabel();
    renderMatchList();
    renderPK();

    const qwenState = status.hasQwenKey ? "PAUL AI ready" : "PAUL AI not connected";
    const resultState = status.hasResultsApi ? "Results API ready" : "Results API not connected";
    const readiness = status.dataReadiness || {};
    const oddsState = readiness.liveOddsProvider
      ? `live odds via ${readiness.liveOddsProvider}`
      : readiness.marketOdds
        ? "market odds loaded"
        : "market odds missing";
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

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function publicProofJson(entry) {
  return JSON.stringify({
    id: entry.id,
    version: entry.version,
    matchId: entry.matchId,
    match: entry.match,
    round: entry.round,
    lockedAt: entry.lockedAt,
    kickoffAt: entry.kickoffAt,
    algorithm: entry.algorithm,
    hash: entry.hash,
    canonical: entry.canonical,
    payload: entry.payload,
    externalProof: entry.externalProof || null
  }, null, 2);
}

function githubProof(externalProof) {
  return externalProof?.github || (externalProof?.provider === "github" ? externalProof : null);
}

function otsProof(externalProof) {
  return externalProof?.opentimestamps || (externalProof?.provider === "opentimestamps" ? externalProof : null);
}

function proofDownloadName(entry) {
  return `paul-proof-${entry.matchId || "match"}-${String(entry.hash || "hash").slice(0, 12)}.ots`;
}

function canonicalDownloadName(entry) {
  return `paul-proof-${entry.matchId || "match"}-${String(entry.hash || "hash").slice(0, 12)}.canonical.json`;
}

function downloadTextFile(text, filename, type = "application/json;charset=utf-8") {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function downloadCanonicalProof(entry) {
  if (!entry?.canonical) return;
  downloadTextFile(entry.canonical, canonicalDownloadName(entry));
}

function downloadOtsProof(entry) {
  const ots = otsProof(entry?.externalProof);
  if (!ots?.otsBase64) return;
  const bytes = Uint8Array.from(atob(ots.otsBase64), (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = proofDownloadName(entry);
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

const fixedDemoProofJson = String.raw`{
  "id": "1:1bb71fdcec218484",
  "version": "paul-proof-v2",
  "matchId": 1,
  "match": "Mexico vs South Africa",
  "round": "Group Stage",
  "lockedAt": "2026-06-02T14:34:50.196Z",
  "kickoffAt": "2026-06-11T20:00:00.000Z",
  "algorithm": "sha256",
  "hash": "1bb71fdcec218484418bd16b11e2366d27a976cc17136a95e7ccc83c33ebacc0",
  "canonical": "{\"evidence\":{\"form\":null,\"generatedAt\":\"2026-06-02T14:34:50.196Z\",\"hasPrimaryEvidence\":true,\"market\":{\"bookmakerCount\":3,\"eventId\":\"demo-match-1\",\"odds\":{\"away\":3.9,\"draw\":3.55,\"home\":2.05},\"probabilities\":{\"away\":0.23,\"draw\":0.253,\"home\":0.437},\"provider\":\"server demo\",\"sampleBookmakers\":[\"DemoBook A\",\"DemoBook B\",\"DemoBook C\"],\"source\":\"demo\",\"updatedAt\":\"2026-06-02T14:34:50.196Z\"},\"missing\":[],\"ratings\":null,\"searchFallback\":false},\"kickoffAt\":\"2026-06-11T20:00:00.000Z\",\"lockedAt\":\"2026-06-02T14:34:50.196Z\",\"match\":\"Mexico vs South Africa\",\"matchId\":1,\"model\":\"PAUL-DEMO\",\"nonce\":\"79a4906603800af68ac374a0cfc64613\",\"prediction\":{\"confidence\":57,\"evidenceUsed\":[\"demo odds snapshot\",\"OpenTimestamps demo\"],\"predictedScore\":\"2-1\",\"probabilities\":{\"away\":25,\"draw\":27,\"home\":48},\"reasoning\":\"Synthetic server-generated proof used to test OpenTimestamps without writing production data.\",\"upsetRisk\":\"Demo only\",\"winnerCode\":\"MEX\",\"winnerName\":\"Mexico\"},\"round\":\"Group Stage\",\"teams\":{\"away\":{\"code\":\"RSA\",\"name\":\"South Africa\"},\"home\":{\"code\":\"MEX\",\"name\":\"Mexico\"}},\"version\":\"paul-proof-v2\"}",
  "payload": {
    "version": "paul-proof-v2",
    "matchId": 1,
    "round": "Group Stage",
    "match": "Mexico vs South Africa",
    "teams": {
      "home": {
        "code": "MEX",
        "name": "Mexico"
      },
      "away": {
        "code": "RSA",
        "name": "South Africa"
      }
    },
    "kickoffAt": "2026-06-11T20:00:00.000Z",
    "lockedAt": "2026-06-02T14:34:50.196Z",
    "model": "PAUL-DEMO",
    "prediction": {
      "winnerCode": "MEX",
      "winnerName": "Mexico",
      "confidence": 57,
      "predictedScore": "2-1",
      "probabilities": {
        "home": 48,
        "draw": 27,
        "away": 25
      },
      "upsetRisk": "Demo only",
      "reasoning": "Synthetic server-generated proof used to test OpenTimestamps without writing production data.",
      "evidenceUsed": [
        "demo odds snapshot",
        "OpenTimestamps demo"
      ]
    },
    "evidence": {
      "generatedAt": "2026-06-02T14:34:50.196Z",
      "hasPrimaryEvidence": true,
      "missing": [],
      "market": {
        "source": "demo",
        "provider": "server demo",
        "eventId": "demo-match-1",
        "updatedAt": "2026-06-02T14:34:50.196Z",
        "bookmakerCount": 3,
        "sampleBookmakers": [
          "DemoBook A",
          "DemoBook B",
          "DemoBook C"
        ],
        "odds": {
          "home": 2.05,
          "draw": 3.55,
          "away": 3.9
        },
        "probabilities": {
          "home": 0.437,
          "draw": 0.253,
          "away": 0.23
        }
      },
      "ratings": null,
      "form": null,
      "searchFallback": false
    },
    "nonce": "79a4906603800af68ac374a0cfc64613"
  },
  "externalProof": {
    "github": null,
    "opentimestamps": {
      "provider": "opentimestamps",
      "status": "pending-bitcoin-confirmation",
      "createdAt": "2026-06-02T14:34:51.302Z",
      "hash": "1bb71fdcec218484418bd16b11e2366d27a976cc17136a95e7ccc83c33ebacc0",
      "otsBase64": "AE9wZW5UaW1lc3RhbXBzAABQcm9vZgC/ieLohOiSlAEIG7cf3OwhhIRBi9FrEeI2bSepdswXE2qV58zIPDPrrMDwEB8luUujemVj5iVQvX2ucb8I//AIh8WYeENJQfUI8SAR8mWR3Ld7wtYd2BIDQhOFUy7ogC278+RTfzSBWeqEqgjwEGSzJwdlzTV1VEs6MapbYyoI8SDsiPjcaAWI9cWcvNTmZgOuW2Mq5ikRZZ7YjnictdRVWQjwIFuv6H6iRUoyZ8I0wlO+cpJWWEM+eJNc6GljNbPIsLarCPEEah7qCvAI3LGNWrGM3TgAg9/jDS75DI4uLWh0dHBzOi8vYWxpY2UuYnRjLmNhbGVuZGFyLm9wZW50aW1lc3RhbXBzLm9yZ//wCDBHjDhpVIX5CPAQ6drEG7+FSeq2w3Yt/CQPSAjxIC4zogz3fjur+VXCKKRWa6+cgatAVq38JLnY++HaXHwxCPAgcH2LngBY/J7NI39WQjrXZaA6vyETs1NHO0cxbW+Y1R8I8QRqHuoK8Ah7gGygZVDquACD3+MNLvkMjiwraHR0cHM6Ly9ib2IuYnRjLmNhbGVuZGFyLm9wZW50aW1lc3RhbXBzLm9yZ//wEHwRDr+qfr2CD88b2M0YfdwI8CBSQHTj2o+JOxPsszvq654875TKdUdCjGc3VaPGruovZAjwIC8J4jTHRdr9gt3MZCHqWP+P3FAZ6wuInozdy4gzfY6hCPEEah7qC/AINUYC0UyrdYUAg9/jDS75DI4pKGh0dHBzOi8vZmlubmV5LmNhbGVuZGFyLmV0ZXJuaXR5d2FsbC5jb23wEHjhp3uoNDT0eqnDrpWebIEI8CB5uKjDIBzPUflRfXZ68V8sOuAnTOf8ssRk3X5rbNGGaQjxBGoe6grwCI/nWWz7mVouAIPf4w0u+QyOIyJodHRwczovL2J0Yy5jYWxlbmRhci5jYXRhbGxheHkuY29t",
      "otsBytes": 735,
      "note": "OpenTimestamps proof created from the SHA-256 hash of canonical proof JSON. It may need later upgrading before Bitcoin block verification is final."
    },
    "demo": {
      "provider": "demo",
      "note": "Server-generated owner demo. Not stored, not official."
    }
  }
}`;

function demoProofJson() {
  return fixedDemoProofJson;
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function loadDemoProof() {
  const status = document.getElementById("copyProofStatus");
  setProofVerifierInput(demoProofJson());
  if (status) status.textContent = "Fixed demo proof with bundled .ots loaded. Click Verify Proof.";
}

function setProofVerifierInput(value) {
  const input = document.getElementById("proofInput");
  const status = document.getElementById("copyProofStatus");
  if (input) input.value = value;
  if (status) status.textContent = "Proof JSON loaded. Click Verify Proof.";
}

function proofIsKnockout(entry) {
  return entry.round && entry.round !== "Group Stage";
}

function proofMatchesLedgerFilters(entry) {
  const roundFilter = document.getElementById("proofRoundFilter")?.value || "All";
  const search = (document.getElementById("proofSearchBox")?.value || "").trim().toLowerCase();
  if (roundFilter === "Group Stage" && entry.round !== "Group Stage") return false;
  if (roundFilter === "Knockout" && !proofIsKnockout(entry)) return false;
  if (!search) return true;
  const haystack = [
    entry.id,
    entry.matchId,
    entry.match,
    entry.round,
    entry.hash,
    entry.lockedAt,
    entry.kickoffAt,
    entry.payload?.prediction?.winnerName,
    entry.payload?.prediction?.winnerCode,
    entry.payload?.teams?.home?.name,
    entry.payload?.teams?.away?.name
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(search);
}

function updateProofLedger(entries, filteredEntries, visibleEntries) {
  const total = entries.length;
  const group = entries.filter((entry) => entry.round === "Group Stage").length;
  const knockout = entries.filter(proofIsKnockout).length;
  const ots = entries.filter((entry) => Boolean(otsProof(entry.externalProof)?.otsBase64)).length;
  const totalStat = document.getElementById("proofTotalStat");
  const groupStat = document.getElementById("proofGroupStat");
  const knockoutStat = document.getElementById("proofKnockoutStat");
  const otsStat = document.getElementById("proofOtsStat");
  const status = document.getElementById("proofLedgerStatus");
  const toggle = document.getElementById("proofToggleButton");
  if (totalStat) totalStat.textContent = String(total);
  if (groupStat) groupStat.textContent = String(group);
  if (knockoutStat) knockoutStat.textContent = String(knockout);
  if (otsStat) otsStat.textContent = String(ots);
  if (toggle) {
    toggle.hidden = filteredEntries.length <= proofLedgerLimit;
    toggle.textContent = proofLedgerExpanded ? "Show latest 12" : `Show all ${filteredEntries.length}`;
  }
  if (status) {
    if (!total) {
      status.textContent = "No locked proofs yet.";
    } else if (!filteredEntries.length) {
      status.textContent = `No proofs match this filter. ${total} official proofs are still retained.`;
    } else if (visibleEntries.length === filteredEntries.length) {
      status.textContent = `Showing ${visibleEntries.length} of ${total} retained official proofs.`;
    } else {
      status.textContent = `Showing latest ${visibleEntries.length} of ${filteredEntries.length} matching proofs. ${total} proofs are retained.`;
    }
  }
}

function proofCardMarkup(entry) {
  const github = githubProof(entry.externalProof);
  const ots = otsProof(entry.externalProof);
  const prediction = entry.payload?.prediction;
  const githubLine = github?.commitUrl
    ? `<a href="${github.commitUrl}" target="_blank" rel="noreferrer">GitHub commit</a>`
    : github?.error
      ? `<span>GitHub pending: ${github.error}</span>`
      : `<span>No GitHub timestamp</span>`;
  const otsLine = ots?.otsBase64
    ? `<span>OpenTimestamps .ots ready (${ots.otsBytes || "N/A"} bytes)</span>`
    : ots?.error
      ? `<span>OpenTimestamps pending: ${ots.error}</span>`
      : `<span>No OpenTimestamps proof</span>`;
  return `
    <article class="proof-card">
      <div class="proof-card__top">
        <span class="winner-pill">${entry.verified ? "Hash verified" : "Hash mismatch"}</span>
        <span class="winner-pill ${entry.isBeforeKickoff ? "" : "winner-pill--warn"}">${entry.isBeforeKickoff ? "Before kickoff" : "Check time"}</span>
        ${ots?.otsBase64 ? `<span class="winner-pill">OTS receipt</span>` : ""}
      </div>
      <div class="proof-card__heading">
        <h3>#${entry.matchId} ${entry.match}</h3>
        <button class="button button--ghost proof-copy-button" type="button" data-proof-id="${entry.id}">Copy</button>
      </div>
      <dl>
        <div><dt>Round</dt><dd>${entry.round || "Unknown"}</dd></div>
        ${prediction?.winnerName ? `<div><dt>Pick</dt><dd>${prediction.winnerName}${prediction.predictedScore ? ` · ${prediction.predictedScore}` : ""}</dd></div>` : ""}
        <div><dt>Locked</dt><dd>${formatProofTime(entry.lockedAt)}</dd></div>
        <div><dt>Kickoff</dt><dd>${formatProofTime(entry.kickoffAt)}</dd></div>
        <div><dt>SHA-256</dt><dd><code>${shortHash(entry.hash)}</code></dd></div>
        <div><dt>GitHub proof</dt><dd>${githubLine}</dd></div>
        <div><dt>OpenTimestamps</dt><dd>${otsLine}</dd></div>
      </dl>
      <div class="proof-card__actions">
        <button class="button button--ghost proof-load-button" type="button" data-proof-id="${entry.id}">Load in Verifier</button>
        <button class="button button--ghost proof-canonical-button" type="button" data-proof-id="${entry.id}">Download canonical</button>
        ${ots?.otsBase64 ? `<button class="button button--ghost proof-ots-button" type="button" data-proof-id="${entry.id}">Download .ots</button>` : ""}
        ${ots?.otsBase64 ? `<a class="button button--ghost" href="https://opentimestamps.org/" target="_blank" rel="noreferrer">Open OTS verifier</a>` : ""}
      </div>
    </article>
  `;
}

function bindProofCardActions(grid) {
  grid.querySelectorAll(".proof-copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (!entry) return;
      await copyText(publicProofJson(entry));
      const status = document.getElementById("copyProofStatus");
      if (status) status.textContent = `Copied proof for match #${entry.matchId}.`;
    });
  });

  grid.querySelectorAll(".proof-load-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (!entry) return;
      setProofVerifierInput(publicProofJson(entry));
      document.getElementById("proofVerifier")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  grid.querySelectorAll(".proof-ots-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (entry) downloadOtsProof(entry);
    });
  });

  grid.querySelectorAll(".proof-canonical-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (entry) downloadCanonicalProof(entry);
    });
  });
}

function renderProofs(entries) {
  const grid = document.getElementById("proofGrid");
  if (!grid) return;
  publicProofEntries = entries;
  const filteredEntries = entries.filter(proofMatchesLedgerFilters);
  const visibleEntries = proofLedgerExpanded ? filteredEntries : filteredEntries.slice(0, proofLedgerLimit);
  updateProofLedger(entries, filteredEntries, visibleEntries);

  if (!entries.length) {
    grid.innerHTML = `
      <article class="proof-card">
        <h3>No locked proofs yet</h3>
        <p>Proof records will appear here as soon as PAUL locks an official prediction.</p>
      </article>
    `;
    return;
  }

  if (!filteredEntries.length) {
    grid.innerHTML = `
      <article class="proof-card">
        <h3>No matching proofs</h3>
        <p>Change the round filter or search term. The official proof ledger still keeps every locked prediction.</p>
      </article>
    `;
    return;
  }

  grid.innerHTML = visibleEntries.map(proofCardMarkup).join("");
  bindProofCardActions(grid);
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

async function verifyProofInput() {
  const input = document.getElementById("proofInput");
  const result = document.getElementById("proofVerifyResult");
  const status = document.getElementById("copyProofStatus");
  if (!input || !result) return;
  const raw = input.value.trim();
  if (!raw) {
    result.innerHTML = `<div class="proof-result-card is-fail"><strong>Missing proof JSON</strong><span>Paste a proof object first.</span></div>`;
    return;
  }

  try {
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    const canonical = parsed?.canonical || (parsed?.payload ? stableStringify(parsed.payload) : raw);
    const expectedHash = parsed?.hash || "";
    const actualHash = await sha256Hex(canonical);
    const canonicalPayload = parsed?.canonical ? JSON.parse(parsed.canonical) : parsed?.payload || parsed;
    const submittedPayload = parsed?.payload || canonicalPayload;
    const payloadMatchesCanonical = parsed?.payload ? stableStringify(parsed.payload) === canonical : true;
    const envelopeMatchesCanonical = parsed
      ? ["matchId", "round", "match", "lockedAt", "kickoffAt"].every((key) => parsed[key] === undefined || parsed[key] === canonicalPayload?.[key])
      : true;
    const proofStructureOk = payloadMatchesCanonical && envelopeMatchesCanonical;
    const payload = canonicalPayload;
    const lockedAt = payload?.lockedAt;
    const kickoffAt = payload?.kickoffAt;
    const timeOk = lockedAt && kickoffAt ? new Date(lockedAt).getTime() < new Date(kickoffAt).getTime() : null;
    const hashOk = expectedHash ? actualHash === expectedHash && proofStructureOk : null;
    const evidence = payload?.evidence || {};
    const market = evidence.market || {};
    const odds = market.odds || {};
    const github = githubProof(parsed?.externalProof);
    const ots = otsProof(parsed?.externalProof);
    const otsDownloadHref = ots?.otsBase64 && /^[A-Za-z0-9+/=]+$/.test(ots.otsBase64)
      ? `data:application/octet-stream;base64,${ots.otsBase64}`
      : "";
    const otsDownloadName = `paul-proof-${payload?.matchId || parsed?.matchId || "demo"}-${String(expectedHash || actualHash).slice(0, 12)}.ots`;
    const canonicalDownloadName = `paul-proof-${payload?.matchId || parsed?.matchId || "demo"}-${String(expectedHash || actualHash).slice(0, 12)}.canonical.json`;
    const canonicalDownloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(canonical)}`;
    const hasExternalTimestamp = Boolean(github?.commitUrl || ots?.otsBase64);
    const external = [
      github?.commitUrl
        ? `<a href="${github.commitUrl}" target="_blank" rel="noreferrer">GitHub commit timestamp</a>`
        : github?.error
          ? `GitHub pending: ${github.error}`
          : null,
      ots?.otsBase64
        ? `OpenTimestamps .ots ready (${ots.otsBytes || "N/A"} bytes; ${ots.status || "pending"})`
        : ots?.error
          ? `OpenTimestamps pending: ${ots.error}`
          : null,
      parsed?.externalProof?.demo?.note || parsed?.externalProof?.note || null
    ].filter(Boolean).join("<br>") || "No external timestamp in this proof JSON";

    result.innerHTML = `
      <div class="proof-result-grid">
        <article class="proof-result-card ${hashOk === false ? "is-fail" : "is-pass"}">
          <strong>${hashOk === null ? "HASH CALCULATED" : hashOk ? "HASH MATCH" : "HASH MISMATCH"}</strong>
          <span>Calculated SHA-256: <code>${actualHash}</code></span>
          ${expectedHash ? `<span>Expected hash: <code>${expectedHash}</code></span>` : "<span>No expected hash was included; use this calculated hash for manual comparison.</span>"}
        </article>
        <article class="proof-result-card ${proofStructureOk ? "is-pass" : "is-fail"}">
          <strong>${proofStructureOk ? "PROOF STRUCTURE MATCH" : "PROOF STRUCTURE TAMPERED"}</strong>
          <span>Payload vs canonical: ${payloadMatchesCanonical ? "match" : "mismatch"}</span>
          <span>Outer fields vs canonical: ${envelopeMatchesCanonical ? "match" : "mismatch"}</span>
          <span>The hash is valid only for the canonical JSON. Edited outer fields do not count.</span>
        </article>
        <article class="proof-result-card ${timeOk === false ? "is-fail" : "is-warn"}">
          <strong>${timeOk === null ? "SELF-DECLARED TIME UNKNOWN" : timeOk ? "SELF-DECLARED BEFORE KICKOFF" : "SELF-DECLARED TIME FAILED"}</strong>
          <span>Locked: ${formatProofTime(lockedAt)}</span>
          <span>Kickoff: ${formatProofTime(kickoffAt)}</span>
          <span>This timestamp is only trusted if an independent public timestamp also exists.</span>
        </article>
        <article class="proof-result-card ${hasExternalTimestamp ? "is-pass" : "is-warn"}">
          <strong>${hasExternalTimestamp ? "PUBLIC TIMESTAMP FOUND" : "NO INDEPENDENT TIMESTAMP"}</strong>
          <span>${external}</span>
          <span>${hasExternalTimestamp ? "GitHub and/or OpenTimestamps can be checked outside this site." : "Hash is valid, but the lockedAt value could still be backdated without an external timestamp."}</span>
        </article>
        <article class="proof-result-card ${ots?.otsBase64 ? "is-pass" : "is-warn"}">
          <strong>${ots?.otsBase64 ? "OPENTIMESTAMPS PROOF READY" : "NO OPENTIMESTAMPS PROOF"}</strong>
          <span>${ots?.otsBase64 ? `Download both files, open the official verifier, then drop the canonical JSON and .ots proof.` : "Official predictions will try to create an .ots proof automatically."}</span>
          <a class="button button--ghost proof-download-inline" download="${canonicalDownloadName}" href="${canonicalDownloadHref}">Download canonical JSON</a>
          ${otsDownloadHref ? `<a class="button button--ghost proof-download-inline" download="${otsDownloadName}" href="${otsDownloadHref}">Download loaded .ots</a>` : ""}
          ${ots?.otsBase64 ? `<a class="button button--ghost proof-download-inline" href="https://opentimestamps.org/" target="_blank" rel="noreferrer">Open OTS verifier</a>` : ""}
          <span>${ots?.note || "OpenTimestamps proofs may start as calendar attestations and need later upgrade to a Bitcoin block."}</span>
        </article>
        <article class="proof-result-card">
          <strong>${payload?.match || parsed?.match || "PAUL proof"}</strong>
          <span>Match #${payload?.matchId || parsed?.matchId || "N/A"} · ${payload?.round || parsed?.round || "N/A"}</span>
          <span>Pick: ${payload?.prediction?.winnerName || payload?.prediction?.winnerCode || "N/A"} · Score ${payload?.prediction?.predictedScore || "N/A"}</span>
          ${proofStructureOk
            ? `<span>${external}</span>`
            : `<span>Canonical lockedAt is ${formatProofTime(payload?.lockedAt)}. Submitted payload lockedAt is ${formatProofTime(submittedPayload?.lockedAt)}.</span>`}
        </article>
        <article class="proof-result-card">
          <strong>Evidence Snapshot</strong>
          <span>Market source: ${market.source || "N/A"} ${market.provider ? `(${market.provider})` : ""}</span>
          <span>Bookmakers: ${market.bookmakerCount || "N/A"}${market.sampleBookmakers?.length ? ` · ${market.sampleBookmakers.join(", ")}` : ""}</span>
          <span>1X2 odds: ${odds.home || "N/A"} / ${odds.draw || "N/A"} / ${odds.away || "N/A"}</span>
        </article>
      </div>
    `;
    if (status) status.textContent = "Proof verification completed locally in this browser.";
  } catch (error) {
    result.innerHTML = `<div class="proof-result-card is-fail"><strong>Verification failed</strong><span>${error.message}</span></div>`;
  }
}

function clearProofVerifier() {
  const input = document.getElementById("proofInput");
  const result = document.getElementById("proofVerifyResult");
  const status = document.getElementById("copyProofStatus");
  if (input) input.value = "";
  if (result) result.innerHTML = "";
  if (status) status.textContent = "No proof loaded.";
}

function renderVerifyReport(data) {
  const report = document.getElementById("verifyReport");
  if (!report) return;
  const checks = Object.entries(data.checks || {});
  const groups = data.trace?.groups || {};
  const rounds = data.trace?.rounds || {};
  const knockoutRounds = ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];
  report.innerHTML = `
    <div class="verify-summary ${data.status === "pass" ? "is-pass" : "is-fail"}">
      <strong>${String(data.status || "unknown").toUpperCase()}</strong>
      <span>Results provider: ${data.provider?.name || "none"} (${data.provider?.configured ? "configured" : "not configured"})</span>
    </div>
    <p class="verify-note">${data.trace?.explanation || "Dry-run uses synthetic results to validate mechanics."}</p>
    <h3 class="verify-title">System Checks</h3>
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
    <h3 class="verify-title">Group Tables</h3>
    <div class="verify-groups">
      ${Object.entries(groups)
        .map(([group, rows]) => `
          <article class="verify-group">
            <h4>Group ${group}</h4>
            <table>
              <thead><tr><th>Team</th><th>Pts</th><th>GD</th><th>GF</th></tr></thead>
              <tbody>
                ${rows
                  .map((row) => `<tr><td>${row.name}</td><td>${row.points}</td><td>${row.gd}</td><td>${row.gf}</td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </article>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Knockout Trace</h3>
    <div class="verify-rounds">
      ${knockoutRounds
        .map((round) => `
          <article class="verify-round">
            <h4>${round}</h4>
            ${(rounds[round] || [])
              .map((match) => `
                <div class="verify-match">
                  <span>#${match.id}</span>
                  <strong>${match.home} ${match.score} ${match.away}</strong>
                  <em>Winner: ${match.winner}</em>
                </div>
              `)
              .join("")}
          </article>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Proof Sample</h3>
    <pre>${JSON.stringify(data.sample?.proof || {}, null, 2)}</pre>
  `;
}

function renderResultsHealth(data) {
  const report = document.getElementById("resultsHealthReport");
  if (!report) return;
  const checks = data.checks || [];
  report.innerHTML = `
    <div class="verify-summary ${data.status === "pass" ? "is-pass" : "is-fail"}">
      <strong>RESULT SOURCES ${String(data.status || "unknown").toUpperCase()}</strong>
      <span>${data.providerName || "none"} · production writes: ${data.writesProductionData ? "yes" : "no"}</span>
    </div>
    <div class="verify-health-grid">
      ${checks
        .map((check) => `
          <article class="verify-health-card ${check.ok ? "is-pass" : "is-fail"}">
            <span>${check.ok ? "PASS" : check.skipped ? "SKIP" : "FAIL"}</span>
            <h3>${check.provider}</h3>
            <p>${check.reason || check.error || `HTTP ${check.status || "N/A"} · ${check.elapsedMs ?? "N/A"}ms`}</p>
            ${check.matchCount !== undefined ? `<p>Matches returned: <strong>${check.matchCount}</strong></p>` : ""}
          </article>
        `)
        .join("")}
    </div>
    <div class="verify-safe-check ${data.safeBeforeKickoff ? "is-pass" : "is-fail"}">
      <strong>${data.safeBeforeKickoff ? "PASS" : "FAIL"}</strong>
      <span>Before kickoff safety: ${data.firstPlayable?.label || "N/A"} returns ${data.firstMatchResult ? "a result" : "null"}, so unfinished 0-0 scores ${data.safeBeforeKickoff ? "will not be saved" : "may be saved"}.</span>
    </div>
    <pre>${JSON.stringify({
      generatedAt: data.generatedAt,
      providers: data.providers,
      firstPlayable: data.firstPlayable,
      safeBeforeKickoff: data.safeBeforeKickoff
    }, null, 2)}</pre>
  `;
}

function metricCard(name, metric) {
  return `
    <article class="verify-health-card ${metric?.accuracy >= 50 ? "is-pass" : ""}">
      <span>${name}</span>
      <h3>${metric?.accuracy ?? 0}%</h3>
      <p>${metric?.correct ?? 0}/${metric?.graded ?? 0} correct · Brier ${metric?.brier ?? "N/A"}</p>
    </article>
  `;
}

function renderBacktestReport(data) {
  const report = document.getElementById("backtestReport");
  if (!report) return;
  const metrics = data.metrics || {};
  const calibration = data.calibration || {};
  report.innerHTML = `
    <div class="verify-summary ${data.status === "pass" ? "is-pass" : "is-fail"}">
      <strong>BACKTEST ${String(data.status || "unknown").toUpperCase()}</strong>
      <span>${data.algorithm?.name || "PAUL Edge"} · ${data.dataset?.name || "Historical dataset"} · ${data.dataset?.matches || 0} matches</span>
    </div>
    <p class="verify-note">
      Source: odds from ${data.dataset?.odds || "N/A"}. ${data.dataset?.note || ""}
      ${data.algorithm?.changes?.length ? `Changes: ${data.algorithm.changes.join("; ")}.` : ""}
    </p>
    <h3 class="verify-title">Baseline Comparison</h3>
    <div class="verify-health-grid">
      ${metricCard("PAUL Edge", metrics.paul)}
      ${metricCard("Market favorite", metrics.market)}
      ${metricCard("Rating baseline", metrics.rating)}
      ${metricCard("Poisson form", metrics.poisson)}
      ${metricCard("Blended baseline", metrics.blended)}
      ${metricCard("Random", metrics.random)}
    </div>
    <h3 class="verify-title">Edge Audit</h3>
    <div class="verify-checks">
      <div class="verify-check ${data.edge?.paulMinusMarket >= 0 ? "is-pass" : "is-fail"}">
        <span>${data.edge?.paulMinusMarket >= 0 ? "PASS" : "WARN"}</span>
        <strong>PAUL vs market: ${data.edge?.paulMinusMarket >= 0 ? "+" : ""}${data.edge?.paulMinusMarket ?? 0} correct picks</strong>
      </div>
      <div class="verify-check ${data.edge?.paulMinusBlended >= 0 ? "is-pass" : "is-fail"}">
        <span>${data.edge?.paulMinusBlended >= 0 ? "PASS" : "WARN"}</span>
        <strong>PAUL vs blended: ${data.edge?.paulMinusBlended >= 0 ? "+" : ""}${data.edge?.paulMinusBlended ?? 0} correct picks</strong>
      </div>
      <div class="verify-check">
        <span>UPSET</span>
        <strong>${data.edge?.upsetHits ?? 0}/${data.edge?.upsetCalls ?? 0} override hits · ${data.edge?.upsetAccuracy ?? 0}%</strong>
      </div>
    </div>
    <h3 class="verify-title">Calibration Buckets</h3>
    <div class="verify-checks">
      ${Object.entries(calibration)
        .map(([band, bucket]) => `
          <div class="verify-check">
            <span>${band}</span>
            <strong>${bucket.correct}/${bucket.graded} · ${bucket.accuracy}%</strong>
          </div>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Sample Match Trace</h3>
    <div class="verify-rounds">
      <article class="verify-round">
        ${(data.trace || [])
          .slice(0, 16)
          .map((match) => `
            <div class="verify-match">
              <span>#${match.id}</span>
              <strong>${match.match} ${match.score}</strong>
              <em>Actual ${match.actual}; PAUL ${match.picks.paul}; Market ${match.picks.market}; Edge ${match.paul.upsetScore}</em>
            </div>
          `)
          .join("")}
      </article>
    </div>
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
    document.querySelectorAll(".owner-only").forEach((element) => {
      element.hidden = false;
    });
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

async function runResultsHealthCheck() {
  const button = document.getElementById("runResultsHealthButton");
  const status = document.getElementById("verifyStatus");
  if (!button || !status) return;
  const token = currentVerifyToken();
  if (!token) {
    status.textContent = "Enter the owner verify token first.";
    return;
  }
  button.disabled = true;
  status.textContent = "Checking result providers...";
  try {
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    const response = await fetch("/api/test/simulate?mode=results-health", {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Result source check failed.");
    renderResultsHealth(data);
    status.textContent = "Result source check complete. Production data was not modified.";
  } catch (error) {
    status.textContent = error.message;
    renderResultsHealth({ status: "fail", checks: [{ provider: "request", ok: false, error: error.message }], writesProductionData: false });
  } finally {
    button.disabled = false;
  }
}

async function runHistoricalBacktest() {
  const button = document.getElementById("runBacktestButton");
  const status = document.getElementById("verifyStatus");
  if (!button || !status) return;
  const token = currentVerifyToken();
  if (!token) {
    status.textContent = "Enter the owner verify token first.";
    return;
  }
  button.disabled = true;
  status.textContent = "Running historical 2022 backtest...";
  try {
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    const response = await fetch("/api/test/simulate?mode=backtest", {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Backtest failed.");
    renderBacktestReport(data);
    status.textContent = "Historical backtest complete. Production data was not modified.";
  } catch (error) {
    status.textContent = error.message;
    renderBacktestReport({ status: "fail", dataset: { name: "Backtest request" }, metrics: {}, edge: {}, trace: [] });
  } finally {
    button.disabled = false;
  }
}

async function runDueAutomation() {
  const button = document.getElementById("runAutomationButton");
  const statusText = document.getElementById("automationStatus");
  if (!button || !statusText) return;
  const token = currentVerifyToken();
  if (!token) {
    statusText.textContent = "Owner token required. Vercel cron runs production tasks automatically.";
    return;
  }

  button.disabled = true;
  statusText.textContent = "Running due prediction and result sync tasks...";
  try {
    const response = await fetch("/api/automation/run-due", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Verify-Token": token },
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
  document.getElementById("runResultsHealthButton")?.addEventListener("click", runResultsHealthCheck);
  document.getElementById("runBacktestButton")?.addEventListener("click", runHistoricalBacktest);
  document.getElementById("loadDemoProofButton")?.addEventListener("click", loadDemoProof);
  document.getElementById("verifyProofButton")?.addEventListener("click", verifyProofInput);
  document.getElementById("clearProofButton")?.addEventListener("click", clearProofVerifier);
  document.getElementById("proofRoundFilter")?.addEventListener("change", () => {
    proofLedgerExpanded = false;
    renderProofs(publicProofEntries);
  });
  document.getElementById("proofSearchBox")?.addEventListener("input", () => {
    proofLedgerExpanded = false;
    renderProofs(publicProofEntries);
  });
  document.getElementById("proofToggleButton")?.addEventListener("click", () => {
    proofLedgerExpanded = !proofLedgerExpanded;
    renderProofs(publicProofEntries);
  });
  updateChampionLabel();
  syncAutomationSnapshot().then(loadAutomationStatus);
  loadAuditProofs();
  window.setInterval(refreshCountdowns, 1000);
}

init();
