const fs = require("fs");
const path = require("path");
const { fetchRemoteMarketOdds, oddsToProbabilities } = require("../../lib/odds");

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
  for (let a = 0; a <= 7; a += 1) {
    for (let b = 0; b <= 7; b += 1) {
      const p = poisson(a, aLambda) * poisson(b, bLambda);
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

function favoriteFromProbabilities(match, probabilities) {
  if (!probabilities) return null;
  const candidates = [
    { side: "home", winnerCode: match.teamA.code, winnerName: match.teamA.name, probability: probabilities.home },
    { side: "draw", winnerCode: "DRAW", winnerName: "Draw", probability: probabilities.draw },
    { side: "away", winnerCode: match.teamB.code, winnerName: match.teamB.name, probability: probabilities.away }
  ].sort((a, b) => b.probability - a.probability);
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
  const direct = Number(record.form || record.rating || record.power || record.score);
  if (Number.isFinite(direct) && direct) return direct;
  const wins = Number(record.wins || 0);
  const draws = Number(record.draws || 0);
  const losses = Number(record.losses || 0);
  const played = wins + draws + losses;
  if (played) return (wins * 3 + draws) / played;
  return null;
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

function findByMatchId(collection, matchId) {
  if (!collection) return null;
  if (Array.isArray(collection)) {
    return collection.find((item) => String(item.matchId || item.id) === String(matchId)) || null;
  }
  return collection[matchId] || collection[String(matchId)] || null;
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
  const remoteOdds = options.liveOdds === false ? { record: null, errors: [] } : await fetchRemoteMarketOdds(match);
  const oddsRecord = remoteOdds.record || findByMatchId(allOdds, match.id);
  const marketProb = oddsToProbabilities(oddsRecord?.odds || oddsRecord);
  const ratingA = findTeamRecord(allRatings, match.teamA.code);
  const ratingB = findTeamRecord(allRatings, match.teamB.code);
  const formA = findTeamRecord(allForm, match.teamA.code);
  const formB = findTeamRecord(allForm, match.teamB.code);
  const allowDraw = match.round === "Group Stage";
  const eloProb = ratingA?.elo && ratingB?.elo ? eloProbabilities(ratingA.elo, ratingB.elo, allowDraw) : null;
  let poisson = null;
  if (ratingA?.attack && ratingA?.defense && ratingB?.attack && ratingB?.defense) {
    const base = allowDraw ? 1.22 : 1.28;
    const aLambda = clamp(base * Number(ratingA.attack) / Math.max(0.1, Number(ratingB.defense)), 0.25, 3.5);
    const bLambda = clamp(base * Number(ratingB.attack) / Math.max(0.1, Number(ratingA.defense)), 0.25, 3.5);
    poisson = poissonProbabilities(aLambda, bLambda, allowDraw);
  }
  const modelBlend = blendModels([
    { name: "market", probabilities: marketProb, weight: 55 },
    { name: "elo", probabilities: eloProb, weight: 25 },
    { name: "poisson", probabilities: poisson?.probabilities, weight: 20 }
  ]);
  const hasPrimaryEvidence = Boolean(marketProb || eloProb || poisson);
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
          probabilities: marketProb
        }
      : null,
    marketFetchErrors: remoteOdds.errors,
    ratings: ratingA && ratingB ? { teamA: ratingA, teamB: ratingB, probabilities: eloProb } : null,
    form: formA && formB ? { teamA: formA, teamB: formB } : null,
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
  return evidence;
}

function buildPrompt(payload, evidence) {
  const needsSearch = !evidence.hasPrimaryEvidence;
  return [
    "You are PAUL AI, an AI octopus for pre-match FIFA World Cup predictions.",
    needsSearch
      ? "Local odds/Elo evidence is missing. Use web search to find recent public information before making the prediction."
      : "Base the prediction on the real evidence object first, and use web search only to supplement the latest context.",
    "Use this decision order: 1) market-implied probability as the anchor, 2) Elo/SPI-style rating strength, 3) attack/defense score model, 4) recent form and availability, 5) tactical upset path.",
    "Do not blindly copy the favorite. Look for plausible upset signals: undervalued teams, injury mismatch, fixture congestion, tactical matchup, psychology, group-table pressure, venue, travel, rest, and weather.",
    "Explicitly compare PAUL's pick with marketFavorite, ratingFavorite, poissonFavorite, and blendedFavorite from evidence.baselines.",
    "Use evidence.paulEdge as PAUL's proprietary edge layer. If upsetScore is high and conservativeOverride is true, explain the upset path; otherwise stay close to the market/blended consensus.",
    "Only treat DRAW as a serious PAUL pick when evidence.paulEdge.drawSqueeze is true; do not force a draw from a merely narrow market.",
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

async function callPaul(payload) {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
  if (!apiKey) {
    const error = new Error("PAUL AI is not connected: missing DASHSCOPE_API_KEY.");
    error.status = 400;
    throw error;
  }
  const evidence = await collectPredictionEvidence(payload);
  const useSearchFallback = !evidence.hasPrimaryEvidence || process.env.QWEN_FORCE_SEARCH === "1";
  evidence.searchFallback = useSearchFallback;
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
  return { model: "PAUL", evidence, analysis };
}

function loadSnapshot() {
  return readJson(path.join(dataDir, "match-snapshot.json"), { matches: [] });
}

module.exports = {
  callPaul,
  collectPredictionEvidence,
  loadSnapshot
};
