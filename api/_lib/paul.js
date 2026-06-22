const fs = require("fs");
const path = require("path");
const { fetchRemoteMarketOdds, oddsToProbabilities } = require("../../lib/odds");
const { parseMatchTime } = require("./bracket");
const { buildMistakeContext } = require("./mistake-engine");
const { getEvidenceCache, getMistakeMemory, setEvidenceEntry } = require("./store");
const { universalPickForPaul } = require("./universal-model");

const root = path.join(__dirname, "..", "..");
const dataDir = path.join(root, "data");
const qwenEndpoint = process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const qwenModel = process.env.QWEN_MODEL || "qwen-plus";

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function normalize3Way(probs) {
  const home = Number(probs.home || probs.a || 0);
  const draw = Number(probs.draw || 0);
  const away = Number(probs.away || probs.b || 0);
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
  let bestScore = "0-0";
  let best = 0;
  const scorelines = [];
  for (let a = 0; a <= 7; a += 1) {
    for (let b = 0; b <= 7; b += 1) {
      const p = poisson(a, aLambda) * poisson(b, bLambda);
      scorelines.push({ score: `${a}-${b}`, probability: Number(p.toFixed(6)) });
      if (p > best) {
        best = p;
        bestScore = `${a}-${b}`;
      }
      if (a > b) home += p;
      else if (a === b) draw += p;
      else away += p;
    }
  }
  if (!allowDraw) {
    const drawSplit = draw / 2;
    home += drawSplit;
    away += drawSplit;
    draw = 0;
  }
  return {
    probabilities: normalize3Way({ home, draw, away }),
    predictedScore: bestScore,
    topScorelines: scorelines.sort((a, b) => b.probability - a.probability).slice(0, 24),
    expectedGoals: {
      home: Number(aLambda.toFixed(2)),
      away: Number(bLambda.toFixed(2))
    }
  };
}

function blendModels(models) {
  const usable = models.filter((item) => item.probabilities && item.weight > 0);
  const totalWeight = usable.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return null;
  return normalize3Way({
    home: usable.reduce((sum, item) => sum + item.probabilities.home * item.weight, 0) / totalWeight,
    draw: usable.reduce((sum, item) => sum + item.probabilities.draw * item.weight, 0) / totalWeight,
    away: usable.reduce((sum, item) => sum + item.probabilities.away * item.weight, 0) / totalWeight
  });
}

function learnedModelWeights(mistakeContext) {
  if (mistakeContext?.learningProfile?.modelWeights) {
    return {
      ...mistakeContext.learningProfile.modelWeights,
      source: mistakeContext.learningProfile.version || "paul-learning-profile-v1",
      sampleSize: Number(mistakeContext.calibrationAdjustment?.sampleSize || 0)
    };
  }
  const adjustment = mistakeContext?.calibrationAdjustment || {};
  let market = 55;
  let elo = 25;
  let poissonWeight = 20;
  const marketShrink = Number(adjustment.marketShrinkDelta || 0);
  const edgeTrust = Number(adjustment.edgeTrustDelta || 0);
  const upsetSensitivity = Number(adjustment.upsetSensitivityDelta || 0);
  const scoreConfidence = Number(adjustment.scoreConfidenceDelta || 0);
  const goalVolatility = Number(adjustment.goalVolatilityDelta || 0);

  market += marketShrink * 220 + Math.max(0, -edgeTrust) * 180 - Math.max(0, upsetSensitivity) * 80;
  elo += edgeTrust * 110 + upsetSensitivity * 45;
  poissonWeight += scoreConfidence * 140 + goalVolatility * 70 + upsetSensitivity * 35;

  market = clamp(market, 45, 65);
  elo = clamp(elo, 18, 34);
  poissonWeight = clamp(poissonWeight, 14, 30);
  const sum = market + elo + poissonWeight;
  const normalized = {
    market: Number(((market / sum) * 100).toFixed(1)),
    elo: Number(((elo / sum) * 100).toFixed(1)),
    poisson: Number(((poissonWeight / sum) * 100).toFixed(1))
  };
  return {
    ...normalized,
    source: mistakeContext?.learningProfile?.version || "static-baseline",
    sampleSize: Number(adjustment.sampleSize || 0),
    maturity: mistakeContext?.learningProfile?.maturity || "seed"
  };
}

function favoriteFromProbabilities(match, probabilities) {
  if (!probabilities) return null;
  const candidates = [
    { side: "home", winnerCode: match.teamA.code, winnerName: match.teamA.name, probability: probabilities.home },
    { side: "away", winnerCode: match.teamB.code, winnerName: match.teamB.name, probability: probabilities.away }
  ];
  if (match.round === "Group Stage") {
    candidates.push({ side: "draw", winnerCode: "DRAW", winnerName: "Draw", probability: probabilities.draw });
  }
  candidates.sort((a, b) => b.probability - a.probability);
  return {
    ...candidates[0],
    probability: Number((candidates[0].probability || 0).toFixed(3))
  };
}

function sideCode(match, side) {
  if (side === "home") return match.teamA.code;
  if (side === "away") return match.teamB.code;
  return "DRAW";
}

function sideName(match, side) {
  if (side === "home") return match.teamA.name;
  if (side === "away") return match.teamB.name;
  return "Draw";
}

function sideProbability(probabilities, side) {
  return probabilities && Number(probabilities[side] || 0);
}

function formValue(record = {}) {
  const direct = Number(record.form || record.rating || record.power || record.score || record.formScore || record.form_score);
  if (Number.isFinite(direct) && direct) return direct;
  const wins = Number(record.wins || 0);
  const draws = Number(record.draws || 0);
  const losses = Number(record.losses || 0);
  const played = wins + draws + losses;
  if (played) return (wins * 3 + draws) / played;
  return null;
}

function hoursToKickoff(match, now = new Date()) {
  const kickoff = parseMatchTime(match);
  if (!kickoff) return null;
  return (kickoff.getTime() - now.getTime()) / (60 * 60 * 1000);
}

function sumUnavailablePlayers(entry = {}) {
  return ["home", "away"].reduce((sum, side) => sum + (Array.isArray(entry?.[side]) ? entry[side].length : 0), 0);
}

function compactAdvancedMetrics(record = {}) {
  const metrics = {
    avgXg: Number(record.avgXg ?? record.avg_xg),
    avgXgConceded: Number(record.avgXgConceded ?? record.avg_xg_conceded),
    avgShots: Number(record.avgShots ?? record.avg_shots),
    avgTeamRating: Number(record.avgTeamRating ?? record.avg_team_rating ?? record.rating ?? record.formScore ?? record.form_score),
    pointsLastN: Number(record.pointsLastN ?? record.points_last_n ?? record.points)
  };
  return Object.fromEntries(
    Object.entries(metrics)
      .filter(([, value]) => Number.isFinite(value))
      .map(([key, value]) => [key, Number(value.toFixed(3))])
  );
}

function advancedMetricsAvailable(metrics = {}) {
  return Object.keys(metrics).length > 0;
}

