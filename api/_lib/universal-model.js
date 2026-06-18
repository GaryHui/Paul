const universalStrategies = {
  marketAnchor: {
    id: "market-anchor",
    weights: { market: 1, rating: 0, score: 0 },
    drawMin: 1,
    drawMarginMax: 0,
    drawEdgeMin: 1,
    overrideMarginMax: 0,
    overrideEdgeMin: 1,
    minOverrideOdds: 99,
    strongAnchor: 1
  },
  balanced: {
    id: "balanced-v1",
    weights: { market: 0.62, rating: 0.23, score: 0.15 },
    drawMin: 0.28,
    drawMarginMax: 0.055,
    drawEdgeMin: 0,
    overrideMarginMax: 0.075,
    overrideEdgeMin: 0.045,
    minOverrideOdds: 2.35,
    strongAnchor: 0.62
  },
  drawWatch: {
    id: "draw-watch-1",
    weights: { market: 0.7, rating: 0.18, score: 0.12 },
    drawMin: 0.285,
    drawMarginMax: 0.075,
    drawEdgeMin: 0.015,
    overrideMarginMax: 0.04,
    overrideEdgeMin: 0.06,
    minOverrideOdds: 3.1,
    strongAnchor: 0.6
  },
  ratingNudge: {
    id: "rating-nudge",
    weights: { market: 0.66, rating: 0.24, score: 0.1 },
    drawMin: 0.29,
    drawMarginMax: 0.06,
    drawEdgeMin: 0.015,
    overrideMarginMax: 0.06,
    overrideEdgeMin: 0.05,
    minOverrideOdds: 2.9,
    strongAnchor: 0.6
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize(probs) {
  const home = Number(probs?.home || 0);
  const draw = Number(probs?.draw || 0);
  const away = Number(probs?.away || 0);
  const sum = home + draw + away;
  if (!sum) return null;
  return { home: home / sum, draw: draw / sum, away: away / sum };
}

function favorite(probs, allowDraw = true) {
  if (!probs) return null;
  const sides = allowDraw ? ["home", "draw", "away"] : ["home", "away"];
  return sides.sort((a, b) => Number(probs[b] || 0) - Number(probs[a] || 0))[0] || null;
}

function blend(models, weights) {
  const usable = [
    { probabilities: models.market, weight: Number(weights.market || 0) },
    { probabilities: models.rating, weight: Number(weights.rating || 0) },
    { probabilities: models.score, weight: Number(weights.score || 0) }
  ].filter((item) => item.probabilities && item.weight > 0);
  const totalWeight = usable.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return null;
  return normalize({
    home: usable.reduce((sum, item) => sum + item.probabilities.home * item.weight, 0) / totalWeight,
    draw: usable.reduce((sum, item) => sum + item.probabilities.draw * item.weight, 0) / totalWeight,
    away: usable.reduce((sum, item) => sum + item.probabilities.away * item.weight, 0) / totalWeight
  });
}

function sideCode(match, side) {
  if (side === "home") return match.teamA?.code || null;
  if (side === "away") return match.teamB?.code || null;
  if (side === "draw") return "DRAW";
  return null;
}

function sideName(match, side) {
  if (side === "home") return match.teamA?.name || "Home";
  if (side === "away") return match.teamB?.name || "Away";
  if (side === "draw") return "Draw";
  return null;
}

function sideProbability(probabilities, side) {
  return probabilities && side ? Number(probabilities[side] || 0) : 0;
}

function sideOdds(evidence, side) {
  if (side === "home") return Number(evidence.market?.odds?.home);
  if (side === "away") return Number(evidence.market?.odds?.away);
  if (side === "draw") return Number(evidence.market?.odds?.draw);
  return NaN;
}

function strategyForEvidence(match, evidence) {
  const learning = evidence.learning?.profile || {};
  const adjustment = learning.calibrationAdjustment || evidence.mistakeEngine?.calibrationAdjustment || {};
  const drawRisk = Number(adjustment.drawRiskDelta || 0);
  const upsetSensitivity = Number(adjustment.upsetSensitivityDelta || 0);
  const marketShrink = Number(adjustment.marketShrinkDelta || 0);
  if (match.round === "Group Stage" && drawRisk > 0.01) return universalStrategies.drawWatch;
  if (upsetSensitivity > 0.012) return universalStrategies.ratingNudge;
  if (marketShrink > 0.025) return universalStrategies.marketAnchor;
  return universalStrategies.balanced;
}

function learningAdjustedStrategy(base, evidence) {
  const learning = evidence.learning?.profile || {};
  const adjustment = learning.calibrationAdjustment || evidence.mistakeEngine?.calibrationAdjustment || {};
  const upsetSensitivity = Number(adjustment.upsetSensitivityDelta || 0);
  const drawRisk = Number(adjustment.drawRiskDelta || 0);
  const marketShrink = Number(adjustment.marketShrinkDelta || 0);
  const edgeTrust = Number(adjustment.edgeTrustDelta || 0);
  return {
    ...base,
    id: `${base.id}+paul-learning`,
    strongAnchor: clamp(base.strongAnchor + marketShrink * 0.35 - upsetSensitivity * 0.2, 0.56, 0.68),
    overrideMarginMax: clamp(base.overrideMarginMax + upsetSensitivity * 0.6 - marketShrink * 0.45 + Math.max(0, edgeTrust) * 0.2, 0.025, 0.16),
    overrideEdgeMin: clamp(base.overrideEdgeMin - upsetSensitivity * 0.25 + marketShrink * 0.3, 0.02, 0.08),
    drawMin: clamp(base.drawMin - drawRisk * 0.45 + marketShrink * 0.2, 0.265, 0.32),
    drawMarginMax: clamp(base.drawMarginMax + drawRisk * 0.65 - marketShrink * 0.2, 0.035, 0.1),
    minOverrideOdds: clamp(base.minOverrideOdds - upsetSensitivity * 8 + marketShrink * 6, 2.35, 3.4)
  };
}

function universalPickForPaul(match, evidence) {
  const allowDraw = match.round === "Group Stage";
  const models = {
    market: normalize(evidence.market?.probabilities),
    rating: normalize(evidence.ratings?.probabilities),
    score: normalize(evidence.poisson?.probabilities || evidence.modelBlend)
  };
  if (!models.market || (!models.rating && !models.score)) return null;
  const baseStrategy = strategyForEvidence(match, evidence);
  const strategy = learningAdjustedStrategy(baseStrategy, evidence);
  const blended = blend(models, strategy.weights);
  if (!blended) return null;

  const marketPick = favorite(models.market, allowDraw);
  const blendedPick = favorite(blended, allowDraw);
  if (!marketPick || !blendedPick) return null;
  const sorted = (allowDraw ? ["home", "draw", "away"] : ["home", "away"])
    .sort((a, b) => sideProbability(models.market, b) - sideProbability(models.market, a));
  const marketMargin = sideProbability(models.market, sorted[0]) - sideProbability(models.market, sorted[1]);
  const edge = sideProbability(blended, blendedPick) - sideProbability(models.market, blendedPick);
  const strongAnchor = sideProbability(models.market, marketPick) >= strategy.strongAnchor;
  const disagreement = new Set([
    marketPick,
    favorite(models.rating, allowDraw),
    favorite(models.score, allowDraw),
    blendedPick
  ].filter(Boolean)).size;
  const selectedOdds = sideOdds(evidence, blendedPick);
  const signals = [];
  let pick = marketPick;
  let override = false;

  if (strongAnchor) signals.push("market favorite protected by universal strong-anchor gate");
  if (!strongAnchor && blendedPick !== marketPick && marketMargin <= strategy.overrideMarginMax && edge >= strategy.overrideEdgeMin && disagreement >= 2) {
    pick = blendedPick;
    override = true;
    signals.push("universal historical gate allows model override");
  }
  if (!strongAnchor && allowDraw && blendedPick === "draw" && models.market.draw >= strategy.drawMin && marketMargin <= strategy.drawMarginMax && (blended.draw - models.market.draw) >= strategy.drawEdgeMin) {
    pick = "draw";
    override = true;
    signals.push("universal draw-compression gate");
  }
  if (override && pick !== "draw" && Number.isFinite(selectedOdds) && selectedOdds < strategy.minOverrideOdds) {
    pick = marketPick;
    override = false;
    signals.push("universal override rejected: price too short");
  }
  if (!override && pick === marketPick) signals.push("universal gate keeps PAUL anchored to market");

  return {
    strategyId: strategy.id,
    baseStrategyId: baseStrategy.id,
    pickSide: pick,
    pickCode: sideCode(match, pick),
    pickName: sideName(match, pick),
    override,
    probability: Number(sideProbability(blended, pick).toFixed(3)),
    marketProbability: Number(sideProbability(models.market, pick).toFixed(3)),
    edge: Number(edge.toFixed(3)),
    marketPickSide: marketPick,
    marketMargin: Number(marketMargin.toFixed(3)),
    support: disagreement,
    probabilities: blended,
    weights: strategy.weights,
    thresholds: {
      strongAnchor: strategy.strongAnchor,
      overrideMarginMax: strategy.overrideMarginMax,
      overrideEdgeMin: strategy.overrideEdgeMin,
      drawMin: strategy.drawMin,
      drawMarginMax: strategy.drawMarginMax,
      minOverrideOdds: strategy.minOverrideOdds
    },
    signals,
    note: override
      ? "Universal historical gate permits PAUL to move away from market, but PAUL news/KV learning still has final authority."
      : "Universal historical gate keeps the market anchor unless PAUL evidence confirms a stronger live edge."
  };
}

module.exports = {
  universalPickForPaul,
  universalStrategies
};
