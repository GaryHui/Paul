const fs = require("fs");
const path = require("path");

const defaultProviders = ["zafronix", "worldcup26", "football-data", "generic"];
const dataDir = path.join(__dirname, "..", "..", "data");

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function configuredProviders() {
  const raw = process.env.RESULTS_PROVIDERS || process.env.RESULTS_PROVIDER;
  const providers = raw
    ? raw.split(",").map((item) => item.trim()).filter(Boolean)
    : defaultProviders;

  return providers.filter((provider) => {
    if (provider === "worldcup26") return true;
    if (provider === "zafronix") return Boolean(process.env.ZAFRONIX_API_KEY);
    if (provider === "football-data") return Boolean(process.env.FOOTBALL_DATA_API_KEY);
    if (provider === "generic") return Boolean(process.env.RESULTS_API_URL);
    return false;
  });
}

function providerName() {
  return configuredProviders().join(",") || "none";
}

function hasResultsProvider() {
  return configuredProviders().length > 0;
}

function normalizeName(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function teamAliases(team) {
  const aliases = new Set([team.name, team.code]);
  if (team.code === "RSA") aliases.add("South Africa");
  if (team.code === "KOR") aliases.add("Korea Republic");
  if (team.code === "KOR") aliases.add("South Korea");
  if (team.code === "CZE") aliases.add("Czech Republic");
  if (team.code === "USA") aliases.add("United States");
  if (team.code === "CIV") aliases.add("Ivory Coast");
  if (team.code === "CUW") aliases.add("Curacao");
  if (team.code === "CUW") aliases.add("Curaçao");
  if (team.code === "IRN") aliases.add("Iran");
  if (team.code === "KSA") aliases.add("Saudi Arabia");
  if (team.code === "COD") aliases.add("Congo DR");
  if (team.code === "COD") aliases.add("DR Congo");
  if (team.code === "COD") aliases.add("Democratic Republic of the Congo");
  if (team.code === "TUR") aliases.add("Turkey");
  if (team.code === "ENG") aliases.add("England");
  return [...aliases].map(normalizeName);
}

function teamsMatch(apiHome, apiAway, match) {
  const home = normalizeName(apiHome);
  const away = normalizeName(apiAway);
  const aAliases = teamAliases(match.teamA);
  const bAliases = teamAliases(match.teamB);
  const direct = aAliases.includes(home) && bAliases.includes(away);
  const reversed = aAliases.includes(away) && bAliases.includes(home);
  return { direct, reversed, matched: direct || reversed };
}

function normalizeFinished(value) {
  const normalized = String(value).toLowerCase();
  return value === true || normalized === "true" || normalized === "finished" || normalized === "completed" || normalized === "ft" || normalized === "ft_pen";
}

function scoreResult(match, homeScore, awayScore, direct, source, providerMatchId, winnerCodeOverride = null) {
  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore)) return null;
  const aScore = direct ? homeScore : awayScore;
  const bScore = direct ? awayScore : homeScore;
  const override = String(winnerCodeOverride || "").toUpperCase();
  const validOverride = override === match.teamA.code || override === match.teamB.code;
  const winnerCode = aScore === bScore
    ? validOverride ? override : null
    : aScore > bScore ? match.teamA.code : match.teamB.code;
  const loserCode = winnerCode
    ? winnerCode === match.teamA.code ? match.teamB.code : match.teamA.code
    : null;
  return {
    matchId: match.id,
    aCode: match.teamA.code,
    bCode: match.teamB.code,
    homeScore: aScore,
    awayScore: bScore,
    winnerCode,
    loserCode,
    status: "final",
    source,
    providerMatchId,
    syncedAt: new Date().toISOString()
  };
}

function parseFootballDataScore(apiMatch, match) {
  if (apiMatch.status !== "FINISHED") return null;
  const { direct, matched } = teamsMatch(apiMatch.homeTeam?.name, apiMatch.awayTeam?.name, match);
  if (!matched) return null;
  return scoreResult(
    match,
    Number(apiMatch.score?.fullTime?.home),
    Number(apiMatch.score?.fullTime?.away),
    direct,
    "football-data.org",
    apiMatch.id
  );
}

