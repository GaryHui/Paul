const seasonLabels = {
  2122: "2021-22",
  2223: "2022-23",
  2324: "2023-24",
  2425: "2024-25"
};

const footballLeagues = [
  { code: "E0", name: "Premier League", region: "England" },
  { code: "SP1", name: "La Liga", region: "Spain" },
  { code: "D1", name: "Bundesliga", region: "Germany" },
  { code: "I1", name: "Serie A", region: "Italy" },
  { code: "F1", name: "Ligue 1", region: "France" }
];

const footballSeasons = ["2122", "2223", "2324", "2425"];

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

function universalPick(match, models) {
  const marketPick = favorite(models.market);
  const blended = blend(models);
  const blendedPick = favorite(blended);
  const sorted = ["home", "draw", "away"].sort((a, b) => models.market[b] - models.market[a]);
  const marketMargin = models.market[sorted[0]] - models.market[sorted[1]];
  const disagreement = new Set([marketPick, favorite(models.rating), favorite(models.form), blendedPick]).size;
  let pick = marketPick;
  const signals = [];
  const selectedOdds = match.odds[blendedPick];
  const edge = blended[blendedPick] - models.market[blendedPick];
  if (blendedPick !== marketPick && marketMargin <= 0.075 && edge >= 0.045 && disagreement >= 2) {
    pick = blendedPick;
    signals.push("narrow-market model override");
  }
  if (blendedPick === "draw" && models.market.draw >= 0.28 && marketMargin <= 0.055) {
    pick = "draw";
    signals.push("draw compression");
  }
  if (pick !== marketPick && pick !== "draw" && selectedOdds < 2.35) {
    pick = marketPick;
    signals.push("override rejected: price too short");
  }
  return { pick, probabilities: blended, confidence: Math.round(Math.max(blended[pick], models.market[pick]) * 100), signals };
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

function runFootballDataset(source, matches) {
  const records = {};
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
      rating: ratingProbabilities(match, records),
      form: formProbabilities(match, records)
    };
    const actual = actualSide(match);
    const candidate = universalPick(match, models);
    const picks = {
      universal: candidate.pick,
      market: favorite(models.market),
      rating: favorite(models.rating),
      form: favorite(models.form)
    };
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
  runs.forEach((run) => {
    Object.keys(metrics).forEach((key) => {
      metrics[key].graded += run.metrics[key].graded;
      metrics[key].correct += run.metrics[key].correct;
      metrics[key].brier += run.metrics[key].brier * run.metrics[key].graded;
    });
    edge.overrides += run.edge.overrides;
    edge.overrideHits += run.edge.overrideHits;
  });
  Object.keys(metrics).forEach((key) => {
    metrics[key] = finalize(metrics[key]);
  });
  edge.universalMinusMarket = metrics.universal.correct - metrics.market.correct;
  edge.overrideAccuracy = edge.overrides ? Math.round((edge.overrideHits / edge.overrides) * 100) : 0;
  return {
    sport: "football",
    label: "European top-five football leagues",
    matches: metrics.universal.graded,
    datasets: runs.length,
    metrics,
    edge,
    trace: runs.flatMap((run) => run.trace).slice(0, 40),
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
      if (matches.length < 200) throw new Error(`only ${matches.length} usable rows`);
      return { run: runFootballDataset(source, matches) };
    } catch (error) {
      return { error: { id: source.id, competition: source.name, season: source.seasonLabel, error: error.message } };
    }
  }));
  const runs = settled.map((item) => item.run).filter(Boolean);
  const errors = settled.map((item) => item.error).filter(Boolean);
  return {
    status: runs.length ? "ok" : "error",
    generatedAt: new Date().toISOString(),
    pool: "universal-football-v1",
    isolation: "Independent from World Cup predictions, proof records, and calibration.",
    dataPolicy: "Public Football-Data CSV odds/results only; no Chinese football leagues included.",
    aggregate: combineFootballRuns(runs),
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
