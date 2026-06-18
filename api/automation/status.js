const fs = require("fs");
const path = require("path");
const { collectPredictionEvidence, loadSnapshot } = require("../_lib/paul");
const { auditSnapshot } = require("../_lib/audit");
const { accuracySnapshot, nextPredictionDue, resolveMatches, stageAccuracySnapshot } = require("../_lib/bracket");
const { hasResultsProvider, providerName } = require("../_lib/results");
const { buildMistakeContext } = require("../_lib/mistake-engine");
const { getDailyAnalysis, getEvidenceCache, getMistakeMemory, getPredictions, getResults, isSharedStoreConfigured } = require("../_lib/store");

function sideFromMarket(probabilities = {}, allowDraw = true) {
  const sides = allowDraw ? ["home", "draw", "away"] : ["home", "away"];
  const available = sides.filter((side) => Number.isFinite(Number(probabilities[side])));
  if (!available.length) return null;
  return available.sort((a, b) => Number(probabilities[b]) - Number(probabilities[a]))[0];
}

function sideTeam(match, side) {
  if (side === "draw") return { code: "DRAW", name: "Draw" };
  if (side === "home") return match?.teamA ? { code: match.teamA.code, name: match.teamA.name } : null;
  if (side === "away") return match?.teamB ? { code: match.teamB.code, name: match.teamB.name } : null;
  return null;
}

