const seasonLabels = {
  1920: "2019-20",
  2021: "2020-21",
  2122: "2021-22",
  2223: "2022-23",
  2324: "2023-24",
  2425: "2024-25"
};

const footballLeagues = [
  { code: "E0", name: "Premier League", region: "England" },
  { code: "E1", name: "Championship", region: "England" },
  { code: "E2", name: "League One", region: "England" },
  { code: "E3", name: "League Two", region: "England" },
  { code: "SC0", name: "Scottish Premiership", region: "Scotland" },
  { code: "SP1", name: "La Liga", region: "Spain" },
  { code: "SP2", name: "Segunda Division", region: "Spain" },
  { code: "D1", name: "Bundesliga", region: "Germany" },
  { code: "D2", name: "Bundesliga 2", region: "Germany" },
  { code: "I1", name: "Serie A", region: "Italy" },
  { code: "I2", name: "Serie B", region: "Italy" },
  { code: "F1", name: "Ligue 1", region: "France" },
  { code: "F2", name: "Ligue 2", region: "France" },
  { code: "N1", name: "Eredivisie", region: "Netherlands" },
  { code: "B1", name: "Belgian Pro League", region: "Belgium" },
  { code: "P1", name: "Primeira Liga", region: "Portugal" },
  { code: "T1", name: "Super Lig", region: "Turkey" },
  { code: "G1", name: "Super League Greece", region: "Greece" }
];

