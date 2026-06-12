const { parseMatchTime, resolveMatches, resultWinnerCode } = require("../_lib/bracket");
const { loadSnapshot } = require("../_lib/paul");
const { getDailyAnalysis, getEvidenceCache, getPredictions, getResults } = require("../_lib/store");

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
    evidenceUsed: listify(analysis.evidenceUsed)
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
    evidenceUsed: listify(pick?.evidenceUsed || dailyRead?.evidenceUsed)
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
    evidenceUsed: ["market odds reference"]
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
    if (score && score === `${result.homeScore}-${result.awayScore}`) stats.exactScore += 1;
    return stats;
  }, { graded: 0, correct: 0, exactScore: 0 });
}

function reliabilityProfile({ predictions, results, modelAccuracy, priorWeight }) {
  const live = liveModelStats(predictions, results);
  const posteriorHitRate = (modelAccuracy * priorWeight + live.correct) / (priorWeight + live.graded || 1);
  const exactScoreBonus = Math.min(0.04, live.exactScore * 0.015);
  const edgeTrust = clamp(0.45 + (posteriorHitRate - 0.5) * 4 + exactScoreBonus, 0.35, 0.92);
  return {
    modelAccuracy,
    priorWeight,
    live,
    posteriorHitRate,
    exactScoreBonus,
    edgeTrust,
    method: "Kelly uses PAUL's pick, then shrinks PAUL's edge versus market implied probability by a reliability factor based on the 55% prior, verified live results, exact-score hits, and each match's daily PAUL trend."
  };
}

