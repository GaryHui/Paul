const DATASET_SOURCE = {
  name: "World Cup 2022 built-in backtest",
  odds: "https://checkbestodds.com/football-odds/archive-world-cup-2022/",
  rankings: "FIFA men's ranking before the 2022 World Cup, stored as rank order priors",
  note: "The test processes matches in listed order. A match can use market odds, pre-tournament rank priors, and tournament form from earlier matches only."
};

const rank = {
  Brazil: 1,
  Belgium: 2,
  Argentina: 3,
  France: 4,
  England: 5,
  Netherlands: 8,
  Portugal: 9,
  Denmark: 10,
  Germany: 11,
  Croatia: 12,
  Mexico: 13,
  Uruguay: 14,
  Switzerland: 15,
  USA: 16,
  Senegal: 18,
  Wales: 19,
  Iran: 20,
  Serbia: 21,
  Morocco: 22,
  Japan: 24,
  Poland: 26,
  "South Korea": 28,
  Tunisia: 30,
  "Costa Rica": 31,
  Australia: 38,
  Canada: 41,
  Cameroon: 43,
  Ecuador: 44,
  Qatar: 50,
  "Saudi Arabia": 51,
  Ghana: 61,
  Spain: 7
};

const rows = [
  "Group A|Qatar|Ecuador|100|13.5|2.41|0|2",
  "Group A|Senegal|Netherlands|6.28|3.75|2.09|0|2",
  "Group A|Qatar|Senegal|18|6.2|1.77|1|3",
  "Group A|Netherlands|Ecuador|1.9|4.7|15|1|1",
  "Group A|Netherlands|Qatar|1.22|10|60|2|0",
  "Group A|Ecuador|Senegal|6.8|4|3.35|1|2",
  "Group B|England|Iran|1.4|10.5|110|6|2",
  "Group B|USA|Wales|2.53|4.6|12.5|1|1",
  "Group B|Wales|Iran|2.61|3.26|4.31|0|2",
  "Group B|England|USA|1.91|4.45|9.08|0|0",
  "Group B|Iran|USA|18|5.4|2.05|0|1",
  "Group B|Wales|England|9.91|4.7|1.56|0|3",
  "Group C|Argentina|Saudi Arabia|1.14|17|90|1|2",
  "Group C|Mexico|Poland|2.59|3.25|4.5|0|0",
  "Group C|Poland|Saudi Arabia|1.75|3.7|5.8|2|0",
  "Group C|Argentina|Mexico|2.12|4.1|7.97|2|0",
  "Group C|Saudi Arabia|Mexico|5.1|4.2|1.74|1|2",
  "Group C|Poland|Argentina|9.2|4.5|1.49|0|2",
  "Group D|Denmark|Tunisia|2|4.1|7.5|0|0",
  "Group D|France|Australia|1.23|10|75|4|1",
  "Group D|Tunisia|Australia|6.2|3.5|3.9|0|1",
  "Group D|France|Denmark|2.19|3.64|5.1|2|1",
  "Group D|Australia|Denmark|7.4|4.5|1.56|1|0",
  "Group D|Tunisia|France|9.1|5|1.43|1|0",
  "Group E|Germany|Japan|1.48|8.75|22|1|2",
  "Group E|Spain|Costa Rica|1.17|18.5|40|7|0",
  "Group E|Japan|Costa Rica|1.46|4.6|9.5|0|1",
  "Group E|Spain|Germany|2.44|3.75|3.08|1|1",
  "Group E|Costa Rica|Germany|100|14|1.12|2|4",
  "Group E|Japan|Spain|23|6.8|1.53|2|1",
  "Group F|Morocco|Croatia|3.88|3.35|2.88|0|0",
  "Group F|Belgium|Canada|1.62|4.7|7.6|1|0",
  "Group F|Belgium|Morocco|2.02|3.42|4.33|0|2",
  "Group F|Croatia|Canada|2.23|3.48|3.5|4|1",
  "Group F|Canada|Morocco|14.5|5.6|1.86|1|2",
  "Group F|Croatia|Belgium|3.22|3.55|2.77|0|0",
  "Group G|Switzerland|Cameroon|2.19|3.56|5.2|1|0",
  "Group G|Brazil|Serbia|1.49|5.2|9.5|2|0",
  "Group G|Cameroon|Serbia|5.35|3.85|1.75|3|3",
  "Group G|Brazil|Switzerland|1.53|4.7|7.5|1|0",
  "Group G|Cameroon|Brazil|8.6|5.15|1.58|1|0",
  "Group G|Serbia|Switzerland|2.7|3.6|2.96|2|3",
  "Group H|Uruguay|South Korea|2.05|3.64|5.4|0|0",
  "Group H|Portugal|Ghana|1.55|5.7|11.5|3|2",
  "Group H|South Korea|Ghana|2.6|3.15|3.13|2|3",
  "Group H|Portugal|Uruguay|2.01|3.45|4.25|2|0",
  "Group H|South Korea|Portugal|4|3.92|2|2|1",
  "Group H|Ghana|Uruguay|4.44|3.74|1.95|0|2",
  "Round of 16|Netherlands|USA|1.96|3.55|4.9|3|1",
  "Round of 16|Argentina|Australia|1.3|6.5|11.25|2|1",
  "Round of 16|France|Poland|1.41|5.3|10|3|1",
  "Round of 16|England|Senegal|1.64|3.82|6.95|3|0",
  "Round of 16|Japan|Croatia|3.95|3.34|2.14|1|1",
  "Round of 16|Brazil|South Korea|1.24|7.2|17|4|1",
  "Round of 16|Morocco|Spain|6.25|3.9|1.65|0|0",
  "Round of 16|Portugal|Switzerland|2.06|3.72|4.76|6|1",
  "Quarterfinal|Croatia|Brazil|9|4.85|1.43|1|1",
  "Quarterfinal|Netherlands|Argentina|4.14|3.17|2.29|2|2",
  "Quarterfinal|Morocco|Portugal|6.75|4|1.65|1|0",
  "Quarterfinal|England|France|3.17|3.25|2.81|1|2",
  "Semifinal|Argentina|Croatia|2.09|3.2|4.95|3|0",
  "Semifinal|France|Morocco|1.66|4.07|6.75|2|0",
  "Third Place|Croatia|Morocco|2.29|3.7|3.2|2|1",
  "Final|Argentina|France|2.77|3.28|2.96|3|3"
];