async function fetchFootballDataResult(match) {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) return null;
  const competition = process.env.FOOTBALL_DATA_COMPETITION || "WC";
  const season = process.env.FOOTBALL_DATA_SEASON || "2026";
  const url = new URL(`https://api.football-data.org/v4/competitions/${competition}/matches`);
  url.searchParams.set("season", season);
  const response = await fetch(url, {
    headers: { "X-Auth-Token": token }
  });
  if (!response.ok) throw new Error(`football-data.org failed: ${response.status}`);
  const data = await response.json();
  const matches = data.matches || [];
  for (const apiMatch of matches) {
    const result = parseFootballDataScore(apiMatch, match);
    if (result) return result;
  }
  return null;
}

function inferWorldcup26KnockoutWinner(apiMatch, games, match) {
  if (match.round === "Group Stage") return null;
  const providerId = Number(apiMatch.id || apiMatch._id || 0);
  if (!providerId) return null;
  const futureGames = games
    .filter((game) => Number(game.id || game._id || 0) > providerId)
    .sort((a, b) => Number(a.id || a._id || 0) - Number(b.id || b._id || 0));
  const aAliases = teamAliases(match.teamA);
  const bAliases = teamAliases(match.teamB);
  for (const game of futureGames) {
    const futureTeams = [
      normalizeName(game.home_team_name_en),
      normalizeName(game.away_team_name_en)
    ].filter(Boolean);
    const aContinues = futureTeams.some((name) => aAliases.includes(name));
    const bContinues = futureTeams.some((name) => bAliases.includes(name));
    if (aContinues !== bContinues) return aContinues ? match.teamA.code : match.teamB.code;
  }
  return null;
}

function parseWorldcup26Score(apiMatch, match, games = []) {
  if (!normalizeFinished(apiMatch.finished)) return null;
  const { direct, matched } = teamsMatch(apiMatch.home_team_name_en, apiMatch.away_team_name_en, match);
  if (!matched) return null;
  const homeScore = Number(apiMatch.home_score);
  const awayScore = Number(apiMatch.away_score);
  const winnerCode = homeScore === awayScore
    ? inferWorldcup26KnockoutWinner(apiMatch, games, match)
    : null;
  return scoreResult(
    match,
    homeScore,
    awayScore,
    direct,
    "worldcup26.ir",
    apiMatch.id || apiMatch._id,
    winnerCode
  );
}

async function fetchWorldcup26Result(match) {
  const response = await fetch("https://worldcup26.ir/get/games");
  if (!response.ok) throw new Error(`worldcup26.ir failed: ${response.status}`);
  const data = await response.json();
  const games = data.games || data.data || [];
  for (const apiMatch of games) {
    const result = parseWorldcup26Score(apiMatch, match, games);
    if (result) return result;
  }
  return null;
}

function extractArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.matches)) return value.matches;
  if (Array.isArray(value.games)) return value.games;
  if (Array.isArray(value.fixtures)) return value.fixtures;
  if (Array.isArray(value.group_stage)) return value.group_stage;
  if (Array.isArray(value.knockouts)) return value.knockouts;
  if (typeof value !== "object") return [];
  return Object.values(value).flatMap((item) => extractArray(item));
}

function parseZafronixScore(apiMatch, match) {
  const status = apiMatch.status || apiMatch.state || apiMatch.phase || apiMatch.finished;
  if (!normalizeFinished(status)) return null;
  const apiHome = apiMatch.home_team?.name || apiMatch.homeTeam?.name || apiMatch.home || apiMatch.team1 || apiMatch.home_team;
  const apiAway = apiMatch.away_team?.name || apiMatch.awayTeam?.name || apiMatch.away || apiMatch.team2 || apiMatch.away_team;
  const { direct, matched } = teamsMatch(apiHome, apiAway, match);
  if (!matched) return null;
  const homeScore = Number(apiMatch.home_score ?? apiMatch.homeScore ?? apiMatch.score?.home ?? apiMatch.score?.home_team);
  const awayScore = Number(apiMatch.away_score ?? apiMatch.awayScore ?? apiMatch.score?.away ?? apiMatch.score?.away_team);
  return scoreResult(match, homeScore, awayScore, direct, "zafronix.com", apiMatch.id || apiMatch.match_id || apiMatch.matchNumber);
}

