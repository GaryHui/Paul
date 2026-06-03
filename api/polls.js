const fs = require("fs");
const path = require("path");
const { getPoll, setPollVote } = require("./_lib/store");

const dataDir = path.join(process.cwd(), "data");
const snapshotFile = path.join(dataDir, "match-snapshot.json");

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) {
        reject(new Error("Request body too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

function queryMatchId(req) {
  const url = new URL(req.url || "", "https://paul.local");
  return url.searchParams.get("matchId");
}

function normalizeVoter(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 80);
}

function readMatches() {
  try {
    return JSON.parse(fs.readFileSync(snapshotFile, "utf8")).matches || [];
  } catch {
    return [];
  }
}

function matchAllowsDraw(matchId) {
  const match = readMatches().find((item) => String(item.id) === String(matchId));
  return !match || match.round === "Group Stage";
}

async function requestBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (req.body && typeof req.body === "string") return JSON.parse(req.body);
  return readBody(req);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const matchId = queryMatchId(req);
      if (!matchId) {
        res.status(400).json({ error: "matchId is required." });
        return;
      }
      res.status(200).json(await getPoll(matchId));
      return;
    }

    if (req.method === "POST") {
      const body = await requestBody(req);
      const matchId = body.matchId;
      const side = body.side;
      const voterId = normalizeVoter(body.voterId);
      if (!matchId || !voterId) {
        res.status(400).json({ error: "matchId and voterId are required." });
        return;
      }
      if (!["home", "draw", "away"].includes(side)) {
        res.status(400).json({ error: "side must be home, draw, or away." });
        return;
      }
      if (side === "draw" && !matchAllowsDraw(matchId)) {
        res.status(400).json({ error: "draw is only available for group-stage polls." });
        return;
      }
      res.status(200).json(await setPollVote(matchId, voterId, side));
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