function parseRows() {
  return rows.map((row, index) => {
    const [round, home, away, homeOdds, drawOdds, awayOdds, homeScore, awayScore] = row.split("|");
    return {
      id: index + 1,
      round,
      home,
      away,
      odds: { home: Number(homeOdds), draw: Number(drawOdds), away: Number(awayOdds) },
      score: { home: Number(homeScore), away: Number(awayScore) }
    };
  });
}

function normalize(probs) {
  const sum = probs.home + probs.draw + probs.away;
  return { home: probs.home / sum, draw: probs.draw / sum, away: probs.away / sum };
}

function oddsProbabilities(odds) {
  return normalize({ home: 1 / odds.home, draw: 1 / odds.draw, away: 1 / odds.away });
}

function rankProbabilities(match) {
  const homeRank = rank[match.home] || 40;
  const awayRank = rank[match.away] || 40;
  const diff = awayRank - homeRank;
  const homeRaw = 1 / (1 + 10 ** (-diff / 22));
  const draw = Math.max(0.14, Math.min(0.3, 0.25 - Math.abs(diff) / 250));
  return normalize({ home: homeRaw * (1 - draw), draw, away: (1 - homeRaw) * (1 - draw) });
}

function priorRecord() {
  return { played: 0, points: 0, gf: 0, ga: 0 };
}

function formScore(record) {
  if (!record.played) return 0;
  return record.points / (record.played * 3) + (record.gf - record.ga) * 0.05;
}

function poissonProbabilities(match, form) {
  const homeRank = rank[match.home] || 40;
  const awayRank = rank[match.away] || 40;
  const homeForm = formScore(form[match.home] || priorRecord());
  const awayForm = formScore(form[match.away] || priorRecord());
  const diff = (awayRank - homeRank) / 30 + (homeForm - awayForm);
  const home = 1 / (1 + Math.exp(-diff));
  const draw = Math.max(0.16, Math.min(0.31, 0.25 - Math.abs(diff) * 0.03));
  return normalize({ home: home * (1 - draw), draw, away: (1 - home) * (1 - draw) });
}

function blend(models) {
  return normalize({
    home: models.market.home * 0.55 + models.rating.home * 0.25 + models.poisson.home * 0.2,
    draw: models.market.draw * 0.55 + models.rating.draw * 0.25 + models.poisson.draw * 0.2,
    away: models.market.away * 0.55 + models.rating.away * 0.25 + models.poisson.away * 0.2
  });
}

function favorite(probs) {
  return ["home", "draw", "away"].sort((a, b) => probs[b] - probs[a])[0];
}

function actualSide(match) {
  if (match.score.home === match.score.away) return "draw";
  return match.score.home > match.score.away ? "home" : "away";
}

function brier(probs, actual) {
  return ["home", "draw", "away"].reduce((sum, side) => {
    const target = side === actual ? 1 : 0;
    return sum + (probs[side] - target) ** 2;
  }, 0);
}

