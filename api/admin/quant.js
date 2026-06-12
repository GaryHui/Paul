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
  if (!isBettable || !odds || !probability) {
    return { fullKelly: 0, fractionalKelly: 0, cappedFraction: 0, rawStake: 0, edgePct: null, impliedProbability: odds ? 1 / odds : null };
  }
  const impliedProbability = 1 / odds;
  const edgePct = (probability - impliedProbability) * 100;
  const fullKelly = (odds * probability - 1) / (odds - 1);
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
    const includeMarketFallback = url.searchParams.get("fallback") !== "0";

    const snapshot = loadSnapshot();
    const [predictions, results, dailyAnalysis, evidenceCache] = await Promise.all([
      getPredictions(),
      getResults(),
      getDailyAnalysis(),
      getEvidenceCache()
    ]);
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
        const isPast = matchTime ? matchTime <= now : false;
        const odds = oddsForSide(market?.odds, pick?.side);
        const probabilities = pick?.probabilities || market?.probabilities || null;
        const probability = probabilities && pick?.side ? Number(probabilities[pick.side] || 0) : null;
        const isBettable = Boolean(!isFinal && !isPast && pick && pick.source !== "Market fallback" && odds && probability);
        let skipReason = "";
        if (!pick) skipReason = "No PAUL read";
        else if (isFinal) skipReason = "Final";
        else if (isPast) skipReason = "Kickoff passed";
        else if (pick.source === "Market fallback") skipReason = "Reference only";
        else if (!odds) skipReason = "Missing odds";
        else if (!probability) skipReason = "Missing PAUL probability";

        const stake = kellyStake({
          odds,
          probability,
          bankroll,
          kellyFraction,
          maxStakePct,
          minEdgePct,
          isBettable
        });
        if (isBettable && stake.edgePct !== null && stake.edgePct < minEdgePct) skipReason = "Edge below threshold";

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
                winnerCode
              }
            : null,
          selectedOdds: odds,
          selectedProbability: probability,
          impliedProbability: stake.impliedProbability,
          edgePct: stake.edgePct,
          fullKelly: stake.fullKelly,
          fractionalKelly: stake.fractionalKelly,
          cappedFraction: stake.cappedFraction,
          rawStake: stake.rawStake,
          finalFraction: stake.cappedFraction,
          recommendedStake: stake.rawStake,
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
        formula: "fullKelly = (decimalOdds * modelProbability - 1) / (decimalOdds - 1); stake = bankroll * min(maxStakePct, kellyFraction * max(0, fullKelly)), then portfolio-cap scaled."
      },
      summary: {
        matches: rows.length,
        bettable: finalBetRows.length,
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