function marketTraceEntry(match, evidence) {
  const market = evidence?.market;
  if (!market?.probabilities) return null;
  const side = sideFromMarket(market.probabilities, match.round === "Group Stage");
  const winner = sideTeam(match, side);
  return {
    matchId: match.id,
    provider: market.provider || market.source || null,
    updatedAt: market.updatedAt || evidence.generatedAt || null,
    bookmakerCount: market.bookmakerCount || null,
    favoriteSide: side,
    favoriteCode: winner?.code || null,
    favoriteName: winner?.name || null,
    probabilities: {
      home: market.probabilities.home ?? null,
      draw: market.probabilities.draw ?? null,
      away: market.probabilities.away ?? null
    }
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function predictionAnalysis(prediction) {
  return prediction?.analysis || prediction?.proof?.payload?.prediction || null;
}

function evidenceForMatch(matchId, prediction, evidenceCache) {
  return evidenceCache?.[matchId] ||
    evidenceCache?.[String(matchId)] ||
    prediction?.evidence ||
    prediction?.proof?.payload?.evidence ||
    null;
}

function normalizedProbabilities(probabilities = {}) {
  const home = Number(probabilities.home ?? 0);
  const draw = Number(probabilities.draw ?? 0);
  const away = Number(probabilities.away ?? 0);
  const total = home + draw + away;
  if (!Number.isFinite(total) || total <= 0) return null;
  return { home: home / total, draw: draw / total, away: away / total };
}

function analysisProbabilities(analysis = {}) {
  const probabilities = analysis.probabilities || {};
  const home = Number(probabilities.home ?? 0);
  const draw = Number(probabilities.draw ?? 0);
  const away = Number(probabilities.away ?? 0);
  if (home > 1 || draw > 1 || away > 1) {
    return normalizedProbabilities({ home, draw, away });
  }
  return normalizedProbabilities(probabilities);
}

function sideCode(match, side) {
  if (side === "draw") return "DRAW";
  if (side === "home") return match.teamA?.code || null;
  if (side === "away") return match.teamB?.code || null;
  return null;
}

function sideNameFor(match, side) {
  if (side === "draw") return "Draw";
  if (side === "home") return match.teamA?.name || "Home";
  if (side === "away") return match.teamB?.name || "Away";
  return null;
}

function sideFromCode(match, code) {
  const value = String(code || "").toUpperCase();
  if (value === "DRAW") return "draw";
  if (value === String(match.teamA?.code || "").toUpperCase()) return "home";
  if (value === String(match.teamB?.code || "").toUpperCase()) return "away";
  return null;
}

function strongestSide(match, probabilities = {}) {
  const sides = match.round === "Group Stage" ? ["home", "draw", "away"] : ["home", "away"];
  return sides
    .filter((side) => Number.isFinite(Number(probabilities[side])))
    .sort((a, b) => Number(probabilities[b]) - Number(probabilities[a]))[0] || null;
}

function scoreParts(score) {
  const match = String(score || "").match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function adjustedScore(officialScore, evidence, adjustment = {}) {
  const scenarios = Array.isArray(evidence?.poisson?.topScorelines) ? evidence.poisson.topScorelines : [];
  if (!officialScore || !scenarios.length) return officialScore || evidence?.poisson?.predictedScore || null;
  const official = scoreParts(officialScore);
  if (!official) return officialScore;
  const officialTotal = official.home + official.away;
  const goalDelta = Number(adjustment.goalVolatilityDelta || adjustment.scoreConfidenceDelta || 0);
  if (goalDelta > 0.006) {
    return scenarios.find((item) => {
      const parts = scoreParts(item.score);
      return parts && parts.home + parts.away >= officialTotal + 1;
    })?.score || officialScore;
  }
  if (goalDelta < -0.006) {
    return scenarios.find((item) => {
      const parts = scoreParts(item.score);
      return parts && parts.home + parts.away <= Math.max(0, officialTotal - 1);
    })?.score || officialScore;
  }
  return scenarios[0]?.score || officialScore;
}

function liveCorrectionForMatch(match, prediction, dailyRead, evidenceCache, mistakeMemory) {
  if (!prediction || dailyRead) return null;
  const analysis = predictionAnalysis(prediction);
  if (!analysis) return null;
  const evidence = evidenceForMatch(match.id, prediction, evidenceCache);
  const mistakeContext = buildMistakeContext(match, mistakeMemory);
  const adjustment = mistakeContext.calibrationAdjustment || {};
  const base = analysisProbabilities(analysis);
  if (!base) return null;

  const next = { ...base };
  const market = normalizedProbabilities(evidence?.market?.probabilities);
  const marketShrink = clamp(Number(adjustment.marketShrinkDelta || 0) + Math.max(0, -Number(adjustment.edgeTrustDelta || 0)), 0, 0.12);
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

  const officialSide = sideFromCode(match, analysis.winnerCode || analysis.winner || analysis.winnerName);
  const liveSide = strongestSide(match, normalizedProbabilities(next));
  const officialScore = analysis.predictedScore || analysis.score || null;
  const liveScore = adjustedScore(officialScore, evidence, adjustment);
  const correctionReasons = [
    `${mistakeContext.summary?.totalReviewed || 0} KV post-match reviews are active`,
    "locked proof is unchanged",
    marketShrink ? `market shrink ${Math.round(marketShrink * 100)}%` : "",
    Number(adjustment.drawRiskDelta || 0) ? `draw risk ${Number(adjustment.drawRiskDelta).toFixed(3)}` : "",
    Number(adjustment.upsetSensitivityDelta || 0) ? `upset sensitivity ${Number(adjustment.upsetSensitivityDelta).toFixed(3)}` : "",
    evidence?.market?.updatedAt ? `market/news evidence ${evidence.market.updatedAt}` : "waiting for next news refresh"
  ].filter(Boolean);

  return {
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    source: "KV live correction",
    official: {
      winnerCode: sideCode(match, officialSide),
      winnerName: sideNameFor(match, officialSide),
      predictedScore: officialScore,
      probability: officialSide ? Math.round(Number(base[officialSide] || 0) * 100) : null,
      confidence: Number(analysis.confidence || 0) || null
    },
    live: {
      winnerCode: sideCode(match, liveSide),
      winnerName: sideNameFor(match, liveSide),
      predictedScore: liveScore,
      probability: liveSide ? Math.round(Number(next[liveSide] || 0) * 100) : null,
      probabilities: {
        home: Math.round(next.home * 100),
        draw: Math.round(next.draw * 100),
        away: Math.round(next.away * 100)
      }
    },
    drifted: officialSide && liveSide ? officialSide !== liveSide : false,
    scoreChanged: Boolean(officialScore && liveScore && String(officialScore).trim() !== String(liveScore).trim()),
    reason: correctionReasons.join("; "),
    kv: {
      usable: mistakeContext.usable,
      totalReviewed: mistakeContext.summary?.totalReviewed || 0,
      adjustment
    },
    freshness: {
      evidenceUpdatedAt: evidence?.market?.updatedAt || evidence?.updatedAt || evidence?.generatedAt || null,
      nextNewsRefresh: "Daily PAUL Read will replace this correction after the next forced news refresh."
    }
  };
}

module.exports = async function handler(req, res) {
  const snapshot = loadSnapshot();
  const predictions = await getPredictions();
  const results = await getResults();
  const evidenceCache = await getEvidenceCache();
  const dailyAnalysis = await getDailyAnalysis();
  const mistakeMemory = await getMistakeMemory();
  const globalMistakeContext = buildMistakeContext({ teamA: {}, teamB: {} }, mistakeMemory);
  const evidenceEntries = Object.values(evidenceCache || {});
  const dailyEntries = Object.values(dailyAnalysis || {});
  const latestEvidenceAt = evidenceEntries
    .map((entry) => entry?.market?.updatedAt || entry?.updatedAt || entry?.generatedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  const latestDailyReadAt = dailyEntries
    .map((entry) => entry?.generatedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  const dataDir = path.join(__dirname, "..", "..", "data");
  const resolvedMatches = resolveMatches(snapshot.matches, results);
  const resolvedById = Object.fromEntries(resolvedMatches.map((match) => [String(match.id), match]));
  const marketTrace = Object.fromEntries(Object.entries(evidenceCache || {})
    .map(([matchId, evidence]) => {
      const match = resolvedById[String(matchId)];
      if (!match) return null;
      const entry = marketTraceEntry(match, evidence);
      return entry ? [String(matchId), entry] : null;
    })
    .filter(Boolean));
  const liveCorrections = Object.fromEntries(resolvedMatches
    .map((match) => {
      const prediction = predictions[match.id] || predictions[String(match.id)] || null;
      const dailyRead = dailyAnalysis[match.id] || dailyAnalysis[String(match.id)] || null;
      const correction = liveCorrectionForMatch(match, prediction, dailyRead, evidenceCache, mistakeMemory);
      return correction ? [String(match.id), correction] : null;
    })
    .filter(Boolean));
  const auditEntries = await auditSnapshot();
  const firstResolved = resolvedMatches.find((match) => match.teamA?.code && match.teamB?.code);
  const first = firstResolved ? await collectPredictionEvidence(firstResolved, { liveOdds: false }) : null;
  res.status(200).json({
    totalMatches: snapshot.matches.length,
    predictionCount: Object.keys(predictions).length,
    auditCount: auditEntries.length,
    resultCount: Object.keys(results).length,
    nextPrediction: nextPredictionDue(snapshot.matches, predictions, results),
    accuracy: accuracySnapshot(predictions, results),
    stageAccuracy: stageAccuracySnapshot(predictions, results, resolvedMatches),
    predictions,
    results,
    dailyAnalysis,
    liveCorrections,
    mistakeMemory: {
      updatedAt: globalMistakeContext.updatedAt,
      usable: globalMistakeContext.usable,
      totalReviewed: globalMistakeContext.summary?.totalReviewed || 0,
      directionMisses: globalMistakeContext.summary?.directionMisses || 0,
      scoreMisses: globalMistakeContext.summary?.scoreMisses || 0,
      exactHits: globalMistakeContext.summary?.exactHits || 0,
      calibrationAdjustment: globalMistakeContext.calibrationAdjustment || null
    },
    marketTrace,
    resolvedMatches: resolvedMatches.map((match) => ({
      id: match.id,
      teamA: match.teamA || null,
      teamB: match.teamB || null
    })),
    dataReadiness: {
      marketOdds: fs.existsSync(path.join(dataDir, "market-odds.json")),
      teamRatings: fs.existsSync(path.join(dataDir, "team-ratings.json")),
      recentForm: fs.existsSync(path.join(dataDir, "recent-form.json")),
      liveOddsProvider: [
        process.env.BSD_API_KEY ? "bsd" : null,
        process.env.ODDS_API_IO_KEY ? "odds-api.io" : null,
        process.env.THE_ODDS_API_KEY ? "theoddsapi.com" : null,
        process.env.BALLDONTLIE_API_KEY ? "balldontlie" : null
      ].filter(Boolean).join(",") || null,
      evidenceCacheCount: evidenceEntries.length,
      latestEvidenceAt,
      oddsRefreshHorizonDays: Number(process.env.ODDS_REFRESH_HORIZON_DAYS || 60),
      dailyAnalysisCount: dailyEntries.length,
      latestDailyReadAt,
      cronOddsRefreshMaxMatches: Number(process.env.CRON_ODDS_REFRESH_MAX_MATCHES || 12),
      cronDailyAnalysisMaxMatches: Number(process.env.CRON_DAILY_ANALYSIS_MAX_MATCHES || 12),
      dailyAnalysisMaxMatches: Number(process.env.DAILY_ANALYSIS_MAX_MATCHES || 8),
      dailyAnalysisHorizonDays: Number(process.env.DAILY_ANALYSIS_HORIZON_DAYS || 45),
      dailyAnalysisPriorityWindowHours: Number(process.env.DAILY_ANALYSIS_PRIORITY_WINDOW_HOURS || process.env.PREDICTION_LEAD_HOURS || 36),
      firstMatchEvidence: first
    },
    hasQwenKey: Boolean(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY),
    hasResultsApi: hasResultsProvider(),
    resultsProvider: providerName(),
    hasSharedStore: isSharedStoreConfigured(),
    cronProtected: Boolean(process.env.CRON_SECRET)
  });
};