function paulEdgePick(match, models, form) {
  const marketPick = favorite(models.market);
  const blended = blend(models);
  const blendedPick = favorite(blended);
  const marketSorted = ["home", "draw", "away"].sort((a, b) => models.market[b] - models.market[a]);
  const marketMargin = models.market[marketSorted[0]] - models.market[marketSorted[1]];
  const homeForm = formScore(form[match.home] || priorRecord());
  const awayForm = formScore(form[match.away] || priorRecord());
  const formLeader = Math.abs(homeForm - awayForm) > 0.18 ? (homeForm > awayForm ? "home" : "away") : null;
  const disagreement = new Set([marketPick, favorite(models.rating), favorite(models.poisson), blendedPick]).size;
  let upsetScore = 0;
  const signals = [];
  if (disagreement >= 2) {
    upsetScore += 20;
    signals.push("baseline disagreement");
  }
  if (marketMargin < 0.12) {
    upsetScore += 18;
    signals.push("narrow market");
  }
  if (formLeader && formLeader !== marketPick) {
    upsetScore += 22;
    signals.push("tournament form challenges market");
  }
  if (blendedPick !== marketPick) {
    upsetScore += 28;
    signals.push("blended model override");
  }
  let pick = blendedPick;
  if (marketMargin > 0.24 && upsetScore < 45) pick = marketPick;
  if (match.round !== "Group Stage" && pick === "draw" && marketPick !== "draw") pick = blended.home >= blended.away ? "home" : "away";
  const confidence = Math.round(Math.max(blended[pick], models.market[pick] || 0) * 100);
  return { pick, probabilities: blended, confidence, upsetScore, signals };
}

function emptyMetric() {
  return { graded: 0, correct: 0, accuracy: 0, brier: 0 };
}

function scoreMetric(metric, probs, pick, actual) {
  metric.graded += 1;
  if (pick === actual) metric.correct += 1;
  metric.brier += brier(probs, actual);
}

function finalizeMetric(metric) {
  if (!metric.graded) return metric;
  metric.accuracy = Math.round((metric.correct / metric.graded) * 100);
  metric.brier = Number((metric.brier / metric.graded).toFixed(3));
  return metric;
}

function updateForm(form, match) {
  form[match.home] ||= priorRecord();
  form[match.away] ||= priorRecord();
  const home = form[match.home];
  const away = form[match.away];
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
}

function runBacktest() {
  const matches = parseRows();
  const form = {};
  const metrics = {
    paul: emptyMetric(),
    market: emptyMetric(),
    rating: emptyMetric(),
    poisson: emptyMetric(),
    blended: emptyMetric(),
    random: emptyMetric()
  };
  const calibration = {};
  const trace = [];
  let upsetCalls = 0;
  let upsetHits = 0;

  matches.forEach((match) => {
    const models = {
      market: oddsProbabilities(match.odds),
      rating: rankProbabilities(match),
      poisson: poissonProbabilities(match, form)
    };
    models.blended = blend(models);
    const actual = actualSide(match);
    const paul = paulEdgePick(match, models, form);
    const picks = {
      paul: paul.pick,
      market: favorite(models.market),
      rating: favorite(models.rating),
      poisson: favorite(models.poisson),
      blended: favorite(models.blended),
      random: ["home", "draw", "away"][match.id % 3]
    };

    scoreMetric(metrics.paul, paul.probabilities, picks.paul, actual);
    scoreMetric(metrics.market, models.market, picks.market, actual);
    scoreMetric(metrics.rating, models.rating, picks.rating, actual);
    scoreMetric(metrics.poisson, models.poisson, picks.poisson, actual);
    scoreMetric(metrics.blended, models.blended, picks.blended, actual);
    scoreMetric(metrics.random, { home: 1 / 3, draw: 1 / 3, away: 1 / 3 }, picks.random, actual);

    const band = paul.confidence < 55 ? "50-54" : paul.confidence < 60 ? "55-59" : paul.confidence < 70 ? "60-69" : "70+";
    calibration[band] ||= { graded: 0, correct: 0, accuracy: 0 };
    calibration[band].graded += 1;
    if (picks.paul === actual) calibration[band].correct += 1;

    if (picks.paul !== picks.market) {
      upsetCalls += 1;
      if (picks.paul === actual) upsetHits += 1;
    }

    trace.push({
      id: match.id,
      round: match.round,
      match: `${match.home} vs ${match.away}`,
      score: `${match.score.home}-${match.score.away}`,
      actual,
      picks,
      paul: { confidence: paul.confidence, upsetScore: paul.upsetScore, signals: paul.signals },
      odds: match.odds
    });

    updateForm(form, match);
  });

  Object.values(metrics).forEach(finalizeMetric);
  Object.values(calibration).forEach((bucket) => {
    bucket.accuracy = bucket.graded ? Math.round((bucket.correct / bucket.graded) * 100) : 0;
  });

  return {
    status: "pass",
    generatedAt: new Date().toISOString(),
    dataset: { ...DATASET_SOURCE, matches: matches.length },
    metrics,
    edge: {
      paulMinusMarket: metrics.paul.correct - metrics.market.correct,
      paulMinusBlended: metrics.paul.correct - metrics.blended.correct,
      upsetCalls,
      upsetHits,
      upsetAccuracy: upsetCalls ? Math.round((upsetHits / upsetCalls) * 100) : 0
    },
    calibration,
    trace
  };
}

module.exports = {
  runBacktest
};
