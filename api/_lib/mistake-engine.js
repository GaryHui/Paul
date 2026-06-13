const { getMistakeMemory, setMistakeMemory } = require("./store");

const qwenEndpoint = process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const qwenModel = process.env.QWEN_MODEL || "qwen-plus";

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

function classifyReview({ match, result, analysis, evidence }) {
  const predictedWinner = String(analysis?.winnerCode || analysis?.winner || "").toUpperCase();
  const actualWinner = winnerForResult(match, result);
  const predictedScore = scoreParts(analysis?.predictedScore || analysis?.score);
  const actualScore = { home: Number(result.homeScore), away: Number(result.awayScore) };
  const directionHit = Boolean(predictedWinner && actualWinner && predictedWinner === actualWinner);
  const scoreHit = Boolean(predictedScore && predictedScore.home === actualScore.home && predictedScore.away === actualScore.away);
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
  }

  if (directionHit && !scoreHit) causes.push("score_miss");
  if (predictedScore && !scoreHit) {
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
    goalDiff,
    predictedWinner,
    actualWinner,
    predictedScore: analysis?.predictedScore || analysis?.score || null,
    actualScore: `${result.homeScore}-${result.awayScore}`,
    marketFavorite: marketCode || null,
    marketHit,
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
    scoreModelDelta: classification.scoreHit ? 0.018 : misses.includes("minor_score_variance") ? -0.004 : -0.012,
    marketShrinkDelta: misses.includes("market_anchor_underweighted") ? 0.035 : misses.includes("market_missed_too") ? -0.005 : 0,
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
  const requestBody = {
    model: qwenModel,
    messages: [
      { role: "system", content: "Return compact JSON only. Do not use markdown." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
    enable_search: true,
    search_options: { forced_search: true, search_strategy: "max" }
  };
  const response = await fetch(`${qwenEndpoint.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Mistake Engine AI failed with status ${response.status}: ${text.slice(0, 240)}`);
  const content = JSON.parse(text).choices?.[0]?.message?.content || "{}";
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

function updateAggregate(memory, review, match) {
  const aggregate = memory.aggregate || {
    total: 0,
    directionMisses: 0,
    scoreMisses: 0,
    exactHits: 0,
    causeCounts: {},
    teamMemory: {}
  };
  aggregate.total += 1;
  if (!review.directionHit) aggregate.directionMisses += 1;
  if (!review.scoreHit) aggregate.scoreMisses += 1;
  if (review.directionHit && review.scoreHit) aggregate.exactHits += 1;
  Object.entries(causeCounts(review.causeTags || [])).forEach(([cause, count]) => {
    aggregate.causeCounts[cause] = (aggregate.causeCounts[cause] || 0) + count;
  });
  teamCodes(match).forEach((code) => {
    aggregate.teamMemory[code] ||= { matches: 0, directionMisses: 0, scoreMisses: 0, causes: {} };
    const team = aggregate.teamMemory[code];
    team.matches += 1;
    if (!review.directionHit) team.directionMisses += 1;
    if (!review.scoreHit) team.scoreMisses += 1;
    Object.entries(causeCounts(review.causeTags || [])).forEach(([cause, count]) => {
      team.causes[cause] = (team.causes[cause] || 0) + count;
    });
  });
  memory.aggregate = aggregate;
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
    directionHit: classification.directionHit,
    scoreHit: classification.scoreHit,
    goalDiff: classification.goalDiff,
    predictedWinner: classification.predictedWinner,
    actualWinner: classification.actualWinner,
    predictedScore: classification.predictedScore,
    actualScore: classification.actualScore,
    marketFavorite: classification.marketFavorite,
    marketHit: classification.marketHit,
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
  memory.matches[match.id] = review;
  updateAggregate(memory, review, match);
  memory.updatedAt = new Date().toISOString();
  await setMistakeMemory(memory);
  return review;
}

function summarizeRelevantMistakes(match, memory = {}) {
  const aggregate = memory.aggregate || {};
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
    topGlobalCauses,
    teams: relevant.map((item) => ({
      code: item.code,
      matches: item.memory.matches || 0,
      directionMissRate: item.memory.matches ? Number(((item.memory.directionMisses || 0) / item.memory.matches).toFixed(3)) : null,
      scoreMissRate: item.memory.matches ? Number(((item.memory.scoreMisses || 0) / item.memory.matches).toFixed(3)) : null,
      topCauses: Object.entries(item.memory.causes || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cause, count]) => ({ cause, count, labelZh: zhCause(cause) }))
    })),
    calibrationUse: "Use as calibration-layer memory only. Do not rewrite locked picks or core model weights."
  };
}

function mistakeAdjustmentFromMemory(summary = {}) {
  const total = Number(summary.totalReviewed || 0);
  if (!total) return null;
  const directionMissRate = Number(summary.directionMisses || 0) / total;
  const scoreMissRate = Number(summary.scoreMisses || 0) / total;
  const drawPressure = summary.topGlobalCauses?.find((item) => item.cause === "draw_underestimated")?.count || 0;
  const upsetPressure = summary.topGlobalCauses?.find((item) => item.cause === "upset_underestimated")?.count || 0;
  return {
    edgeTrustDelta: Number(clamp(0.02 - directionMissRate * 0.05, -0.04, 0.015).toFixed(3)),
    scoreConfidenceDelta: Number(clamp(0.015 - scoreMissRate * 0.035, -0.035, 0.012).toFixed(3)),
    drawRiskDelta: Number(clamp(drawPressure / Math.max(total, 1) * 0.05, 0, 0.025).toFixed(3)),
    upsetSensitivityDelta: Number(clamp(upsetPressure / Math.max(total, 1) * 0.045, 0, 0.025).toFixed(3)),
    sampleSize: total
  };
}

module.exports = {
  recordMistakeReview,
  summarizeRelevantMistakes,
  mistakeAdjustmentFromMemory
};
