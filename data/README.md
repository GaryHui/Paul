# Real Prediction Data Inputs

The site now refuses to create a formal prediction unless it has real input data.

## Required for better predictions

Use at least one primary source:

- Live odds provider env vars, preferred:
  - `BSD_API_KEY`: BSD/Bzzoiro token. The app checks football events and pulls consensus 1X2 odds plus injuries, form, H2H, coaches, and tactical fields when available.
  - `ODDS_API_IO_KEY`: Odds-API.io key. The app checks football events, finds the matching fixture, then pulls 1X2 odds.
  - `THE_ODDS_API_KEY`: TheOddsAPI key. Used as a secondary live odds provider.
  - `BALLDONTLIE_API_KEY`: BALLDONTLIE FIFA World Cup key. Used as a World Cup-specific fallback for match odds and official tournament context.
- `market-odds.json`: local 1X2 market odds or probabilities, used only when live providers are not configured or no matching event is found.
- `team-ratings.json`: real team ratings such as Elo/SPI plus optional attack/defense values.

Optional but useful:

- `recent-form.json`: recent match form, injuries, rest days, or notes.
- `RESULTS_API_URL`: API endpoint for final scores.

## Live odds environment variables

Keep all keys server-side in Vercel Production env vars. Never put them in `app.js` or `index.html`.

```text
BSD_API_KEY=...
BSD_API_BASE_URL=https://sports.bzzoiro.com/api

ODDS_API_IO_KEY=...
ODDS_API_IO_SPORT=football
ODDS_BOOKMAKERS=Bet365,Pinnacle,Unibet

THE_ODDS_API_KEY=...
THE_ODDS_SPORT_KEY=soccer_fifa_world_cup
ODDS_REGIONS=us,uk,eu

BALLDONTLIE_API_KEY=...
BALLDONTLIE_BASE_URL=https://api.balldontlie.io/fifa/worldcup/v1

ODDS_REFRESH_HORIZON_DAYS=60
ODDS_REFRESH_MAX_MATCHES=12
ODDS_CACHE_MAX_HOURS=26

DAILY_ANALYSIS_HORIZON_DAYS=45
DAILY_ANALYSIS_MAX_MATCHES=4
DAILY_ANALYSIS_DISABLED=1
```

`BSD_API_KEY` is tried first because it can provide both odds and daily intelligence. `ODDS_API_IO_KEY` and `THE_ODDS_API_KEY` are tried next as specialist odds feeds. `BALLDONTLIE_API_KEY` is tried as a World Cup-specific fallback. If no live provider returns a matching event, PAUL falls back to `market-odds.json`.

The odds fetcher only calls providers when a match reaches its refresh window. It stores future-match odds snapshots in Vercel KV under `paul:evidence:v1`. Formal predictions use a fresh cached snapshot when available and fetch live odds only when the cache is stale or missing. By default the cron checks the next 12 due scheduled playable matches to avoid serverless timeouts and API overuse; increase `ODDS_REFRESH_MAX_MATCHES` only if the odds provider and Vercel plan can handle it.

Vercel Hobby plans only allow daily Cron Jobs, so `vercel.json` keeps the built-in safety cron at once per day. To run the full cadence below, use either Vercel Pro with `*/15 * * * *`, or an external scheduler such as GitHub Actions, cron-job.org, EasyCron, or Upstash QStash to call `/api/automation/run-due` every 15 minutes with `Authorization: Bearer <CRON_SECRET>`. The endpoint is protected; public visitors cannot trigger it.

This repository includes `.github/workflows/paul-cron.yml` for the external scheduler path. Add a GitHub repository secret named `CRON_SECRET` with the same value as Vercel Production `CRON_SECRET`; GitHub Actions will then wake the protected endpoint every 15 minutes while the app code decides whether any provider calls are actually due.

Dynamic odds refresh cadence:

- More than 30 days before kickoff: every 48 hours.
- 30 days to 7 days before kickoff: every 24 hours.
- 7 days to 48 hours before kickoff: every 12 hours.
- 48 hours to 6 hours before kickoff: every 6 hours.
- 6 hours to 60 minutes before kickoff: every 1 hour.
- Final 60 minutes before kickoff: every 15 minutes.

Daily odds refresh does not call PAUL/Qwen. The separate Daily PAUL Read can call PAUL/Qwen once per selected upcoming match, storing public win/draw/loss probabilities in Vercel KV under `paul:daily-analysis:v1`. Defaults are conservative: the next 4 resolved fixtures inside a 45-day horizon. Daily reads are also cadence-gated: every 24 hours normally, every 6 hours inside 48 hours, and every 1 hour inside 6 hours. Increase `DAILY_ANALYSIS_MAX_MATCHES` only when the model/search budget can handle it. Set `DAILY_ANALYSIS_DISABLED=1` to disable the daily read while keeping odds refresh, result sync, and formal proof-locked predictions active.

The Daily PAUL Read is not a formal proof record. Official predictions are still created only in the pre-match lock window and stored with proof records.

Formal prediction proof records use `paul-proof-v2`, which includes a compact public evidence snapshot: provider, event id, bookmaker count, sample bookmakers, consensus 1X2 odds, and implied probabilities. API keys and raw private responses are never included in the public proof.

## PAUL Edge Engine v4

Formal predictions now build a fixed evidence layer before PAUL writes the final call:

