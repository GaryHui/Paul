const { runUniversalBacktest } = require("./_lib/universal-backtest");

function requestToken(req) {
  const auth = req.headers?.authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  if (req.headers?.["x-verify-token"]) return String(req.headers["x-verify-token"]).trim();
  try {
    const url = new URL(req.url || "/", "https://paul.local");
    return url.searchParams.get("token") || url.searchParams.get("verify") || "";
  } catch {
    return "";
  }
}

function assertAllowed(req) {
  const verifyToken = process.env.VERIFY_TOKEN;
  const token = requestToken(req);
  if (verifyToken && token === verifyToken) return;
  const error = new Error("Unauthorized universal backtest request.");
  error.status = 401;
  throw error;
}

function params(req) {
  const url = new URL(req.url || "/", "https://paul.local");
  return {
    sport: url.searchParams.get("sport") || "football",
    seasons: url.searchParams.get("seasons") ? url.searchParams.get("seasons").split(",").map((item) => item.trim()).filter(Boolean) : null,
    leagues: url.searchParams.get("leagues") ? url.searchParams.get("leagues").split(",").map((item) => item.trim()).filter(Boolean) : null
  };
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload, null, 2));
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return json(res, 405, { error: "Method not allowed." });
    }
    assertAllowed(req);
    const result = await runUniversalBacktest(params(req));
    return json(res, 200, result);
  } catch (error) {
    return json(res, error.status || 500, { error: error.message || "Universal backtest failed." });
  }
};
