const fs = require("fs");
const path = require("path");

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

function oddsToProbabilities(odds) {
  if (!odds) return null;
  const homeOdds = Number(odds.home || odds.a || odds.teamA);
  const drawOdds = Number(odds.draw);
  const awayOdds = Number(odds.away || odds.b || odds.teamB);
  if (!homeOdds || !drawOdds || !awayOdds) return null;
  return normalize3Way({ home: 1 / homeOdds, draw: 1 / drawOdds, away: 1 / awayOdds });
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

function collectPredictionEvidence(match) {
  const oddsFile = path.join(dataDir, "market-odds.json");
  const ratingsFile = path.join(dataDir, "team-ratings.json");
  const formFile = path.join(dataDir, "recent-form.json");
  const allOdds = readJson(oddsFile, {});
  const allRatings = readJson(ratingsFile, {});
  const allForm = readJson(formFile, {});
  const oddsRecord = findByMatchId(allOdds, match.id);
  const marketProb = oddsToProbabilities(oddsRecord?.odds || oddsRecord);
  const ratingA = findTeamRecord(allRatings, match.teamA.code);
  const ratingB = findTeamRecord(allRatings, match.teamB.code);
  const formA = findTeamRecord(allForm, match.teamA.code);
  const formB = findTeamRecord(allForm, match.teamB.code);
  const hasPrimaryEvidence = Boolean(marketProb || (ratingA?.elo && ratingB?.elo));
  const missing = [];
  if (!marketProb) missing.push("market odds");
  if (!(ratingA?.elo && ratingB?.elo)) missing.push("real Elo or team ratings");
  if (!(formA && formB)) missing.push("recent form");
  return {
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    hasPrimaryEvidence,
    missing,
    market: marketProb ? { odds: oddsRecord?.odds || oddsRecord, probabilities: marketProb } : null,
    ratings: ratingA && ratingB ? { teamA: ratingA, teamB: ratingB } : null,
    form: formA && formB ? { teamA: formA, teamB: formB } : null
  };
}

function buildPrompt(payload, evidence) {
  const needsSearch = !evidence.hasPrimaryEvidence;
  return [
    "You are PAUL AI, an AI octopus for pre-match FIFA World Cup predictions.",
    needsSearch
      ? "Local odds/Elo evidence is missing. Use web search to find recent public information before making the prediction."
      : "Base the prediction on the real evidence object first, and use web search only to supplement the latest context.",
    "Look for plausible upset signals: undervalued teams, injury mismatch, fixture congestion, tactical matchup, psychology, group-table pressure, venue, travel, rest, and weather.",
    "Do not provide betting advice. Do not invent exact links, injuries, lineups, odds, or recent results that are not supported by evidence.",
    "Return strict JSON with these keys: winnerCode, winnerName, confidence, predictedScore, probabilities, reasoning, upsetRisk, evidenceUsed.",
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
  const evidence = collectPredictionEvidence(payload);
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
