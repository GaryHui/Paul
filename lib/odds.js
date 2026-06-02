const defaultTimeoutMs = 8000;

const aliases = {
  BIH: ["bosnia", "bosnia and herzegovina"],
  COD: ["dr congo", "congo dr", "democratic republic of congo"],
  CIV: ["cote divoire", "ivory coast", "cote d ivoire"],
  CZE: ["czechia", "czech republic"],
  ENG: ["england"],
  KOR: ["korea republic", "south korea", "republic of korea"],
  NZL: ["new zealand"],
  RSA: ["south africa"],
  SCO: ["scotland"],
  SUI: ["switzerland", "swiss"],
  USA: ["usa", "united states", "united states of america"]
};

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function teamTerms(team = {}) {
  return [team.code, team.name, ...(aliases[team.code] || [])]
    .map(normalizeName)
    .filter(Boolean);
}

function matchesTeam(team, value) {
  const haystack = normalizeName(value);
  if (!haystack) return false;
  return teamTerms(team).some((term) => haystack === term || haystack.includes(term) || term.includes(haystack));
}

function matchDate(match) {
  const date = new Date(`${match.date} 20:00:00 GMT+0000`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function eventDate(event = {}) {
  const raw =
    event.startTime ||
    event.start_time ||
    event.commence_time ||
    event.kickoff ||
    event.date ||
    event.time;
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function isNearMatchDate(match, event) {
  const a = matchDate(match);
  const b = eventDate(event);
  if (!a || !b) return true;
  return Math.abs(a.getTime() - b.getTime()) <= 72 * 60 * 60 * 1000;
}

function eventTeams(event = {}) {
  const names = [
    event.home,
    event.away,
    event.homeTeam,
    event.awayTeam,
    event.home_team,
    event.away_team,
    event.name,
    event.title,
    event.eventName,
    event.matchName
  ];
  if (Array.isArray(event.teams)) names.push(...event.teams.map((team) => team?.name || team));
  if (Array.isArray(event.participants)) names.push(...event.participants.map((team) => team?.name || team));
  if (Array.isArray(event.competitors)) names.push(...event.competitors.map((team) => team?.name || team));
  return names.filter(Boolean);
}

function eventMatches(match, event) {
  if (!isNearMatchDate(match, event)) return false;
  const names = eventTeams(event);
  const hasA = names.some((name) => matchesTeam(match.teamA, name));
  const hasB = names.some((name) => matchesTeam(match.teamB, name));
  return hasA && hasB;
}

function eventId(event = {}) {
  return event.id || event.eventId || event.event_id || event.key || event.fixtureId || event.fixture_id || null;
}

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.events)) return value.events;
  if (Array.isArray(value.results)) return value.results;
  return [];
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || defaultTimeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`${response.status} ${text.slice(0, 180)}`);
    }
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timeout);
  }
}

function decimalOdds(price) {
  const value = Number(price);
  if (!Number.isFinite(value) || value === 0) return null;
  if (value < 0) return 1 + 100 / Math.abs(value);
  if (value >= 20) return 1 + value / 100;
  return value;
}

function median(values) {
  const sorted = values.filter(Boolean).sort((a, b) => a - b);
  if (!sorted.length) return null;
  return sorted[Math.floor(sorted.length / 2)];
}

function outcomeName(outcome = {}) {
  return outcome.name || outcome.label || outcome.outcome || outcome.selection || outcome.option_name || outcome.team || "";
}

function outcomePrice(outcome = {}) {
  return decimalOdds(outcome.price || outcome.odds || outcome.decimal || outcome.decimalOdds || outcome.value);
}

function marketLooksLikeWinner(market = {}) {
  const key = normalizeName(market.key || market.name || market.market || market.type || "");
  return !key || key.includes("h2h") || key.includes("moneyline") || key.includes("match winner") || key.includes("full time result") || key === "ml";
}

function marketOutcomes(book = {}) {
  if (Array.isArray(book.outcomes)) return book.outcomes;
  const markets = asArray(book.markets || book.odds || book.bets);
  const market = markets.find(marketLooksLikeWinner) || markets[0];
  return Array.isArray(market?.outcomes) ? market.outcomes : [];
}

function extractBooks(payload) {
  const rootEvents = asArray(payload);
  const first = rootEvents[0] || payload || {};
  const source = first.books || first.bookmakers || first.odds || first.markets || first.data || payload?.books || payload?.bookmakers || payload;
  return asArray(source);
}

