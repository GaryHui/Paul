const { parseMatchTime, resolveMatches } = require("../_lib/bracket");
const { buildMistakeContext } = require("../_lib/mistake-engine");
const { calibratedPredictedScore, loadSnapshot } = require("../_lib/paul");
const { getDailyAnalysis, getEvidenceCache, getMistakeMemory, getPredictions, getQwenUsage, getResults } = require("../_lib/store");

const HISTORICAL_BACKTEST = {
  correct: 972,
  graded: 1708,
  accuracy: 972 / 1708,
  type: "direction",
  label: "胜平负/晋级方向命中",
  marketCorrect: 972,
  marketGraded: 1708,
  marketAccuracy: 972 / 1708,
  exactScoreCorrect: null,
  exactScoreGraded: 0,
  exactScoreAccuracy: null,
  exactScoreNote: "历史回测只记录 PAUL Edge 的胜平负/晋级方向和概率，没有保存逐场精确比分预测；市场 1X2 赔率也不提供精确比分基准。",
  source: "World Cup 2022/2018/2014/2010/2006 + Premier League 2021-22 through 2024-25 holdout",
  note: "Stored audit baseline from data/README.md. PAUL Edge 972/1708 direction calls, market favorite 972/1708, rounded public accuracy 57%."
};

function requestToken(req) {
  const url = new URL(req.url || "/", "https://paul.local");
  const auth = req.headers.authorization || "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  return (
    bearer ||
    req.headers["x-verify-token"] ||
    req.headers["x-owner-token"] ||
    url.searchParams.get("verify") ||
    url.searchParams.get("token") ||
    ""
  );
}

function assertOwner(req) {
  const expected = process.env.VERIFY_TOKEN || process.env.AUTOMATION_SECRET || process.env.CRON_SECRET;
  if (!expected) {
    const error = new Error("Owner token is not configured.");
    error.status = 500;
    throw error;
  }
  if (requestToken(req) !== expected) {
    const error = new Error("Unauthorized.");
    error.status = 401;
    throw error;
  }
}

function numberParam(url, key, fallback, min, max) {
  const rawValue = url.searchParams.get(key);
  const raw = rawValue === null || rawValue === "" ? NaN : Number(rawValue);
  const value = Number.isFinite(raw) ? raw : fallback;
  return Math.max(min, Math.min(max, value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload, null, 2));
}

function sideForCode(match, code) {
  const value = String(code || "").toUpperCase();
  if (!value) return null;
  if (value === "DRAW") return "draw";
  if (value === String(match.teamA?.code || "").toUpperCase()) return "home";
  if (value === String(match.teamB?.code || "").toUpperCase()) return "away";
  return null;
}

function sideName(match, side) {
  if (side === "home") return match.teamA?.name || "Home";
  if (side === "away") return match.teamB?.name || "Away";
  if (side === "draw") return "Draw";
  return "No pick";
}

function sideCode(match, side) {
  if (side === "home") return match.teamA?.code || "HOME";
  if (side === "away") return match.teamB?.code || "AWAY";
  if (side === "draw") return "DRAW";
  return null;
}

function oddsForSide(odds, side) {
  const value = Number(odds?.[side]);
  return Number.isFinite(value) && value > 1 ? value : null;
}

function normalizeProbabilities(probabilities) {
  if (!probabilities || typeof probabilities !== "object") return null;
  const home = Number(probabilities.home || 0);
  const draw = Number(probabilities.draw || 0);
  const away = Number(probabilities.away || 0);
  if (![home, draw, away].some((value) => Number.isFinite(value) && value > 0)) return null;
  const max = Math.max(home, draw, away);
  const normalized = {
    home: max > 1 ? home / 100 : home,
    draw: max > 1 ? draw / 100 : draw,
    away: max > 1 ? away / 100 : away
  };
  const sum = normalized.home + normalized.draw + normalized.away;
  if (sum > 0 && sum < 0.92) {
    return {
      home: normalized.home / sum,
      draw: normalized.draw / sum,
      away: normalized.away / sum
    };
  }
  return normalized;
}

function evidenceRecord(matchId, prediction, evidenceCache) {
  const cached = evidenceCache?.[matchId] || evidenceCache?.[String(matchId)] || null;
  const proofEvidence = prediction?.proof?.payload?.evidence || null;
  const directEvidence = prediction?.evidence || null;
  return directEvidence || proofEvidence || cached || null;
}

function oddsRecord(evidence) {
  if (!evidence) return null;
  const market = evidence.market || evidence;
  if (!market?.odds) return null;
  return {
    source: market.source || evidence.source || null,
    provider: market.provider || market.bookmaker || evidence.provider || "market",
    updatedAt: market.updatedAt || evidence.updatedAt || evidence.generatedAt || null,
    bookmakerCount: market.bookmakerCount || null,
    odds: market.odds,
    openingOdds: market.openingOdds || null,
    openingUpdatedAt: market.openingUpdatedAt || null,
    closingOdds: market.closingOdds || null,
    closingUpdatedAt: market.closingUpdatedAt || null,
    sideOrder: market.sideOrder || market.intelligence?.sideOrder || null,
    eventName: market.eventName || null,
    probabilities: normalizeProbabilities(market.probabilities)
  };
}

function listify(value) {
  if (Array.isArray(value)) return value.filter(Boolean).slice(0, 6);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|;|,\s+(?=[A-Z0-9])/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6);
  }
  return [];
}

function zhEvidenceItem(item) {
  const text = String(item || "").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  const replacements = [
    [/market odds|odds|bookmaker|bsd consensus/i, "市场赔率"],
    [/coach tactical profiles|coach|formation|tactical/i, "教练与阵型信息"],
    [/recent form|form/i, "近期状态"],
    [/xg|expected goals/i, "预期进球数据"],
    [/paul edge|edge engine|consensus lean/i, "PAUL Edge 共识判断"],
    [/injur|unavailable|lineup/i, "伤停与阵容信息"],
    [/over\/under|under25|over25|btts/i, "大小球与进球盘口"],
    [/elo|rating/i, "球队评级"],
    [/poisson/i, "进球分布模型"]
  ];
  for (const [pattern, label] of replacements) {
    if (pattern.test(text)) return `${label}：${text}`;
  }
  if (lower.includes("market")) return `市场参考：${text}`;
  return `证据：${text}`;
}

function zhRiskText(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  const level = lower.includes("low")
    ? "低"
    : lower.includes("moderate") || lower.includes("medium")
      ? "中"
      : lower.includes("high")
        ? "高"
        : "未分级";
  const reasons = [];
  if (lower.includes("counter")) reasons.push("对手反击可能制造威胁");
  if (lower.includes("draw")) reasons.push("存在平局风险");
  if (lower.includes("line") || lower.includes("defensive")) reasons.push("防线站位和身后空间是变量");
  if (lower.includes("price") || lower.includes("odds")) reasons.push("赔率没有给出足够冷门补偿");
  if (lower.includes("margin")) reasons.push("市场差距需要重点观察");
  if (lower.includes("injur") || lower.includes("lineup")) reasons.push("阵容和伤停会影响判断");
  if (!reasons.length) reasons.push(text);
  return `风险等级：${level}。${reasons.join("；")}。`;
}

