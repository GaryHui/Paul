const http = require("http");
const fs = require("fs");
const path = require("path");
const { resolveMatches, stageAccuracySnapshot } = require("./api/_lib/bracket");
const { fetchMatchResult: fetchSharedMatchResult, hasResultsProvider, providerName } = require("./api/_lib/results");
const { fetchRemoteMarketOdds } = require("./lib/odds");

const root = __dirname;
const dataDir = path.join(root, "data");

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile();

const port = Number(process.env.PORT || 4173);
const qwenEndpoint = process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const qwenModel = process.env.QWEN_MODEL || "qwen-plus";
const predictionLeadHours = Number(process.env.PREDICTION_LEAD_HOURS || 24);
const resultSyncDelayHours = Number(process.env.RESULT_SYNC_DELAY_HOURS || 3);
const automationIntervalMinutes = Number(process.env.AUTOMATION_INTERVAL_MINUTES || 60);

const snapshotFile = path.join(dataDir, "match-snapshot.json");
const predictionsFile = path.join(dataDir, "qwen-predictions.json");
const resultsFile = path.join(dataDir, "match-results.json");
const oddsFile = path.join(dataDir, "market-odds.json");
const ratingsFile = path.join(dataDir, "team-ratings.json");
const formFile = path.join(dataDir, "recent-form.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".gif": "image/gif"
};

