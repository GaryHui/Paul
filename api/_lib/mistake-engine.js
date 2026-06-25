const { getMistakeMemory, getQwenUsage, recordQwenUsage, setMistakeMemory } = require("./store");
const { chooseQwenModel, qwenBudgetDecision, qwenEndpoint, qwenMaxTokens } = require("./qwen-router");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function predictionAnalysis(prediction) {
  return prediction?.analysis || prediction?.proof?.payload?.prediction || null;
}

function scoreParts(score) {
  const match = String(score || "").match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function scoreKey(parts) {
  return parts ? `${parts.home}-${parts.away}` : null;
}

function winnerFromAnalysis(analysis) {
  return String(analysis?.winnerCode || analysis?.winner || "").toUpperCase();
}

function topCountEntries(counts = {}, limit = 8) {
  return Object.entries(counts)
    .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function winnerForResult(match, result) {
  if (result?.winnerCode) return String(result.winnerCode).toUpperCase();
  if (Number(result?.homeScore) === Number(result?.awayScore)) return "DRAW";
  return Number(result?.homeScore) > Number(result?.awayScore)
    ? String(match.teamA?.code || "").toUpperCase()
    : String(match.teamB?.code || "").toUpperCase();
}

function sideForCode(match, code) {
  const value = String(code || "").toUpperCase();
  if (value === String(match.teamA?.code || "").toUpperCase()) return "home";
  if (value === String(match.teamB?.code || "").toUpperCase()) return "away";
  if (value === "DRAW") return "draw";
  return null;
}

function probabilityForSide(probabilities, side) {
  return probabilities && side ? Number(probabilities[side] || 0) : null;
}

function marketFavorite(evidence) {
  return evidence?.baselines?.marketFavorite || evidence?.marketBaseline || null;
}

function teamCodes(match) {
  return [match.teamA?.code, match.teamB?.code].filter(Boolean).map((code) => String(code).toUpperCase());
}

function causeCounts(items) {
  return items.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

const calibrationKeys = [
  "edgeTrustDelta",
  "scoreModelDelta",
  "marketShrinkDelta",
  "drawRiskDelta",
  "upsetSensitivityDelta",
  "goalVolatilityDelta"
];

function emptyCalibrationTotals() {
  return Object.fromEntries(calibrationKeys.map((key) => [key, 0]));
}

function addCalibrationTotals(target = {}, hints = {}) {
  calibrationKeys.forEach((key) => {
    target[key] = Number(target[key] || 0) + Number(hints?.[key] || 0);
  });
  return target;
}

function averageCalibrationTotals(totals = {}, matches = 0) {
  if (!matches) return null;
  return Object.fromEntries(calibrationKeys.map((key) => [
    key,
    Number((Number(totals[key] || 0) / matches).toFixed(4))
  ]));
}

function classifyReview({ match, result, analysis, evidence }) {
  const predictedWinner = String(analysis?.winnerCode || analysis?.winner || "").toUpperCase();
  const actualWinner = winnerForResult(match, result);
  const predictedScore = scoreParts(analysis?.predictedScore || analysis?.score);
  const scoreScenarios = Array.isArray(analysis?.scoreScenarios) ? analysis.scoreScenarios : [];
  const actualScore = { home: Number(result.homeScore), away: Number(result.awayScore) };
  const actualScoreKey = scoreKey(actualScore);
  const directionHit = Boolean(predictedWinner && actualWinner && predictedWinner === actualWinner);
  const scoreHit = Boolean(predictedScore && predictedScore.home === actualScore.home && predictedScore.away === actualScore.away);
  const scorePathKeys = scoreScenarios.map((item) => scoreKey(scoreParts(item?.score || item?.scoreline))).filter(Boolean);
  const scoreTop3Hit = Boolean(actualScoreKey && scorePathKeys.slice(0, 3).includes(actualScoreKey));
  const scoreTop5Hit = Boolean(actualScoreKey && scorePathKeys.slice(0, 5).includes(actualScoreKey));
  const predictedSide = sideForCode(match, predictedWinner);
  const actualSide = sideForCode(match, actualWinner);
  const market = marketFavorite(evidence);
  const marketCode = String(market?.winnerCode || "").toUpperCase();
  const marketHit = marketCode ? marketCode === actualWinner : null;
  const marketSide = sideForCode(match, marketCode);
  const paulProbability = probabilityForSide(analysis?.probabilities, predictedSide);
  const marketProbability = probabilityForSide(evidence?.market?.probabilities, marketSide);
  const actualMarketProbability = probabilityForSide(evidence?.market?.probabilities, actualSide);
  const predictedTotal = predictedScore ? predictedScore.home + predictedScore.away : null;
  const actualTotal = actualScore.home + actualScore.away;
  const totalGoalDiff = predictedTotal === null ? null : actualTotal - predictedTotal;
  const goalDiff = predictedScore
    ? Math.abs(predictedScore.home - actualScore.home) + Math.abs(predictedScore.away - actualScore.away)
    : null;
  const causes = [];

  if (!directionHit) {
    causes.push("direction_miss");
    if (actualWinner === "DRAW") causes.push("draw_underestimated");
    if (marketHit === true) causes.push("market_anchor_underweighted");
    if (marketHit === false && marketCode) causes.push("market_missed_too");
    if (actualMarketProbability !== null && actualMarketProbability < 0.28) causes.push("upset_underestimated");
  } else if (marketHit === false && marketCode) {
    causes.push("paul_outperformed_market");
  }

  if (directionHit && !scoreHit) causes.push("score_miss");
  if (predictedScore && !scoreHit) {
    if (scoreTop3Hit) causes.push("score_top3_hit");
    else if (scoreTop5Hit) causes.push("score_top5_hit");
    if (totalGoalDiff !== null && totalGoalDiff >= 2) causes.push("pace_or_finishing_underestimated");
    if (totalGoalDiff !== null && totalGoalDiff <= -2) causes.push("low_event_game_underestimated");
    if (goalDiff !== null && goalDiff <= 1) causes.push("minor_score_variance");
  }

  if (Number(analysis?.confidence || 0) >= 65 && !directionHit) causes.push("overconfidence");
  if (evidence?.paulEdge?.drawSqueeze && actualWinner !== "DRAW") causes.push("false_draw_squeeze");
  if (evidence?.paulEdge?.conservativeOverride && !directionHit) causes.push("false_upset_override");

  return {
    directionHit,
    scoreHit,
    scoreTop3Hit,
    scoreTop5Hit,
    goalDiff,
    predictedWinner,
    actualWinner,
    predictedScore: analysis?.predictedScore || analysis?.score || null,
    actualScore: `${result.homeScore}-${result.awayScore}`,
    marketFavorite: marketCode || null,
    marketHit,
    marketEdgeOutcome: marketCode
      ? directionHit && marketHit ? "both_correct"
        : directionHit && !marketHit ? "paul_only_correct"
          : !directionHit && marketHit ? "market_only_correct"
            : "both_missed"
      : "no_market",
    paulProbability,
    marketProbability,
    actualMarketProbability,
    causes: [...new Set(causes)]
  };
}

function calibrationHints(classification) {
  const misses = classification.causes || [];
  return {
    keepPredictionModel: true,
    adjustOnlyCalibration: true,
    edgeTrustDelta: classification.directionHit ? (classification.scoreHit ? 0.012 : 0.004) : -0.022,
    scoreModelDelta: classification.scoreHit ? 0.018 : classification.scoreTop3Hit ? 0.006 : classification.scoreTop5Hit ? 0.002 : misses.includes("minor_score_variance") ? -0.004 : -0.012,
    marketShrinkDelta: misses.includes("market_anchor_underweighted") ? 0.045 : misses.includes("paul_outperformed_market") ? -0.035 : misses.includes("market_missed_too") ? -0.015 : 0,
    drawRiskDelta: misses.includes("draw_underestimated") ? 0.025 : misses.includes("false_draw_squeeze") ? -0.018 : 0,
    upsetSensitivityDelta: misses.includes("upset_underestimated") ? 0.02 : misses.includes("false_upset_override") ? -0.025 : 0,
    goalVolatilityDelta: misses.includes("pace_or_finishing_underestimated") ? 0.018 : misses.includes("low_event_game_underestimated") ? -0.012 : 0
  };
}

function zhCause(cause) {
  const labels = {
    direction_miss: "胜负方向未命中",
    score_miss: "比分未命中",
    draw_underestimated: "低估平局",
    market_anchor_underweighted: "市场热门权重不足",
    market_missed_too: "市场也未命中",
    upset_underestimated: "低估冷门",
    pace_or_finishing_underestimated: "低估节奏或终结效率",
    low_event_game_underestimated: "低估低事件比赛",
    minor_score_variance: "比分小偏差",
    overconfidence: "置信度偏高",
    false_draw_squeeze: "平局挤压信号误报",
    false_upset_override: "冷门覆盖信号误报"
  };
  return labels[cause] || cause;
}

function localSummary(classification) {
  if (classification.directionHit && classification.scoreHit) {
    return "PAUL 同时命中胜负方向和比分，本场作为正向样本保留，校准层只做轻微增强。";
  }
  if (classification.directionHit) {
    return `PAUL 命中胜负方向但比分未中。主要复盘点：${classification.causes.map(zhCause).join("、") || "比分层随机波动"}。后续只微调比分层和节奏/进球数校准，不削弱当前胜负模型。`;
  }
  return `PAUL 胜负方向未命中。主要复盘点：${classification.causes.map(zhCause).join("、") || "证据不足"}。后续作为失误记忆进入校准层，提醒相似场景提高市场回缩、平局风险或冷门敏感度。`;
}

function compactEvidence(evidence) {
  if (!evidence) return null;
  return {
    market: evidence.market
      ? {
          provider: evidence.market.provider || evidence.market.source || null,
          odds: evidence.market.odds || null,
          probabilities: evidence.market.probabilities || null,
          intelligence: evidence.market.intelligence
            ? {
                eventStatus: evidence.market.intelligence.eventStatus || null,
                headToHead: evidence.market.intelligence.headToHead || null,
                form: evidence.market.intelligence.form || null,
                unavailablePlayers: evidence.market.intelligence.unavailablePlayers || null
              }
            : null
        }
      : null,
    baselines: evidence.baselines || null,
    paulEdge: evidence.paulEdge || null
  };
}

async function callAiMistakeReview({ match, result, analysis, evidence, classification, baseReview }) {
  if (process.env.MISTAKE_ENGINE_USE_AI === "0" || process.env.MISTAKE_ENGINE_DISABLED === "1") return null;
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
  if (!apiKey) return null;
  const prompt = [
    "You are PAUL's post-match mistake engine. This is NOT a new prediction and must not rewrite any locked prediction.",
    "Analyze why the prediction was wrong or why the score missed. Use web search for post-match reports, lineups, injuries, red cards, xG, tactical recaps, or match reports if available.",
    "Return strict JSON in Chinese with keys: summaryZh, newsFindings, causeTags, calibrationHints, evidenceUsedZh.",
    "calibrationHints must only adjust calibration/risk sizing, never the protected core prediction model.",
    "Do not invent sources. If search evidence is weak, say so.",
    "",
    `Match: ${match.id} ${match.teamA?.name} vs ${match.teamB?.name}`,
    `Result: ${result.homeScore}-${result.awayScore}, winner ${classification.actualWinner}`,
    `Locked prediction: ${analysis?.winnerName || analysis?.winnerCode}, score ${analysis?.predictedScore || "unknown"}, confidence ${analysis?.confidence || "unknown"}`,
    `Local classification: ${JSON.stringify(classification)}`,
    `Base review: ${JSON.stringify(baseReview)}`,
    `Evidence: ${JSON.stringify(compactEvidence(evidence))}`
  ].join("\n");
  const route = chooseQwenModel({ source: "mistake-review" });
  let budget;
  try {
    budget = qwenBudgetDecision("mistake-review", await getQwenUsage());
  } catch {
    budget = { allowed: true, reason: "budget-ledger-unavailable" };
  }
  if (!budget.allowed) return null;
  const requestBody = {
    model: route.model,
    messages: [
      { role: "system", content: "Return compact JSON only. Do not use markdown." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    max_tokens: qwenMaxTokens("mistake-review"),
    response_format: { type: "json_object" },
    enable_search: true,
    search_options: { forced_search: true, search_strategy: "max" }
  };
  const response = await fetch(`${qwenEndpoint().replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Mistake Engine AI failed with status ${response.status}: ${text.slice(0, 240)}`);
  const payload = JSON.parse(text);
  if (payload.usage) {
    try {
      await recordQwenUsage({
        id: `${new Date().toISOString()}:mistake-review:${match.id}`,
        source: "mistake-review",
        matchId: match.id,
        model: route.model,
        usage: payload.usage
      });
    } catch {
      // Usage tracking must not block post-match review.
    }
  }
  const content = payload.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content);
}

function mergeHints(localHints, aiHints = {}) {
  return {
    keepPredictionModel: true,
    adjustOnlyCalibration: true,
    edgeTrustDelta: Number(aiHints.edgeTrustDelta ?? localHints.edgeTrustDelta ?? 0),
    scoreModelDelta: Number(aiHints.scoreModelDelta ?? localHints.scoreModelDelta ?? 0),
    marketShrinkDelta: Number(aiHints.marketShrinkDelta ?? localHints.marketShrinkDelta ?? 0),
    drawRiskDelta: Number(aiHints.drawRiskDelta ?? localHints.drawRiskDelta ?? 0),
    upsetSensitivityDelta: Number(aiHints.upsetSensitivityDelta ?? localHints.upsetSensitivityDelta ?? 0),
    goalVolatilityDelta: Number(aiHints.goalVolatilityDelta ?? localHints.goalVolatilityDelta ?? 0)
  };
}

function emptyAggregate() {
  return {
    total: 0,
    directionMisses: 0,
    scoreMisses: 0,
    exactHits: 0,
    scoreTop3Hits: 0,
    scoreTop5Hits: 0,
    causeCounts: {},
    calibrationTotals: emptyCalibrationTotals(),
    marketEdge: {
      graded: 0,
      paulOnlyCorrect: 0,
      marketOnlyCorrect: 0,
      bothCorrect: 0,
      bothMissed: 0
    },
    shadowAB: {
      graded: 0,
      rawDirectionCorrect: 0,
      kvDirectionCorrect: 0,
      rawScoreExact: 0,
      kvScoreExact: 0,
      rawOnlyDirectionCorrect: 0,
      kvOnlyDirectionCorrect: 0,
      bothDirectionCorrect: 0,
      bothDirectionMissed: 0
    },
    teamMemory: {}
  };
}

function evaluateShadowAB(match, result, prediction) {
  const shadow = prediction?.evidence?.shadowEvaluation || prediction?.proof?.payload?.evidence?.shadowEvaluation || null;
  const raw = shadow?.rawNoKv?.analysis || shadow?.rawNoKv || null;
  const kv = shadow?.kvCalibrated?.analysis || shadow?.kvCalibrated || predictionAnalysis(prediction);
  if (!raw || !kv) return null;
  const actualWinner = winnerForResult(match, result);
  const actualScore = `${result.homeScore}-${result.awayScore}`;
  const rawScore = scoreKey(scoreParts(raw.predictedScore || raw.score));
  const kvScore = scoreKey(scoreParts(kv.predictedScore || kv.score));
  const rawWinner = winnerFromAnalysis(raw);
  const kvWinner = winnerFromAnalysis(kv);
  const rawDirectionHit = Boolean(rawWinner && rawWinner === actualWinner);
  const kvDirectionHit = Boolean(kvWinner && kvWinner === actualWinner);
  return {
    version: shadow?.version || "paul-shadow-ab-v1",
    rawNoKv: {
      winnerCode: rawWinner || null,
      confidence: raw.confidence || null,
      predictedScore: raw.predictedScore || raw.score || null,
      directionHit: rawDirectionHit,
      scoreHit: Boolean(rawScore && rawScore === actualScore)
    },
    kvCalibrated: {
      winnerCode: kvWinner || null,
      confidence: kv.confidence || null,
      predictedScore: kv.predictedScore || kv.score || null,
      directionHit: kvDirectionHit,
      scoreHit: Boolean(kvScore && kvScore === actualScore)
    },
    contribution: kvDirectionHit && !rawDirectionHit
      ? "kv_helped_direction"
      : !kvDirectionHit && rawDirectionHit
        ? "kv_hurt_direction"
        : kvScore === actualScore && rawScore !== actualScore
          ? "kv_helped_score"
          : rawScore === actualScore && kvScore !== actualScore
            ? "kv_hurt_score"
            : "neutral",
    actualWinner,
    actualScore
  };
}

function addReviewToAggregate(aggregate, review) {
  if (!review) return;
  aggregate.total += 1;
  if (!review.directionHit) aggregate.directionMisses += 1;
  if (!review.scoreHit) aggregate.scoreMisses += 1;
  if (review.directionHit && review.scoreHit) aggregate.exactHits += 1;
  if (review.scoreTop3Hit) aggregate.scoreTop3Hits += 1;
  if (review.scoreTop5Hit) aggregate.scoreTop5Hits += 1;
  const marketOutcome = review.marketEdgeOutcome || (
    review.marketFavorite
      ? review.directionHit && review.marketHit ? "both_correct"
        : review.directionHit && !review.marketHit ? "paul_only_correct"
          : !review.directionHit && review.marketHit ? "market_only_correct"
            : "both_missed"
      : "no_market"
  );
  if (marketOutcome !== "no_market") {
    aggregate.marketEdge ||= emptyAggregate().marketEdge;
    aggregate.marketEdge.graded += 1;
    if (marketOutcome === "paul_only_correct") aggregate.marketEdge.paulOnlyCorrect += 1;
    else if (marketOutcome === "market_only_correct") aggregate.marketEdge.marketOnlyCorrect += 1;
    else if (marketOutcome === "both_correct") aggregate.marketEdge.bothCorrect += 1;
    else if (marketOutcome === "both_missed") aggregate.marketEdge.bothMissed += 1;
  }
  if (review.shadowAB) {
    aggregate.shadowAB ||= emptyAggregate().shadowAB;
    aggregate.shadowAB.graded += 1;
    if (review.shadowAB.rawNoKv?.directionHit) aggregate.shadowAB.rawDirectionCorrect += 1;
    if (review.shadowAB.kvCalibrated?.directionHit) aggregate.shadowAB.kvDirectionCorrect += 1;
    if (review.shadowAB.rawNoKv?.scoreHit) aggregate.shadowAB.rawScoreExact += 1;
    if (review.shadowAB.kvCalibrated?.scoreHit) aggregate.shadowAB.kvScoreExact += 1;
    const rawHit = Boolean(review.shadowAB.rawNoKv?.directionHit);
    const kvHit = Boolean(review.shadowAB.kvCalibrated?.directionHit);
    if (rawHit && kvHit) aggregate.shadowAB.bothDirectionCorrect += 1;
    else if (rawHit && !kvHit) aggregate.shadowAB.rawOnlyDirectionCorrect += 1;
    else if (!rawHit && kvHit) aggregate.shadowAB.kvOnlyDirectionCorrect += 1;
    else aggregate.shadowAB.bothDirectionMissed += 1;
  }
  Object.entries(causeCounts(review.causeTags || [])).forEach(([cause, count]) => {
    aggregate.causeCounts[cause] = (aggregate.causeCounts[cause] || 0) + count;
  });
  addCalibrationTotals(aggregate.calibrationTotals, review.calibrationHints);
  (review.teamCodes || []).forEach((code) => {
    aggregate.teamMemory[code] ||= {
      matches: 0,
      directionMisses: 0,
      scoreMisses: 0,
      causes: {},
      calibrationTotals: emptyCalibrationTotals()
    };
    const team = aggregate.teamMemory[code];
    team.matches += 1;
    if (!review.directionHit) team.directionMisses += 1;
    if (!review.scoreHit) team.scoreMisses += 1;
    if (review.scoreTop3Hit) team.scoreTop3Hits = Number(team.scoreTop3Hits || 0) + 1;
    if (review.scoreTop5Hit) team.scoreTop5Hits = Number(team.scoreTop5Hits || 0) + 1;
    addCalibrationTotals(team.calibrationTotals, review.calibrationHints);
    Object.entries(causeCounts(review.causeTags || [])).forEach(([cause, count]) => {
      team.causes[cause] = (team.causes[cause] || 0) + count;
    });
  });
}

function rebuildAggregate(memory) {
  const aggregate = emptyAggregate();
  Object.values(memory.matches || {}).forEach((review) => addReviewToAggregate(aggregate, review));
  memory.aggregate = aggregate;
}

function aggregateForMemory(memory = {}) {
  const matches = memory.matches || {};
  const matchCount = Object.keys(matches).length;
  const aggregateTotal = Number(memory.aggregate?.total || 0);
  if (
    memory.aggregate &&
    aggregateTotal >= matchCount &&
    memory.aggregate.marketEdge &&
    memory.aggregate.shadowAB &&
    Object.prototype.hasOwnProperty.call(memory.aggregate, "scoreTop3Hits")
  ) {
    return memory.aggregate;
  }
  const aggregate = emptyAggregate();
  Object.values(matches).forEach((review) => addReviewToAggregate(aggregate, review));
  return aggregate;
}

function marketEdgeProfile(aggregate = {}) {
  const edge = aggregate.marketEdge || {};
  const graded = Number(edge.graded || 0);
  const paulOnlyCorrect = Number(edge.paulOnlyCorrect || 0);
  const marketOnlyCorrect = Number(edge.marketOnlyCorrect || 0);
  const bothCorrect = Number(edge.bothCorrect || 0);
  const bothMissed = Number(edge.bothMissed || 0);
  const netEdge = paulOnlyCorrect - marketOnlyCorrect;
  return {
    graded,
    paulOnlyCorrect,
    marketOnlyCorrect,
    bothCorrect,
    bothMissed,
    netEdge,
    paulOnlyRate: graded ? Number((paulOnlyCorrect / graded).toFixed(3)) : 0,
    marketOnlyRate: graded ? Number((marketOnlyCorrect / graded).toFixed(3)) : 0,
    bothCorrectRate: graded ? Number((bothCorrect / graded).toFixed(3)) : 0,
    recommendation: graded < 12
      ? "seed: keep market as anchor until enough PAUL-vs-market evidence exists"
      : netEdge > 0
        ? "PAUL has shown some independent edge; allow bounded non-market overrides when universal/news support agrees"
        : netEdge < 0
          ? "market is still winning the head-to-head; shrink weak PAUL deviations back toward market"
          : "PAUL and market are tied; require strong evidence before moving away from market"
  };
}

function shadowABProfile(aggregate = {}) {
  const shadow = aggregate.shadowAB || {};
  const graded = Number(shadow.graded || 0);
  return {
    graded,
    rawDirectionCorrect: Number(shadow.rawDirectionCorrect || 0),
    kvDirectionCorrect: Number(shadow.kvDirectionCorrect || 0),
    rawScoreExact: Number(shadow.rawScoreExact || 0),
    kvScoreExact: Number(shadow.kvScoreExact || 0),
    rawOnlyDirectionCorrect: Number(shadow.rawOnlyDirectionCorrect || 0),
    kvOnlyDirectionCorrect: Number(shadow.kvOnlyDirectionCorrect || 0),
    bothDirectionCorrect: Number(shadow.bothDirectionCorrect || 0),
    bothDirectionMissed: Number(shadow.bothDirectionMissed || 0),
    directionLift: Number(shadow.kvDirectionCorrect || 0) - Number(shadow.rawDirectionCorrect || 0),
    scoreLift: Number(shadow.kvScoreExact || 0) - Number(shadow.rawScoreExact || 0),
    status: graded ? "active" : "pending-next-locked-match"
  };
}

async function recordMistakeReview({ match, result, prediction, evidence, baseReview = null }) {
  if (process.env.MISTAKE_ENGINE_DISABLED === "1") return baseReview;
  const analysis = predictionAnalysis(prediction);
  if (!analysis) return baseReview;
  const classification = classifyReview({ match, result, analysis, evidence });
  const localHints = calibrationHints(classification);
  const localReview = {
    engineVersion: "mistake-engine-v1",
    generatedAt: new Date().toISOString(),
    matchId: match.id,
    match: `${match.teamA?.name} vs ${match.teamB?.name}`,
    teamCodes: teamCodes(match),
    directionHit: classification.directionHit,
    scoreHit: classification.scoreHit,
    goalDiff: classification.goalDiff,
    predictedWinner: classification.predictedWinner,
    actualWinner: classification.actualWinner,
    predictedScore: classification.predictedScore,
    actualScore: classification.actualScore,
    marketFavorite: classification.marketFavorite,
    marketHit: classification.marketHit,
    marketEdgeOutcome: classification.marketEdgeOutcome,
    shadowAB: evaluateShadowAB(match, result, prediction),
    causeTags: classification.causes,
    summaryZh: localSummary(classification),
    newsFindings: [],
    evidenceUsedZh: ["本地赛果复盘", "锁定预测", "赛前证据快照"],
    calibrationHints: localHints
  };
  let aiReview = null;
  const shouldUseAi = !classification.directionHit || !classification.scoreHit;
  if (shouldUseAi) {
    try {
      aiReview = await callAiMistakeReview({ match, result, analysis, evidence, classification, baseReview: localReview });
    } catch (error) {
      aiReview = {
        summaryZh: null,
        newsFindings: [],
        evidenceUsedZh: [`赛后新闻检索失败：${error.message}`]
      };
    }
  }
  const review = {
    ...localReview,
    summaryZh: aiReview?.summaryZh || localReview.summaryZh,
    newsFindings: Array.isArray(aiReview?.newsFindings) ? aiReview.newsFindings.slice(0, 8) : localReview.newsFindings,
    causeTags: Array.isArray(aiReview?.causeTags) && aiReview.causeTags.length ? [...new Set([...localReview.causeTags, ...aiReview.causeTags])] : localReview.causeTags,
    evidenceUsedZh: Array.isArray(aiReview?.evidenceUsedZh) && aiReview.evidenceUsedZh.length ? [...new Set([...localReview.evidenceUsedZh, ...aiReview.evidenceUsedZh])] : localReview.evidenceUsedZh,
    calibrationHints: mergeHints(localHints, aiReview?.calibrationHints)
  };
  const memory = await getMistakeMemory();
  memory.version = "paul-mistake-memory-v1";
  memory.matches ||= {};
  const hadPreviousReview = Boolean(memory.matches[match.id]);
  memory.matches[match.id] = review;
  if (memory.aggregate && !hadPreviousReview) {
    addReviewToAggregate(memory.aggregate, review);
  } else {
    rebuildAggregate(memory);
  }
  memory.updatedAt = new Date().toISOString();
  await setMistakeMemory(memory);
  return review;
}

function summarizeRelevantMistakes(match, memory = {}) {
  const aggregate = aggregateForMemory(memory);
  const scoreCounts = {};
  const totalCounts = {};
  const marginCounts = {};
  let scoredReviews = 0;
  let totalGoals = 0;
  let highEvent = 0;
  let lowEvent = 0;
  Object.values(memory.matches || {}).forEach((review) => {
    const actual = scoreParts(review?.actualScore);
    if (!actual) return;
    const key = scoreKey(actual);
    const total = actual.home + actual.away;
    const margin = Math.abs(actual.home - actual.away);
    scoredReviews += 1;
    totalGoals += total;
    if (total >= 4) highEvent += 1;
    if (total <= 2) lowEvent += 1;
    scoreCounts[key] = (scoreCounts[key] || 0) + 1;
    totalCounts[total] = (totalCounts[total] || 0) + 1;
    marginCounts[margin] = (marginCounts[margin] || 0) + 1;
  });
  const teams = teamCodes(match).map((code) => ({ code, memory: aggregate.teamMemory?.[code] || null }));
  const relevant = teams.filter((item) => item.memory);
  const causeCountsAll = aggregate.causeCounts || {};
  const topGlobalCauses = Object.entries(causeCountsAll)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cause, count]) => ({ cause, count, labelZh: zhCause(cause) }));
  return {
    source: "paul:mistake-memory:v1",
    updatedAt: memory.updatedAt || null,
    totalReviewed: aggregate.total || 0,
    directionMisses: aggregate.directionMisses || 0,
    scoreMisses: aggregate.scoreMisses || 0,
    exactHits: aggregate.exactHits || 0,
    scoreTop3Hits: aggregate.scoreTop3Hits || 0,
    scoreTop5Hits: aggregate.scoreTop5Hits || 0,
    marketEdgeProfile: marketEdgeProfile(aggregate),
    shadowABProfile: shadowABProfile(aggregate),
    scorelineProfile: {
      sampleSize: scoredReviews,
      exactHitRate: scoredReviews ? Number((Number(aggregate.exactHits || 0) / scoredReviews).toFixed(3)) : 0,
      top3HitRate: scoredReviews ? Number((Number(aggregate.scoreTop3Hits || 0) / scoredReviews).toFixed(3)) : 0,
      top5HitRate: scoredReviews ? Number((Number(aggregate.scoreTop5Hits || 0) / scoredReviews).toFixed(3)) : 0,
      averageTotalGoals: scoredReviews ? Number((totalGoals / scoredReviews).toFixed(2)) : null,
      highEventRate: scoredReviews ? Number((highEvent / scoredReviews).toFixed(3)) : null,
      lowEventRate: scoredReviews ? Number((lowEvent / scoredReviews).toFixed(3)) : null,
      topScores: topCountEntries(scoreCounts),
      totalGoalCounts: topCountEntries(totalCounts, 10),
      marginCounts: topCountEntries(marginCounts, 8)
    },
    topGlobalCauses,
    averageCalibration: averageCalibrationTotals(aggregate.calibrationTotals, aggregate.total || 0),
    teams: relevant.map((item) => ({
      code: item.code,
      matches: item.memory.matches || 0,
      directionMissRate: item.memory.matches ? Number(((item.memory.directionMisses || 0) / item.memory.matches).toFixed(3)) : null,
      scoreMissRate: item.memory.matches ? Number(((item.memory.scoreMisses || 0) / item.memory.matches).toFixed(3)) : null,
      averageCalibration: averageCalibrationTotals(item.memory.calibrationTotals, item.memory.matches || 0),
      topCauses: Object.entries(item.memory.causes || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cause, count]) => ({ cause, count, labelZh: zhCause(cause) }))
    })),
    calibrationUse: "Use as calibration-layer memory only. Do not rewrite locked picks or core model weights."
  };
}