function calibratedKellyProbability(paulProbability, impliedProbability, edgeTrust) {
  if (paulProbability === null || paulProbability === undefined || impliedProbability === null || impliedProbability === undefined) return null;
  if (!Number.isFinite(Number(paulProbability)) || !Number.isFinite(Number(impliedProbability))) return null;
  return clamp(impliedProbability + (paulProbability - impliedProbability) * edgeTrust, 0.01, 0.99);
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

function clvSnapshot(market, side, selectedOdds) {
  const closingOdds = oddsForSide(market?.closingOdds || market?.closing?.odds || market?.close?.odds, side);
  if (!selectedOdds || !closingOdds) {
    return {
      status: "pending",
      selectedOdds: selectedOdds || null,
      closingOdds: closingOdds || null,
      clvPct: null,
      beatClosing: null,
      note: "等待收盘赔率。CLV 要在临近开赛或赛后才能判断。"
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

  if (edgePct < strictEdgePct) reasons.push(`优势 ${edgePct.toFixed(2)}% 低于严格门槛 ${strictEdgePct}%。`);
  if (trustPct < minTrustPct) reasons.push(`信任系数 ${trustPct.toFixed(2)}% 低于门槛 ${minTrustPct}%。`);

  const drawDanger = pick.side !== "draw" && drawPct >= drawDangerPct && marginPct <= 8;
  if (drawDanger) reasons.push(`小组赛平局风险偏高：平局 ${drawPct.toFixed(2)}%，胜平负差距 ${marginPct.toFixed(2)}%。`);

  if (reasons.length) {
    return {
      action: drawDanger ? "WATCH" : "NO_BET",
      label: drawDanger ? "观察" : "不下注",
      level: drawDanger ? "watch" : "blocked",
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

    const snapshot = loadSnapshot();
    const [predictions, results, dailyAnalysis, evidenceCache] = await Promise.all([
      getPredictions(),
      getResults(),
      getDailyAnalysis(),
      getEvidenceCache()
    ]);
    const reliability = reliabilityProfile({ predictions, results, modelAccuracy, priorWeight });
    const resolvedMatches = resolveMatches(snapshot.matches || [], results);
    const now = new Date();
    const rows = resolvedMatches
      .filter((match) => match.teamA?.code && match.teamB?.code)
      .sort(sortMatches)
      .map((match) => {
        const prediction = predictions[match.id] || predictions[String(match.id)] || null;
        const dailyRead = dailyAnalysis[match.id] || dailyAnalysis[String(match.id)] || null;
        const evidence = evidenceRecord(match.id, prediction, evidenceCache);
        const market = oddsRecord(evidence);
        const officialPick = pickFromPrediction(match, prediction);
        const dailyPick = pickFromDaily(match, dailyRead);
        const pick = officialPick || dailyPick || (includeMarketFallback ? fallbackPickFromMarket(match, market) : null);
        const result = results[match.id] || results[String(match.id)] || null;
        const matchTime = parseMatchTime(match);
        const winnerCode = resultWinnerCode(match, result);
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
        const rowEdgeTrust = clamp(reliability.edgeTrust + dailyCalibration.trustAdjustment, 0.25, 0.95);
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
        const pickCode = String(pick?.code || "").toUpperCase();
        const finalWinnerCode = String(winnerCode || "").toUpperCase();
        const pickOutcome = isFinal && pickCode && finalWinnerCode
          ? (pickCode === finalWinnerCode ? "correct" : "missed")
          : (isFinal ? "ungraded" : "pending");
        const exactScoreHit = Boolean(isFinal && resultScore && pick?.predictedScore && String(pick.predictedScore).replace(/\s/g, "") === resultScore);

        const preliminaryStake = kellyStake({
          odds,
          probability: kellyProbability,
          bankroll,
          kellyFraction,
          maxStakePct,
          minEdgePct,
          isBettable
        });
        const decision = qualityDecision({
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
        const stake = decision.action === "BET"
          ? preliminaryStake
          : {
              ...preliminaryStake,
              fractionalKelly: 0,
              cappedFraction: 0,
              rawStake: 0
            };
        const clv = clvSnapshot(market, pick?.side, odds);

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
          market,
          result: result
            ? {
                status: result.status || null,
                homeScore: result.homeScore ?? null,
                awayScore: result.awayScore ?? null,
                score: resultScore,
                winnerCode,
                source: result.source || null,
                updatedAt: result.updatedAt || result.fetchedAt || null
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
      row.impliedProbability = row.impliedProbability === null ? null : Number((row.impliedProbability * 100).toFixed(2));
    });

    const finalBetRows = rows.filter((row) => row.recommendedStake > 0);
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
        formula: "dailyAdjustedProbability blends PAUL's locked/current probability with that match's daily PAUL read. edgeTrust comes from the 55% prior, verified real results, exact-score hits, and daily trend stability. kellyProbability = impliedProbability + (dailyAdjustedProbability - impliedProbability) * edgeTrust; only rows that pass strict edge, trust, draw-risk, and market-data gates can receive a stake. fullKelly = (decimalOdds * kellyProbability - 1) / (decimalOdds - 1); stake = bankroll * min(maxStakePct, kellyFraction * max(0, fullKelly)), then portfolio-cap scaled."
      },
      reliability: {
        ...reliability,
        posteriorHitRate: Number((reliability.posteriorHitRate * 100).toFixed(2)),
        edgeTrust: Number((reliability.edgeTrust * 100).toFixed(2)),
        exactScoreBonus: Number((reliability.exactScoreBonus * 100).toFixed(2)),
        modelAccuracy: Number((reliability.modelAccuracy * 100).toFixed(2))
      },
      summary: {
        matches: rows.length,
        bettable: finalBetRows.length,
        watch: rows.filter((row) => row.decision?.action === "WATCH").length,
        noBet: rows.filter((row) => row.decision?.action === "NO_BET").length,
        settled: rows.filter((row) => row.decision?.action === "SETTLED").length,
        positiveClv: rows.filter((row) => row.clv?.status === "positive").length,
        negativeClv: rows.filter((row) => row.clv?.status === "negative").length,
        totalRecommendedStake: Number(finalBetRows.reduce((sum, row) => sum + row.recommendedStake, 0).toFixed(2)),
        portfolioCap: Number(portfolioCap.toFixed(2)),
        portfolioScale: Number(scale.toFixed(3)),
        maxSingleStake: Number(finalBetRows.reduce((max, row) => Math.max(max, row.recommendedStake), 0).toFixed(2)),
        averageEdgePct: Number(averageEdge.toFixed(2))
      },
      rows
    });
  } catch (error) {
    return json(res, error.status || 500, { error: error.message || "Quant tool failed." });
  }
};
