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
  if (!marketProb) missing.push("市场赔率");
  if (!(ratingA?.elo && ratingB?.elo)) missing.push("真实 Elo/球队评分");
  if (!(formA && formB)) missing.push("近期战绩");
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
    "你是 PAUL AI，一只用于世界杯赛前预测的 AI 章鱼。",
    needsSearch
      ? "本地缺少赔率/Elo 等数据。你必须启用联网搜索，查找两队近期公开资料后再分析。"
      : "必须基于 evidence 中的真实数据源输出预测，并可联网补充最新信息。",
    "重点寻找黑马信号：被低估、伤停错配、赛程压力、战术克制、心理因素、小组形势、赛地气候。",
    "不要输出投注建议。不要编造不存在的具体链接。",
    "返回严格 JSON：winnerCode, winnerName, confidence, predictedScore, probabilities, reasoning, upsetRisk, evidenceUsed。",
    "probabilities 包含 home/draw/away，数值为 0-100。中文输出 reasoning、upsetRisk、evidenceUsed。",
    "",
    `比赛：${payload.id} / ${payload.round} / ${payload.date} / ${payload.venue}`,
    `球队A：${payload.teamA.code} ${payload.teamA.name}`,
    `球队B：${payload.teamB.code} ${payload.teamB.name}`,
    `证据包：${JSON.stringify(evidence)}`
  ].join("\n");
}

async function callPaul(payload) {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
  if (!apiKey) {
    const error = new Error("PAUL AI 未配置：缺少 DASHSCOPE_API_KEY。");
    error.status = 400;
    throw error;
  }
  const evidence = collectPredictionEvidence(payload);
  const useSearchFallback = !evidence.hasPrimaryEvidence || process.env.QWEN_FORCE_SEARCH === "1";
  evidence.searchFallback = useSearchFallback;
  const requestBody = {
    model: qwenModel,
    messages: [
      { role: "system", content: "你只返回紧凑 JSON，不要 markdown。" },
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
