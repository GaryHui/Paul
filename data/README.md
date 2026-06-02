# Real Prediction Data Inputs

The site now refuses to create a formal prediction unless it has real input data.

## Required for better predictions

Use at least one primary source:

- `market-odds.json`: 1X2 market odds or probabilities.
- `team-ratings.json`: real team ratings such as Elo/SPI plus optional attack/defense values.

Optional but useful:

- `recent-form.json`: recent match form, injuries, rest days, or notes.
- `RESULTS_API_URL`: API endpoint for final scores.

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