const footballSeasons = ["1920", "2021", "2122", "2223", "2324", "2425"];
const holdoutSeason = "2425";
const strategyCandidates = [
  { id: "market-anchor", label: "Market anchor", weights: { market: 1, rating: 0, form: 0 }, drawMin: 1, drawMarginMax: 0, drawEdgeMin: 1, overrideMarginMax: 0, overrideEdgeMin: 1, minOverrideOdds: 99, strongAnchor: 1 },
  { id: "odds-momentum-mistake", label: "Odds momentum + mistake engine", useClosingMarket: true, useRollingMistakes: true, weights: { market: 1, rating: 0, form: 0 }, drawMin: 1, drawMarginMax: 0, drawEdgeMin: 1, overrideMarginMax: 0, overrideEdgeMin: 1, minOverrideOdds: 99, strongAnchor: 1 },
  { id: "odds-momentum", label: "Odds momentum", useClosingMarket: true, weights: { market: 1, rating: 0, form: 0 }, drawMin: 1, drawMarginMax: 0, drawEdgeMin: 1, overrideMarginMax: 0, overrideEdgeMin: 1, minOverrideOdds: 99, strongAnchor: 1 },
  { id: "balanced-v1", label: "Balanced v1", weights: { market: 0.62, rating: 0.23, form: 0.15 }, drawMin: 0.28, drawMarginMax: 0.055, drawEdgeMin: 0, overrideMarginMax: 0.075, overrideEdgeMin: 0.045, minOverrideOdds: 2.35, strongAnchor: 0.62 },
  { id: "draw-watch-1", label: "Draw watch 1", weights: { market: 0.7, rating: 0.18, form: 0.12 }, drawMin: 0.285, drawMarginMax: 0.075, drawEdgeMin: 0.015, overrideMarginMax: 0.04, overrideEdgeMin: 0.06, minOverrideOdds: 3.1, strongAnchor: 0.6 },
  { id: "draw-watch-2", label: "Draw watch 2", weights: { market: 0.72, rating: 0.16, form: 0.12 }, drawMin: 0.295, drawMarginMax: 0.09, drawEdgeMin: 0, overrideMarginMax: 0.035, overrideEdgeMin: 0.07, minOverrideOdds: 3.4, strongAnchor: 0.58 },
  { id: "form-nudge", label: "Form nudge", weights: { market: 0.66, rating: 0.18, form: 0.16 }, drawMin: 0.3, drawMarginMax: 0.055, drawEdgeMin: 0.02, overrideMarginMax: 0.065, overrideEdgeMin: 0.055, minOverrideOdds: 2.8, strongAnchor: 0.6 },
  { id: "rating-nudge", label: "Rating nudge", weights: { market: 0.66, rating: 0.24, form: 0.1 }, drawMin: 0.29, drawMarginMax: 0.06, drawEdgeMin: 0.015, overrideMarginMax: 0.06, overrideEdgeMin: 0.05, minOverrideOdds: 2.9, strongAnchor: 0.6 }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize(probs) {
  const home = Number(probs.home || 0);
  const draw = Number(probs.draw || 0);
  const away = Number(probs.away || 0);
  const sum = home + draw + away;
  if (!sum) return { home: 1 / 3, draw: 1 / 3, away: 1 / 3 };
  return { home: home / sum, draw: draw / sum, away: away / sum };
}

function favorite(probs) {
  return ["home", "draw", "away"].sort((a, b) => probs[b] - probs[a])[0];
}

function brier(probs, actual) {
  return ["home", "draw", "away"].reduce((sum, side) => {
    const target = side === actual ? 1 : 0;
    return sum + (Number(probs[side] || 0) - target) ** 2;
  }, 0);
}

function emptyMetric() {
  return { graded: 0, correct: 0, accuracy: 0, brier: 0 };
}

function score(metric, probs, pick, actual) {
  metric.graded += 1;
  if (pick === actual) metric.correct += 1;
  metric.brier += brier(probs, actual);
}

function finalize(metric) {
  if (!metric.graded) return metric;
  return {
    ...metric,
    accuracy: Math.round((metric.correct / metric.graded) * 100),
    brier: Number((metric.brier / metric.graded).toFixed(3))
  };
}

function emptyAuditBucket(label, id = label) {
  return {
    id,
    label,
    matches: 0,
    universalCorrect: 0,
    marketCorrect: 0,
    universalBrier: 0,
    marketBrier: 0,
    universalProfit: 0,
    marketProfit: 0,
    overrides: 0,
    overrideHits: 0
  };
}

function settleProfit(odds, pick, actual) {
  const price = Number(odds?.[pick]);
  if (!Number.isFinite(price) || price <= 1) return 0;
  return pick === actual ? price - 1 : -1;
}

function oddsBand(price) {
  const value = Number(price);
  if (!Number.isFinite(value)) return { id: "unknown", label: "Unknown odds" };
  if (value < 1.4) return { id: "odds-1", label: "Below 1.40" };
  if (value < 1.8) return { id: "odds-2", label: "1.40 to 1.79" };
  if (value < 2.5) return { id: "odds-3", label: "1.80 to 2.49" };
  if (value < 4) return { id: "odds-4", label: "2.50 to 3.99" };
  return { id: "odds-5", label: "4.00+" };
}

function mergeAuditBucket(target, source = {}) {
  target.matches += Number(source.matches || 0);
  target.universalCorrect += Number(source.universalCorrect || 0);
  target.marketCorrect += Number(source.marketCorrect || 0);
  target.universalBrier += Number(source.universalBrier || 0);
  target.marketBrier += Number(source.marketBrier || 0);
  target.universalProfit += Number(source.universalProfit || 0);
  target.marketProfit += Number(source.marketProfit || 0);
  target.overrides += Number(source.overrides || 0);
  target.overrideHits += Number(source.overrideHits || 0);
  return target;
}

function addAudit(bucket, details) {
  bucket.matches += 1;
  if (details.universalPick === details.actual) bucket.universalCorrect += 1;
  if (details.marketPick === details.actual) bucket.marketCorrect += 1;
  bucket.universalBrier += brier(details.universalProbs, details.actual);
  bucket.marketBrier += brier(details.marketProbs, details.actual);
  bucket.universalProfit += settleProfit(details.universalOdds, details.universalPick, details.actual);
  bucket.marketProfit += settleProfit(details.marketOdds, details.marketPick, details.actual);
  if (details.override) {
    bucket.overrides += 1;
    if (details.universalPick === details.actual) bucket.overrideHits += 1;
  }
}

function finalizeAuditBucket(bucket = {}) {
  const matches = Number(bucket.matches || 0);
  const universalAccuracy = matches ? Number(((bucket.universalCorrect / matches) * 100).toFixed(1)) : 0;
  const marketAccuracy = matches ? Number(((bucket.marketCorrect / matches) * 100).toFixed(1)) : 0;
  const universalBrier = matches ? Number((bucket.universalBrier / matches).toFixed(3)) : 0;
  const marketBrier = matches ? Number((bucket.marketBrier / matches).toFixed(3)) : 0;
  const universalRoi = matches ? Number(((bucket.universalProfit / matches) * 100).toFixed(2)) : 0;
  const marketRoi = matches ? Number(((bucket.marketProfit / matches) * 100).toFixed(2)) : 0;
  return {
    id: bucket.id,
    label: bucket.label,
    matches,
    universalCorrect: bucket.universalCorrect || 0,
    marketCorrect: bucket.marketCorrect || 0,
    universalAccuracy,
    marketAccuracy,
    edge: (bucket.universalCorrect || 0) - (bucket.marketCorrect || 0),
    universalBrier,
    marketBrier,
    brierDelta: Number((marketBrier - universalBrier).toFixed(3)),
    universalRoi,
    marketRoi,
    roiDelta: Number((universalRoi - marketRoi).toFixed(2)),
    overrides: bucket.overrides || 0,
    overrideHits: bucket.overrideHits || 0,
    overrideAccuracy: bucket.overrides ? Number(((bucket.overrideHits / bucket.overrides) * 100).toFixed(1)) : 0
  };
}

function finalizeAuditMap(map, order = null) {
  const entries = Object.entries(map || {});
  const ordered = order
    ? order.map((id) => entries.find(([key]) => key === id)).filter(Boolean)
    : entries.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  return ordered.map(([, bucket]) => finalizeAuditBucket(bucket));
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

function parseFootballDataCsv(text, source) {
  const lines = String(text || "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  const index = Object.fromEntries(headers.map((header, i) => [header, i]));
  const oddKeys = index.AvgH !== undefined && index.AvgD !== undefined && index.AvgA !== undefined
    ? ["AvgH", "AvgD", "AvgA"]
    : ["B365H", "B365D", "B365A"];
  return lines.slice(1).map((line, rowIndex) => {
    const cells = parseCsvLine(line);
    const home = cells[index.HomeTeam];
    const away = cells[index.AwayTeam];
    const homeScore = Number(cells[index.FTHG]);
    const awayScore = Number(cells[index.FTAG]);
    const odds = {
      home: Number(cells[index[oddKeys[0]]]),
      draw: Number(cells[index[oddKeys[1]]]),
      away: Number(cells[index[oddKeys[2]]])
    };
    const closingOdds = index.AvgCH !== undefined && index.AvgCD !== undefined && index.AvgCA !== undefined
      ? {
          home: Number(cells[index.AvgCH]),
          draw: Number(cells[index.AvgCD]),
          away: Number(cells[index.AvgCA])
        }
      : null;
    if (!home || !away || !Number.isFinite(homeScore) || !Number.isFinite(awayScore)) return null;
    if (!Number.isFinite(odds.home) || !Number.isFinite(odds.draw) || !Number.isFinite(odds.away)) return null;
    return {
      id: rowIndex + 1,
      sport: "football",
      competition: source.name,
      season: source.seasonLabel,
      home,
      away,
      odds,
      closingOdds: closingOdds && Number.isFinite(closingOdds.home) && Number.isFinite(closingOdds.draw) && Number.isFinite(closingOdds.away)
        ? closingOdds
        : null,
      score: { home: homeScore, away: awayScore }
    };
  }).filter(Boolean);
}

function marketProbabilities(odds) {
  return normalize({ home: 1 / odds.home, draw: 1 / odds.draw, away: 1 / odds.away });
}

function record() {
  return { played: 0, points: 0, gf: 0, ga: 0, elo: 1500 };
}

function formScore(team) {
  if (!team.played) return 0;
  const pointsRate = team.points / Math.max(1, team.played * 3);
  const goalRate = (team.gf - team.ga) / Math.max(1, team.played * 2.8);
  return pointsRate * 0.72 + goalRate * 0.28;
}

function ratingProbabilities(match, records) {
  const home = records[match.home] || record();
  const away = records[match.away] || record();
  const diff = (home.elo + 55) - away.elo;
  const homeRaw = 1 / (1 + 10 ** (-diff / 420));
  const draw = clamp(0.28 - Math.abs(diff) / 3000, 0.2, 0.31);
  return normalize({ home: homeRaw * (1 - draw), draw, away: (1 - homeRaw) * (1 - draw) });
}

function formProbabilities(match, records) {
  const home = records[match.home] || record();
  const away = records[match.away] || record();
  const diff = 0.16 + (home.elo - away.elo) / 560 + (formScore(home) - formScore(away)) * 0.75;
  const homeRaw = 1 / (1 + Math.exp(-diff));
  const draw = clamp(0.29 - Math.abs(diff) * 0.045, 0.2, 0.32);
  return normalize({ home: homeRaw * (1 - draw), draw, away: (1 - homeRaw) * (1 - draw) });
}

function blend(models, weights = { market: 0.62, rating: 0.23, form: 0.15 }) {
  return normalize({
    home: models.market.home * weights.market + models.rating.home * weights.rating + models.form.home * weights.form,
    draw: models.market.draw * weights.market + models.rating.draw * weights.rating + models.form.draw * weights.form,
    away: models.market.away * weights.market + models.rating.away * weights.rating + models.form.away * weights.form
  });
}

function emptyRollingMistakes() {
  return {
    moves: 0,
    closingHits: 0,
    openingHits: 0,
    suppressed: 0,
    league: {}
  };
}

function rollingBucket(memory, leagueCode) {
  memory.league[leagueCode] ||= { moves: 0, closingHits: 0, openingHits: 0, suppressed: 0 };
  return memory.league[leagueCode];
}

function moveDelta(bucket = {}) {
  return Number(bucket.closingHits || 0) - Number(bucket.openingHits || 0);
}

function shouldSuppressMomentum(memory, leagueCode) {
  const league = memory.league?.[leagueCode] || null;
  const globalBad = memory.moves >= 50 && moveDelta(memory) <= -12;
  const leagueBad = league && league.moves >= 25 && moveDelta(league) <= -6;
  return Boolean(globalBad || leagueBad);
}

function updateRollingMistakes(memory, leagueCode, candidate, actual) {
  if (!candidate?.momentumMove) return;
  const league = rollingBucket(memory, leagueCode);
  const closingHit = candidate.closingPick === actual ? 1 : 0;
  const openingHit = candidate.openingPick === actual ? 1 : 0;
  memory.moves += 1;
  memory.closingHits += closingHit;
  memory.openingHits += openingHit;
  league.moves += 1;
  league.closingHits += closingHit;
  league.openingHits += openingHit;
  if (candidate.suppressedByMistakeEngine) {
    memory.suppressed += 1;
    league.suppressed += 1;
  }
}

function summarizeRollingMistakes(memory) {
  const league = Object.fromEntries(Object.entries(memory.league || {}).map(([code, item]) => [
    code,
    {
      moves: item.moves,
      closingHits: item.closingHits,
      openingHits: item.openingHits,
      edge: moveDelta(item),
      suppressed: item.suppressed
    }
  ]));
  return {
    source: "rolling-universal-backtest-memory",
    moves: memory.moves,
    closingHits: memory.closingHits,
    openingHits: memory.openingHits,
    edge: moveDelta(memory),
    suppressed: memory.suppressed,
    league
  };
}

function universalPick(match, models, strategy = strategyCandidates[1], rollingMistakes = null, leagueCode = "global") {
  const marketPick = favorite(models.market);
  if (strategy.useClosingMarket && models.closing) {
    const closingPick = favorite(models.closing);
    const momentumMove = closingPick !== marketPick;
    const suppressedByMistakeEngine = Boolean(strategy.useRollingMistakes && momentumMove && rollingMistakes && shouldSuppressMomentum(rollingMistakes, leagueCode));
    const pick = suppressedByMistakeEngine ? marketPick : closingPick;
    const probabilities = suppressedByMistakeEngine ? models.market : models.closing;
    const signals = [];
    if (!momentumMove) signals.push("odds momentum confirms market");
    if (momentumMove && !suppressedByMistakeEngine) signals.push("odds momentum moved away from opening market");
    if (suppressedByMistakeEngine) signals.push("mistake engine suppressed weak momentum");
    return {
      pick,
      probabilities,
      confidence: Math.round(probabilities[pick] * 100),
      signals,
      momentumMove,
      openingPick: marketPick,
      closingPick,
      suppressedByMistakeEngine,
      strategyId: strategy.id
    };
  }
  const blended = blend(models, strategy.weights);
  const blendedPick = favorite(blended);
  const sorted = ["home", "draw", "away"].sort((a, b) => models.market[b] - models.market[a]);
  const marketMargin = models.market[sorted[0]] - models.market[sorted[1]];
  const disagreement = new Set([marketPick, favorite(models.rating), favorite(models.form), blendedPick]).size;
  let pick = marketPick;
  const signals = [];
  const selectedOdds = match.odds[blendedPick];
  const edge = blended[blendedPick] - models.market[blendedPick];
  const strongAnchor = models.market[marketPick] >= strategy.strongAnchor;
  if (!strongAnchor && blendedPick !== marketPick && marketMargin <= strategy.overrideMarginMax && edge >= strategy.overrideEdgeMin && disagreement >= 2) {
    pick = blendedPick;
    signals.push("narrow-market model override");
  }
  if (!strongAnchor && blendedPick === "draw" && models.market.draw >= strategy.drawMin && marketMargin <= strategy.drawMarginMax && (blended.draw - models.market.draw) >= strategy.drawEdgeMin) {
    pick = "draw";
    signals.push("draw compression");
  }
  if (pick !== marketPick && pick !== "draw" && selectedOdds < strategy.minOverrideOdds) {
    pick = marketPick;
    signals.push("override rejected: price too short");
  }
  return { pick, probabilities: blended, confidence: Math.round(Math.max(blended[pick], models.market[pick]) * 100), signals, strategyId: strategy.id };
}

function updateRecords(records, match) {
  records[match.home] ||= record();
  records[match.away] ||= record();
  const home = records[match.home];
  const away = records[match.away];
  home.played += 1;
  away.played += 1;
  home.gf += match.score.home;
  home.ga += match.score.away;
  away.gf += match.score.away;
  away.ga += match.score.home;
  if (match.score.home === match.score.away) {
    home.points += 1;
    away.points += 1;
  } else if (match.score.home > match.score.away) {
    home.points += 3;
  } else {
    away.points += 3;
  }
  const expectedHome = 1 / (1 + 10 ** ((away.elo - (home.elo + 55)) / 420));
  const actualHome = match.score.home === match.score.away ? 0.5 : match.score.home > match.score.away ? 1 : 0;
  const margin = Math.min(2.2, Math.log(Math.abs(match.score.home - match.score.away) + 1) + 0.65);
  const change = 22 * margin * (actualHome - expectedHome);
  home.elo += change;
  away.elo -= change;
}

function actualSide(match) {
  if (match.score.home === match.score.away) return "draw";
  return match.score.home > match.score.away ? "home" : "away";
}

function runFootballDataset(source, matches, strategy = strategyCandidates[1]) {
  const records = {};
  const rollingMistakes = emptyRollingMistakes();
  const audit = {
    total: emptyAuditBucket(`${source.name} ${source.seasonLabel}`, source.id),
    oddsBands: {},
    momentum: {}
  };
  const metrics = {
    universal: emptyMetric(),
    market: emptyMetric(),
    rating: emptyMetric(),
    form: emptyMetric()
  };
  let overrides = 0;
  let overrideHits = 0;
  const trace = [];
  matches.forEach((match) => {
    const models = {
      market: marketProbabilities(match.odds),
      closing: match.closingOdds ? marketProbabilities(match.closingOdds) : null,
      rating: ratingProbabilities(match, records),
      form: formProbabilities(match, records)
    };
    const actual = actualSide(match);
    const candidate = universalPick(match, models, strategy, rollingMistakes, source.code || source.id || "global");
    const picks = {
      universal: candidate.pick,
      market: favorite(models.market),
      rating: favorite(models.rating),
      form: favorite(models.form)
    };
    const universalOdds = strategy.useClosingMarket && match.closingOdds ? match.closingOdds : match.odds;
    const marketOdds = match.odds;
    const auditDetails = {
      actual,
      universalPick: picks.universal,
      marketPick: picks.market,
      universalProbs: candidate.probabilities,
      marketProbs: models.market,
      universalOdds,
      marketOdds,
      override: picks.universal !== picks.market
    };
    const band = oddsBand(universalOdds[picks.universal]);
    const momentumKey = candidate.suppressedByMistakeEngine ? "suppressed" : candidate.momentumMove ? "moved" : strategy.useClosingMarket ? "confirmed" : "model";
    const momentumLabel = {
      confirmed: "Odds move confirmed opening market",
      moved: "Odds move changed the pick",
      suppressed: "Mistake engine suppressed the move",
      model: "Model blend without closing odds"
    }[momentumKey] || momentumKey;
    audit.oddsBands[band.id] ||= emptyAuditBucket(band.label, band.id);
    audit.momentum[momentumKey] ||= emptyAuditBucket(momentumLabel, momentumKey);
    addAudit(audit.total, auditDetails);
    addAudit(audit.oddsBands[band.id], auditDetails);
    addAudit(audit.momentum[momentumKey], auditDetails);
    score(metrics.universal, candidate.probabilities, picks.universal, actual);
    score(metrics.market, models.market, picks.market, actual);
    score(metrics.rating, models.rating, picks.rating, actual);
    score(metrics.form, models.form, picks.form, actual);
    if (picks.universal !== picks.market) {
      overrides += 1;
      if (picks.universal === actual) overrideHits += 1;
    }
    if (trace.length < 16) {
      trace.push({
        competition: source.name,
        season: source.seasonLabel,
        match: `${match.home} vs ${match.away}`,
        score: `${match.score.home}-${match.score.away}`,
        actual,
        picks,
        confidence: candidate.confidence,
        signals: candidate.signals,
        odds: match.odds
      });
    }
    if (strategy.useRollingMistakes) {
      updateRollingMistakes(rollingMistakes, source.code || source.id || "global", candidate, actual);
    }
    updateRecords(records, match);
  });
  Object.keys(metrics).forEach((key) => {
    metrics[key] = finalize(metrics[key]);
  });
  return {
    id: source.id,
    sport: "football",
    competition: source.name,
    season: source.seasonLabel,
    region: source.region,
    source: source.url,
    matches: matches.length,
    metrics,
    strategy: { id: strategy.id, label: strategy.label },
    audit,
    mistakeEngine: strategy.useRollingMistakes ? summarizeRollingMistakes(rollingMistakes) : null,
    edge: {
      universalMinusMarket: metrics.universal.correct - metrics.market.correct,
      overrides,
      overrideHits,
      overrideAccuracy: overrides ? Math.round((overrideHits / overrides) * 100) : 0
    },
    trace
  };
}

function combineFootballRuns(runs) {
  const metrics = {
    universal: emptyMetric(),
    market: emptyMetric(),
    rating: emptyMetric(),
    form: emptyMetric()
  };
  const edge = { overrides: 0, overrideHits: 0 };
  const mistakeEngine = emptyRollingMistakes();
  const audit = {
    overall: emptyAuditBucket("All matches", "overall"),
    bySeason: {},
    byLeague: {},
    byOddsBand: {},
    byMomentum: {}
  };
  runs.forEach((run) => {
    Object.keys(metrics).forEach((key) => {
      metrics[key].graded += run.metrics[key].graded;
      metrics[key].correct += run.metrics[key].correct;
      metrics[key].brier += run.metrics[key].brier * run.metrics[key].graded;
    });
    edge.overrides += run.edge.overrides;
    edge.overrideHits += run.edge.overrideHits;
    if (run.audit) {
      mergeAuditBucket(audit.overall, run.audit.total);
      audit.bySeason[run.season] ||= emptyAuditBucket(run.season, run.season);
      audit.byLeague[run.competition] ||= emptyAuditBucket(run.competition, run.competition);
      mergeAuditBucket(audit.bySeason[run.season], run.audit.total);
      mergeAuditBucket(audit.byLeague[run.competition], run.audit.total);
      Object.entries(run.audit.oddsBands || {}).forEach(([id, bucket]) => {
        audit.byOddsBand[id] ||= emptyAuditBucket(bucket.label || id, id);
        mergeAuditBucket(audit.byOddsBand[id], bucket);
      });
      Object.entries(run.audit.momentum || {}).forEach(([id, bucket]) => {
        audit.byMomentum[id] ||= emptyAuditBucket(bucket.label || id, id);
        mergeAuditBucket(audit.byMomentum[id], bucket);
      });
    }
    if (run.mistakeEngine) {
      mistakeEngine.moves += Number(run.mistakeEngine.moves || 0);
      mistakeEngine.closingHits += Number(run.mistakeEngine.closingHits || 0);
      mistakeEngine.openingHits += Number(run.mistakeEngine.openingHits || 0);
      mistakeEngine.suppressed += Number(run.mistakeEngine.suppressed || 0);
      Object.entries(run.mistakeEngine.league || {}).forEach(([code, item]) => {
        const bucket = rollingBucket(mistakeEngine, code);
        bucket.moves += Number(item.moves || 0);
        bucket.closingHits += Number(item.closingHits || 0);
        bucket.openingHits += Number(item.openingHits || 0);
        bucket.suppressed += Number(item.suppressed || 0);
      });
    }
  });
  Object.keys(metrics).forEach((key) => {
    metrics[key] = finalize(metrics[key]);
  });
  edge.universalMinusMarket = metrics.universal.correct - metrics.market.correct;
  edge.overrideAccuracy = edge.overrides ? Math.round((edge.overrideHits / edge.overrides) * 100) : 0;
  return {
    sport: "football",
    label: "European football leagues and divisions",
    matches: metrics.universal.graded,
    datasets: runs.length,
    strategy: runs[0]?.strategy || null,
    metrics,
    edge,
    mistakeEngine: mistakeEngine.moves ? summarizeRollingMistakes(mistakeEngine) : null,
    trace: runs.flatMap((run) => run.trace).slice(0, 40),
    stabilityAudit: {
      overall: finalizeAuditBucket(audit.overall),
      bySeason: finalizeAuditMap(audit.bySeason, footballSeasons.map((season) => seasonLabels[season])),
      byLeague: finalizeAuditMap(audit.byLeague),
      byOddsBand: finalizeAuditMap(audit.byOddsBand, ["odds-1", "odds-2", "odds-3", "odds-4", "odds-5", "unknown"]),
      byMomentum: finalizeAuditMap(audit.byMomentum, ["confirmed", "moved", "suppressed", "model"])
    },
    stability: runs.map((run) => ({
      id: run.id,
      competition: run.competition,
      season: run.season,
      matches: run.matches,
      universalAccuracy: run.metrics.universal.accuracy,
      marketAccuracy: run.metrics.market.accuracy,
      edge: run.edge.universalMinusMarket
    }))
  };
}

function selectStrategy(datasetRecords) {
  const evaluated = strategyCandidates.map((strategy) => {
    const runs = datasetRecords.map((item) => runFootballDataset(item.source, item.matches, strategy));
    const trainRuns = runs.filter((run) => run.season !== seasonLabels[holdoutSeason]);
    const holdoutRuns = runs.filter((run) => run.season === seasonLabels[holdoutSeason]);
    const train = combineFootballRuns(trainRuns);
    const holdout = combineFootballRuns(holdoutRuns);
    return {
      strategy: { id: strategy.id, label: strategy.label },
      train: {
        matches: train.matches,
        edge: train.edge.universalMinusMarket,
        universalAccuracy: train.metrics.universal.accuracy,
        marketAccuracy: train.metrics.market.accuracy,
        brierDelta: Number((train.metrics.market.brier - train.metrics.universal.brier).toFixed(3))
      },
      holdout: {
        matches: holdout.matches,
        edge: holdout.edge.universalMinusMarket,
        universalAccuracy: holdout.metrics.universal.accuracy,
        marketAccuracy: holdout.metrics.market.accuracy,
        brierDelta: Number((holdout.metrics.market.brier - holdout.metrics.universal.brier).toFixed(3))
      },
      runs
    };
  });
  const deployable = evaluated.filter((item) => item.train.edge > 0 && item.train.brierDelta >= 0);
  const selected = deployable.length ? [...deployable].sort((a, b) => {
    if (b.train.edge !== a.train.edge) return b.train.edge - a.train.edge;
    return b.train.brierDelta - a.train.brierDelta;
  })[0] : evaluated.find((item) => item.strategy.id === "market-anchor") || evaluated[0];
  const bestHoldout = [...evaluated].sort((a, b) => b.holdout.edge - a.holdout.edge)[0] || evaluated[0];
  return {
    selected,
    deploymentGate: deployable.length
      ? "通过：所选策略在训练集跑赢市场，且没有恶化 Brier 概率校准。"
      : "未通过：目前没有候选策略能在训练集跑赢市场并保持 Brier 校准不变差，因此回退到市场锚定层。",
    bestHoldout: {
      strategy: bestHoldout.strategy,
      train: bestHoldout.train,
      holdout: bestHoldout.holdout,
      note: "Research reference only. This is selected after seeing the holdout and must not be treated as the deployed strategy."
    },
    candidates: evaluated.map((item) => ({
      strategy: item.strategy,
      train: item.train,
      holdout: item.holdout
    }))
  };
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "PAUL Universal Lab backtest" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function runFootballBacktest(options = {}) {
  if (typeof fetch !== "function") throw new Error("fetch is not available in this runtime");
  const seasons = options.seasons?.length ? options.seasons : footballSeasons;
  const leagueCodes = options.leagues?.length ? options.leagues : footballLeagues.map((league) => league.code);
  const sources = seasons.flatMap((season) => footballLeagues
    .filter((league) => leagueCodes.includes(league.code))
    .map((league) => ({
      ...league,
      season,
      seasonLabel: seasonLabels[season] || season,
      id: `${league.code}-${season}`,
      url: `https://www.football-data.co.uk/mmz4281/${season}/${league.code}.csv`
    })));
  const settled = await Promise.all(sources.map(async (source) => {
    try {
      const text = await fetchText(source.url);
      const matches = parseFootballDataCsv(text, source);
      if (matches.length < 120) throw new Error(`only ${matches.length} usable rows`);
      return { dataset: { source, matches } };
    } catch (error) {
      return { error: { id: source.id, competition: source.name, season: source.seasonLabel, error: error.message } };
    }
  }));
  const datasetRecords = settled.map((item) => item.dataset).filter(Boolean);
  const strategyLab = selectStrategy(datasetRecords);
  const runs = strategyLab.selected.runs;
  const errors = settled.map((item) => item.error).filter(Boolean);
  return {
    status: runs.length ? "ok" : "error",
    generatedAt: new Date().toISOString(),
    pool: "universal-football-v1",
    isolation: "Independent from World Cup predictions, proof records, and calibration.",
    dataPolicy: "Public Football-Data CSV opening/closing odds and results from 18 European leagues/divisions; no Chinese football leagues included.",
    aggregate: combineFootballRuns(runs),
    split: {
      trainSeasons: footballSeasons.filter((season) => season !== holdoutSeason).map((season) => seasonLabels[season]),
      holdoutSeason: seasonLabels[holdoutSeason],
      selectedBy: "highest training edge, then Brier improvement. Holdout is not used to select the deployed strategy."
    },
    strategyLab: {
      deploymentGate: strategyLab.deploymentGate,
      selected: {
        strategy: strategyLab.selected.strategy,
        train: strategyLab.selected.train,
        holdout: strategyLab.selected.holdout
      },
      bestHoldout: strategyLab.bestHoldout,
      candidates: strategyLab.candidates
    },
    runs,
    errors
  };
}

async function runUniversalBacktest(options = {}) {
  const sport = options.sport || "football";
  if (sport === "football") return runFootballBacktest(options);
  return {
    status: "not-configured",
    generatedAt: new Date().toISOString(),
    pool: `universal-${sport}-v1`,
    sport,
    isolation: "Separate sport pool. Not mixed with football or World Cup records.",
    message: "No trusted historical odds/results source is configured for this sport yet.",
    requiredData: sport === "basketball"
      ? ["moneyline odds", "spread odds", "final scores", "injury/rest context"]
      : sport === "baseball"
        ? ["moneyline odds", "run line", "final scores", "starting pitchers", "bullpen/weather context"]
        : ["market odds/probabilities", "clear result definition", "close time", "official result source"]
  };
}

module.exports = {
  runUniversalBacktest
};
