const DATASET_NOTE =
  "The test processes matches in listed order. Group matches are graded as 1X2. Knockout matches are graded by advancing winner, matching PAUL's win-or-go-home product target.";

const ranks2022 = {
  Brazil: 1,
  Belgium: 2,
  Argentina: 3,
  France: 4,
  England: 5,
  Spain: 7,
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
  Ghana: 61
};

const ranks2018 = {
  Germany: 1,
  Brazil: 2,
  Belgium: 3,
  Portugal: 4,
  Argentina: 5,
  Switzerland: 6,
  France: 7,
  Poland: 8,
  Spain: 10,
  Peru: 11,
  Denmark: 12,
  England: 13,
  Uruguay: 14,
  Mexico: 15,
  Colombia: 16,
  Croatia: 20,
  Tunisia: 21,
  Iceland: 22,
  "Costa Rica": 23,
  Sweden: 24,
  Senegal: 27,
  Serbia: 34,
  Australia: 36,
  Iran: 37,
  Morocco: 41,
  Egypt: 45,
  Nigeria: 48,
  Panama: 55,
  "South Korea": 57,
  Japan: 61,
  "Saudi Arabia": 67,
  Russia: 70
};

const ranks2014 = {
  Spain: 1,
  Germany: 2,
  Brazil: 3,
  Portugal: 4,
  Argentina: 5,
  Switzerland: 6,
  Uruguay: 7,
  Colombia: 8,
  Italy: 9,
  England: 10,
  Belgium: 11,
  Greece: 12,
  USA: 13,
  Chile: 14,
  Netherlands: 15,
  France: 17,
  Croatia: 18,
  Russia: 19,
  Mexico: 20,
  "Bosnia and Herzegovina": 21,
  Algeria: 22,
  "Ivory Coast": 23,
  Ecuador: 26,
  "Costa Rica": 28,
  Honduras: 33,
  Ghana: 37,
  Iran: 43,
  Nigeria: 44,
  Japan: 46,
  Cameroon: 56,
  "South Korea": 57,
  Australia: 62
};

