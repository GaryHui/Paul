const { loadSnapshot } = require("../_lib/paul");
const { resolveMatches } = require("../_lib/bracket");
const { refreshDailyAnalysis } = require("../_lib/daily-analysis");
const { refreshMarketEvidence } = require("../_lib/evidence-refresh");
const { getResults } = require("../_lib/store");

const deepOddsRefreshMaxMatches = Number(process.env.DEEP_ODDS_REFRESH_MAX_MATCHES || 8);
const deepDailyAnalysisMaxMatches = Number(process.env.DEEP_DAILY_ANALYSIS_MAX_MATCHES || 12);

function requestToken(req) {
  const auth = req.headers?.authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  if (req.headers?.["x-verify-token"]) return String(req.headers["x-verify-token"]).trim();
  try {
    const url = new URL(req.url || "", "https://paul.local");
    return url.searchParams.get("token") || url.searchParams.get("verify") || "";
  } catch {
    return "";
  }
}

function assertCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    const error = new Error("CRON_SECRET is not configured.");
    error.status = 403;
    throw error;
  }
  if (requestToken(req) !== secret && requestToken(req) !== process.env.VERIFY_TOKEN) {
    const error = new Error("Unauthorized deep refresh.");
    error.status = 401;
    throw error;
  }
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      res.status(405).json({ error: "Method not allowed." });
      return;
    }
    assertCron(req);
    const now = new Date();
    const snapshot = loadSnapshot();
    const results = await getResults();
    const resolvedMatches = resolveMatches(snapshot.matches, results);
    const evidenceRefresh = process.env.ODDS_REFRESH_DISABLED === "1"
      ? { checked: 0, eligible: 0, skipped: 0, ok: 0, missing: 0, errors: 0, disabled: true, events: [] }
      : await refreshMarketEvidence(resolvedMatches, {
        now,
        limit: deepOddsRefreshMaxMatches
      });
    const dailyAnalysis = process.env.DAILY_ANALYSIS_DISABLED === "1" || !(process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY)
      ? { checked: 0, eligible: 0, skipped: 0, ok: 0, errors: 0, disabled: true, events: [] }
      : await refreshDailyAnalysis(resolvedMatches, {
        now,
        limit: deepDailyAnalysisMaxMatches
      });

    res.status(200).json({
      type: "deep-refresh",
      generatedAt: now.toISOString(),
      evidenceRefresh,
      dailyAnalysis
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
