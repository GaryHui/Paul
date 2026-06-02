const { runBacktest } = require("../_lib/backtest");

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

function verifyAccess(req) {
  const expected = process.env.VERIFY_TOKEN;
  if (!expected) {
    const error = new Error("VERIFY_TOKEN is not configured.");
    error.status = 403;
    throw error;
  }
  if (requestToken(req) !== expected) {
    const error = new Error("Unauthorized backtest request.");
    error.status = 401;
    throw error;
  }
}

module.exports = async function handler(req, res) {
  try {
    verifyAccess(req);
    res.status(200).json(runBacktest());
  } catch (error) {
    res.status(error.status || 500).json({ status: "fail", error: error.message });
  }
};