function buildPaulEdge(match, evidence) {
  const baselines = evidence.baselines || {};
  const favorites = [
    baselines.marketFavorite,
    baselines.ratingFavorite,
    baselines.poissonFavorite,
    baselines.blendedFavorite
  ].filter(Boolean);
  const voteCounts = favorites.reduce((counts, favorite) => {
    counts[favorite.winnerCode] = (counts[favorite.winnerCode] || 0) + 1;
    return counts;
  }, {});
  const consensusCode = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const marketSide = baselines.marketFavorite?.side || null;
  const ratingSide = baselines.ratingFavorite?.side || null;
  const poissonSide = baselines.poissonFavorite?.side || null;
  const blendSide = baselines.blendedFavorite?.side || null;
  const marketProb = sideProbability(evidence.market?.probabilities, marketSide);
  const blendProb = sideProbability(evidence.modelBlend, blendSide);
  const marketBlendGap = marketSide && blendSide ? Math.abs(marketProb - sideProbability(evidence.modelBlend, marketSide)) : null;
  const marketSorted = evidence.market?.probabilities
    ? ["home", "draw", "away"].sort((a, b) => sideProbability(evidence.market.probabilities, b) - sideProbability(evidence.market.probabilities, a))
    : [];
  const marketMargin = marketSorted.length ? sideProbability(evidence.market.probabilities, marketSorted[0]) - sideProbability(evidence.market.probabilities, marketSorted[1]) : null;
  const ratingHomeAwayGap = evidence.ratings?.probabilities ? Math.abs(sideProbability(evidence.ratings.probabilities, "home") - sideProbability(evidence.ratings.probabilities, "away")) : null;
  const poissonHomeAwayGap = evidence.poisson?.probabilities ? Math.abs(sideProbability(evidence.poisson.probabilities, "home") - sideProbability(evidence.poisson.probabilities, "away")) : null;
  const drawModelGap = ratingHomeAwayGap !== null && poissonHomeAwayGap !== null ? Math.max(ratingHomeAwayGap, poissonHomeAwayGap) : null;
  const drawSqueeze =
    match.round === "Group Stage" &&
    sideProbability(evidence.market?.probabilities, "draw") >= 0.29 &&
    marketMargin !== null &&
    marketMargin <= 0.06 &&
    drawModelGap !== null &&
    drawModelGap <= 0.12;
  const modelDisagreement = new Set(favorites.map((favorite) => favorite.winnerCode)).size;
  const overrideSupport = [ratingSide, poissonSide, blendSide].filter((side) => side && side === blendSide).length;
  const blendOdds = blendSide === "home" ? Number(evidence.market?.odds?.home) : blendSide === "away" ? Number(evidence.market?.odds?.away) : Number(evidence.market?.odds?.draw);
  const underdogPriceGate = blendSide !== "draw" && Number.isFinite(blendOdds) && blendOdds >= 3.1;
  const conservativeOverride = Boolean(blendSide && marketSide && blendSide !== marketSide && marketMargin !== null && marketMargin <= 0.14 && overrideSupport >= 2 && underdogPriceGate);
  const formA = formValue(evidence.form?.teamA);
  const formB = formValue(evidence.form?.teamB);
  const formEdge = formA !== null && formB !== null ? formA - formB : null;
  const underdogSide = evidence.market?.probabilities
    ? ["home", "away"].sort((a, b) => sideProbability(evidence.market.probabilities, a) - sideProbability(evidence.market.probabilities, b))[0]
    : null;
  const underdogCode = underdogSide ? sideCode(match, underdogSide) : null;
  let upsetScore = 0;
  const signals = [];
  if (modelDisagreement >= 2) {
    upsetScore += 22;
    signals.push("baseline disagreement");
  }
  if (marketBlendGap !== null && marketBlendGap <= 0.08) {
    upsetScore += 18;
    signals.push("market edge is narrow after model blend");
  }
  if (underdogSide && blendSide === underdogSide) {
    upsetScore += 24;
    signals.push("blended model prefers the market underdog");
  }
  if (formEdge !== null) {
    const formUnderdog = formEdge > 0.25 ? match.teamA.code : formEdge < -0.25 ? match.teamB.code : null;
    if (formUnderdog && formUnderdog === underdogCode) {
      upsetScore += 18;
      signals.push("recent form supports the underdog");
    }
  }
  if (baselines.poissonFavorite && baselines.marketFavorite && baselines.poissonFavorite.winnerCode !== baselines.marketFavorite.winnerCode) {
    upsetScore += 12;
    signals.push("score model challenges the market");
  }
  if (drawSqueeze) {
    upsetScore += 18;
    signals.push("strict draw-squeeze setup");
  }
  if (conservativeOverride) signals.push("multi-model override gate");
  const tier = upsetScore >= 55 ? "live upset candidate" : upsetScore >= 35 ? "watchlist upset" : "consensus lean";
  return {
    name: "PAUL Edge Engine v4",
    weights: { market: 55, elo: 25, poisson: 20, drawSqueeze: "strict group-stage only, market draw >= 29%, top-two margin <= 6%, rating/poisson gap <= 12%", upsetOverlay: "conservative holdout-gated", underdogPriceGate: "non-draw upset target must be 3.10+ in market odds" },
    consensusCode,
    consensusName: consensusCode === match.teamA.code ? match.teamA.name : consensusCode === match.teamB.code ? match.teamB.name : consensusCode === "DRAW" ? "Draw" : null,
    modelDisagreement,
    upsetScore: clamp(upsetScore, 0, 100),
    upsetTier: tier,
    marketMargin: marketMargin === null ? null : Number(marketMargin.toFixed(3)),
    drawSqueeze,
    drawModelGap: drawModelGap === null ? null : Number(drawModelGap.toFixed(3)),
    conservativeOverride,
    overrideSupport,
    underdogPriceGate,
    underdogCode,
    underdogName: underdogSide ? sideName(match, underdogSide) : null,
    signals,
    recommendation: drawSqueeze
      ? "Draw is eligible only because market, rating, and score model all show a compressed match."
      : conservativeOverride && upsetScore >= 55
        ? "PAUL may override the market favorite, but only if current news confirms the model edge."
        : "PAUL should stay close to the market/blended consensus unless live news materially changes the setup."
  };
}

function buildUniversalOverlay(match, evidence) {
  const productionUniversal = universalPickForPaul(match, evidence);
  if (productionUniversal) return productionUniversal;
  const marketProbabilities = evidence.market?.probabilities || null;
  const blendedProbabilities = evidence.modelBlend || null;
  const marketFavorite = evidence.baselines?.marketFavorite || null;
  const blendedFavorite = evidence.baselines?.blendedFavorite || favoriteFromProbabilities(match, blendedProbabilities);
  if (!blendedProbabilities || !blendedFavorite) return null;
  const marketSorted = marketProbabilities
    ? ["home", "draw", "away"].sort((a, b) => sideProbability(marketProbabilities, b) - sideProbability(marketProbabilities, a))
    : [];
  const marketSide = marketFavorite?.side || marketSorted[0] || null;
  const marketTopProbability = marketSide ? sideProbability(marketProbabilities, marketSide) : 0;
  const marketMargin = marketSorted.length >= 2
    ? sideProbability(marketProbabilities, marketSorted[0]) - sideProbability(marketProbabilities, marketSorted[1])
    : null;
  const candidateSide = blendedFavorite.side;
  const candidateProbability = sideProbability(blendedProbabilities, candidateSide);
  const marketCandidateProbability = sideProbability(marketProbabilities, candidateSide);
  const candidateEdge = Number((candidateProbability - marketCandidateProbability).toFixed(3));
  const ratingSide = evidence.baselines?.ratingFavorite?.side || null;
  const poissonSide = evidence.baselines?.poissonFavorite?.side || null;
  const support = [ratingSide, poissonSide, candidateSide].filter((side) => side && side === candidateSide).length;
  const candidateOdds = candidateSide === "home"
    ? Number(evidence.market?.odds?.home)
    : candidateSide === "away"
      ? Number(evidence.market?.odds?.away)
      : Number(evidence.market?.odds?.draw);
  const signals = [];
  if (support >= 2) signals.push("rating/score/blend support");
  if (marketMargin !== null && marketMargin <= 0.12) signals.push("market margin narrow");
  if (candidateEdge >= 0.035) signals.push("model probability above market");
  if (Number.isFinite(candidateOdds) && candidateOdds >= 2.7) signals.push("market price leaves upset value");

  let override = false;
  if (marketTopProbability >= 0.62) {
    signals.push("market favorite too strong for overlay");
  } else if (candidateSide === "draw" && match.round === "Group Stage") {
    override = Boolean(
      marketMargin !== null &&
      marketMargin <= 0.075 &&
      marketCandidateProbability >= 0.285 &&
      candidateEdge >= 0.015 &&
      support >= 2
    );
  } else if (marketSide && candidateSide && candidateSide !== marketSide) {
    override = Boolean(
      marketMargin !== null &&
      marketMargin <= 0.14 &&
      candidateEdge >= 0.035 &&
      support >= 2 &&
      (!Number.isFinite(candidateOdds) || candidateOdds >= 2.7)
    );
  }

  return {
    strategyId: "paul-universal-overlay-v1",
    pickSide: candidateSide,
    pickCode: sideCode(match, candidateSide),
    pickName: sideName(match, candidateSide),
    override,
    probability: Number(candidateProbability.toFixed(3)),
    marketProbability: Number((marketCandidateProbability || 0).toFixed(3)),
    edge: candidateEdge,
    marketPickSide: marketSide,
    marketMargin: marketMargin === null ? null : Number(marketMargin.toFixed(3)),
    support,
    signals,
    note: override
      ? "Universal overlay is allowed to move PAUL away from the market anchor because model support and price edge are both present."
      : "Universal overlay reviewed, but PAUL remains anchored unless the model edge clears the override gate."
  };
}