function classifyOutcome(match, name) {
  const value = normalizeName(name);
  if (!value) return null;
  if (["draw", "tie", "x"].includes(value) || value.includes("draw")) return "draw";
  if (matchesTeam(match.teamA, value)) return "home";
  if (matchesTeam(match.teamB, value)) return "away";
  return null;
}

function normalize3Way(probs) {
  const home = Number(probs.home || 0);
  const draw = Number(probs.draw || 0);
  const away = Number(probs.away || 0);
  const sum = home + draw + away;
  if (!sum) return null;
  return { home: home / sum, draw: draw / sum, away: away / sum };
}

function oddsToProbabilities(odds) {
  const home = Number(odds?.home || odds?.a || odds?.teamA);
  const draw = Number(odds?.draw);
  const away = Number(odds?.away || odds?.b || odds?.teamB);
  if (!home || !draw || !away) return null;
  return normalize3Way({ home: 1 / home, draw: 1 / draw, away: 1 / away });
}

function summarizeOdds(provider, match, event, payload) {
  const prices = { home: [], draw: [], away: [] };
  const sampleBooks = [];

  for (const book of extractBooks(payload)) {
    const outcomes = marketOutcomes(book);
    const bookName = book.book || book.bookmaker || book.name || book.title || book.provider || "bookmaker";
    let contributed = false;
    for (const outcome of outcomes) {
      const side = classifyOutcome(match, outcomeName(outcome));
      const price = outcomePrice(outcome);
      if (side && price) {
        prices[side].push(price);
        contributed = true;
      }
    }
    if (contributed && sampleBooks.length < 8) sampleBooks.push(bookName);
  }

  const odds = {
    home: median(prices.home),
    draw: median(prices.draw),
    away: median(prices.away)
  };
  const probabilities = oddsToProbabilities(odds);
  if (!probabilities) return null;

  return {
    source: provider,
    provider,
    eventId: eventId(event),
    eventName: event.name || event.title || event.eventName || null,
    updatedAt: new Date().toISOString(),
    bookmakerCount: Math.max(prices.home.length, prices.draw.length, prices.away.length),
    sampleBookmakers: sampleBooks,
    odds,
    probabilities
  };
}

async function fetchOddsApiIo(match) {
  const apiKey = process.env.ODDS_API_IO_KEY;
  if (!apiKey) return null;
  const base = process.env.ODDS_API_IO_BASE_URL || "https://api.odds-api.io/v3";
  const sport = process.env.ODDS_API_IO_SPORT || "football";
  const eventsUrl = `${base.replace(/\/$/, "")}/events?apiKey=${encodeURIComponent(apiKey)}&sport=${encodeURIComponent(sport)}&limit=100`;
  const eventsPayload = await fetchJson(eventsUrl);
  const event = asArray(eventsPayload).find((item) => eventMatches(match, item));
  if (!event) return null;
  const id = eventId(event);
  if (!id) return null;
  const bookmakers = process.env.ODDS_BOOKMAKERS ? `&bookmakers=${encodeURIComponent(process.env.ODDS_BOOKMAKERS)}` : "";
  const oddsUrl = `${base.replace(/\/$/, "")}/odds?apiKey=${encodeURIComponent(apiKey)}&eventId=${encodeURIComponent(id)}${bookmakers}`;
  const oddsPayload = await fetchJson(oddsUrl);
  return summarizeOdds("odds-api.io", match, event, oddsPayload);
}

async function fetchTheOddsApi(match) {
  const apiKey = process.env.THE_ODDS_API_KEY;
  if (!apiKey) return null;
  const base = process.env.THE_ODDS_API_BASE_URL || "https://api.theoddsapi.com";
  const sportKey = process.env.THE_ODDS_SPORT_KEY || "soccer_fifa_world_cup";
  const regions = process.env.ODDS_REGIONS || "us,uk,eu";
  const url = `${base.replace(/\/$/, "")}/odds?sport_key=${encodeURIComponent(sportKey)}&markets=h2h&oddsFormat=decimal&regions=${encodeURIComponent(regions)}`;
  const payload = await fetchJson(url, { headers: { "x-api-key": apiKey } });
  const event = asArray(payload).find((item) => eventMatches(match, item));
  if (!event) return null;
  return summarizeOdds("theoddsapi.com", match, event, event);
}

async function fetchRemoteMarketOdds(match) {
  const errors = [];
  for (const provider of [fetchOddsApiIo, fetchTheOddsApi]) {
    try {
      const result = await provider(match);
      if (result) return { record: result, errors };
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { record: null, errors };
}

module.exports = {
  fetchRemoteMarketOdds,
  oddsToProbabilities
};
