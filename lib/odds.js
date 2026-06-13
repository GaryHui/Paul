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
  const date = match?.kickoffAt ? new Date(match.kickoffAt) : new Date(`${match.date} 20:00:00 GMT+0000`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function eventDate(event = {}) {
  const raw =
    event.startTime ||
    event.start_time ||
    event.commence_time ||
    event.kickoff ||
    event.event_date ||
    event.datetime ||
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
    event.home_team_obj?.name,
    event.away_team_obj?.name,
    event.home_team?.name,
    event.away_team?.name,
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
  return event.id || event.eventId || event.event_id || event.key || event.fixtureId || event.fixture_id || event.match_id || null;
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

function compactUnavailable(value) {
  if (!value) return null;
  return {
    home: asArray(value.home).slice(0, 12).map((item) => ({
      name: item.name || item.player_name || item.player || null,
      status: item.status || null,
      reason: item.reason || item.type || null,
      expectedReturn: item.expected_return || item.expectedReturn || null
    })),
    away: asArray(value.away).slice(0, 12).map((item) => ({
      name: item.name || item.player_name || item.player || null,
      status: item.status || null,
      reason: item.reason || item.type || null,
      expectedReturn: item.expected_return || item.expectedReturn || null
    }))
  };
}

function compactCoach(value) {
  if (!value) return null;
  return {
    name: value.name || value.short_name || value.shortName || null,
    profile: value.profile || null,
    preferredFormation: value.preferred_formation || value.formation || null,
    pressingIntensity: value.pressing_intensity || null,
    defensiveLine: value.defensive_line || null,
    topStyles: value.top_styles || null
  };
}

function compactForm(value) {
  if (!value) return null;
  return {
    formString: value.form_string || value.form || null,
    wins: value.wins ?? null,
    draws: value.draws ?? null,
    losses: value.losses ?? null,
    pointsLastN: value.points_last_n ?? value.points ?? null,
    goalsScoredLastN: value.goals_scored_last_n ?? null,
    goalsConcededLastN: value.goals_conceded_last_n ?? null,
    avgXg: value.avg_xg ?? null,
    avgXgConceded: value.avg_xg_conceded ?? null,
    avgShots: value.avg_shots ?? null,
    avgTeamRating: value.avg_team_rating ?? value.rating ?? null
  };
}

function compactHeadToHead(value) {
  if (!value) return null;
  return {
    totalMatches: value.total_matches ?? null,
    homeWins: value.home_wins ?? null,
    draws: value.draws ?? null,
    awayWins: value.away_wins ?? null,
    avgTotalGoals: value.avg_total_goals ?? null,
    recentMatches: asArray(value.recent_matches).slice(0, 5)
  };
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

function summarizeDirectOdds(provider, match, event, odds, extra = {}) {
  const normalizedOdds = {
    home: decimalOdds(odds.home),
    draw: decimalOdds(odds.draw),
    away: decimalOdds(odds.away)
  };
  const probabilities = oddsToProbabilities(normalizedOdds);
  if (!probabilities && !extra.intelligence) return null;
  return {
    source: provider,
    provider,
    eventId: eventId(event),
    eventName: event.name || event.title || event.eventName || `${match.teamA.name} vs ${match.teamB.name}`,
    updatedAt: extra.updatedAt || new Date().toISOString(),
    bookmakerCount: extra.bookmakerCount || null,
    sampleBookmakers: extra.sampleBookmakers || null,
    odds: normalizedOdds,
    probabilities,
    intelligence: extra.intelligence || null
  };
}

function bsdHeaders() {
  return { Authorization: `Token ${process.env.BSD_API_KEY}` };
}

function bdlHeaders() {
  return { Authorization: process.env.BALLDONTLIE_API_KEY };
}

function dateParam(date) {
  return date.toISOString().slice(0, 10);
}

async function fetchBsdOdds(match) {
  const apiKey = process.env.BSD_API_KEY;
  if (!apiKey) return null;
  const base = process.env.BSD_API_BASE_URL || "https://sports.bzzoiro.com/api";
  const kickoff = matchDate(match);
  const from = kickoff ? new Date(kickoff.getTime() - 2 * 24 * 60 * 60 * 1000) : new Date();
  const to = kickoff ? new Date(kickoff.getTime() + 2 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const eventsUrl = `${base.replace(/\/$/, "")}/events/?date_from=${dateParam(from)}&date_to=${dateParam(to)}&tz=UTC&limit=200`;
  const eventsPayload = await fetchJson(eventsUrl, { headers: bsdHeaders() });
  const event = asArray(eventsPayload).find((item) => eventMatches(match, item));
  if (!event) return null;
  const id = eventId(event);
  let detail = event;
  if (id) {
    try {
      detail = await fetchJson(`${base.replace(/\/$/, "")}/events/${encodeURIComponent(id)}/?tz=UTC`, { headers: bsdHeaders() });
    } catch {
      detail = event;
    }
  }
  const odds = {
    home: detail.odds_home ?? event.odds_home,
    draw: detail.odds_draw ?? event.odds_draw,
    away: detail.odds_away ?? event.odds_away
  };
  const intelligence = {
    source: "bsd",
    eventStatus: detail.status || event.status || null,
    kickoffAt: detail.event_date || event.event_date || null,
    coaches: {
      home: compactCoach(detail.home_coach || event.home_coach),
      away: compactCoach(detail.away_coach || event.away_coach)
    },
    unavailablePlayers: compactUnavailable(detail.unavailable_players || event.unavailable_players),
    form: {
      teamA: compactForm(detail.home_form),
      teamB: compactForm(detail.away_form)
    },
    headToHead: compactHeadToHead(detail.head_to_head),
    overUnder: {
      over15: detail.odds_over_15 ?? event.odds_over_15 ?? null,
      over25: detail.odds_over_25 ?? event.odds_over_25 ?? null,
      under25: detail.odds_under_25 ?? event.odds_under_25 ?? null,
      bttsYes: detail.odds_btts_yes ?? event.odds_btts_yes ?? null,
      bttsNo: detail.odds_btts_no ?? event.odds_btts_no ?? null
    }
  };
  return summarizeDirectOdds("bsd", match, detail, odds, {
    bookmakerCount: detail.bookmaker_count || event.bookmaker_count || 14,
    sampleBookmakers: ["BSD consensus"],
    intelligence
  });
}

async function pagedBalldontlie(path, params = {}) {
  const base = process.env.BALLDONTLIE_BASE_URL || "https://api.balldontlie.io/fifa/worldcup/v1";
  const url = new URL(`${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.append(key, value);
  });
  return fetchJson(url.toString(), { headers: bdlHeaders() });
}

async function pagedBalldontlieAll(path, params = {}, maxPages = 5) {
  const rows = [];
  let cursor = null;
  for (let page = 0; page < maxPages; page += 1) {
    const payload = await pagedBalldontlie(path, {
      ...params,
      ...(cursor ? { cursor } : {})
    });
    rows.push(...asArray(payload));
    cursor = payload?.meta?.next_cursor || payload?.meta?.nextCursor || payload?.next_cursor || payload?.nextCursor || null;
    if (!cursor) break;
  }
  return rows;
}

async function fetchBalldontlieOdds(match) {
  if (!process.env.BALLDONTLIE_API_KEY) return null;
  const matches = await pagedBalldontlieAll("matches", { per_page: 100, "seasons[]": 2026 });
  const bdlMatch = matches.find((item) => Number(item.match_number) === Number(match.id) || eventMatches(match, item));
  if (!bdlMatch?.id) return null;
  const odds = await pagedBalldontlieAll("odds", { per_page: 100, "match_ids[]": bdlMatch.id, "seasons[]": 2026 });
  const rows = odds.filter((item) => Number(item.match_id) === Number(bdlMatch.id));
  if (!rows.length) return null;
  const record = summarizeDirectOdds("balldontlie", match, bdlMatch, {
    home: median(rows.map((item) => decimalOdds(item.moneyline_home_odds))),
    draw: median(rows.map((item) => decimalOdds(item.moneyline_draw_odds))),
    away: median(rows.map((item) => decimalOdds(item.moneyline_away_odds)))
  }, {
    bookmakerCount: rows.length,
    sampleBookmakers: [...new Set(rows.map((item) => item.vendor).filter(Boolean))].slice(0, 8),
    updatedAt: rows.map((item) => item.updated_at).filter(Boolean).sort().at(-1) || new Date().toISOString(),
    intelligence: {
      source: "balldontlie",
      matchStatus: bdlMatch.status || null,
      kickoffAt: bdlMatch.datetime || null,
      formations: {
        home: bdlMatch.home_formation || null,
        away: bdlMatch.away_formation || null
      },
      managers: {
        home: bdlMatch.home_manager || null,
        away: bdlMatch.away_manager || null
      },
      referee: bdlMatch.referee || null,
      stadium: bdlMatch.stadium || null
    }
  });
  return record;
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
  for (const provider of [fetchBsdOdds, fetchOddsApiIo, fetchTheOddsApi, fetchBalldontlieOdds]) {
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