function weightedTeamCalibration(summary = {}) {
  const teams = Array.isArray(summary.teams) ? summary.teams.filter((item) => item?.averageCalibration && Number(item.matches || 0) > 0) : [];
  const totalWeight = teams.reduce((sum, item) => sum + Number(item.matches || 0), 0);
  if (!totalWeight) return null;
  const totals = emptyCalibrationTotals();
  teams.forEach((item) => {
    const weight = Number(item.matches || 0) / totalWeight;
    calibrationKeys.forEach((key) => {
      totals[key] += Number(item.averageCalibration?.[key] || 0) * weight;
    });
  });
  return Object.fromEntries(calibrationKeys.map((key) => [key, Number(totals[key].toFixed(4))]));
}

function mistakeAdjustmentFromMemory(summary = {}) {
  const total = Number(summary.totalReviewed || 0);
  if (!total) return null;
  const globalAverage = summary.averageCalibration || {};
  const teamAverage = weightedTeamCalibration(summary) || {};
  const marketEdge = summary.marketEdgeProfile || {};
  const shadow = summary.shadowABProfile || {};
  const blend = (key, fallback = 0) => {
    const globalValue = Number(globalAverage?.[key] || 0);
    const teamValue = Number(teamAverage?.[key] || 0);
    const combined = globalValue * 0.65 + teamValue * 0.35;
    return Number.isFinite(combined) && combined !== 0 ? combined : fallback;
  };
  const marketEdgeDelta = Number(marketEdge.graded || 0) >= 12
    ? clamp((Number(marketEdge.marketOnlyCorrect || 0) - Number(marketEdge.paulOnlyCorrect || 0)) / Math.max(1, Number(marketEdge.graded || 0)) * 0.08, -0.025, 0.025)
    : 0;
  const shadowDirectionDelta = Number(shadow.graded || 0) >= 8
    ? clamp(Number(shadow.directionLift || 0) / Math.max(1, Number(shadow.graded || 0)) * 0.035, -0.018, 0.018)
    : 0;
  return {
    edgeTrustDelta: Number(clamp(blend("edgeTrustDelta") + shadowDirectionDelta, -0.04, 0.025).toFixed(3)),
    scoreConfidenceDelta: Number(clamp(blend("scoreModelDelta"), -0.035, 0.018).toFixed(3)),
    marketShrinkDelta: Number(clamp(blend("marketShrinkDelta") + marketEdgeDelta, -0.025, 0.055).toFixed(3)),
    drawRiskDelta: Number(clamp(blend("drawRiskDelta"), -0.02, 0.03).toFixed(3)),
    upsetSensitivityDelta: Number(clamp(blend("upsetSensitivityDelta"), -0.03, 0.03).toFixed(3)),
    goalVolatilityDelta: Number(clamp(blend("goalVolatilityDelta"), -0.02, 0.02).toFixed(3)),
    marketEdgeDelta: Number(marketEdgeDelta.toFixed(3)),
    shadowDirectionDelta: Number(shadowDirectionDelta.toFixed(3)),
    sampleSize: total
  };
}