function buildPreLockRehearsal(match, evidence) {
  const now = new Date();
  const hours = hoursToKickoff(match, now);
  const intelligence = evidence.intelligence || evidence.market?.intelligence || {};
  const unavailable = intelligence.unavailablePlayers || {};
  const teamNewsCount = sumUnavailablePlayers(unavailable);
  const hasTeamNews = teamNewsCount > 0;
  const hasLineupContext = Boolean(
    intelligence.formations?.home ||
    intelligence.formations?.away ||
    intelligence.coaches?.home?.name ||
    intelligence.coaches?.away?.name ||
    intelligence.managers?.home ||
    intelligence.managers?.away
  );
  const teamAMetrics = compactAdvancedMetrics(evidence.form?.teamA || {});
  const teamBMetrics = compactAdvancedMetrics(evidence.form?.teamB || {});
  const localAdvancedData = advancedMetricsAvailable(teamAMetrics) || advancedMetricsAvailable(teamBMetrics);
  const marketFavorite = evidence.baselines?.marketFavorite || null;
  const blendedFavorite = evidence.baselines?.blendedFavorite || null;
  const upsetEdge = evidence.paulEdge || null;
  const universalEdge = evidence.universal || null;
  const rehearsalWindowHours = Number(process.env.PAUL_PRELOCK_NEWS_WINDOW_HOURS || process.env.PREDICTION_LEAD_HOURS || 36);
  const nearLockWindow = hours !== null && hours >= 0 && hours <= rehearsalWindowHours;
  const optaThin = !localAdvancedData;
  const universalUpset = Boolean(
    universalEdge &&
    universalEdge.pickSide &&
    universalEdge.marketPickSide &&
    universalEdge.pickSide !== universalEdge.marketPickSide &&
    (universalEdge.override || Number(universalEdge.edge || 0) >= 0.025 || Number(universalEdge.marketMargin || 1) <= 0.12)
  );
  const upsetSensitive = Boolean(upsetEdge && (upsetEdge.upsetScore >= 30 || upsetEdge.drawSqueeze || upsetEdge.conservativeOverride)) || universalUpset;
  const searchReasons = [];
  if (nearLockWindow) searchReasons.push("kickoff is inside the pre-lock rehearsal window");
  if (!hasTeamNews) searchReasons.push("latest team-news/injury detail is still thin");
  if (!hasLineupContext) searchReasons.push("lineup/tactical context is still thin");
  if (optaThin) searchReasons.push("advanced metrics need public Opta-style confirmation");
  if (upsetSensitive) searchReasons.push("upset/watchlist signals need extra news, lineup, and Opta-style stress-testing");
  const focus = [];
  if (!hasTeamNews) focus.push("team news");
  if (!hasLineupContext) focus.push("likely lineups");
  if (optaThin) focus.push("Opta-style preview metrics");
  if (upsetSensitive) {
    focus.push("upset path validation");
    focus.push("underdog press/transition/set-piece route");
  }
  if (!focus.length) focus.push("late-breaking availability");
  return {
    status: searchReasons.length ? "needs-fresh-rehearsal" : "locally-covered",
    hoursToKickoff: hours === null ? null : Number(hours.toFixed(2)),
    teamNews: {
      available: hasTeamNews,
      unavailablePlayerCount: teamNewsCount,
      lineupContextAvailable: hasLineupContext,
      source: intelligence.source || evidence.market?.provider || null
    },
    optaReference: {
      requested: true,
      localAdvancedData,
      source: intelligence.source || "local-form-and-models",
      note: localAdvancedData
        ? "Local advanced metrics are available. Use them as a baseline and verify whether public Opta-style previews agree."
        : "Local advanced metrics are thin. Search public Opta-style previews before final lock if available.",
      teamA: teamAMetrics,
      teamB: teamBMetrics
    },
    upsetPreview: {
      tier: upsetEdge?.upsetTier || null,
      upsetScore: upsetEdge?.upsetScore ?? null,
      underdogCode: upsetEdge?.underdogCode || null,
      underdogName: upsetEdge?.underdogName || null,
      marketFavorite: marketFavorite
        ? {
            code: marketFavorite.winnerCode,
            name: marketFavorite.winnerName,
            probability: marketFavorite.probability
          }
        : null,
      blendedFavorite: blendedFavorite
        ? {
            code: blendedFavorite.winnerCode,
            name: blendedFavorite.winnerName,
            probability: blendedFavorite.probability
          }
        : null,
      signals: Array.isArray(upsetEdge?.signals) ? upsetEdge.signals.slice(0, 6) : [],
      universalOverlay: universalEdge
        ? {
            pickCode: universalEdge.pickCode,
            pickName: universalEdge.pickName,
            override: Boolean(universalEdge.override),
            edge: universalEdge.edge,
            marketMargin: universalEdge.marketMargin,
            signals: Array.isArray(universalEdge.signals) ? universalEdge.signals.slice(0, 6) : []
          }
        : null,
      recommendation: upsetSensitive
        ? "Upset probability is live enough to justify a deeper news/lineup/Opta-style review. Increase upset weight only when fresh evidence confirms the underdog path."
        : upsetEdge?.recommendation || null
    },
    mistakeMemory: evidence.mistakeEngine?.usable
      ? {
          totalReviewed: evidence.mistakeEngine.summary?.totalReviewed || 0,
          edgeTrustDelta: evidence.mistakeEngine.calibrationAdjustment?.edgeTrustDelta || 0,
          drawRiskDelta: evidence.mistakeEngine.calibrationAdjustment?.drawRiskDelta || 0,
          upsetSensitivityDelta: evidence.mistakeEngine.calibrationAdjustment?.upsetSensitivityDelta || 0
        }
      : null,
    searchPlan: {
      required: Boolean(searchReasons.length && (nearLockWindow || upsetSensitive || optaThin || !hasTeamNews || !hasLineupContext)),
      reasons: searchReasons,
      focus,
      suggestedQueries: [
        `${match.teamA.name} vs ${match.teamB.name} team news injuries suspension likely lineup preview`,
        `${match.teamA.name} vs ${match.teamB.name} Opta prediction xG xGA shots preview`,
        `${match.teamA.name} vs ${match.teamB.name} upset preview tactical analysis underdog news`,
        `${match.teamA.name} vs ${match.teamB.name} set pieces pressing transition xG preview`
      ]
    }
  };
}