async function fetchZafronixResult(match) {
  const token = process.env.ZAFRONIX_API_KEY;
  if (!token) return null;
  const baseUrl = process.env.ZAFRONIX_BASE_URL || "https://api.zafronix.com/fifa/worldcup/v1";
  const response = await fetch(`${baseUrl}/tournaments/2026`, {
    headers: { "X-API-Key": token }
  });
  if (!response.ok) throw new Error(`zafronix failed: ${response.status}`);
  const data = await response.json();
  for (const apiMatch of extractArray(data)) {
    const result = parseZafronixScore(apiMatch, match);
    if (result) return result;
  }
  return null;
}

async function fetchGenericResult(match) {
  const baseUrl = process.env.RESULTS_API_URL;
  if (!baseUrl) return null;
  const url = new URL(baseUrl);
  url.searchParams.set("matchId", match.id);
  url.searchParams.set("teamA", match.teamA.code);
  url.searchParams.set("teamB", match.teamB.code);
  const headers = {};
  if (process.env.RESULTS_API_KEY) headers.Authorization = `Bearer ${process.env.RESULTS_API_KEY}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Result API failed for match ${match.id}: ${response.status}`);
  const data = await response.json();
  if (data.status !== "final") return null;
  const homeScore = Number(data.homeScore);
  const awayScore = Number(data.awayScore);
  const winnerCode = data.winnerCode || (homeScore === awayScore ? null : homeScore > awayScore ? match.teamA.code : match.teamB.code);
  const loserCode = data.loserCode || (homeScore === awayScore ? null : homeScore > awayScore ? match.teamB.code : match.teamA.code);
  return {
    matchId: match.id,
    aCode: match.teamA.code,
    bCode: match.teamB.code,
    homeScore,
    awayScore,
    winnerCode,
    loserCode,
    status: "final",
    source: baseUrl,
    syncedAt: new Date().toISOString()
  };
}

function fetchLocalVerifiedResult(match) {
  const allResults = readJson(path.join(dataDir, "match-results.json"), {});
  const record = allResults?.[match.id] || allResults?.[String(match.id)] || null;
  if (!record || record.status !== "final") return null;
  const homeScore = Number(record.homeScore);
  const awayScore = Number(record.awayScore);
  return scoreResult(
    match,
    homeScore,
    awayScore,
    true,
    record.source || "data/match-results.json",
    record.providerMatchId || `local-${match.id}`
  );
}

async function fetchMatchResult(match) {
  if (!match.teamA?.code || !match.teamB?.code) return null;
  const errors = [];
  for (const provider of configuredProviders()) {
    try {
      if (provider === "worldcup26") {
        const result = await fetchWorldcup26Result(match);
        if (result) return result;
      }
      if (provider === "zafronix") {
        const result = await fetchZafronixResult(match);
        if (result) return result;
      }
      if (provider === "football-data") {
        const result = await fetchFootballDataResult(match);
        if (result) return result;
      }
      if (provider === "generic") {
        const result = await fetchGenericResult(match);
        if (result) return result;
      }
    } catch (error) {
      errors.push(`${provider}: ${error.message}`);
    }
  }
  const localResult = fetchLocalVerifiedResult(match);
  if (localResult) return localResult;
  if (errors.length && process.env.RESULTS_STRICT === "true") {
    throw new Error(errors.join("; "));
  }
  return null;
}

module.exports = {
  configuredProviders,
  fetchMatchResult,
  hasResultsProvider,
  providerName
};