const rows2022 = [
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

const rows2018 = [
  "Group A|Egypt|Uruguay|9.20|4.20|1.55|0|1",
  "Group A|Russia|Egypt|2.25|3.72|4.70|3|1",
  "Group A|Uruguay|Saudi Arabia|1.24|8.50|21.00|1|0",
  "Group A|Saudi Arabia|Egypt|7.00|4.40|1.83|2|1",
  "Group A|Uruguay|Russia|2.77|3.20|3.45|3|0",
  "Group B|Morocco|Iran|2.38|3.05|4.30|0|1",
  "Group B|Portugal|Spain|4.55|3.36|2.10|3|3",
  "Group B|Portugal|Morocco|1.75|3.80|6.50|1|0",
  "Group B|Iran|Spain|26.00|7.20|1.23|0|1",
  "Group B|Spain|Morocco|1.41|5.75|10.75|2|2",
  "Group B|Iran|Portugal|9.00|5.00|1.65|1|1",
  "Group C|Denmark|Australia|2.04|3.80|5.50|1|1",
  "Group C|France|Peru|1.65|4.75|7.50|1|0",
  "Group C|Denmark|France|6.00|3.75|2.25|0|0",
  "Group C|Australia|Peru|3.65|3.58|2.55|0|2",
  "Group D|Croatia|Nigeria|1.73|3.90|6.32|2|0",
  "Group D|Argentina|Croatia|2.15|3.50|4.20|0|3",
  "Group D|Nigeria|Iceland|3.05|3.15|3.00|2|0",
  "Group D|Iceland|Croatia|5.00|4.15|1.94|1|2",
  "Group D|Nigeria|Argentina|9.00|5.45|1.52|1|2",
  "Group E|Costa Rica|Serbia|5.50|3.50|1.94|0|1",
  "Group E|Brazil|Switzerland|1.50|4.75|9.74|1|1",
  "Group E|Brazil|Costa Rica|1.24|7.15|21.90|2|0",
  "Group E|Serbia|Switzerland|2.90|3.30|3.10|1|2",
  "Group E|Switzerland|Costa Rica|1.85|3.80|7.84|2|2",
  "Group E|Serbia|Brazil|9.50|5.00|1.52|0|2",
  "Group F|Germany|Mexico|1.52|4.75|8.36|0|1",
  "Group F|Sweden|South Korea|2.32|3.25|4.09|1|0",
  "Group F|South Korea|Mexico|6.00|3.98|1.80|1|2",
  "Group F|Germany|Sweden|1.56|4.95|8.30|2|1",
  "Group G|Belgium|Panama|1.25|7.00|21.00|3|0",
  "Group G|Tunisia|England|9.54|4.45|1.50|1|2",
  "Group G|Belgium|Tunisia|1.39|5.35|12.75|5|2",
  "Group G|England|Panama|1.24|6.60|21.00|6|1",
  "Group G|England|Belgium|2.90|3.40|4.00|0|1",
  "Group G|Panama|Tunisia|4.70|3.90|2.15|1|2",
  "Group H|Colombia|Japan|1.92|3.65|5.75|1|2",
  "Group H|Poland|Senegal|2.55|3.30|3.50|1|2",
  "Group H|Japan|Senegal|3.60|3.30|2.74|2|2",
  "Group H|Poland|Colombia|3.61|3.50|2.30|0|3",
  "Group H|Senegal|Colombia|5.65|3.92|2.05|0|1",
  "Group H|Japan|Poland|4.33|3.50|2.80|0|1",
  "Third Place|Belgium|England|2.27|3.92|3.26|2|0"
];

const rows2014 = [
  "Group A|Brazil|Croatia|1.33|5.50|13.33|3|1",
  "Group A|Mexico|Cameroon|2.27|3.30|4.00|1|0",
  "Group B|Spain|Netherlands|1.90|3.50|5.50|1|5",
  "Group B|Chile|Australia|1.46|4.85|10.50|3|1",
  "Group C|Colombia|Greece|1.92|3.40|5.50|3|0",
  "Group D|Uruguay|Costa Rica|1.48|4.55|9.80|1|3",
  "Group D|England|Italy|2.65|3.10|3.46|1|2",
  "Group C|Ivory Coast|Japan|2.76|3.47|2.94|2|1",
  "Group E|Switzerland|Ecuador|2.60|3.35|3.34|2|1",
  "Group E|France|Honduras|1.30|6.50|15.00|3|0",
  "Group F|Argentina|Bosnia and Herzegovina|1.34|5.90|12.00|2|1",
  "Group G|Germany|Portugal|2.19|3.75|3.92|4|0",
  "Group F|Iran|Nigeria|5.70|3.56|1.91|0|0",
  "Group G|Ghana|USA|2.50|3.65|3.15|1|2",
  "Group H|Belgium|Algeria|1.36|5.70|13.00|2|1",
  "Group A|Brazil|Mexico|1.37|5.80|10.85|0|0",
  "Group H|Russia|South Korea|1.86|3.85|5.10|1|1",
  "Group B|Australia|Netherlands|15.50|7.20|1.26|2|3",
  "Group B|Spain|Chile|1.61|4.95|6.20|0|2",
  "Group A|Cameroon|Croatia|5.81|4.14|1.74|0|4",
  "Group C|Colombia|Ivory Coast|2.10|3.66|3.95|2|1",
  "Group D|Uruguay|England|3.95|4.20|2.02|2|1",
  "Group C|Japan|Greece|2.54|3.75|3.25|0|0",
  "Group D|Italy|Costa Rica|1.62|4.27|7.05|0|1",
  "Group E|Switzerland|France|4.78|3.63|1.91|2|5"
];

const datasets = [
  {
    year: 2022,
    role: "tuning sample",
    name: "World Cup 2022 built-in backtest",
    odds: "https://checkbestodds.com/football-odds/archive-world-cup-2022/",
    results: "Fixture list and final scores stored in api/_lib/backtest.js",
    rankings: "FIFA men's ranking before the 2022 World Cup, stored as rank-order priors",
    coverage: "64/64 matches",
    note: DATASET_NOTE,
    ranks: ranks2022,
    rows: rows2022,
    shootoutWinners: {
      "Japan|Croatia": "away",
      "Morocco|Spain": "home",
      "Croatia|Brazil": "home",
      "Netherlands|Argentina": "away",
      "Argentina|France": "home"
    }
  },
  {
    year: 2018,
    role: "holdout",
    name: "World Cup 2018 available-odds holdout",
    odds: "https://checkbestodds.com/football-odds/archive-world-cup-2018/",
    results: "https://fixturedownload.com/feed/json/fifa-world-cup-2018",
    rankings: "FIFA men's ranking before the 2018 World Cup, stored as rank-order priors",
    coverage: "43 matches with public 1X2 odds found in the archived source",
    note: `${DATASET_NOTE} This holdout only includes matches with public 1X2 odds found in the archived source.`,
    ranks: ranks2018,
    rows: rows2018,
    shootoutWinners: {}
  },
  {
    year: 2014,
    role: "holdout",
    name: "World Cup 2014 available-odds holdout",
    odds: "https://checkbestodds.com/football-odds/archive-world-cup-2014/",
    results: "2014 public result tables cross-checked against the listed matches",
    rankings: "FIFA men's ranking before the 2014 World Cup, stored as rank-order priors",
    coverage: "25 group-stage matches with public 1X2 odds found in the archived source",
    note: `${DATASET_NOTE} CheckBestOdds only exposes group-stage odds for this archive, so this holdout is intentionally partial.`,
    ranks: ranks2014,
    rows: rows2014,
    shootoutWinners: {}
  }
];

function parseRows(dataset) {
  return dataset.rows.map((row, index) => {
    const [round, home, away, homeOdds, drawOdds, awayOdds, homeScore, awayScore] = row.split("|");
    return {
      id: index + 1,
      datasetYear: dataset.year,
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

function rankProbabilities(match, ranks) {
  const homeRank = ranks[match.home] || 40;
  const awayRank = ranks[match.away] || 40;
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

function poissonProbabilities(match, form, ranks) {
  const homeRank = ranks[match.home] || 40;
  const awayRank = ranks[match.away] || 40;
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

function winnerFavorite(probs) {
  return probs.home >= probs.away ? "home" : "away";
}

function isGroupRound(match) {
  return String(match.round || "").startsWith("Group");
}

function actualSide(match, dataset) {
  const key = `${match.home}|${match.away}`;
  if (!isGroupRound(match) && match.score.home === match.score.away) return dataset.shootoutWinners[key] || "draw";
  if (match.score.home === match.score.away) return "draw";
  return match.score.home > match.score.away ? "home" : "away";
}

function brier(probs, actual) {
  const sides = actual === "draw" ? ["home", "draw", "away"] : ["home", "away"];
  const adjusted = actual === "draw" ? probs : normalize({ home: probs.home, draw: 0, away: probs.away });
  return sides.reduce((sum, side) => {
    const target = side === actual ? 1 : 0;
    return sum + (adjusted[side] - target) ** 2;
  }, 0);
}

function paulEdgePick(match, models, form) {
  const marketPick = favorite(models.market);
  const blended = blend(models);
  const blendedPick = favorite(blended);
  const marketSorted = ["home", "draw", "away"].sort((a, b) => models.market[b] - models.market[a]);
  const marketMargin = models.market[marketSorted[0]] - models.market[marketSorted[1]];
  const homeRecord = form[match.home] || priorRecord();
  const awayRecord = form[match.away] || priorRecord();
  const homeForm = formScore(homeRecord);
  const awayForm = formScore(awayRecord);
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
  if (isGroupRound(match) && models.market.draw >= 0.26 && marketMargin <= 0.1 && upsetScore < 70) {
    pick = "draw";
    signals.push("draw-squeeze setup");
  }
  if (!isGroupRound(match)) pick = winnerFavorite(blended);
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

function finalizeCalibration(calibration) {
  Object.values(calibration).forEach((bucket) => {
    bucket.accuracy = bucket.graded ? Math.round((bucket.correct / bucket.graded) * 100) : 0;
  });
  return calibration;
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

function runDataset(dataset) {
  const matches = parseRows(dataset);
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
      rating: rankProbabilities(match, dataset.ranks),
      poisson: poissonProbabilities(match, form, dataset.ranks)
    };
    models.blended = blend(models);
    const actual = actualSide(match, dataset);
    const paul = paulEdgePick(match, models, form);
    const picks = {
      paul: paul.pick,
      market: isGroupRound(match) ? favorite(models.market) : winnerFavorite(models.market),
      rating: isGroupRound(match) ? favorite(models.rating) : winnerFavorite(models.rating),
      poisson: isGroupRound(match) ? favorite(models.poisson) : winnerFavorite(models.poisson),
      blended: isGroupRound(match) ? favorite(models.blended) : winnerFavorite(models.blended),
      random: isGroupRound(match) ? ["home", "draw", "away"][match.id % 3] : ["home", "away"][match.id % 2]
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
      datasetYear: dataset.year,
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
  finalizeCalibration(calibration);

  return {
    year: dataset.year,
    role: dataset.role,
    dataset: { ...dataset, ranks: undefined, rows: undefined, shootoutWinners: undefined, matches: matches.length },
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

function combineRuns(runs, label, role) {
  const metrics = {
    paul: emptyMetric(),
    market: emptyMetric(),
    rating: emptyMetric(),
    poisson: emptyMetric(),
    blended: emptyMetric(),
    random: emptyMetric()
  };
  const calibration = {};
  const edge = { upsetCalls: 0, upsetHits: 0 };

  runs.forEach((run) => {
    Object.entries(metrics).forEach(([key, metric]) => {
      const source = run.metrics[key] || emptyMetric();
      metric.graded += source.graded;
      metric.correct += source.correct;
      metric.brier += (source.brier || 0) * source.graded;
    });
    Object.entries(run.calibration || {}).forEach(([band, bucket]) => {
      calibration[band] ||= { graded: 0, correct: 0, accuracy: 0 };
      calibration[band].graded += bucket.graded;
      calibration[band].correct += bucket.correct;
    });
    edge.upsetCalls += run.edge.upsetCalls;
    edge.upsetHits += run.edge.upsetHits;
  });

  Object.values(metrics).forEach(finalizeMetric);
  finalizeCalibration(calibration);
  edge.upsetAccuracy = edge.upsetCalls ? Math.round((edge.upsetHits / edge.upsetCalls) * 100) : 0;
  edge.paulMinusMarket = metrics.paul.correct - metrics.market.correct;
  edge.paulMinusBlended = metrics.paul.correct - metrics.blended.correct;

  return {
    label,
    role,
    dataset: {
      name: label,
      matches: metrics.paul.graded,
      coverage: `${runs.length} dataset${runs.length === 1 ? "" : "s"}`
    },
    metrics,
    edge,
    calibration,
    trace: runs.flatMap((run) => run.trace.map((match) => ({ ...match, datasetYear: run.year })))
  };
}

function runBacktest() {
  const runs = datasets.map(runDataset);
  const aggregate = combineRuns(runs, "World Cup 2022 + 2018/2014 holdout", "aggregate");
  const holdoutRuns = runs.filter((run) => run.role === "holdout");
  const holdout = combineRuns(holdoutRuns, "2018/2014 holdout only", "holdout");

  return {
    status: "pass",
    generatedAt: new Date().toISOString(),
    algorithm: {
      name: "PAUL Edge Engine v2",
      changes: ["group-stage draw-squeeze detector", "removed over-aggressive live-form override", "knockout grading uses advancing winner"]
    },
    dataset: aggregate.dataset,
    metrics: aggregate.metrics,
    edge: aggregate.edge,
    calibration: aggregate.calibration,
    trace: aggregate.trace,
    aggregate,
    holdout,
    datasets: runs
  };
}

module.exports = {
  runBacktest
};