function scoreParts(score) {
  const match = String(score || "").match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function pickFromPrediction(match, prediction) {
  const analysis = prediction?.analysis || prediction?.proof?.payload?.prediction || null;
  if (!analysis) return null;
  const side = sideForCode(match, analysis.winnerCode || analysis.winner || analysis.winnerName);
  if (!side) return null;
  return {
    source: "Official lock",
    side,
    code: sideCode(match, side),
    name: sideName(match, side),
    confidence: Number(analysis.confidence || 0) || null,
    predictedScore: analysis.predictedScore || null,
    probabilities: normalizeProbabilities(analysis.probabilities),
    reasoning: analysis.reasoning || prediction.lockReason || "",
    upsetRisk: analysis.upsetRisk || "",
    upsetRiskZh: zhRiskText(analysis.upsetRisk),
    lab: null,
    calibrationLayer: analysis.calibrationLayer || prediction?.proof?.payload?.prediction?.calibrationLayer || null,
    evidenceUsed: listify(analysis.evidenceUsed),
    evidenceUsedZh: listify(analysis.evidenceUsed).map(zhEvidenceItem).filter(Boolean)
  };
}

function pickFromDaily(match, dailyRead) {
  const pick = dailyRead?.pick || dailyRead?.analysis || null;
  const probabilities = normalizeProbabilities(dailyRead?.probabilities || pick?.probabilities);
  const side = sideForCode(match, pick?.winnerCode || pick?.winner || pick?.winnerName) || bestSide(match, probabilities);
  if (!side) return null;
  return {
    source: "Daily read",
    side,
    code: sideCode(match, side),
    name: sideName(match, side),
    confidence: Number(pick?.confidence || (probabilities?.[side] ? probabilities[side] * 100 : 0)) || null,
    predictedScore: pick?.predictedScore || null,
    probabilities,
    reasoning: dailyRead?.summary || pick?.reasoning || "",
    upsetRisk: pick?.upsetRisk || dailyRead?.upsetRisk || "",
    upsetRiskZh: zhRiskText(pick?.upsetRisk || dailyRead?.upsetRisk),
    lab: dailyRead?.lab || null,
    calibrationLayer: pick?.calibrationLayer || dailyRead?.calibrationLayer || null,
    evidenceUsed: listify(pick?.evidenceUsed || dailyRead?.evidenceUsed),
    evidenceUsedZh: listify(pick?.evidenceUsed || dailyRead?.evidenceUsed).map(zhEvidenceItem).filter(Boolean)
  };
}

function liveDriftFromPicks(officialPick, dailyPick) {
  if (!officialPick || !dailyPick) return null;
  const officialCode = String(officialPick.code || "").toUpperCase();
  const liveCode = String(dailyPick.code || "").toUpperCase();
  if (!officialCode || !liveCode) return null;
  const winnerVolatility = dailyPick.lab?.winnerVolatility || null;
  const scoreScenarios = Array.isArray(dailyPick.lab?.scoreScenarios) ? dailyPick.lab.scoreScenarios.slice(0, 5) : [];
  const officialScore = scoreParts(officialPick.predictedScore);
  const liveScore = scoreParts(dailyPick.predictedScore);
  const scoreChanged = Boolean(
    officialPick.predictedScore &&
    dailyPick.predictedScore &&
    (!officialScore || !liveScore || officialScore.home !== liveScore.home || officialScore.away !== liveScore.away)
  );
  return {
    drifted: officialCode !== liveCode,
    scoreChanged,
    official: {
      code: officialPick.code,
      name: officialPick.name,
      confidence: officialPick.confidence,
      probability: officialPick.probabilities?.[officialPick.side] || null,
      predictedScore: officialPick.predictedScore || null
    },
    live: {
      code: dailyPick.code,
      name: dailyPick.name,
      confidence: dailyPick.confidence,
      probability: dailyPick.probabilities?.[dailyPick.side] || null,
      predictedScore: dailyPick.predictedScore || null,
      updatedBy: dailyPick.source === "KV live estimate"
        ? "KV live estimate + latest cached evidence + mistake memory calibration"
        : "Daily read + latest evidence + mistake memory calibration"
    },
    winnerChangeRisk: winnerVolatility
      ? {
          label: winnerVolatility.label,
          leaderName: winnerVolatility.leaderName,
          leaderProbability: winnerVolatility.leaderProbability,
          challengerName: winnerVolatility.challengerName,
          challengerProbability: winnerVolatility.challengerProbability,
          gap: winnerVolatility.gap,
          noteZh: winnerVolatility.label === "volatile"
            ? "胜方领先幅度很窄，实验室应把结果视为可翻转场。"
            : winnerVolatility.label === "watch"
              ? "胜方仍领先，但需要持续观察实时情报。"
              : "当前胜方概率结构相对稳定。"
        }
      : null,
    scoreChangeRisk: {
      changed: scoreChanged,
      officialScore: officialPick.predictedScore || null,
      liveScore: dailyPick.predictedScore || null,
      scenarios: scoreScenarios,
      noteZh: scoreChanged
        ? "实时比分判断已经偏离正式锁定比分，实验室应继续跟踪进球路径变化。"
        : scoreScenarios.length
          ? "实时比分暂未偏移，但应继续观察最可能比分路径是否切换。"
          : "缺少足够的比分场景数据。"
    },
    noteZh: officialCode !== liveCode
      ? "正式 Proof 不变，但实时 PAUL 已被新数据推向另一方向；实验室应降低原锁定方向信任或进入观察。"
      : scoreChanged
        ? "正式胜方未变，但实时比分路径已改变；实验室应继续跟踪进球分布和临场信息。"
        : "实时 PAUL 与正式锁定方向一致；实验室仍只把新数据用于概率和仓位校准。"
  };
}

function normalizeLiveProbabilities(probabilities) {
  const normalized = normalizeProbabilities(probabilities);
  if (!normalized) return null;
  const sum = Number(normalized.home || 0) + Number(normalized.draw || 0) + Number(normalized.away || 0);
  if (!sum) return null;
  return {
    home: normalized.home / sum,
    draw: normalized.draw / sum,
    away: normalized.away / sum
  };
}

function livePickFromKvCorrection(match, officialPick, evidence, mistakeContext) {
  if (!officialPick || !evidence || !mistakeContext) return null;
  const base = normalizeLiveProbabilities(officialPick.probabilities);
  if (!base) return null;
  const adjustment = mistakeContext.calibrationAdjustment || {};
  let next = { ...base };
  const market = normalizeLiveProbabilities(evidence.market?.probabilities);
  const marketShrink = clamp(
    Number(adjustment.marketShrinkDelta || 0) + Math.max(0, -Number(adjustment.edgeTrustDelta || 0)),
    0,
    0.12
  );
  if (market && marketShrink) {
    ["home", "draw", "away"].forEach((side) => {
      next[side] = next[side] * (1 - marketShrink) + market[side] * marketShrink;
    });
  }
  if (match.round === "Group Stage" && Number(adjustment.drawRiskDelta || 0)) {
    next.draw = clamp(next.draw + Number(adjustment.drawRiskDelta || 0), 0.05, 0.55);
    const totalOther = Math.max(0.001, next.home + next.away);
    const remaining = Math.max(0.001, 1 - next.draw);
    next.home = remaining * (next.home / totalOther);
    next.away = remaining * (next.away / totalOther);
  }
  next = normalizeLiveProbabilities(next);
  const side = bestSide(match, next);
  if (!side) return null;
  const scoreEvidence = {
    ...evidence,
    mistakeEngine: mistakeContext,
    learning: {
      ...(evidence.learning || {}),
      profile: mistakeContext.learningProfile || evidence.learning?.profile || null,
      applied: Boolean(mistakeContext.usable)
    }
  };
  return {
    source: "KV live estimate",
    side,
    code: sideCode(match, side),
    name: sideName(match, side),
    confidence: Math.round(Number(next[side] || 0) * 100),
    predictedScore: calibratedPredictedScore(scoreEvidence, adjustment, side, Number(next[side] || 0)) || officialPick.predictedScore || null,
    probabilities: next,
    reasoning: `${mistakeContext.summary?.totalReviewed || 0} KV reviews + latest cached evidence are adjusting the lab estimate.`,
    upsetRisk: "",
    upsetRiskZh: "",
    lab: null,
    calibrationLayer: {
      version: "kv-live-estimate-v1",
      applied: Boolean(mistakeContext.usable),
      sampleSize: mistakeContext.summary?.totalReviewed || 0,
      adjustments: adjustment
    },
    evidenceUsed: ["KV live correction", "latest cached evidence", "official lock unchanged"],
    evidenceUsedZh: ["KV live calibration", "latest cached evidence", "official proof unchanged"]
  };
}

function liveDriftTrustPenalty(liveDrift) {
  if (!liveDrift) return 0;
  let penalty = 0;
  if (liveDrift.drifted) penalty -= 0.12;
  if (liveDrift.scoreChanged) penalty -= 0.04;
  const volatility = liveDrift.winnerChangeRisk?.label;
  if (volatility === "volatile") penalty -= 0.05;
  else if (volatility === "watch") penalty -= 0.025;
  return Number(penalty.toFixed(3));
}

function summarizeLiveDrift(rows) {
  const driftRows = rows.filter((row) => row.liveDrift);
  const winnerChanged = driftRows.filter((row) => row.liveDrift?.drifted).length;
  const scoreChanged = driftRows.filter((row) => row.liveDrift?.scoreChanged).length;
  const volatile = driftRows.filter((row) => row.liveDrift?.winnerChangeRisk?.label === "volatile").length;
  return {
    tracked: driftRows.length,
    winnerChanged,
    scoreChanged,
    volatile,
    stable: Math.max(0, driftRows.length - winnerChanged),
    penaltyRows: rows.filter((row) => Number(row.driftTrustPenalty || 0) < 0).length
  };
}

function bestSide(match, probabilities) {
  if (!probabilities) return null;
  const candidates = [
    ["home", probabilities.home],
    ["away", probabilities.away]
  ];
  if (match.round === "Group Stage") candidates.push(["draw", probabilities.draw]);
  candidates.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
  return Number(candidates[0]?.[1] || 0) > 0 ? candidates[0][0] : null;
}

function fallbackPickFromMarket(match, market) {
  const side = bestSide(match, market?.probabilities);
  if (!side) return null;
  return {
    source: "Market fallback",
    side,
    code: sideCode(match, side),
    name: sideName(match, side),
    confidence: Math.round(Number(market.probabilities[side] || 0) * 100),
    predictedScore: null,
    probabilities: market.probabilities,
    reasoning: "No PAUL read is stored yet, so this row only shows the current market favorite as a reference.",
    upsetRisk: "No proprietary PAUL edge available yet.",
    upsetRiskZh: "风险等级：未分级。暂无 PAUL Edge 独立判断，只能作为市场参考。",
    evidenceUsed: ["market odds reference"],
    evidenceUsedZh: ["市场赔率：暂无 PAUL 判断时，仅显示市场热门方向作为参考。"]
  };
}

function kellyStake({ odds, probability, bankroll, kellyFraction, maxStakePct, minEdgePct, isBettable }) {
  if (!odds || !probability) {
    return { fullKelly: 0, fractionalKelly: 0, cappedFraction: 0, rawStake: 0, edgePct: null, impliedProbability: odds ? 1 / odds : null };
  }
  const impliedProbability = 1 / odds;
  const edgePct = (probability - impliedProbability) * 100;
  const fullKelly = (odds * probability - 1) / (odds - 1);
  if (!isBettable) {
    return {
      fullKelly: 0,
      fractionalKelly: 0,
      cappedFraction: 0,
      rawStake: 0,
      edgePct,
      impliedProbability
    };
  }
  const positiveKelly = Math.max(0, fullKelly);
  const fractionalKelly = edgePct >= minEdgePct ? positiveKelly * kellyFraction : 0;
  const cappedFraction = Math.min(fractionalKelly, maxStakePct);
  return {
    fullKelly,
    fractionalKelly,
    cappedFraction,
    rawStake: bankroll * cappedFraction,
    edgePct,
    impliedProbability
  };
}

function predictionPickCode(prediction) {
  const analysis = prediction?.analysis || prediction?.proof?.payload?.prediction || null;
  return analysis?.winnerCode || analysis?.winner || null;
}

function predictionScore(prediction) {
  const analysis = prediction?.analysis || prediction?.proof?.payload?.prediction || null;
  return String(analysis?.predictedScore || "").trim();
}

function resultWinner(result) {
  if (!result?.status || result.status !== "final") return null;
  if (result.winnerCode) return result.winnerCode;
  if (Number(result.homeScore) === Number(result.awayScore)) return "DRAW";
  return Number(result.homeScore) > Number(result.awayScore) ? result.aCode : result.bCode;
}

function liveModelStats(predictions, results) {
  return Object.entries(results || {}).reduce((stats, [matchId, result]) => {
    if (result?.status !== "final") return stats;
    const prediction = predictions?.[result.matchId || matchId] || predictions?.[String(result.matchId || matchId)];
    if (!prediction) return stats;
    const pick = String(predictionPickCode(prediction) || "").toUpperCase();
    const winner = String(resultWinner(result) || "").toUpperCase();
    if (!pick || !winner) return stats;
    stats.graded += 1;
    if (pick === winner) stats.correct += 1;
    const score = predictionScore(prediction).replace(/\s/g, "");
    const actualScore = `${result.homeScore}-${result.awayScore}`;
    if (score && score === actualScore) {
      stats.exactScore += 1;
      stats.exactScoreMatches.push({
        matchId: result.matchId || matchId,
        predictedScore: score,
        actualScore,
        winner
      });
    }
    if (score) stats.exactScoreGraded += 1;
    const marketPick = String(
      prediction?.evidence?.baselines?.marketFavorite?.winnerCode ||
      prediction?.proof?.payload?.evidence?.baselines?.marketFavorite?.winnerCode ||
      ""
    ).toUpperCase();
    if (marketPick) {
      stats.marketGraded += 1;
      if (marketPick === winner) stats.marketCorrect += 1;
    }
    return stats;
  }, { graded: 0, correct: 0, exactScore: 0, exactScoreGraded: 0, exactScoreMatches: [], marketGraded: 0, marketCorrect: 0 });
}

function postMatchCalibrationDelta(results, mistakeMemory = {}) {
  const memoryReviews = Object.values(mistakeMemory.matches || {});
  const reviewSource = memoryReviews.length
    ? memoryReviews
    : Object.values(results || {})
      .filter((result) => result?.status === "final")
      .map((result) => result.postMatchReview)
      .filter(Boolean);
  const delta = reviewSource.reduce((sum, review) => {
    const value = Number(review?.calibrationHints?.edgeTrustDelta || 0);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);
  return clamp(delta, -0.06, 0.06);
}

function reliabilityProfile({ predictions, results, mistakeMemory, modelAccuracy, priorWeight }) {
  const live = liveModelStats(predictions, results);
  const reviewDelta = postMatchCalibrationDelta(results, mistakeMemory);
  const historicalCorrect = HISTORICAL_BACKTEST.correct;
  const historicalGraded = HISTORICAL_BACKTEST.graded;
  const combinedCorrect = historicalCorrect + live.correct;
  const combinedGraded = historicalGraded + live.graded;
  const combinedAccuracy = combinedGraded ? combinedCorrect / combinedGraded : modelAccuracy;
  const posteriorHitRate = combinedAccuracy;
  const exactScoreBonus = Math.min(0.04, live.exactScore * 0.015);
  const edgeTrust = clamp(0.45 + (posteriorHitRate - 0.5) * 4 + exactScoreBonus + reviewDelta, 0.35, 0.92);
  return {
    modelAccuracy: combinedAccuracy,
    priorWeight: combinedGraded || priorWeight,
    historical: HISTORICAL_BACKTEST,
    historicalComparison: {
      type: HISTORICAL_BACKTEST.type,
      label: HISTORICAL_BACKTEST.label,
      paul: {
        correct: HISTORICAL_BACKTEST.correct,
        graded: HISTORICAL_BACKTEST.graded,
        accuracy: HISTORICAL_BACKTEST.accuracy
      },
      market: {
        correct: HISTORICAL_BACKTEST.marketCorrect,
        graded: HISTORICAL_BACKTEST.marketGraded,
        accuracy: HISTORICAL_BACKTEST.marketAccuracy
      },
      exactScore: {
        correct: HISTORICAL_BACKTEST.exactScoreCorrect,
        graded: HISTORICAL_BACKTEST.exactScoreGraded,
        accuracy: HISTORICAL_BACKTEST.exactScoreAccuracy,
        note: HISTORICAL_BACKTEST.exactScoreNote
      }
    },
    combined: {
      correct: combinedCorrect,
      graded: combinedGraded,
      accuracy: combinedAccuracy
    },
    liveComparison: {
      direction: {
        paul: { correct: live.correct, graded: live.graded, accuracy: live.graded ? live.correct / live.graded : null },
        market: { correct: live.marketCorrect, graded: live.marketGraded, accuracy: live.marketGraded ? live.marketCorrect / live.marketGraded : null }
      },
      exactScore: {
        paul: { correct: live.exactScore, graded: live.exactScoreGraded, accuracy: live.exactScoreGraded ? live.exactScore / live.exactScoreGraded : null, matches: live.exactScoreMatches || [] },
        market: { correct: null, graded: 0, accuracy: null, note: "市场 1X2 赔率没有精确比分预测，不能和 PAUL 比分全中率直接比较。" }
      }
    },
    live,
    posteriorHitRate,
    exactScoreBonus,
    postMatchCalibrationDelta: reviewDelta,
    edgeTrust,
    method: "Kelly uses PAUL's pick, then shrinks PAUL's edge versus market implied probability by a reliability factor based on the historical backtest plus verified official live results, exact-score hits, and each match's daily PAUL trend."
  };
}

function summarizeQwenUsage(ledger = {}, now = new Date()) {
  const todayKey = now.toISOString().slice(0, 10);
  const byDate = ledger.byDate || {};
  const today = byDate[todayKey] || { calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0, sources: {} };
  const events = Array.isArray(ledger.events) ? ledger.events : [];
  const totals = events.reduce((sum, event) => ({
    calls: sum.calls + 1,
    promptTokens: sum.promptTokens + Number(event.promptTokens || 0),
    completionTokens: sum.completionTokens + Number(event.completionTokens || 0),
    totalTokens: sum.totalTokens + Number(event.totalTokens || 0)
  }), { calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 });
  const recent = events.slice(-12).reverse();
  return {
    updatedAt: ledger.updatedAt || null,
    todayKey,
    today,
    totals,
    recent
  };
}

function calibratedKellyProbability(paulProbability, impliedProbability, edgeTrust) {
  if (paulProbability === null || paulProbability === undefined || impliedProbability === null || impliedProbability === undefined) return null;
  if (!Number.isFinite(Number(paulProbability)) || !Number.isFinite(Number(impliedProbability))) return null;
  return clamp(impliedProbability + (paulProbability - impliedProbability) * edgeTrust, 0.01, 0.99);
}

function winConfidenceProfile({
  pick,
  probability,
  dailyAdjustedProbability,
  kellyProbability,
  impliedProbability,
  rowEdgeTrust,
  dailyCalibration,
  edgePct,
  isFinal,
  isPast
}) {
  if (!pick || pick.source === "Market fallback") {
    return {
      tier: "NONE",
      label: "暂无 PAUL 胜算",
      score: 0,
      candidate: false,
      reason: "没有 PAUL 锁定或每日判断，只能作为市场参考。"
    };
  }
  const selectedProbability = Number(kellyProbability ?? dailyAdjustedProbability ?? probability);
  const rawProbability = Number(probability);
  const implied = Number(impliedProbability);
  const trust = Number(rowEdgeTrust || 0);
  const confidence = Number(pick.confidence || 0) / 100;
  const samePickRate = Number(dailyCalibration?.samePickRate ?? 1);
  const sampleCount = Number(dailyCalibration?.count || 0);
  const marketEdge = Number.isFinite(selectedProbability) && Number.isFinite(implied) ? selectedProbability - implied : 0;
  const displayProbability = Number.isFinite(selectedProbability) ? selectedProbability : rawProbability;

  let score = 0;
  if (displayProbability >= 0.7) score += 34;
  else if (displayProbability >= 0.62) score += 28;
  else if (displayProbability >= 0.56) score += 18;
  else if (displayProbability >= 0.51) score += 10;

  if (confidence >= 0.7) score += 18;
  else if (confidence >= 0.62) score += 12;
  else if (confidence >= 0.55) score += 6;

  if (trust >= 0.75) score += 18;
  else if (trust >= 0.65) score += 13;
  else if (trust >= 0.58) score += 8;

  if (marketEdge >= 0.06) score += 18;
  else if (marketEdge >= 0.03) score += 12;
  else if (marketEdge >= 0) score += 5;
  else score -= 8;

  if (sampleCount >= 3 && samePickRate >= 0.75) score += 8;
  else if (sampleCount >= 2 && samePickRate >= 0.6) score += 4;

  if (Number(edgePct) < -2) score -= 10;
  if (isFinal || isPast) score -= 8;

  score = Math.round(clamp(score, 0, 100));
  const tier = score >= 72 ? "HIGH" : score >= 56 ? "MEDIUM" : score >= 40 ? "WATCH" : "LOW";
  const label = tier === "HIGH"
    ? "高胜算候选"
    : tier === "MEDIUM"
      ? "中高胜算"
      : tier === "WATCH"
        ? "观察胜算"
        : "胜算不足";
  const reasons = [
    `PAUL/Kelly 校准胜率 ${Number.isFinite(displayProbability) ? `${(displayProbability * 100).toFixed(2)}%` : "N/A"}`,
    `市场隐含胜率 ${Number.isFinite(implied) ? `${(implied * 100).toFixed(2)}%` : "N/A"}`,
    `校准信任系数 ${(trust * 100).toFixed(2)}%`,
    sampleCount ? `每日判断样本 ${sampleCount} 次，同向率 ${(samePickRate * 100).toFixed(2)}%` : "暂无每日趋势样本"
  ];
  return {
    tier,
    label,
    score,
    candidate: !isFinal && !isPast && (tier === "HIGH" || tier === "MEDIUM"),
    probability: Number.isFinite(displayProbability) ? displayProbability : null,
    marketEdge,
    reason: reasons.join("；")
  };
}

function dailyProbabilityForSide(record, side) {
  const probabilities = normalizeProbabilities(record?.probabilities || record?.pick?.probabilities);
  const value = Number(probabilities?.[side]);
  return Number.isFinite(value) ? value : null;
}

function dailyCalibrationForSide(match, dailyRead, side) {
  if (!dailyRead || !side) {
    return { count: 0, samePickRate: null, latestProbability: null, firstProbability: null, trendPct: null, trustAdjustment: 0 };
  }
  const history = Array.isArray(dailyRead.history) ? dailyRead.history.slice() : [];
  const current = {
    generatedAt: dailyRead.generatedAt,
    pick: dailyRead.pick || null,
    probabilities: dailyRead.probabilities || dailyRead.pick?.probabilities || null
  };
  if (current.generatedAt && !history.some((item) => item.generatedAt === current.generatedAt)) history.push(current);
  const samples = history
    .map((item) => ({
      generatedAt: item.generatedAt || null,
      side: sideForCode(match, item.pick?.winnerCode || item.pick?.winner || item.pick?.winnerName),
      probability: dailyProbabilityForSide(item, side)
    }))
    .filter((item) => item.probability !== null)
    .sort((a, b) => new Date(a.generatedAt || 0) - new Date(b.generatedAt || 0));
  if (!samples.length) {
    return { count: 0, samePickRate: null, latestProbability: null, firstProbability: null, trendPct: null, trustAdjustment: 0 };
  }
  const latest = samples.at(-1);
  const first = samples[0];
  const sameSideSamples = samples.filter((item) => item.side === side).length;
  const samePickRate = sameSideSamples / samples.length;
  const trend = latest.probability - first.probability;
  const stabilityAdjustment = (samePickRate - 0.5) * 0.12;
  const trendAdjustment = clamp(trend * 0.5, -0.06, 0.06);
  const trustAdjustment = clamp(stabilityAdjustment + trendAdjustment, -0.08, 0.08);
  return {
    count: samples.length,
    samePickRate,
    latestProbability: latest.probability,
    firstProbability: first.probability,
    trendPct: trend * 100,
    trustAdjustment
  };
}

function riskLabel(row, maxStakePct) {
  if (!row.recommendedStake) return row.skipReason || "No bet";
  if (row.finalFraction >= maxStakePct * 0.98) return "Capped";
  if (row.edgePct >= 10) return "Strong edge";
  if (row.edgePct >= 5) return "Measured edge";
  return "Small edge";
}

function sortMatches(a, b) {
  const aTime = parseMatchTime(a)?.getTime() || 0;
  const bTime = parseMatchTime(b)?.getTime() || 0;
  return aTime - bTime || Number(a.id) - Number(b.id);
}

function scoreString(result) {
  if (!result || result.homeScore === undefined || result.awayScore === undefined) return null;
  return `${result.homeScore}-${result.awayScore}`;
}

function topProbabilityMargin(probabilities) {
  if (!probabilities) return null;
  const values = ["home", "draw", "away"]
    .map((side) => Number(probabilities[side] || 0))
    .filter((value) => Number.isFinite(value));
  if (values.length < 2) return null;
  values.sort((a, b) => b - a);
  return values[0] - values[1];
}

function clvSnapshot(market, side, selectedOdds, isFinal = false) {
  const closingOdds = oddsForSide(market?.closingOdds || market?.closing?.odds || market?.close?.odds, side);
  if (!selectedOdds || !closingOdds) {
    return {
      status: isFinal ? "unavailable" : "pending",
      selectedOdds: selectedOdds || null,
      closingOdds: closingOdds || null,
      clvPct: null,
      beatClosing: null,
      note: isFinal
        ? "赛后没有同步到收盘赔率，CLV 暂时无法复盘。"
        : "等待收盘赔率。CLV 要在临近开赛或赛后才能判断。"
    };
  }
  const clvPct = (selectedOdds / closingOdds - 1) * 100;
  return {
    status: clvPct >= 0 ? "positive" : "negative",
    selectedOdds,
    closingOdds,
    clvPct,
    beatClosing: clvPct >= 0,
    note: clvPct >= 0 ? "拿到的赔率优于或等于收盘价。" : "收盘价比拿到的赔率更好，说明入场价格不理想。"
  };
}

function qualityDecision({
  isFinal,
  isPast,
  pick,
  market,
  probabilities,
  stake,
  strictEdgePct,
  minTrustPct,
  drawDangerPct,
  rowEdgeTrust
}) {
  const trustPct = rowEdgeTrust * 100;
  const edgePct = Number(stake.edgePct);
  const drawPct = Number(probabilities?.draw || 0) * 100;
  const marginPct = Number(topProbabilityMargin(probabilities) || 0) * 100;
  const reasons = [];

  if (isFinal) return { action: "SETTLED", label: "已完赛", level: "settled", reasons: ["比赛已完赛，只保留复盘数据。"] };
  if (isPast) return { action: "NO_BET", label: "已开赛", level: "blocked", reasons: ["比赛已经开始，不能再入场。"] };
  if (!pick) return { action: "NO_BET", label: "不下注", level: "blocked", reasons: ["没有 PAUL 判断。"] };
  if (pick.source === "Market fallback") return { action: "NO_BET", label: "不下注", level: "blocked", reasons: ["只有市场参考，没有 PAUL 优势。"] };
  if (!market?.odds) return { action: "NO_BET", label: "不下注", level: "blocked", reasons: ["缺少可执行赔率。"] };
  if (!Number.isFinite(edgePct)) return { action: "NO_BET", label: "不下注", level: "blocked", reasons: ["缺少概率优势。"] };

  const nearEdge = edgePct >= strictEdgePct - 2;
  const nearTrust = trustPct >= minTrustPct - 8;
  const hasPositiveEdge = edgePct > 0;
  if (edgePct < 0) {
    reasons.push(`负优势 ${edgePct.toFixed(2)}%：PAUL 可以看好方向，但赔率隐含胜率更高，赛前下注价值不足。`);
  } else if (edgePct < strictEdgePct) {
    reasons.push(`优势 ${edgePct.toFixed(2)}% 低于正式下注门槛 ${strictEdgePct}%${nearEdge ? "，但接近门槛可继续观察" : ""}。`);
  }
  if (trustPct < minTrustPct) reasons.push(`信任系数 ${trustPct.toFixed(2)}% 低于正式下注门槛 ${minTrustPct}%。`);

  const drawDanger = pick.side !== "draw" && drawPct >= drawDangerPct && marginPct <= 8;
  if (drawDanger) reasons.push(`小组赛平局风险偏高：平局 ${drawPct.toFixed(2)}%，胜平负差距 ${marginPct.toFixed(2)}%。`);

  if (reasons.length) {
    const shouldWatch = drawDanger || (hasPositiveEdge && nearEdge && nearTrust);
    return {
      action: shouldWatch ? "WATCH" : "NO_BET",
      label: shouldWatch ? "观察机会" : "不下注",
      level: shouldWatch ? "watch" : "blocked",
      reasons
    };
  }

  if (edgePct < strictEdgePct + 2 || trustPct < minTrustPct + 6) {
    return {
      action: "WATCH",
      label: "观察",
      level: "watch",
      reasons: ["优势刚过门槛，等待更好的赔率或更稳定的每日 PAUL 数据。"]
    };
  }

  return {
    action: "BET",
    label: "可下注",
    level: edgePct >= 10 ? "strong" : "qualified",
    reasons: ["通过严格优势、信任系数和平局风险过滤。"]
  };
}

function simulationStake({
  odds,
  probability,
  impliedProbability,
  rowEdgeTrust,
  edgePct,
  pick,
  bankroll,
  maxStakePct,
  isBettable
}) {
  if (!isBettable || !odds || !probability || pick?.source === "Market fallback") {
    return { fraction: 0, rawStake: 0 };
  }
  const confidence = Number(pick?.confidence || 0) / 100;
  const base = 0.004;
  const trustBonus = Math.max(0, Number(rowEdgeTrust || 0) - 0.55) * 0.025;
  const confidenceBonus = Math.max(0, confidence - 0.55) * 0.012;
  const edgeBonus = clamp(Number(edgePct || 0) / 100, -0.05, 0.08) * 0.08;
  const marketPenalty = impliedProbability && probability < impliedProbability ? 0.004 : 0;
  const rawFraction = base + trustBonus + confidenceBonus + edgeBonus - marketPenalty;
  const cap = Math.min(Number(maxStakePct || 0.03), 0.015);
  const fraction = clamp(rawFraction, 0.0015, cap);
  return {
    fraction,
    rawStake: bankroll * fraction
  };
}

function fmtPct(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "N/A";
  return `${number.toFixed(2)}%`;
}

function fmtOdds(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "N/A";
  return number.toFixed(2);
}

function sourceLabelZh(source) {
  if (source === "Official lock") return "正式锁定";
  if (source === "Daily read") return "每日判断";
  if (source === "Market fallback") return "市场参考";
  return source || "未知来源";
}

function outcomeTextZh(row) {
  if (row.pickOutcome === "correct") return row.exactScoreHit ? "胜负方向命中，比分也命中" : "胜负方向命中，比分未中";
  if (row.pickOutcome === "missed") return "胜负方向未命中";
  if (row.pickOutcome === "ungraded") return "赛果无法判定";
  return "等待赛果";
}

function buildFallbackPostMatchReview({ pick, result, pickOutcome, exactScoreHit }) {
  if (!result || result.status !== "final") return null;
  const score = result.score || `${result.homeScore}-${result.awayScore}`;
  if (pickOutcome === "correct" && exactScoreHit) {
    return {
      summaryZh: `真实赛果 ${score}。PAUL 胜负方向和比分都命中，本场作为正向样本保留。`,
      calibrationHints: { keepPredictionModel: true, adjustOnlyCalibration: true, edgeTrustDelta: 0.015, scoreModelDelta: 0.02 }
    };
  }
  if (pickOutcome === "correct") {
    return {
      summaryZh: `真实赛果 ${score}。PAUL 胜负方向命中，但比分未中；说明强弱判断有效，比分层需要复盘进球数、大小球、临场效率和领先后的比赛节奏。`,
      calibrationHints: { keepPredictionModel: true, adjustOnlyCalibration: true, edgeTrustDelta: 0.005, scoreModelDelta: -0.01 }
    };
  }
  return {
    summaryZh: `真实赛果 ${score}。PAUL 胜负方向未命中；需要检查是否低估了冷门/平局、伤停临场变化、战术克制、红牌点球或市场临近变化。主预测模型不回改，只下调类似场景的校准信任。`,
    calibrationHints: { keepPredictionModel: true, adjustOnlyCalibration: true, edgeTrustDelta: -0.02, scoreModelDelta: -0.015, marketShrinkDelta: 0.03 }
  };
}

function chineseAnalysisReason({
  pick,
  market,
  result,
  pickOutcome,
  exactScoreHit,
  odds,
  probability,
  impliedProbability,
  dailyAdjustedProbability,
  kellyProbability,
  edgePct,
  rowEdgeTrust,
  dailyCalibration,
  mistakeContext,
  decision
}) {
  if (!pick) return "暂无 PAUL 判断，实验室不会给出仓位建议。";

  const lines = [];
  const pickName = pick.name || "未知方向";
  const score = pick.predictedScore ? `，预测比分 ${pick.predictedScore}` : "";
  const confidence = pick.confidence ? `，置信度 ${fmtPct(pick.confidence)}` : "";
  lines.push(`PAUL 当前选择 ${pickName}${score}${confidence}，来源为${sourceLabelZh(pick.source)}。`);

  if (market?.odds && odds) {
    lines.push(`市场给到该方向赔率 ${fmtOdds(odds)}，对应保本隐含概率 ${fmtPct((impliedProbability || 0) * 100)}。PAUL 原始概率为 ${fmtPct((probability || 0) * 100)}，结合每日更新后为 ${fmtPct((dailyAdjustedProbability || 0) * 100)}，再按信任系数 ${fmtPct((rowEdgeTrust || 0) * 100)} 收缩，得到 Kelly 校准概率 ${fmtPct((kellyProbability || 0) * 100)}。`);
    if (Number.isFinite(edgePct)) {
      const edgeText = edgePct >= 0
        ? `校准后仍有 ${fmtPct(edgePct)} 的正优势。`
        : `校准后为 ${fmtPct(edgePct)} 的负优势，说明方向可以看好，但当前赔率不够划算。`;
      lines.push(edgeText);
    }
  } else {
    lines.push("当前缺少可执行赔率或对应方向赔率，实验室只能复盘 PAUL 判断，不能计算有效 Kelly 仓位。");
  }

  if (dailyCalibration?.count) {
    lines.push(`每日 PAUL 已累积 ${dailyCalibration.count} 次样本，同向率 ${fmtPct(dailyCalibration.samePickRate * 100)}，趋势变化 ${fmtPct(dailyCalibration.trendPct)}，对本场信任系数调整 ${fmtPct(dailyCalibration.trustAdjustment * 100)}。`);
  } else {
    lines.push("每日 PAUL 样本还不够多，仓位会更保守。");
  }

  if (mistakeContext?.usable) {
    const adjustment = mistakeContext.calibrationAdjustment || {};
    const teamNotes = (mistakeContext.summary?.teams || [])
      .map((team) => `${team.code} 方向失误率 ${fmtPct((team.directionMissRate || 0) * 100)}`)
      .join("；");
    lines.push(`失误引擎读取 KV 复盘记忆 ${mistakeContext.summary?.totalReviewed || 0} 场，本场只作为校准辅助：Edge ${adjustment.edgeTrustDelta || 0}，平局 ${adjustment.drawRiskDelta || 0}，冷门 ${adjustment.upsetSensitivityDelta || 0}${teamNotes ? `；${teamNotes}` : ""}。`);
  }

  if (pick.lab?.rehearsal) {
    const rehearsal = pick.lab.rehearsal;
    lines.push(`锁定前预演：${rehearsal.searchRequired ? "需要继续抓取" : "本地信息基本覆盖"}${rehearsal.focus?.length ? `，重点关注 ${rehearsal.focus.join("、")}` : ""}。`);
  }

  if (pick.lab?.winnerVolatility) {
    const volatility = pick.lab.winnerVolatility;
    lines.push(`实时胜方波动：${volatility.leaderName || "当前领先方"}领先 ${volatility.gap ?? "N/A"}%，等级 ${volatility.label || "unknown"}。`);
  }

  if (pick.lab?.scoreScenarios?.length) {
    lines.push(`实时比分路径 Top3：${pick.lab.scoreScenarios.slice(0, 3).map((item) => `${item.score}(${item.probability}%)`).join(" / ")}。`);
    lines.push(`实时比分路径 Top5：${pick.lab.scoreScenarios.slice(0, 5).map((item) => `${item.score}(${item.probability}%)`).join(" / ")}。`);
  }

  if (decision?.reasons?.length) {
    lines.push(`过滤器结论：${decision.reasons.join(" ")}`);
  } else if (decision?.action === "BET") {
    lines.push("过滤器结论：优势、信任系数和平局风险均通过。");
  }

  if (result?.status === "final") {
    lines.push(`真实赛果已同步：${result.score || `${result.homeScore}-${result.awayScore}`}，${outcomeTextZh({ pickOutcome, exactScoreHit })}。完赛后只用于复盘，不再给入场仓位。`);
  }

  if (pick.upsetRiskZh || pick.upsetRisk) lines.push(`风险提示：${pick.upsetRiskZh || pick.upsetRisk}`);
  return lines.join(" ");
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed." });
  }

  try {
    assertOwner(req);
    const url = new URL(req.url || "/", "https://paul.local");
    const bankroll = numberParam(url, "bankroll", 1000, 1, 1000000000);
    const kellyFraction = numberParam(url, "kelly", 0.25, 0.01, 1);
    const maxStakePct = numberParam(url, "maxStakePct", 0.03, 0.001, 0.25);
    const portfolioCapPct = numberParam(url, "portfolioCapPct", 0.12, 0.001, 0.75);
    const minEdgePct = numberParam(url, "minEdgePct", 2, 0, 50);
    const modelAccuracy = numberParam(url, "modelAccuracy", 0.55, 0.5, 0.75);
    const priorWeight = numberParam(url, "priorWeight", 40, 1, 1000);
    const strictEdgePct = numberParam(url, "strictEdgePct", 4, 0, 50);
    const minTrustPct = numberParam(url, "minTrustPct", 60, 0, 100);
    const drawDangerPct = numberParam(url, "drawDangerPct", 28, 0, 60);
    const includeMarketFallback = url.searchParams.get("fallback") !== "0";
    const strategy = url.searchParams.get("strategy") === "value" ? "value" : "paul-follow";

    const snapshot = loadSnapshot();
    const [predictions, results, dailyAnalysis, evidenceCache, mistakeMemory, qwenUsageLedger] = await Promise.all([
      getPredictions(),
      getResults(),
      getDailyAnalysis(),
      getEvidenceCache(),
      getMistakeMemory(),
      getQwenUsage()
    ]);
    const reliability = reliabilityProfile({ predictions, results, mistakeMemory, modelAccuracy, priorWeight });
    const labMistakeContext = buildMistakeContext({ teamA: {}, teamB: {} }, mistakeMemory);
    const resolvedMatches = resolveMatches(snapshot.matches || [], results);
    const now = new Date();
    const qwenUsage = summarizeQwenUsage(qwenUsageLedger, now);
    const rows = resolvedMatches
      .filter((match) => match.teamA?.code && match.teamB?.code)
      .sort(sortMatches)
      .map((match) => {
        const prediction = predictions[match.id] || predictions[String(match.id)] || null;
        const dailyRead = dailyAnalysis[match.id] || dailyAnalysis[String(match.id)] || null;
        const evidence = evidenceRecord(match.id, prediction, evidenceCache);
        const mistakeContext = buildMistakeContext(match, mistakeMemory);
        const mistakeAdjustment = mistakeContext.calibrationAdjustment || {};
        const kvPostMatchReview = mistakeMemory.matches?.[match.id] || mistakeMemory.matches?.[String(match.id)] || null;
        const market = oddsRecord(evidence);
        const officialPick = pickFromPrediction(match, prediction);
        const dailyPick = pickFromDaily(match, dailyRead);
        const livePick = dailyPick || livePickFromKvCorrection(match, officialPick, evidence, mistakeContext);
        const liveDrift = liveDriftFromPicks(officialPick, livePick);
        const driftTrustPenalty = liveDriftTrustPenalty(liveDrift);
        const pick = officialPick || livePick || (includeMarketFallback ? fallbackPickFromMarket(match, market) : null);
        const result = results[match.id] || results[String(match.id)] || null;
        const matchTime = parseMatchTime(match);
        const winnerCode = resultWinner(result);
        const isFinal = result?.status === "final";
        const resultScore = scoreString(result);
        const isPast = matchTime ? matchTime <= now : false;
        const odds = oddsForSide(market?.odds, pick?.side);
        const probabilities = pick?.probabilities || market?.probabilities || null;
        const probability = probabilities && pick?.side ? Number(probabilities[pick.side] || 0) : null;
        const impliedProbability = odds ? 1 / odds : null;
        const dailyCalibration = dailyCalibrationForSide(match, dailyRead, pick?.side);
        const dailyBlendWeight = dailyCalibration.latestProbability !== null ? (pick?.source === "Official lock" ? 0.25 : 0.4) : 0;
        const dailyAdjustedProbability = probability && dailyBlendWeight
          ? clamp(probability * (1 - dailyBlendWeight) + dailyCalibration.latestProbability * dailyBlendWeight, 0.01, 0.99)
          : probability;
        const rowEdgeTrust = clamp(
          reliability.edgeTrust + dailyCalibration.trustAdjustment + Number(mistakeAdjustment.edgeTrustDelta || 0) + driftTrustPenalty,
          0.25,
          0.95
        );
        const kellyProbability = calibratedKellyProbability(dailyAdjustedProbability, impliedProbability, rowEdgeTrust);
        const rawEdgePct = probability && impliedProbability ? (probability - impliedProbability) * 100 : null;
        const dailyAdjustedEdgePct = dailyAdjustedProbability && impliedProbability ? (dailyAdjustedProbability - impliedProbability) * 100 : null;
        const isBettable = Boolean(!isFinal && !isPast && pick && pick.source !== "Market fallback" && odds && probability);
        let skipReason = "";
        if (!pick) skipReason = "No PAUL read";
        else if (isFinal) skipReason = "Final";
        else if (isPast) skipReason = "Kickoff passed";
        else if (pick.source === "Market fallback") skipReason = "Reference only";
        else if (!odds) skipReason = "Missing odds";
        else if (!probability) skipReason = "Missing PAUL probability";
        const pickCode = String(officialPick?.code || "").toUpperCase();
        const finalWinnerCode = String(winnerCode || "").toUpperCase();
        const pickOutcome = isFinal && pickCode && finalWinnerCode
          ? (pickCode === finalWinnerCode ? "correct" : "missed")
          : (isFinal ? "ungraded" : "pending");
        const exactScoreHit = Boolean(isFinal && resultScore && officialPick?.predictedScore && String(officialPick.predictedScore).replace(/\s/g, "") === resultScore);

        const preliminaryStake = kellyStake({
          odds,
          probability: kellyProbability,
          bankroll,
          kellyFraction,
          maxStakePct,
          minEdgePct,
          isBettable
        });
        let decision = qualityDecision({
          isFinal,
          isPast,
          pick,
          market,
          probabilities: dailyAdjustedProbability ? { ...(probabilities || {}), [pick?.side]: dailyAdjustedProbability } : probabilities,
          stake: preliminaryStake,
          strictEdgePct: Math.max(strictEdgePct, minEdgePct),
          minTrustPct,
          drawDangerPct,
          rowEdgeTrust
        });
        if (isBettable && preliminaryStake.edgePct !== null && preliminaryStake.edgePct < Math.max(strictEdgePct, minEdgePct)) skipReason = "Edge below threshold";
        const simulated = simulationStake({
          odds,
          probability: kellyProbability || dailyAdjustedProbability || probability,
          impliedProbability,
          rowEdgeTrust,
          edgePct: preliminaryStake.edgePct,
          pick,
          bankroll,
          maxStakePct,
          isBettable
        });
        let stake = decision.action === "BET"
          ? preliminaryStake
          : {
            ...preliminaryStake,
            fractionalKelly: 0,
            cappedFraction: 0,
            rawStake: 0
          };
        if (strategy === "paul-follow" && decision.action !== "BET" && simulated.rawStake > 0) {
          decision = {
            action: "SIMULATE",
            label: "小仓模拟",
            level: "watch",
            reasons: [
              `严格价值下注未通过，但 PAUL 有明确方向；按保守跟投模拟给 ${fmtPct(simulated.fraction * 100)} 仓位。`,
              "该模式用于测试 1000 单位资金曲线，不代表数学正期望下注。"
            ]
          };
          stake = {
            ...preliminaryStake,
            fractionalKelly: simulated.fraction,
            cappedFraction: simulated.fraction,
            rawStake: simulated.rawStake
          };
        }
        const clv = clvSnapshot(market, pick?.side, odds, isFinal);
        const winConfidence = winConfidenceProfile({
          pick,
          probability,
          dailyAdjustedProbability,
          kellyProbability,
          impliedProbability,
          rowEdgeTrust,
          dailyCalibration,
          edgePct: preliminaryStake.edgePct,
          isFinal,
          isPast
        });
        const analysisReasonZh = chineseAnalysisReason({
          pick,
          market,
          result: result
            ? {
                status: result.status || null,
                homeScore: result.homeScore ?? null,
                awayScore: result.awayScore ?? null,
                score: resultScore
              }
            : null,
          pickOutcome,
          exactScoreHit,
          odds,
          probability,
          impliedProbability,
          dailyAdjustedProbability,
          kellyProbability,
          edgePct: preliminaryStake.edgePct,
          rowEdgeTrust,
          dailyCalibration,
          mistakeContext,
          decision
        });
        const ledgerEligible = Boolean(pick && pick.source !== "Market fallback" && odds && probability);
        const simulationBase = strategy === "paul-follow"
          ? simulationStake({
            odds,
            probability: kellyProbability || dailyAdjustedProbability || probability,
            impliedProbability,
            rowEdgeTrust,
            edgePct: preliminaryStake.edgePct,
            pick,
            bankroll,
            maxStakePct,
            isBettable: ledgerEligible
          })
          : {
            fraction: stake.cappedFraction || 0,
            rawStake: stake.rawStake || 0
          };
        const simulationStakeAmount = Number(simulationBase.rawStake || 0);
        const simulationProfitIfWin = odds ? simulationStakeAmount * (odds - 1) : 0;
        const simulationLossIfLose = -simulationStakeAmount;

        return {
          id: match.id,
          round: match.round,
          group: match.group || null,
          kickoffAt: matchTime ? matchTime.toISOString() : null,
          venue: match.venue || null,
          match: `${match.teamA.name} vs ${match.teamB.name}`,
          teams: {
            home: { code: match.teamA.code, name: match.teamA.name },
            away: { code: match.teamB.code, name: match.teamB.name }
          },
          pick,
          dailyLab: dailyRead?.lab || livePick?.lab || null,
          liveDrift,
          driftTrustPenalty,
          winConfidence,
          market,
          result: result
            ? {
                status: result.status || null,
                homeScore: result.homeScore ?? null,
                awayScore: result.awayScore ?? null,
                score: resultScore,
                winnerCode,
                source: result.source || null,
                updatedAt: result.updatedAt || result.fetchedAt || null,
                postMatchReview: result.postMatchReview || kvPostMatchReview || null
              }
            : null,
          pickOutcome,
          exactScoreHit,
          selectedOdds: odds,
          selectedProbability: probability,
          dailyAdjustedProbability,
          kellyProbability,
          rawEdgePct,
          dailyAdjustedEdgePct,
          rowEdgeTrust,
          dailyCalibration,
          impliedProbability: stake.impliedProbability,
          edgePct: stake.edgePct,
          fullKelly: stake.fullKelly,
          fractionalKelly: stake.fractionalKelly,
          cappedFraction: stake.cappedFraction,
          rawStake: stake.rawStake,
          finalFraction: stake.cappedFraction,
          recommendedStake: stake.rawStake,
          decision,
          analysisReasonZh,
          postMatchReview: result?.postMatchReview || kvPostMatchReview || buildFallbackPostMatchReview({ pick, result: result ? { ...result, score: resultScore } : null, pickOutcome, exactScoreHit }),
          mistakeEngine: mistakeContext.usable ? mistakeContext : null,
          simulation: {
            strategy,
            eligible: ledgerEligible,
            stake: simulationStakeAmount,
            fraction: Number(simulationBase.fraction || 0),
            odds,
            profitIfWin: simulationProfitIfWin,
            lossIfLose: simulationLossIfLose,
            settledProfit: null,
            balanceBefore: null,
            balanceAfter: null,
            balanceIfWin: null,
            balanceIfLose: null,
            scoreFocus: exactScoreHit
              ? "比分完全命中。"
              : pickOutcome === "correct"
                ? "胜负方向命中，但比分未中；后续应重点复盘进球数、盘口强弱差、阵型节奏和临场效率。"
                : pickOutcome === "missed"
                  ? "胜负方向未中，比分判断同步失效。"
                  : "等待赛果验证比分。"
          },
          clv,
          skipReason,
          risk: ""
        };
      });

    const positiveRows = rows.filter((row) => row.rawStake > 0);
    const rawTotalStake = positiveRows.reduce((sum, row) => sum + row.rawStake, 0);
    const portfolioCap = bankroll * portfolioCapPct;
    const scale = rawTotalStake > portfolioCap ? portfolioCap / rawTotalStake : 1;
    rows.forEach((row) => {
      row.recommendedStake = Number((row.rawStake * scale).toFixed(2));
      row.finalFraction = bankroll ? row.recommendedStake / bankroll : 0;
      if (row.simulation && row.result?.status !== "final" && row.rawStake > 0) {
        row.simulation.stake = row.recommendedStake;
        row.simulation.fraction = bankroll ? row.recommendedStake / bankroll : 0;
        row.simulation.profitIfWin = row.selectedOdds ? row.recommendedStake * (row.selectedOdds - 1) : 0;
        row.simulation.lossIfLose = -row.recommendedStake;
      }
    });
    let simulationBalance = bankroll;
    let settledSimulationProfit = 0;
    let settledSimulationStake = 0;
    let pendingSimulationStake = 0;
    rows.forEach((row) => {
      if (!row.simulation || !row.simulation.eligible || !row.simulation.stake) return;
      row.simulation.balanceBefore = simulationBalance;
      if (row.result?.status === "final") {
        const settledProfit = row.pickOutcome === "correct"
          ? row.simulation.profitIfWin
          : row.simulation.lossIfLose;
        row.simulation.settledProfit = settledProfit;
        row.simulation.balanceAfter = simulationBalance + settledProfit;
        settledSimulationProfit += settledProfit;
        settledSimulationStake += row.simulation.stake;
        simulationBalance = row.simulation.balanceAfter;
      } else {
        pendingSimulationStake += row.simulation.stake;
        row.simulation.balanceIfWin = simulationBalance + row.simulation.profitIfWin;
        row.simulation.balanceIfLose = simulationBalance + row.simulation.lossIfLose;
      }
    });
    rows.forEach((row) => {
      row.risk = riskLabel(row, maxStakePct);
      row.edgePct = row.edgePct === null ? null : Number(row.edgePct.toFixed(2));
      row.fullKelly = Number((row.fullKelly * 100).toFixed(2));
      row.fractionalKelly = Number((row.fractionalKelly * 100).toFixed(2));
      row.cappedFraction = Number((row.cappedFraction * 100).toFixed(2));
      row.finalFraction = Number((row.finalFraction * 100).toFixed(2));
      row.selectedProbability = row.selectedProbability === null ? null : Number((row.selectedProbability * 100).toFixed(2));
      row.kellyProbability = row.kellyProbability === null ? null : Number((row.kellyProbability * 100).toFixed(2));
      row.dailyAdjustedProbability = row.dailyAdjustedProbability === null ? null : Number((row.dailyAdjustedProbability * 100).toFixed(2));
      row.rawEdgePct = row.rawEdgePct === null ? null : Number(row.rawEdgePct.toFixed(2));
      row.dailyAdjustedEdgePct = row.dailyAdjustedEdgePct === null ? null : Number(row.dailyAdjustedEdgePct.toFixed(2));
      row.rowEdgeTrust = row.rowEdgeTrust === null ? null : Number((row.rowEdgeTrust * 100).toFixed(2));
      if (row.dailyCalibration) {
        row.dailyCalibration = {
          ...row.dailyCalibration,
          samePickRate: row.dailyCalibration.samePickRate === null ? null : Number((row.dailyCalibration.samePickRate * 100).toFixed(2)),
          latestProbability: row.dailyCalibration.latestProbability === null ? null : Number((row.dailyCalibration.latestProbability * 100).toFixed(2)),
          firstProbability: row.dailyCalibration.firstProbability === null ? null : Number((row.dailyCalibration.firstProbability * 100).toFixed(2)),
          trendPct: row.dailyCalibration.trendPct === null ? null : Number(row.dailyCalibration.trendPct.toFixed(2)),
          trustAdjustment: Number((row.dailyCalibration.trustAdjustment * 100).toFixed(2))
        };
      }
      if (row.clv) {
        row.clv = {
          ...row.clv,
          clvPct: row.clv.clvPct === null ? null : Number(row.clv.clvPct.toFixed(2))
        };
      }
      if (row.simulation) {
        row.simulation = {
          ...row.simulation,
          stake: Number(row.simulation.stake.toFixed(2)),
          fraction: Number((row.simulation.fraction * 100).toFixed(2)),
          profitIfWin: Number(row.simulation.profitIfWin.toFixed(2)),
          lossIfLose: Number(row.simulation.lossIfLose.toFixed(2)),
          settledProfit: row.simulation.settledProfit === null ? null : Number(row.simulation.settledProfit.toFixed(2)),
          balanceBefore: row.simulation.balanceBefore === null ? null : Number(row.simulation.balanceBefore.toFixed(2)),
          balanceAfter: row.simulation.balanceAfter === null ? null : Number(row.simulation.balanceAfter.toFixed(2)),
          balanceIfWin: row.simulation.balanceIfWin === null ? null : Number(row.simulation.balanceIfWin.toFixed(2)),
          balanceIfLose: row.simulation.balanceIfLose === null ? null : Number(row.simulation.balanceIfLose.toFixed(2))
        };
      }
      if (row.winConfidence) {
        row.winConfidence = {
          ...row.winConfidence,
          probability: row.winConfidence.probability === null ? null : Number((row.winConfidence.probability * 100).toFixed(2)),
          marketEdge: Number((Number(row.winConfidence.marketEdge || 0) * 100).toFixed(2))
        };
      }
      row.driftTrustPenalty = Number((Number(row.driftTrustPenalty || 0) * 100).toFixed(2));
      row.impliedProbability = row.impliedProbability === null ? null : Number((row.impliedProbability * 100).toFixed(2));
    });

    const finalBetRows = rows.filter((row) => row.recommendedStake > 0);
    const settledSimulationRows = rows.filter((row) => row.simulation?.eligible && row.simulation?.stake && row.result?.status === "final");
    const settledSimulationWins = settledSimulationRows.filter((row) => row.pickOutcome === "correct").length;
    const settledSimulationLosses = settledSimulationRows.filter((row) => row.pickOutcome === "missed").length;
    const settledSimulationRoi = settledSimulationStake ? settledSimulationProfit / settledSimulationStake : null;
    const averageSettledSimulationOdds = settledSimulationRows.length
      ? settledSimulationRows.reduce((sum, row) => sum + Number(row.simulation?.odds || row.selectedOdds || 0), 0) / settledSimulationRows.length
      : null;
    const driftSummary = summarizeLiveDrift(rows);
    const averageEdge = finalBetRows.length
      ? finalBetRows.reduce((sum, row) => sum + Number(row.edgePct || 0), 0) / finalBetRows.length
      : 0;

    return json(res, 200, {
      status: "ok",
      generatedAt: new Date().toISOString(),
      note: "Private admin bankroll research tool. Entertainment/reference only; not financial or betting advice.",
      controls: {
        bankroll,
        kellyFraction,
        maxStakePct,
        portfolioCapPct,
        minEdgePct,
        modelAccuracy,
        priorWeight,
        strictEdgePct,
        minTrustPct,
        drawDangerPct,
        strategy,
        formula: "dailyAdjustedProbability blends PAUL's locked/current probability with that match's daily PAUL read. edgeTrust comes from the 55% prior, verified real results, exact-score hits, daily trend stability, and the KV mistake-memory calibration layer. kellyProbability = impliedProbability + (dailyAdjustedProbability - impliedProbability) * edgeTrust; only rows that pass strict edge, trust, draw-risk, and market-data gates can receive a stake. fullKelly = (decimalOdds * kellyProbability - 1) / (decimalOdds - 1); stake = bankroll * min(maxStakePct, kellyFraction * max(0, fullKelly)), then portfolio-cap scaled."
      },
      reliability: {
        ...reliability,
        mistakeEngine: {
          source: labMistakeContext.source,
          updatedAt: labMistakeContext.updatedAt,
          totalReviewed: labMistakeContext.summary?.totalReviewed || 0,
          directionMisses: labMistakeContext.summary?.directionMisses || 0,
          scoreMisses: labMistakeContext.summary?.scoreMisses || 0,
          exactHits: labMistakeContext.summary?.exactHits || 0,
          topGlobalCauses: labMistakeContext.summary?.topGlobalCauses || [],
          calibrationAdjustment: labMistakeContext.calibrationAdjustment
        },
        posteriorHitRate: Number((reliability.posteriorHitRate * 100).toFixed(2)),
        edgeTrust: Number((reliability.edgeTrust * 100).toFixed(2)),
        exactScoreBonus: Number((reliability.exactScoreBonus * 100).toFixed(2)),
        postMatchCalibrationDelta: Number((reliability.postMatchCalibrationDelta * 100).toFixed(2)),
        modelAccuracy: Number((reliability.modelAccuracy * 100).toFixed(2)),
        historicalComparison: {
          ...reliability.historicalComparison,
          paul: {
            ...reliability.historicalComparison.paul,
            accuracy: Number((reliability.historicalComparison.paul.accuracy * 100).toFixed(2))
          },
          market: {
            ...reliability.historicalComparison.market,
            accuracy: Number((reliability.historicalComparison.market.accuracy * 100).toFixed(2))
          }
        },
        liveComparison: {
          direction: {
            paul: {
              ...reliability.liveComparison.direction.paul,
              accuracy: reliability.liveComparison.direction.paul.accuracy === null ? null : Number((reliability.liveComparison.direction.paul.accuracy * 100).toFixed(2))
            },
            market: {
              ...reliability.liveComparison.direction.market,
              accuracy: reliability.liveComparison.direction.market.accuracy === null ? null : Number((reliability.liveComparison.direction.market.accuracy * 100).toFixed(2))
            }
          },
          exactScore: {
            paul: {
              ...reliability.liveComparison.exactScore.paul,
              accuracy: reliability.liveComparison.exactScore.paul.accuracy === null ? null : Number((reliability.liveComparison.exactScore.paul.accuracy * 100).toFixed(2))
            },
            market: reliability.liveComparison.exactScore.market
          }
        },
        combined: {
          ...reliability.combined,
          accuracy: Number((reliability.combined.accuracy * 100).toFixed(2))
        }
      },
      qwenUsage,
      summary: {
        matches: rows.length,
        bettable: finalBetRows.length,
        valueBets: rows.filter((row) => row.decision?.action === "BET").length,
        simulated: rows.filter((row) => row.decision?.action === "SIMULATE").length,
        watch: rows.filter((row) => row.decision?.action === "WATCH").length,
        noBet: rows.filter((row) => row.decision?.action === "NO_BET").length,
        settled: rows.filter((row) => row.decision?.action === "SETTLED").length,
        positiveClv: rows.filter((row) => row.clv?.status === "positive").length,
        negativeClv: rows.filter((row) => row.clv?.status === "negative").length,
        totalRecommendedStake: Number(finalBetRows.reduce((sum, row) => sum + row.recommendedStake, 0).toFixed(2)),
        simulatedBalance: Number(simulationBalance.toFixed(2)),
        settledSimulationProfit: Number(settledSimulationProfit.toFixed(2)),
        settledSimulationStake: Number(settledSimulationStake.toFixed(2)),
        settledSimulationBets: settledSimulationRows.length,
        settledSimulationWins,
        settledSimulationLosses,
        settledSimulationWinRate: settledSimulationRows.length ? Number(((settledSimulationWins / settledSimulationRows.length) * 100).toFixed(2)) : null,
        settledSimulationRoi: settledSimulationRoi === null ? null : Number((settledSimulationRoi * 100).toFixed(2)),
        averageSettledSimulationOdds: averageSettledSimulationOdds === null ? null : Number(averageSettledSimulationOdds.toFixed(2)),
        pendingSimulationStake: Number(pendingSimulationStake.toFixed(2)),
        portfolioCap: Number(portfolioCap.toFixed(2)),
        portfolioScale: Number(scale.toFixed(3)),
        maxSingleStake: Number(finalBetRows.reduce((max, row) => Math.max(max, row.recommendedStake), 0).toFixed(2)),
        highWinCandidates: rows.filter((row) => row.winConfidence?.candidate && row.winConfidence?.tier === "HIGH").length,
        mediumWinCandidates: rows.filter((row) => row.winConfidence?.candidate && row.winConfidence?.tier === "MEDIUM").length,
        driftTracked: driftSummary.tracked,
        driftWinnerChanged: driftSummary.winnerChanged,
        driftScoreChanged: driftSummary.scoreChanged,
        driftVolatile: driftSummary.volatile,
        driftPenaltyRows: driftSummary.penaltyRows,
        averageEdgePct: Number(averageEdge.toFixed(2))
      },
      rows
    });
  } catch (error) {
    return json(res, error.status || 500, { error: error.message || "Quant tool failed." });
  }
};