function findByMatchId(collection, matchId) {
  if (!collection) return null;
  if (Array.isArray(collection)) {
    return collection.find((item) => String(item.matchId || item.id) === String(matchId)) || null;
  }
  return collection[matchId] || collection[String(matchId)] || null;
}

function cachedEvidenceIsFresh(entry, maxHours = Number(process.env.ODDS_CACHE_MAX_HOURS || 26)) {
  const value = entry?.market?.updatedAt || entry?.updatedAt || entry?.generatedAt;
  const updatedAt = value ? new Date(value) : null;
  if (!updatedAt || Number.isNaN(updatedAt.getTime())) return false;
  return Date.now() - updatedAt.getTime() <= maxHours * 60 * 60 * 1000;
}

function marketWithSnapshots(match, currentMarket, previousEntry) {
  const now = new Date();
  const matchTime = parseMatchTime(match);
  const hoursToKickoff = matchTime ? (matchTime.getTime() - now.getTime()) / (60 * 60 * 1000) : null;
  const previousMarket = previousEntry?.market || null;
  const previousOpeningOdds = previousMarket?.openingOdds || previousMarket?.odds || null;
  const previousOpeningAt = previousMarket?.openingUpdatedAt || previousMarket?.updatedAt || previousEntry?.generatedAt || null;
  const closingWindowHours = Number(process.env.CLV_CLOSING_WINDOW_HOURS || 1);
  const shouldMarkClosing = hoursToKickoff !== null && hoursToKickoff >= 0 && hoursToKickoff <= closingWindowHours;

  return {
    ...currentMarket,
    openingOdds: previousOpeningOdds || currentMarket?.odds || null,
    openingUpdatedAt: previousOpeningOdds ? previousOpeningAt : (currentMarket?.updatedAt || now.toISOString()),
    closingOdds: shouldMarkClosing ? (currentMarket?.odds || null) : (previousMarket?.closingOdds || null),
    closingUpdatedAt: shouldMarkClosing ? (currentMarket?.updatedAt || now.toISOString()) : (previousMarket?.closingUpdatedAt || null)
  };
}

function findTeamRecord(collection, code) {
  if (!collection) return null;
  if (Array.isArray(collection)) {
    return collection.find((item) => item.code === code || item.teamCode === code) || null;
  }
  return collection[code] || null;
}

async function collectPredictionEvidence(match, options = {}) {
  const oddsFile = path.join(dataDir, "market-odds.json");
  const ratingsFile = path.join(dataDir, "team-ratings.json");
  const formFile = path.join(dataDir, "recent-form.json");
  const allOdds = readJson(oddsFile, {});
  const allRatings = readJson(ratingsFile, {});
  const allForm = readJson(formFile, {});
  const evidenceCache = options.cache === false ? {} : await getEvidenceCache();
  const mistakeMemory = options.mistakeMemory === false || process.env.MISTAKE_ENGINE_DISABLED === "1" ? {} : await getMistakeMemory();
  const cachedEvidence = findByMatchId(evidenceCache, match.id);
  const cachedOdds = cachedEvidenceIsFresh(cachedEvidence) ? cachedEvidence.market : null;
  const shouldFetchLive = options.liveOdds !== false && (options.forceLiveOdds || !cachedOdds);
  const remoteOdds = shouldFetchLive ? await fetchRemoteMarketOdds(match) : { record: null, errors: [] };
  if (remoteOdds.record) {
    await setEvidenceEntry(match.id, {
      matchId: match.id,
      generatedAt: new Date().toISOString(),
      market: marketWithSnapshots(match, remoteOdds.record, cachedEvidence),
      marketFetchErrors: remoteOdds.errors
    });
  }
  const oddsRecord = remoteOdds.record || cachedOdds || findByMatchId(allOdds, match.id);
  const marketProb = oddsToProbabilities(oddsRecord?.odds || oddsRecord);
  const providerIntelligence = oddsRecord?.intelligence || null;
  const ratingA = findTeamRecord(allRatings, match.teamA.code);
  const ratingB = findTeamRecord(allRatings, match.teamB.code);
  const formA = findTeamRecord(allForm, match.teamA.code) || providerIntelligence?.form?.teamA || null;
  const formB = findTeamRecord(allForm, match.teamB.code) || providerIntelligence?.form?.teamB || null;
  const allowDraw = match.round === "Group Stage";
  const eloProb = ratingA?.elo && ratingB?.elo ? eloProbabilities(ratingA.elo, ratingB.elo, allowDraw) : null;
  let poisson = null;
  if (ratingA?.attack && ratingA?.defense && ratingB?.attack && ratingB?.defense) {
    const base = allowDraw ? 1.22 : 1.28;
    const aLambda = clamp(base * Number(ratingA.attack) / Math.max(0.1, Number(ratingB.defense)), 0.25, 3.5);
    const bLambda = clamp(base * Number(ratingB.attack) / Math.max(0.1, Number(ratingA.defense)), 0.25, 3.5);
    poisson = poissonProbabilities(aLambda, bLambda, allowDraw);
  }
  const mistakeContext = buildMistakeContext(match, mistakeMemory);
  const modelWeights = learnedModelWeights(mistakeContext);
  const modelBlend = blendModels([
    { name: "market", probabilities: marketProb, weight: modelWeights.market },
    { name: "elo", probabilities: eloProb, weight: modelWeights.elo },
    { name: "poisson", probabilities: poisson?.probabilities, weight: modelWeights.poisson }
  ]);
  const hasPrimaryEvidence = Boolean(marketProb || eloProb || poisson || providerIntelligence);
  const missing = [];
  if (!marketProb) missing.push("market odds");
  if (!(ratingA?.elo && ratingB?.elo)) missing.push("real Elo or team ratings");
  if (!poisson) missing.push("attack/defense ratings");
  if (!(formA && formB)) missing.push("recent form");
  const evidence = {
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    hasPrimaryEvidence,
    missing,
    market: marketProb
      ? {
          source: remoteOdds.record ? oddsRecord.source : "data/market-odds.json",
          provider: oddsRecord.provider || oddsRecord.bookmaker || oddsRecord.source || "local",
          eventId: oddsRecord.eventId || null,
          updatedAt: oddsRecord.updatedAt || null,
          bookmakerCount: oddsRecord.bookmakerCount || null,
          sampleBookmakers: oddsRecord.sampleBookmakers || null,
          odds: oddsRecord?.odds || oddsRecord,
          probabilities: marketProb,
          intelligence: providerIntelligence
        }
      : null,
    marketFetchErrors: remoteOdds.errors,
    evidenceCache: cachedOdds
      ? {
          status: "hit",
          updatedAt: cachedOdds.updatedAt || cachedEvidence?.updatedAt || cachedEvidence?.generatedAt || null
        }
      : {
          status: shouldFetchLive ? "miss-refreshed" : "miss",
          updatedAt: null
        },
    ratings: ratingA && ratingB ? { teamA: ratingA, teamB: ratingB, probabilities: eloProb } : null,
    form: formA && formB ? { teamA: formA, teamB: formB } : null,
    intelligence: providerIntelligence,
    mistakeEngine: mistakeContext.usable ? mistakeContext : null,
    learning: {
      modelWeights,
      profile: mistakeContext.learningProfile || null,
      applied: Boolean(mistakeContext.usable),
      note: "Learning weights are recalculated from post-match KV memory before every PAUL read."
    },
    poisson,
    modelBlend,
    baselines: {
      marketFavorite: favoriteFromProbabilities(match, marketProb),
      ratingFavorite: favoriteFromProbabilities(match, eloProb),
      poissonFavorite: favoriteFromProbabilities(match, poisson?.probabilities),
      blendedFavorite: favoriteFromProbabilities(match, modelBlend)
    }
  };
  evidence.paulEdge = buildPaulEdge(match, evidence);
  evidence.universal = buildUniversalOverlay(match, evidence);
  evidence.preLockRehearsal = buildPreLockRehearsal(match, evidence);
  return evidence;
}

