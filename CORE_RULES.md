# PAUL Core Rules

This project has three non-negotiable rules. Every code, data, UI, automation, or deployment change must follow them.

## 1. Locked Predictions Are Immutable

Once a PAUL prediction is locked, it must not be changed, overwritten, deleted, re-ranked, or silently regenerated.

This includes:

- winner pick
- predicted score
- confidence and probability payload
- reasoning text stored in the official proof
- canonical proof JSON
- SHA-256 hash
- OpenTimestamps receipt
- locked timestamp
- kickoff timestamp used by that proof

Allowed changes:

- fix UI display around an existing locked prediction
- add clearer labels or translations
- add post-match result, accuracy status, and review notes
- add external verification metadata without changing the original canonical payload

If historical locked data looks wrong because of a timezone, API, or display bug, keep the original proof intact and add a correction note beside it. Do not rewrite history.

## 2. Do Not Modify The PAUL Core Prediction Model

The current PAUL core prediction model is protected. Do not change the core logic that creates the official pick unless the owner explicitly approves a model-version upgrade.

Protected areas include:

- official match-pick generation logic
- winner selection behavior
- score prediction behavior
- prompt structure that produces official locked predictions
- proof canonicalization for official predictions
- model identity used for official locked predictions

Allowed changes:

- improve data collection before lock
- improve odds/result/news provider integrations
- improve storage, retries, logs, and monitoring
- improve UI, language, proof verification, match trace, and admin tools
- add analysis after the match for calibration review

If a future model upgrade is approved, it must use a new explicit version name and must not be applied retroactively to already locked picks.

## 3. Calibration Layer May Be Tuned To Beat The Market

The calibration layer is the place for controlled improvement. Its goal is to help PAUL outperform the market over time without damaging the protected core model.

Calibration changes may adjust:

- bankroll and Kelly sizing
- market-implied probability shrinkage
- confidence reliability weights
- draw-risk handling
- upset-risk handling
- post-match review weights
- CLV and market movement interpretation
- historical/live accuracy priors
- portfolio caps and single-match exposure limits

Calibration changes must be measurable:

- compare PAUL against market favorite
- track direction accuracy separately from exact-score accuracy
- track group-stage and knockout performance separately
- track CLV where available
- track simulation bankroll curve
- mark whether changes are backtest-only, live-only, or both

Calibration must never rewrite PAUL's official locked pick. It can only decide how strongly the lab trusts that pick, how much simulated stake it suggests, and how post-match lessons affect future risk sizing.

## Required Change Checklist

Before finishing any change, verify:

- locked official predictions remain unchanged
- proof hashes and canonical payloads remain valid
- PAUL core model behavior is unchanged unless a new approved model version is created
- calibration changes are isolated and explainable
- UI changes do not imply certainty or guaranteed betting profit
- results and accuracy updates are appended, not backfilled deceptively

## Project Principle

PAUL can learn around the edges, but it must not cheat its own record.
