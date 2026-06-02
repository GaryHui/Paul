function providerName() {
  return process.env.RESULTS_PROVIDER || (process.env.FOOTBALL_DATA_API_KEY ? "football-data" : process.env.RESULTS_API_URL ? "generic" : "none");
}

function hasResultsProvider() {
  return providerName() !== "none";
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
  if (team.code === "CZE") aliases.add("Czech Republic");
  if (team.code === "USA") aliases.add("United States");
  if (team.code === "CIV") aliases.add("Ivory Coast");
  if (team.code === "CUW") aliases.add("Curaçao");
  if (team.code === "IRN") aliases.add("Iran");
  if (team.code === "KSA") aliases.add("Saudi Arabia");
  if (team.code === "COD") aliases.add("Congo DR");
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

function parseFootballDataScore(apiMatch, match) {
  if (apiMatch.status !== "FINISHED") return null;
  const { direct, reversed, matched } = teamsMatch(apiMatch.homeTeam?.name, apiMatch.awayTeam?.name, match);
  if (!matched) return null;
  const home = Number(apiMatch.score?.fullTime?.home);
  const away = Number(apiMatch.score?.fullTime?.away);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
  const homeScore = direct ? home : away;
  const awayScore = direct ? away : home;
  const winnerCode = homeScore === awayScore ? null : homeScore > awayScore ? match.teamA.code : match.teamB.code;
  const loserCode = homeScore === awayScore ? null : homeScore > awayScore ? match.teamB.code : match.teamA.code;
  return {
    matchId: match.id,
    aCode: match.teamA.code,
    bCode: match.teamB.code,
    homeScore,
    awayScore,
    winnerCode,
    loserCode,
    status: "final",
    source: "football-data.org",
    providerMatchId: apiMatch.id,
    syncedAt: new Date().toISOString()
  };
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

async function fetchMatchResult(match) {
  if (!match.teamA?.code || !match.teamB?.code) return null;
  const provider = providerName();
  if (provider === "football-data") return fetchFootballDataResult(match);
  if (provider === "generic") return fetchGenericResult(match);
  return null;
}

module.exports = {
  fetchMatchResult,
  hasResultsProvider,
  providerName
};