function buildPrompt(payload, evidence) {
  const needsSearch = !evidence.market || !evidence.hasPrimaryEvidence;
  const knockout = payload.round !== "Group Stage";
  return [
    "You are PAUL AI, an AI octopus for pre-match football predictions.",
    needsSearch
      ? "Local market odds or model evidence is missing. Use web search to find recent public information, team news, likely lineups, injuries, form, and expert previews before making the prediction."
      : "Base the prediction on the real evidence object first, and use web search only to supplement the latest context.",
    "Use this decision order: 1) market-implied probability as the anchor, 2) Elo/SPI-style rating strength, 3) attack/defense score model, 4) universal overlay gate, 5) recent form and availability, 6) tactical upset path.",
    "Do not blindly copy the favorite. Look for plausible upset signals: undervalued teams, injury mismatch, fixture congestion, tactical matchup, psychology, group-table pressure, venue, travel, rest, and weather.",
    "Explicitly compare PAUL's pick with marketFavorite, ratingFavorite, poissonFavorite, and blendedFavorite from evidence.baselines.",
    "Use evidence.paulEdge as PAUL's proprietary edge layer. If upsetScore is high and conservativeOverride is true, explain the upset path; otherwise stay close to the market/blended consensus.",
    "Use evidence.universal as PAUL's historical Universal gate, distilled from broad backtests. It may permit a market override only when universal.override is true; PAUL's live news and KV learning layer still have final authority.",
    "Use evidence.learning as PAUL's adaptive learning layer. It turns post-match KV corrections into bounded model-weight changes before each prediction, so explain when learning weights materially affect the read.",
    "Before finalizing the locked pick, use evidence.preLockRehearsal as a replay-room checklist: verify fresh team news, likely lineups, Opta-style preview data (xG, xGA, shots, set pieces, pressing/field tilt when publicly available), and whether the upset path still holds.",
    "When evidence.preLockRehearsal.upsetPreview.recommendation says the upset probability is live enough, spend extra effort on underdog news, lineup absences, set pieces, pressing/transition routes, xG/xGA, and market movement before deciding whether to slightly lift the upset/draw probability.",
    "Recent results have shown more upsets than the base market anchor expected, so stress-test favorites harder when team news, Opta-style metrics, form, travel/rest, or tactical matchup support the underdog or draw.",
    "evidence.mistakeEngine is an automatic KV calibration layer built from post-match reviews. It already adjusts trust, draw risk, upset sensitivity, score volatility, and adaptive model weights before your wording. Explain it when relevant, but do not invent facts.",
    knockout
      ? "This is a knockout match. The final PAUL pick must be the advancing/winning team, never DRAW. If regulation time may be level, explain that as risk but still choose one team to advance."
      : "Only treat DRAW as a serious PAUL pick when evidence.paulEdge.drawSqueeze is true; do not force a draw from a merely narrow market.",
    "Confidence should be calibrated: 50-59 is lean, 60-69 is solid, 70-79 is strong, 80+ is rare.",
    "Do not provide betting advice. Do not invent exact links, injuries, lineups, odds, or recent results that are not supported by evidence.",
    "Return strict JSON with these keys: winnerCode, winnerName, confidence, predictedScore, probabilities, reasoning, upsetRisk, evidenceUsed, marketBaseline, ratingBaseline, calibrationNote, upsetCase.",
    "probabilities must include home/draw/away as numbers from 0 to 100. Write reasoning, upsetRisk, and evidenceUsed in English.",
    "",
    `Match: ${payload.id} / ${payload.round} / ${payload.date} / ${payload.venue}`,
    `Team A: ${payload.teamA.code} ${payload.teamA.name}`,
    `Team B: ${payload.teamB.code} ${payload.teamB.name}`,
    `Evidence package: ${JSON.stringify(evidence)}`
  ].join("\n");
}

function preventKnockoutDraw(payload, analysis = {}) {
  if (payload.round === "Group Stage") return analysis;
  const winnerCode = String(analysis.winnerCode || analysis.winner || "").toUpperCase();
  const winnerName = String(analysis.winnerName || "").toUpperCase();
  if (winnerCode !== "DRAW" && winnerName !== "DRAW") return analysis;
  const probabilities = analysis.probabilities || {};
  const home = Number(probabilities.home || 0);
  const away = Number(probabilities.away || 0);
  const pick = home >= away ? payload.teamA : payload.teamB;
  return {
    ...analysis,
    winnerCode: pick.code,
    winnerName: pick.name,
    upsetRisk: analysis.upsetRisk || "Regulation draw risk, but knockout prediction must choose an advancing team."
  };
}

function probabilitiesFromAny(raw, fallback = null) {
  const input = raw && typeof raw === "object" ? raw : null;
  const parse = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };
  const home = parse(input?.home);
  const draw = parse(input?.draw);
  const away = parse(input?.away);
  const sum = home + draw + away;
  if (sum > 0) {
    const asRatio = sum > 1.5
      ? normalize3Way({ home: home / 100, draw: draw / 100, away: away / 100 })
      : normalize3Way({ home, draw, away });
    if (asRatio) return asRatio;
  }
  return fallback;
}

function probabilitiesToPercentages(probabilities) {
  if (!probabilities) return null;
  return {
    home: Math.round(Number(probabilities.home || 0) * 100),
    draw: Math.round(Number(probabilities.draw || 0) * 100),
    away: Math.round(Number(probabilities.away || 0) * 100)
  };
}

function sideFromCode(payload, code) {
  const value = String(code || "").toUpperCase();
  if (value === String(payload.teamA?.code || "").toUpperCase()) return "home";
  if (value === String(payload.teamB?.code || "").toUpperCase()) return "away";
  if (value === "DRAW") return "draw";
  return null;
}

function blendToward(anchor, target, factor) {
  const use = clamp(Number(factor || 0), 0, 0.35);
  if (!anchor || !target || use <= 0) return anchor;
  return normalize3Way({
    home: Number(anchor.home || 0) * (1 - use) + Number(target.home || 0) * use,
    draw: Number(anchor.draw || 0) * (1 - use) + Number(target.draw || 0) * use,
    away: Number(anchor.away || 0) * (1 - use) + Number(target.away || 0) * use
  });
}

function shiftProbability(probabilities, fromSide, toSide, delta) {
  const next = { ...probabilities };
  if (!fromSide || !toSide || fromSide === toSide) return next;
  const shift = clamp(Number(delta || 0), 0, Number(next[fromSide] || 0));
  if (shift <= 0) return next;
  next[fromSide] = Number(next[fromSide] || 0) - shift;
  next[toSide] = Number(next[toSide] || 0) + shift;
  return normalize3Way(next);
}

