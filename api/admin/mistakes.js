const { getMistakeMemory } = require("../_lib/store");

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
  const error = new Error("Unauthorized mistake memory request.");
  error.status = 401;
  throw error;
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
    const memory = await getMistakeMemory();
    const matches = memory.matches || {};
    const reviews = Object.values(matches)
      .sort((a, b) => new Date(b.generatedAt || 0) - new Date(a.generatedAt || 0))
      .slice(0, 80);
    return json(res, 200, {
      status: "ok",
      generatedAt: new Date().toISOString(),
      version: memory.version || "paul-mistake-memory-v1",
      updatedAt: memory.updatedAt || null,
      aggregate: memory.aggregate || null,
      reviewCount: Object.keys(matches).length,
      reviews
    });
  } catch (error) {
    return json(res, error.status || 500, { error: error.message || "Mistake memory failed." });
  }
};
