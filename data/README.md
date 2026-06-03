# Real Prediction Data Inputs

The site now refuses to create a formal prediction unless it has real input data.

## Required for better predictions

Use at least one primary source:

- Live odds provider env vars, preferred:
  - `ODDS_API_IO_KEY`: Odds-API.io key. The app checks football events, finds the matching fixture, then pulls 1X2 odds.
  - `THE_ODDS_API_KEY`: TheOddsAPI key. Used as a secondary live odds provider.
- `market-odds.json`: local 1X2 market odds or probabilities, used only when live providers are not configured or no matching event is found.
- `team-ratings.json`: real team ratings such as Elo/SPI plus optional attack/defense values.

Optional but useful:

- `recent-form.json`: recent match form, injuries, rest days, or notes.
- `RESULTS_API_URL`: API endpoint for final scores.

## Live odds environment variables

Keep all keys server-side in Vercel Production env vars. Never put them in `app.js` or `index.html`.

```text
ODDS_API_IO_KEY=...
ODDS_API_IO_SPORT=football
ODDS_BOOKMAKERS=Bet365,Pinnacle,Unibet

THE_ODDS_API_KEY=...
THE_ODDS_SPORT_KEY=soccer_fifa_world_cup
ODDS_REGIONS=us,uk,eu
```

`ODDS_API_IO_KEY` is tried first. `THE_ODDS_API_KEY` is tried second. If neither returns a matching event, PAUL falls back to `market-odds.json`. Live odds are fetched only when PAUL is about to create a formal prediction or when the private evidence endpoint is requested, not on every page view.

Formal prediction proof records use `paul-proof-v2`, which includes a compact public evidence snapshot: provider, event id, bookmaker count, sample bookmakers, consensus 1X2 odds, and implied probabilities. API keys and raw private responses are never included in the public proof.

## PAUL Edge Engine v1

Formal predictions now build a fixed evidence layer before PAUL writes the final call:

- Market baseline: 1X2 odds are converted into implied probabilities and weighted at 55%.
- Rating baseline: Elo/SPI-style ratings are converted into win/draw/loss probabilities and weighted at 25%.
- Score model: optional attack/defense values feed a Poisson score model and are weighted at 20%.
- Upset overlay: PAUL receives an evidence-gated upset score from 0-100. It rises when baselines disagree, the blended model challenges the market, the market edge is narrow, or recent form supports the underdog.
- Calibration: PAUL is instructed to keep confidence realistic: 50-59 lean, 60-69 solid, 70-79 strong, 80+ rare.

The public proof payload stores `evidence.baselines` and `evidence.paulEdge`, so every pick can later be judged against market favorites, rating favorites, score-model favorites, and PAUL's own confidence.

## Historical backtest

The private Verify page includes a historical backtest powered by `api/_lib/backtest.js`.

The runner processes matches in listed order, so PAUL Edge can use only prior tournament form, never future results. 2022 is treated as the tuning sample. 2018 and 2014 are displayed as holdout checks, using only the archived matches where public CheckBestOdds 1X2 odds were found.

Current PAUL Edge Engine v4 result:

- 2022 tuning sample: PAUL Edge 38/64, 59% accuracy; market favorite 38/64, 59%.
- 2018 holdout: PAUL Edge 28/43, 65% accuracy; market favorite 26/43, 60%.
- 2014 holdout: PAUL Edge 15/25, 60% accuracy; market favorite 14/25, 56%.
- 2010 holdout: PAUL Edge 30/56, 54% accuracy; market favorite 29/56, 52%.
- 2018+2014+2010 holdout total: PAUL Edge 73/124, 59%; market favorite 69/124, 56%.

The v4 change keeps PAUL conservative on shallow underdogs: non-draw upset targets must clear a 3.10+ market-price gate. It gives up 2022 tuning-sample edge, but every listed holdout year now beats the market favorite baseline. Treat this as an audit harness, not a guarantee or promotional claim. Future algorithm changes should be judged by whether they improve holdout performance without hiding the per-year breakdown.

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