function rebalanceDraw(probabilities, delta, allowDraw) {
  if (!allowDraw || !Number.isFinite(Number(delta))) return probabilities;
  const next = {
    home: Number(probabilities.home || 0),
    draw: Number(probabilities.draw || 0),
    away: Number(probabilities.away || 0)
  };
  const targetDraw = clamp(next.draw + Number(delta || 0), 0.08, 0.38);
  const diff = targetDraw - next.draw;
  if (Math.abs(diff) < 0.0005) return probabilities;
  const homeAwayTotal = Math.max(0.0001, next.home + next.away);
  next.home = clamp(next.home - diff * (next.home / homeAwayTotal), 0.01, 0.9);
  next.away = clamp(next.away - diff * (next.away / homeAwayTotal), 0.01, 0.9);
  next.draw = targetDraw;
  return normalize3Way(next);
}

function scoreParts(score) {
  const match = String(score || "").match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function scoreSide(parts) {
  if (!parts) return null;
  if (parts.home === parts.away) return "draw";
  return parts.home > parts.away ? "home" : "away";
}

function commonScorePrior(score) {
  const priors = {
    "1-0": 0.018,
    "0-1": 0.018,
    "1-1": 0.018,
    "2-1": 0.014,
    "1-2": 0.014,
    "2-0": 0.01,
    "0-2": 0.01,
    "0-0": 0.008,
    "2-2": 0.006,
    "3-1": 0.004,
    "1-3": 0.004
  };
  return priors[score] || 0;
}

function scoreShapeContext(evidence = {}, adjustment = {}, pickSide = null, pickProbability = 0) {
  const market = evidence.market?.probabilities || {};
  const poisson = evidence.poisson || {};
  const expectedHome = Number(poisson.expectedGoals?.home);
  const expectedAway = Number(poisson.expectedGoals?.away);
  const expectedTotal = Number.isFinite(expectedHome) && Number.isFinite(expectedAway)
    ? expectedHome + expectedAway
    : null;
  const marketPickProbability = Number(sideProbability(market, pickSide) || 0);
  const marketDraw = Number(market.draw || 0);
  const learningProfile = evidence.learning?.profile || evidence.mistakeEngine?.learningProfile || {};
  const scorelineProfile = evidence.mistakeEngine?.summary?.scorelineProfile || {};
  const scoreMissRate = Number(learningProfile.scoreMissRate || 0);
  const probabilityWeight = scoreMissRate >= 0.8 ? 0.72 : scoreMissRate >= 0.65 ? 0.84 : 1;
  const favoriteSide = evidence.baselines?.marketFavorite?.side || evidence.baselines?.blendedFavorite?.side || null;
  const favoriteProbability = Math.max(
    Number(sideProbability(market, favoriteSide) || 0),
    Number(evidence.baselines?.marketFavorite?.probability || 0),
    Number(evidence.baselines?.blendedFavorite?.probability || 0),
    Number(pickProbability || 0)
  );
  const scorePriorWeight = scoreMissRate >= 0.8 ? 0.35 : scoreMissRate >= 0.65 ? 0.55 : 1;
  const compressed = Boolean(
    evidence.paulEdge?.drawSqueeze ||
      marketDraw >= 0.29 ||
      (favoriteProbability > 0 && favoriteProbability <= 0.56)
  );
  const strongFavorite = Boolean(favoriteProbability >= 0.64 || marketPickProbability >= 0.62);
  const upsetPick = Boolean(
    pickSide &&
      favoriteSide &&
      pickSide !== "draw" &&
      favoriteSide !== "draw" &&
      pickSide !== favoriteSide
  );
  const highEventBias = Number(adjustment.goalVolatilityDelta || 0) > 0.006 ||
    evidence.mistakeEngine?.learningProfile?.currentBias?.includes("lift high-event score paths");
  const lowEventBias = Number(adjustment.goalVolatilityDelta || 0) < -0.006 ||
    evidence.mistakeEngine?.learningProfile?.currentBias?.includes("prefer lower-event score paths");
  return {
    expectedTotal,
    marketDraw,
    favoriteProbability,
    marketPickProbability,
    scoreMissRate,
    scorePriorWeight,
    probabilityWeight,
    compressed,
    strongFavorite,
    upsetPick,
    highEventBias,
    lowEventBias,
    scorelineProfile
  };
}

function scoreCandidateRank(item, context = {}) {
  const parts = scoreParts(item.score);
  if (!parts) return -Infinity;
  const total = parts.home + parts.away;
  const margin = Math.abs(parts.home - parts.away);
  let rank = Number(item.probability || 0) * Number(context.probabilityWeight ?? 1) + commonScorePrior(item.score) * Number(context.scorePriorWeight ?? 1);
  const profile = context.scorelineProfile || {};
  const profileSample = Number(profile.sampleSize || 0);
  if (profileSample >= 8) {
    const topScores = Array.isArray(profile.topScores) ? profile.topScores : [];
    const totalCounts = Array.isArray(profile.totalGoalCounts) ? profile.totalGoalCounts : [];
    const marginCounts = Array.isArray(profile.marginCounts) ? profile.marginCounts : [];
    const exactSeen = topScores.find((entry) => String(entry.key) === item.score);
    const totalSeen = totalCounts.find((entry) => Number(entry.key) === total);
    const marginSeen = marginCounts.find((entry) => Number(entry.key) === margin);
    if (exactSeen) rank += Math.min(0.035, Number(exactSeen.count || 0) / profileSample * 0.14);
    if (totalSeen) rank += Math.min(0.025, Number(totalSeen.count || 0) / profileSample * 0.075);
    if (marginSeen) rank += Math.min(0.018, Number(marginSeen.count || 0) / profileSample * 0.05);
    const averageTotalGoals = Number(profile.averageTotalGoals || 0);
    if (averageTotalGoals >= 3.2 && total >= 3) rank += 0.012;
    if (averageTotalGoals <= 2.4 && total <= 2) rank += 0.012;
    if (Number(profile.highEventRate || 0) >= 0.38 && total >= 4) rank += 0.014;
    if (Number(profile.lowEventRate || 0) >= 0.55 && total <= 2) rank += 0.014;
  }
  if (context.pickSide && scoreSide(parts) === context.pickSide) rank += 0.02;
  if (context.expectedTotal !== null && Number.isFinite(context.expectedTotal)) {
    rank -= Math.abs(total - context.expectedTotal) * 0.004;
  }
  if (context.targetTotal !== null && Number.isFinite(context.targetTotal)) {
    rank -= Math.abs(total - context.targetTotal) * 0.006;
  }
  if (context.compressed) {
    if (margin <= 1) rank += 0.012;
    if (total <= 2) rank += 0.008;
    if (total >= 4) rank -= 0.012;
  }
  if (context.strongFavorite && context.pickSide && context.pickSide !== "draw") {
    if (margin >= 2 && total >= 2 && total <= 4) rank += 0.012;
    if (margin === 1 && total <= 2) rank -= 0.004;
  }
  if (context.upsetPick) {
    if (margin === 1) rank += 0.014;
    if (margin >= 2) rank -= 0.012;
  }
  if (context.pickSide === "draw") {
    if (item.score === "1-1") rank += context.lowEventBias ? 0.004 : 0.012;
    if (item.score === "0-0") rank += context.lowEventBias ? 0.014 : 0.004;
    if (margin > 0) rank -= 0.03;
  }
  if (context.pickSide && context.pickSide !== "draw" && Number(context.pickProbability || 0) < 0.58 && margin === 1) {
    rank += 0.01;
  }
  if (context.highEventBias && total >= Math.max(3, context.baseTotal + 1)) rank += 0.01;
  if (context.lowEventBias && total <= Math.max(1, context.baseTotal)) rank += 0.01;
  if (context.goalDelta < -0.006 && total <= context.baseTotal) rank += 0.008;
  if (context.goalDelta > 0.006 && total >= context.baseTotal + 1) rank += 0.008;
  return rank;
}

function calibratedPredictedScore(evidence, adjustment = {}, pickSide = null, pickProbability = 0) {
  const base = evidence.poisson?.predictedScore || null;
  const scenarios = Array.isArray(evidence.poisson?.topScorelines) ? evidence.poisson.topScorelines : [];
  if (!base || !scenarios.length) return base;
  const baseParts = scoreParts(base);
  if (!baseParts) return base;
  const baseTotal = baseParts.home + baseParts.away;
  const goalDelta = Number(adjustment.goalVolatilityDelta || 0);
  const shape = scoreShapeContext(evidence, adjustment, pickSide, pickProbability);
  let candidates = scenarios.filter((item) => scoreParts(item.score));
  const sideCandidates = pickSide ? candidates.filter((item) => scoreSide(scoreParts(item.score)) === pickSide) : [];
  if (sideCandidates.length) candidates = sideCandidates;
  let targetTotal = baseTotal;
  if (goalDelta >= 0.008) targetTotal = baseTotal + 1;
  if (goalDelta <= -0.008) targetTotal = Math.max(0, baseTotal - 1);
  const totalCandidates = candidates.filter((item) => {
    const parts = scoreParts(item.score);
    if (goalDelta >= 0.008) return parts && (parts.home + parts.away) >= baseTotal + 1;
    if (goalDelta <= -0.008) return parts && (parts.home + parts.away) <= Math.max(0, baseTotal - 1);
    return true;
  });
  if (totalCandidates.length) candidates = totalCandidates;
  candidates.sort((a, b) => scoreCandidateRank(b, {
    ...shape,
    pickSide,
    pickProbability,
    targetTotal,
    baseTotal,
    goalDelta
  }) - scoreCandidateRank(a, {
    ...shape,
    pickSide,
    pickProbability,
    targetTotal,
    baseTotal,
    goalDelta
  }));
  if (candidates[0]?.score) return candidates[0].score;
  if (goalDelta >= 0.008) {
    return scenarios.find((item) => {
      const parts = scoreParts(item.score);
      return parts && (parts.home + parts.away) >= baseTotal + 1;
    })?.score || base;
  }
  if (goalDelta <= -0.008) {
    return scenarios.find((item) => {
      const parts = scoreParts(item.score);
      return parts && (parts.home + parts.away) <= Math.max(0, baseTotal - 1);
    })?.score || base;
  }
  return base;
}

function calibratedScoreScenarios(evidence, adjustment = {}, pickSide = null, pickProbability = 0, limit = 5) {
  const scenarios = Array.isArray(evidence.poisson?.topScorelines) ? evidence.poisson.topScorelines : [];
  if (!scenarios.length) return [];
  const base = evidence.poisson?.predictedScore || scenarios[0]?.score || null;
  const baseParts = scoreParts(base);
  const baseTotal = baseParts ? baseParts.home + baseParts.away : null;
  const goalDelta = Number(adjustment.goalVolatilityDelta || 0);
  const shape = scoreShapeContext(evidence, adjustment, pickSide, pickProbability);
  return scenarios
    .filter((item) => scoreParts(item.score))
    .map((item) => ({
      ...item,
      rank: Number(scoreCandidateRank(item, {
        ...shape,
        pickSide,
        pickProbability,
        targetTotal: baseTotal,
        baseTotal,
        goalDelta
      }).toFixed(6))
    }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit);
}

function applyMistakeCalibration(payload, evidence, baseProbabilities) {
  const adjustment = evidence.mistakeEngine?.calibrationAdjustment || null;
  if (!evidence.mistakeEngine?.usable || !adjustment) {
    return {
      probabilities: baseProbabilities,
      calibrationLayer: {
        version: "kv-calibration-v1",
        applied: false,
        source: evidence.mistakeEngine?.source || "paul:mistake-memory:v1",
        sampleSize: evidence.mistakeEngine?.calibrationAdjustment?.sampleSize || 0
      }
    };
  }
  const allowDraw = payload.round === "Group Stage";
  let probabilities = { ...baseProbabilities };
  const notes = [];
  const marketFactor = clamp(
    Math.max(0, Number(adjustment.marketShrinkDelta || 0)) +
      Math.max(0, -Number(adjustment.edgeTrustDelta || 0)) * 0.8,
    0,
    0.08
  );
  if (marketFactor > 0 && evidence.market?.probabilities) {
    probabilities = blendToward(probabilities, evidence.market.probabilities, marketFactor * 3.5);
    notes.push(`market shrink ${marketFactor.toFixed(3)}`);
  }
  if (allowDraw && Number(adjustment.drawRiskDelta || 0) !== 0) {
    probabilities = rebalanceDraw(probabilities, Number(adjustment.drawRiskDelta || 0), allowDraw);
    notes.push(`draw risk ${Number(adjustment.drawRiskDelta || 0).toFixed(3)}`);
  }
  const marketFavoriteSide = evidence.baselines?.marketFavorite?.side || null;
  const underdogSide = sideFromCode(payload, evidence.paulEdge?.underdogCode || null);
  const upsetShift = Number(adjustment.upsetSensitivityDelta || 0);
  if (underdogSide && marketFavoriteSide && underdogSide !== marketFavoriteSide && upsetShift !== 0) {
    if (upsetShift > 0) {
      probabilities = shiftProbability(probabilities, marketFavoriteSide, underdogSide, clamp(upsetShift, 0, 0.03));
      notes.push(`upset sensitivity +${upsetShift.toFixed(3)}`);
    } else {
      probabilities = shiftProbability(probabilities, underdogSide, marketFavoriteSide, clamp(Math.abs(upsetShift), 0, 0.03));
      notes.push(`upset sensitivity ${upsetShift.toFixed(3)}`);
    }
  }
  return {
    probabilities: normalize3Way(probabilities),
    calibrationLayer: {
      version: "kv-calibration-v1",
      applied: true,
      source: evidence.mistakeEngine.source || "paul:mistake-memory:v1",
      sampleSize: Number(adjustment.sampleSize || 0),
      adjustments: {
        edgeTrustDelta: Number(adjustment.edgeTrustDelta || 0),
        marketShrinkDelta: Number(adjustment.marketShrinkDelta || 0),
        drawRiskDelta: Number(adjustment.drawRiskDelta || 0),
        upsetSensitivityDelta: Number(adjustment.upsetSensitivityDelta || 0),
        scoreConfidenceDelta: Number(adjustment.scoreConfidenceDelta || 0),
        goalVolatilityDelta: Number(adjustment.goalVolatilityDelta || 0)
      },
      before: probabilitiesToPercentages(baseProbabilities),
      after: probabilitiesToPercentages(normalize3Way(probabilities)),
      notes
    }
  };
}

function defaultEvidenceUsed(evidence) {
  const used = [];
  if (evidence.market?.probabilities) used.push("market consensus odds");
  if (evidence.ratings?.probabilities) used.push("team ratings / Elo baseline");
  if (evidence.poisson?.probabilities) used.push("attack-defense score model");
  if (evidence.form?.teamA && evidence.form?.teamB) used.push("recent form");
  if (evidence.intelligence || evidence.market?.intelligence) used.push("team news and availability");
  if (evidence.mistakeEngine?.usable) used.push("mistake engine calibration memory");
  if (evidence.learning?.applied) used.push("adaptive learning weights from post-match memory");
  if (evidence.universal) used.push("historical Universal gate");
  if (evidence.searchFallback) used.push("fresh public news/search validation");
  return used;
}

function deterministicAnalysis(payload, evidence) {
  const allowDraw = payload.round === "Group Stage";
  const uncalibratedProbabilities = probabilitiesFromAny(
    evidence.modelBlend,
    evidence.market?.probabilities ||
      evidence.ratings?.probabilities ||
      evidence.poisson?.probabilities ||
      normalize3Way({ home: 0.5, draw: allowDraw ? 0.2 : 0, away: 0.5 })
  );
  const calibration = applyMistakeCalibration(payload, evidence, uncalibratedProbabilities);
  const baseProbabilities = calibration.probabilities || uncalibratedProbabilities;
  let side = favoriteFromProbabilities(payload, baseProbabilities)?.side ||
    evidence.baselines?.marketFavorite?.side ||
    evidence.baselines?.blendedFavorite?.side ||
    evidence.baselines?.ratingFavorite?.side ||
    evidence.baselines?.poissonFavorite?.side ||
    "home";
  if (allowDraw && evidence.paulEdge?.drawSqueeze) {
    side = "draw";
  } else if (evidence.universal?.override && evidence.universal?.pickSide) {
    side = evidence.universal.pickSide;
  } else if (evidence.paulEdge?.conservativeOverride && Number(evidence.paulEdge?.upsetScore || 0) >= 55) {
    side = evidence.baselines?.blendedFavorite?.side || side;
  }
  if (!allowDraw && side === "draw") {
    side = favoriteFromProbabilities(
      payload,
      normalize3Way({ home: Number(baseProbabilities.home || 0), draw: 0, away: Number(baseProbabilities.away || 0) })
    )?.side || "home";
  }
  const pick = side === "home"
    ? payload.teamA
    : side === "away"
      ? payload.teamB
      : { code: "DRAW", name: "Draw" };
  const pickProbability = Number(sideProbability(baseProbabilities, side) || 0);
  const marketPickProbability = Number(sideProbability(evidence.market?.probabilities, side) || 0);
  const confidenceAdjustment = Number(evidence.mistakeEngine?.calibrationAdjustment?.scoreConfidenceDelta || 0) * 100;
  const confidence = clamp(Math.round(Math.max(pickProbability, marketPickProbability) * 100 + confidenceAdjustment), 50, 88);
  const scoreScenarios = calibratedScoreScenarios(evidence, evidence.mistakeEngine?.calibrationAdjustment, side, pickProbability, 5);
  return {
    winnerCode: pick.code,
    winnerName: pick.name,
    confidence,
    predictedScore: scoreScenarios[0]?.score || calibratedPredictedScore(evidence, evidence.mistakeEngine?.calibrationAdjustment, side, pickProbability) || null,
    scoreScenarios,
    probabilities: probabilitiesToPercentages(baseProbabilities),
    evidenceUsed: defaultEvidenceUsed(evidence),
    marketBaseline: evidence.baselines?.marketFavorite
      ? `${evidence.baselines.marketFavorite.winnerName} ${Math.round(Number(evidence.baselines.marketFavorite.probability || 0) * 100)}%`
      : null,
    ratingBaseline: evidence.baselines?.ratingFavorite
      ? `${evidence.baselines.ratingFavorite.winnerName} ${Math.round(Number(evidence.baselines.ratingFavorite.probability || 0) * 100)}%`
      : null,
    calibrationLayer: calibration.calibrationLayer,
    calibrationNote: calibration.calibrationLayer?.applied
      ? `Mistake-engine KV calibration is auto-applied before the final pick. ${calibration.calibrationLayer.notes?.join("; ") || "No extra note."}`
      : evidence.universal?.override
        ? `Universal overlay moved PAUL toward ${evidence.universal.pickName} because ${evidence.universal.signals?.join("; ") || "cross-model support cleared the gate"}.`
      : evidence.paulEdge?.conservativeOverride
        ? "Pick is anchored to the protected PAUL evidence layer, with the upset path allowed only through the conservative override gate."
        : "Pick stays close to the protected market/blended evidence layer unless the draw/upset gates are explicitly open."
  };
}

function mergeAnalysisWithEvidence(payload, evidence, analysis = {}) {
  const anchored = deterministicAnalysis(payload, evidence);
  const aiProbabilities = probabilitiesFromAny(analysis.probabilities, null);
  const finalProbabilities = probabilitiesToPercentages(aiProbabilities || probabilitiesFromAny(anchored.probabilities, null));
  const finalEvidenceUsed = Array.from(new Set([
    ...defaultEvidenceUsed(evidence),
    ...(Array.isArray(analysis.evidenceUsed) ? analysis.evidenceUsed : [])
  ])).filter(Boolean);
  const aiWinnerCode = String(analysis.winnerCode || analysis.winner || "").toUpperCase();
  const winnerOverridden = Boolean(aiWinnerCode && aiWinnerCode !== String(anchored.winnerCode).toUpperCase());
  return {
    ...analysis,
    winnerCode: anchored.winnerCode,
    winnerName: anchored.winnerName,
    confidence: anchored.confidence,
    predictedScore: anchored.predictedScore,
    scoreScenarios: anchored.scoreScenarios,
    probabilities: finalProbabilities,
    evidenceUsed: finalEvidenceUsed,
    marketBaseline: analysis.marketBaseline || anchored.marketBaseline,
    ratingBaseline: analysis.ratingBaseline || anchored.ratingBaseline,
    calibrationLayer: anchored.calibrationLayer,
    calibrationNote: winnerOverridden
      ? `${anchored.calibrationNote} LLM wording was normalized back to the evidence-layer pick.`
      : (analysis.calibrationNote || anchored.calibrationNote)
  };
}

async function callPaul(payload, options = {}) {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
  if (!apiKey) {
    const error = new Error("PAUL AI is not connected: missing DASHSCOPE_API_KEY.");
    error.status = 400;
    throw error;
  }
  const evidence = await collectPredictionEvidence(payload);
  const useSearchFallback = (
    !evidence.market ||
    !evidence.hasPrimaryEvidence ||
    options.forceSearch ||
    evidence.preLockRehearsal?.searchPlan?.required ||
    process.env.QWEN_FORCE_SEARCH === "1"
  );
  evidence.searchFallback = useSearchFallback;
  evidence.searchMode = options.forceSearch ? "forced-live-news-refresh" : (useSearchFallback ? "conditional-search" : "local-evidence-first");
  const requestBody = {
    model: qwenModel,
    messages: [
      { role: "system", content: "Return compact JSON only. Do not use markdown." },
      { role: "user", content: buildPrompt(payload, evidence) }
    ],
    temperature: 0.35,
    response_format: { type: "json_object" }
  };
  if (useSearchFallback) {
    requestBody.enable_search = true;
    requestBody.search_options = { forced_search: true, search_strategy: "max" };
  }
  const response = await fetch(`${qwenEndpoint.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  const text = await response.text();
  if (!response.ok) {
    const error = new Error(`PAUL AI request failed with status ${response.status}.`);
    error.status = response.status;
    error.detail = text.slice(0, 800);
    throw error;
  }
  const data = JSON.parse(text);
  const content = data.choices?.[0]?.message?.content || "{}";
  let analysis;
  try {
    analysis = JSON.parse(content);
  } catch {
    analysis = { reasoning: content };
  }
  analysis = mergeAnalysisWithEvidence(payload, evidence, analysis);
  analysis = preventKnockoutDraw(payload, analysis);
  evidence.calibrationLayer = analysis.calibrationLayer || null;
  return { model: "PAUL Edge Engine v4.1 + KV Calibration", evidence, analysis };
}

function loadSnapshot() {
  return readJson(path.join(dataDir, "match-snapshot.json"), { matches: [] });
}

module.exports = {
  callPaul,
  collectPredictionEvidence,
  calibratedPredictedScore,
  calibratedScoreScenarios,
  loadSnapshot
};