- Market baseline: 1X2 odds are converted into implied probabilities and weighted at 55%.
- Rating baseline: Elo/SPI-style ratings are converted into win/draw/loss probabilities and weighted at 25%.
- Score model: optional attack/defense values feed a Poisson score model and are weighted at 20%.
- Upset overlay: PAUL receives an evidence-gated upset score from 0-100. It rises when baselines disagree, the blended model challenges the market, the market edge is narrow, or recent form supports the underdog.
- Calibration: PAUL is instructed to keep confidence realistic: 50-59 lean, 60-69 solid, 70-79 strong, 80+ rare.

The public proof payload stores `evidence.baselines` and `evidence.paulEdge`, so every pick can later be judged against market favorites, rating favorites, score-model favorites, and PAUL's own confidence.

## Historical backtest

The private Verify page includes a historical backtest powered by `api/_lib/backtest.js`.

The runner processes matches in listed order, so PAUL Edge can use only prior tournament form, never future results. 2022 is treated as the tuning sample. 2018, 2014, 2010, and 2006 are displayed as World Cup holdout checks, using public archived 1X2 odds where available. The 2006 set uses the TIB/Leibniz ODDSET appendix tables, which expose all 64 matches. When network access is available, the same private backtest also fetches Premier League CSV files from Football-Data for a cross-competition holdout.

Current PAUL Edge Engine v4 result:

- 2022 tuning sample: PAUL Edge 38/64, 59% accuracy; market favorite 38/64, 59%.
- 2018 holdout: PAUL Edge 28/43, 65% accuracy; market favorite 26/43, 60%.
- 2014 holdout: PAUL Edge 15/25, 60% accuracy; market favorite 14/25, 56%.
- 2010 holdout: PAUL Edge 30/56, 54% accuracy; market favorite 29/56, 52%.
- 2006 holdout: PAUL Edge 36/64, 56% accuracy; market favorite 40/64, 63%.
- 2018+2014+2010+2006 holdout total: PAUL Edge 109/188, 58%; market favorite 109/188, 58%.
- Premier League 2021-22 through 2024-25 cross-check: PAUL Edge 863/1520, 57%; market favorite 863/1520, 57%; edge 0 in conservative league mode.
- World Cup holdout + Premier League cross-check: PAUL Edge 972/1708, 57%; market favorite 972/1708, 57%; edge 0.

The private backtest page also runs a stability audit:

- Year-by-year holdout edge: 2018 +2, 2014 +1, 2010 +1, 2006 -4.
- Leave-one-year-out sensitivity is no longer uniformly positive after adding 2006; this is a watch signal for algorithm work, not a result to hide.
- Deterministic bootstrap now runs over 188 holdout matches and should be read with the per-year breakdown, because the 2006 full-odds set changes the stability picture.

The v4 change keeps PAUL conservative on shallow underdogs: non-draw upset targets must clear a 3.10+ market-price gate. For high-liquidity league matches, PAUL uses conservative market-anchor mode rather than forcing the World Cup upset layer into a different competition format. Adding the 2006 full-odds set weakens the earlier World Cup holdout advantage from +4 to 0, so future algorithm changes should be judged by whether they improve 2006 without damaging 2018/2014/2010 or the Premier League cross-check. Treat this as an audit harness, not a guarantee or promotional claim.

## OpenTimestamps proof

Official predictions also try to create an OpenTimestamps `.ots` receipt unless disabled:

```text
OPENTIMESTAMPS_DISABLED=1
```

When enabled, the server timestamps the SHA-256 hash of the canonical proof JSON through OpenTimestamps calendar servers. The resulting `.ots` receipt is stored in the public proof JSON as `externalProof.opentimestamps.otsBase64`.

Verification flow:

1. Copy the proof JSON.
2. Recompute SHA-256 from `canonical`; it must equal `hash`.
3. Save the canonical JSON bytes to a file.
4. Decode `otsBase64` to `file.ots`.
5. Verify with opentimestamps.org or the OpenTimestamps CLI.

New `.ots` receipts may initially be `pending-bitcoin-confirmation`. After the calendar has anchored to Bitcoin, the proof can be upgraded and verified against a Bitcoin block.

## Automation safety

Production prediction/result sync is intended to run from Vercel Cron, not from public user clicks.

Recommended Vercel env var:

```text
CRON_SECRET=long-random-secret
```

When `CRON_SECRET` is configured, Vercel sends it as `Authorization: Bearer <secret>` for cron invocations, and `/api/automation/run-due` rejects public GET requests. Manual POST runs always require the owner `VERIFY_TOKEN`.

The owner-only demo OpenTimestamps proof endpoint is rate limited with:

```text
DEMO_OTS_COOLDOWN_SECONDS=300
```

Within the cooldown window, the site reuses the previous demo proof instead of calling OpenTimestamps calendars again.

## `market-odds.json`

```json
{
  "1": {
    "bookmaker": "example",
    "odds": {
      "home": 1.85,
      "draw": 3.40,
      "away": 4.50
    }
  }
}
```

Keys are match IDs from the site. `home` maps to Team A, `away` maps to Team B.

## `team-ratings.json`

```json
{
  "MEX": {
    "elo": 1785,
    "attack": 1.12,
    "defense": 0.96,
    "source": "World Football Elo / internal import"
  },
  "RSA": {
    "elo": 1605,
    "attack": 0.88,
    "defense": 1.08,
    "source": "World Football Elo / internal import"
  }
}
```

`elo` enables the Elo probability layer. `attack` and `defense` enable the Poisson score layer.

## `recent-form.json`

```json
{
  "MEX": {
    "last10": "5W-3D-2L",
    "notes": "No confirmed injury feed connected yet."
  }
}
```

This is passed to Qwen as context but does not create probabilities by itself.