function modelWeightsFromAdjustment(adjustment = {}, maturity = "seed") {
  let market = 55;
  let elo = 25;
  let poisson = 20;
  const marketShrink = Number(adjustment.marketShrinkDelta || 0);
  const edgeTrust = Number(adjustment.edgeTrustDelta || 0);
  const upsetSensitivity = Number(adjustment.upsetSensitivityDelta || 0);
  const scoreConfidence = Number(adjustment.scoreConfidenceDelta || 0);
  const goalVolatility = Number(adjustment.goalVolatilityDelta || 0);
  market += marketShrink * 220 + Math.max(0, -edgeTrust) * 180 - Math.max(0, upsetSensitivity) * 80;
  elo += edgeTrust * 110 + upsetSensitivity * 45;
  poisson += scoreConfidence * 140 + goalVolatility * 70 + upsetSensitivity * 35;
  market = clamp(market, 45, 65);
  elo = clamp(elo, 18, 34);
  poisson = clamp(poisson, 14, 30);
  const sum = market + elo + poisson;
  return {
    market: Number(((market / sum) * 100).toFixed(1)),
    elo: Number(((elo / sum) * 100).toFixed(1)),
    poisson: Number(((poisson / sum) * 100).toFixed(1)),
    maturity
  };
}

function learningProfileFromMemory(summary = {}, adjustment = null) {
  const total = Number(summary.totalReviewed || 0);
  const directionMissRate = total ? Number((Number(summary.directionMisses || 0) / total).toFixed(3)) : 0;
  const scoreMissRate = total ? Number((Number(summary.scoreMisses || 0) / total).toFixed(3)) : 0;
  const exactHitRate = total ? Number((Number(summary.exactHits || 0) / total).toFixed(3)) : 0;
  const topCauses = Array.isArray(summary.topGlobalCauses) ? summary.topGlobalCauses.slice(0, 4).map((item) => item.cause) : [];
  const maturity = total >= 40 ? "stable" : total >= 16 ? "learning" : total >= 4 ? "warming-up" : "seed";
  const currentBias = [];
  if (topCauses.includes("market_anchor_underweighted")) currentBias.push("increase market anchor after PAUL-only misses");
  if (topCauses.includes("market_missed_too")) currentBias.push("allow more non-market edge when market misses too");
  if (summary.marketEdgeProfile?.netEdge < 0) currentBias.push("market currently beats PAUL head-to-head; require stronger non-market evidence");
  if (summary.marketEdgeProfile?.netEdge > 0) currentBias.push("PAUL has positive market edge; preserve bounded independent overrides");
  if (summary.shadowABProfile?.directionLift > 0) currentBias.push("KV shadow layer is adding direction value");
  if (summary.shadowABProfile?.directionLift < 0) currentBias.push("KV shadow layer is hurting direction value; shrink future KV deltas");
  if (topCauses.includes("draw_underestimated")) currentBias.push("raise draw-risk sensitivity in compressed group matches");
  if (topCauses.includes("upset_underestimated")) currentBias.push("raise upset sensitivity when underdog evidence is confirmed");
  if (topCauses.includes("pace_or_finishing_underestimated")) currentBias.push("lift high-event score paths");
  if (topCauses.includes("low_event_game_underestimated")) currentBias.push("prefer lower-event score paths");
  return {
    version: "paul-learning-profile-v1",
    sampleSize: total,
    maturity,
    directionMissRate,
    scoreMissRate,
    exactHitRate,
    currentBias,
    calibrationAdjustment: adjustment,
    modelWeights: modelWeightsFromAdjustment(adjustment || {}, maturity),
    policy: "Every post-match review updates KV memory; future PAUL reads use this profile as a bounded calibration layer, not as a rewrite of locked proofs."
  };
}

function buildMistakeContext(match, memory = {}) {
  const summary = summarizeRelevantMistakes(match, memory);
  const calibrationAdjustment = mistakeAdjustmentFromMemory(summary);
  return {
    enabled: process.env.MISTAKE_ENGINE_DISABLED !== "1",
    source: "paul:mistake-memory:v1",
    updatedAt: summary.updatedAt,
    usable: Boolean(calibrationAdjustment),
    summary,
    calibrationAdjustment,
    learningProfile: learningProfileFromMemory(summary, calibrationAdjustment)
  };
}

async function getMistakeContextForMatch(match) {
  if (process.env.MISTAKE_ENGINE_DISABLED === "1") {
    return {
      enabled: false,
      source: "paul:mistake-memory:v1",
      updatedAt: null,
      usable: false,
      summary: null,
      calibrationAdjustment: null
    };
  }
  return buildMistakeContext(match, await getMistakeMemory());
}

module.exports = {
  buildMistakeContext,
  getMistakeContextForMatch,
  recordMistakeReview,
  summarizeRelevantMistakes,
  mistakeAdjustmentFromMemory
};