fs.mkdirSync(dataDir, { recursive: true });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 180000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, payload) {
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize3Way(probs) {
  const home = Number(probs.home || probs.a || 0);
  const draw = Number(probs.draw || 0);
  const away = Number(probs.away || probs.b || 0);
  const sum = home + draw + away;
  if (!sum) return null;
  return {
    home: home / sum,
    draw: draw / sum,
    away: away / sum
  };
}

function oddsToProbabilities(odds) {
  if (!odds) return null;
  const homeOdds = Number(odds.home || odds.a || odds.teamA);
  const drawOdds = Number(odds.draw);
  const awayOdds = Number(odds.away || odds.b || odds.teamB);
  if (!homeOdds || !drawOdds || !awayOdds) return null;
  return normalize3Way({
    home: 1 / homeOdds,
    draw: 1 / drawOdds,
    away: 1 / awayOdds
  });
}

function parseMatchTime(match) {
  const date = new Date(`${match.date} 20:00:00 GMT+0000`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resultWinner(result) {
  if (Number(result.homeScore) === Number(result.awayScore)) return "DRAW";
  return Number(result.homeScore) > Number(result.awayScore) ? result.aCode : result.bCode;
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

function eloProbabilities(aRating, bRating, allowDraw) {
  const diff = Number(aRating) - Number(bRating);
  const homeRaw = 1 / (1 + 10 ** (-diff / 400));
  const draw = allowDraw ? clamp(0.28 - Math.abs(diff) / 2400, 0.12, 0.3) : 0;
  return {
    home: homeRaw * (1 - draw),
    draw,
    away: (1 - homeRaw) * (1 - draw)
  };
}

function poisson(k, lambda) {
  let factorial = 1;
  for (let i = 2; i <= k; i += 1) factorial *= i;
  return (Math.E ** -lambda * lambda ** k) / factorial;
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
    { code: match.teamA.code, name: match.teamA.name, value: probabilities.home },
    { code: "DRAW", name: "平局", value: probabilities.draw },
    { code: match.teamB.code, name: match.teamB.name, value: probabilities.away }
  ].sort((a, b) => b.value - a.value);
  return candidates[0];
}

async function collectPredictionEvidence(match, options = {}) {
  const allOdds = readJson(oddsFile, {});
  const allRatings = readJson(ratingsFile, {});
  const allForm = readJson(formFile, {});
  const allowDraw = match.round === "Group Stage";

  const remoteOdds = options.liveOdds === false ? { record: null, errors: [] } : await fetchRemoteMarketOdds(match);
  const oddsRecord = remoteOdds.record || findByMatchId(allOdds, match.id);
  const marketProb = oddsToProbabilities(oddsRecord?.odds || oddsRecord);
  const ratingA = findTeamRecord(allRatings, match.teamA.code);
  const ratingB = findTeamRecord(allRatings, match.teamB.code);
  const formA = findTeamRecord(allForm, match.teamA.code);
  const formB = findTeamRecord(allForm, match.teamB.code);

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

  const missing = [];
  if (!marketProb) missing.push("市场赔率：data/market-odds.json 或 ODDS_API_*");
  if (!eloProb) missing.push("真实 Elo/球队评分：data/team-ratings.json");
  if (!poisson) missing.push("进攻/防守评分：team-ratings.json 的 attack/defense");
  if (!formA || !formB) missing.push("近期战绩：data/recent-form.json");

  const hasPrimaryEvidence = Boolean(marketProb || eloProb || poisson);
  return {
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    hasPrimaryEvidence,
    missing,
    sources: {
      marketOdds: marketProb ? (remoteOdds.record ? oddsRecord.source : "data/market-odds.json") : null,
      ratings: eloProb || poisson ? "data/team-ratings.json" : null,
      recentForm: formA && formB ? "data/recent-form.json" : null
    },
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
    blended: modelBlend,
    favorite: favoriteFromProbabilities(match, modelBlend || marketProb || eloProb || poisson?.probabilities)
  };
}

function buildQwenPrompt(payload, evidence) {
  const needsSearch = !evidence.hasPrimaryEvidence;
  return [
    "You are PAUL AI, an AI octopus for pre-match FIFA World Cup predictions.",
    needsSearch
      ? "Local odds/Elo evidence is missing. Use web search to find recent public information before making the prediction."
      : "Base the prediction on the real evidence object first. Do not invent injuries, lineups, recent results, or odds.",
    needsSearch
      ? "Prioritize recent form, FIFA/Elo ranking, injury and lineup news, odds or market forecasts, venue, travel, and rest days."
      : "Market odds and statistical models are the main anchor. Make only calibrated adjustments and mention evidence gaps in reasoning.",
    "Look for plausible upset signals: undervalued teams, injury mismatch, fixture congestion, tactical matchup, psychology, group-table pressure, venue, travel, rest, and weather.",
    "Return strict JSON with these keys: winnerCode, winnerName, confidence, predictedScore, probabilities, reasoning, upsetRisk, evidenceUsed.",
    "probabilities must include home/draw/away as numbers from 0 to 100. Write reasoning, upsetRisk, and evidenceUsed in English.",
    "evidenceUsed must list the data or public information sources actually used. Do not invent exact links.",
    "",
    `Match: ${payload.id} / ${payload.round} / ${payload.date} / ${payload.venue}`,
    `Team A: ${payload.teamA.code} ${payload.teamA.name}`,
    `Team B: ${payload.teamB.code} ${payload.teamB.name}`,
    `Evidence package: ${JSON.stringify(evidence)}`
  ].join("\n");
}

async function callQwenAnalysis(payload, evidence = null) {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
  if (!apiKey) {
    const error = new Error("PAUL AI is not connected: missing DASHSCOPE_API_KEY.");
    error.status = 400;
    throw error;
  }
  evidence = evidence || await collectPredictionEvidence(payload);
  const useSearchFallback = !evidence.hasPrimaryEvidence || process.env.QWEN_FORCE_SEARCH === "1";
  evidence.searchFallback = useSearchFallback;

  const requestBody = {
    model: qwenModel,
    messages: [
      {
        role: "system",
        content: "Return compact JSON only. Do not use markdown."
      },
      {
        role: "user",
        content: buildQwenPrompt(payload, evidence)
      }
    ],
    temperature: 0.35,
    response_format: { type: "json_object" }
  };

  if (useSearchFallback) {
    requestBody.enable_search = true;
    requestBody.search_options = {
      forced_search: true,
      search_strategy: "max"
    };
  }

  const response = await fetch(`${qwenEndpoint.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
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

  return {
    model: data.model || qwenModel,
    evidence,
    analysis
  };
}

async function handleQwen(req, res) {
  try {
    const payload = JSON.parse(await readBody(req));
    const predictions = readJson(predictionsFile, {});
    if (predictions[payload.id]) {
      sendJson(res, 200, { ...predictions[payload.id], locked: true, persisted: true });
      return;
    }
    const evidence = await collectPredictionEvidence(payload);
    const result = await callQwenAnalysis(payload, evidence);
    const record = {
      matchId: payload.id,
      generatedAt: new Date().toISOString(),
      model: result.model || "PAUL",
      evidence: result.evidence,
      analysis: result.analysis
    };
    predictions[payload.id] = record;
    writeJson(predictionsFile, predictions);
    sendJson(res, 200, { ...record, persisted: true });
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message, detail: error.detail, evidence: error.evidence });
  }
}

function accuracySnapshot(predictions, results) {
  const completed = Object.entries(results).filter(([, result]) => result.status === "final");
  const graded = completed.filter(([matchId, result]) => predictions[result.matchId || matchId]);
  const correct = graded.filter(([matchId, result]) => {
    const prediction = predictions[result.matchId || matchId].analysis || {};
    const pick = prediction.winnerCode || prediction.winner || prediction.winnerName;
    return String(pick).toUpperCase() === String(resultWinner(result)).toUpperCase();
  });
  return {
    completed: completed.length,
    graded: graded.length,
    correct: correct.length,
    accuracy: graded.length ? Math.round((correct.length / graded.length) * 100) : 0
  };
}

function nextPredictionDue(matches, predictions, results = {}, now = new Date()) {
  return resolveMatches(matches, results)
    .map((match) => {
      const matchTime = parseMatchTime(match);
      if (!matchTime || predictions[match.id] || !match.teamA?.code || !match.teamB?.code) return null;
      return {
        id: match.id,
        label: `${match.teamA.name} vs ${match.teamB.name}`,
        dueAt: new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000).toISOString()
      };
    })
    .filter(Boolean)
    .filter((item) => new Date(item.dueAt) >= now)
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))[0] || null;
}

async function fetchMatchResult(match) {
  return fetchSharedMatchResult(match);
}

async function runDueAutomation({ force = false } = {}) {
  const matches = readJson(snapshotFile, { matches: [] }).matches || [];
  const predictions = readJson(predictionsFile, {});
  const results = readJson(resultsFile, {});
  const now = new Date();
  const events = [];

  for (const match of resolveMatches(matches, results)) {
    const matchTime = parseMatchTime(match);
    if (!matchTime || !match.teamA?.code || !match.teamB?.code) {
      if (match.round !== "Group Stage") {
        events.push({ type: "bracket", matchId: match.id, status: "waiting", reason: "slot not resolved" });
      }
      continue;
    }
    const predictAt = new Date(matchTime.getTime() - predictionLeadHours * 60 * 60 * 1000);
    const shouldPredict = force || (now >= predictAt && now < matchTime);

    if (shouldPredict && !predictions[match.id]) {
      try {
        const evidence = await collectPredictionEvidence(match);
        predictions[match.id] = {
          matchId: match.id,
          generatedAt: now.toISOString(),
          ...await callQwenAnalysis(match, evidence)
        };
        events.push({ type: "prediction", matchId: match.id, status: "ok" });
      } catch (error) {
        events.push({ type: "prediction", matchId: match.id, status: "error", error: error.message });
      }
    }

    const resultAt = new Date(matchTime.getTime() + resultSyncDelayHours * 60 * 60 * 1000);
    const shouldSyncResult = force || now >= resultAt;
    if (shouldSyncResult && !results[match.id]) {
      try {
        const result = await fetchMatchResult(match);
        if (result) {
          results[match.id] = result;
          events.push({ type: "result", matchId: match.id, status: "ok" });
        }
      } catch (error) {
        events.push({ type: "result", matchId: match.id, status: "error", error: error.message });
      }
    }
  }

  writeJson(predictionsFile, predictions);
  writeJson(resultsFile, results);
  return {
    events,
      summary: await buildAutomationStatus(matches, predictions, results)
  };
}

async function dataReadiness(matches) {
  const first = matches[0] ? await collectPredictionEvidence(matches[0], { liveOdds: false }) : null;
  return {
    marketOdds: fs.existsSync(oddsFile),
    teamRatings: fs.existsSync(ratingsFile),
    recentForm: fs.existsSync(formFile),
    liveOddsProvider: process.env.ODDS_API_IO_KEY
      ? "odds-api.io"
      : process.env.THE_ODDS_API_KEY
        ? "theoddsapi.com"
        : null,
    firstMatchEvidence: first
  };
}

async function buildAutomationStatus(matches, predictions, results) {
  const resolvedMatches = resolveMatches(matches, results);
  return {
    totalMatches: matches.length,
    predictionCount: Object.keys(predictions).length,
    resultCount: Object.keys(results).length,
    nextPrediction: nextPredictionDue(matches, predictions, results),
    accuracy: accuracySnapshot(predictions, results),
    stageAccuracy: stageAccuracySnapshot(predictions, results, resolvedMatches),
    predictions,
    results,
    resolvedMatches: resolvedMatches.map((match) => ({
      id: match.id,
      teamA: match.teamA || null,
      teamB: match.teamB || null
    })),
    dataReadiness: await dataReadiness(matches),
    predictionLeadHours,
    resultSyncDelayHours,
    hasQwenKey: Boolean(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY),
    hasResultsApi: hasResultsProvider(),
    resultsProvider: providerName()
  };
}

async function handleAutomation(req, res) {
  try {
    if (req.method === "POST" && req.url?.startsWith("/api/automation/snapshot")) {
      const payload = JSON.parse(await readBody(req));
      writeJson(snapshotFile, { updatedAt: new Date().toISOString(), matches: payload.matches || [] });
      sendJson(res, 200, { ok: true, matches: payload.matches?.length || 0 });
      return;
    }
    if (req.method === "POST" && req.url?.startsWith("/api/automation/run-due")) {
      const payload = JSON.parse((await readBody(req)) || "{}");
      sendJson(res, 200, await runDueAutomation({ force: Boolean(payload.force) }));
      return;
    }
    if (req.method === "GET" && req.url?.startsWith("/api/automation/status")) {
      const matches = readJson(snapshotFile, { matches: [] }).matches || [];
      const predictions = readJson(predictionsFile, {});
      const results = readJson(resultsFile, {});
      sendJson(res, 200, await buildAutomationStatus(matches, predictions, results));
      return;
    }
    sendJson(res, 404, { error: "Automation route not found." });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleEvidence(req, res) {
  const url = new URL(req.url, `http://localhost:${port}`);
  const matchId = url.searchParams.get("matchId");
  const matches = readJson(snapshotFile, { matches: [] }).matches || [];
  const match = matches.find((item) => String(item.id) === String(matchId));
  if (!match) {
    sendJson(res, 404, { error: "Match not found in snapshot." });
    return;
  }
  sendJson(res, 200, await collectPredictionEvidence(match));
}

setInterval(() => {
  runDueAutomation().catch((error) => console.error("Automation failed:", error.message));
}, automationIntervalMinutes * 60 * 1000);

runDueAutomation().catch(() => {});

function serveStatic(req, res) {
  const requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(root, safePath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url?.startsWith("/api/qwen-predict")) {
      handleQwen(req, res);
      return;
    }
    if (req.url?.startsWith("/api/automation/")) {
      handleAutomation(req, res);
      return;
    }
    if (req.method === "GET" && req.url?.startsWith("/api/prediction/evidence")) {
      handleEvidence(req, res);
      return;
    }
    serveStatic(req, res);
  })
  .listen(port, () => {
    console.log(`Paul 2026 site: http://localhost:${port}`);
    console.log(`PAUL AI model: ${qwenModel}`);
  });
