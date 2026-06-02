const { auditSnapshot, createAuditEntry, createOpenTimestamp, sha256 } = require("./_lib/audit");
const { loadSnapshot } = require("./_lib/paul");

function requestToken(req) {
  const auth = req.headers?.authorization || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  if (req.headers?.["x-verify-token"]) return String(req.headers["x-verify-token"]).trim();
  return req.query?.token || req.query?.verify || "";
}

function verifyAccess(req) {
  const expected = process.env.VERIFY_TOKEN;
  if (!expected) {
    const error = new Error("VERIFY_TOKEN is not configured.");
    error.status = 403;
    throw error;
  }
  if (requestToken(req) !== expected) {
    const error = new Error("Unauthorized verify request.");
    error.status = 401;
    throw error;
  }
}

async function demoOpenTimestampProof() {
  const snapshot = loadSnapshot();
  const match = snapshot.matches.find((item) => item.id === 1) || snapshot.matches[0];
  const winner = match.teamA || { code: "MEX", name: "Mexico" };
  const record = {
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    model: "PAUL-DEMO",
    evidence: {
      generatedAt: new Date().toISOString(),
      hasPrimaryEvidence: true,
      missing: [],
      market: {
        source: "demo",
        provider: "server demo",
        eventId: "demo-match-1",
        updatedAt: new Date().toISOString(),
        bookmakerCount: 3,
        sampleBookmakers: ["DemoBook A", "DemoBook B", "DemoBook C"],
        odds: { home: 2.05, draw: 3.55, away: 3.9 },
        probabilities: { home: 0.437, draw: 0.253, away: 0.23 }
      },
      ratings: null,
      form: null,
      searchFallback: false
    },
    analysis: {
      winnerCode: winner.code,
      winnerName: winner.name,
      confidence: 57,
      predictedScore: "2-1",
      probabilities: { home: 48, draw: 27, away: 25 },
      upsetRisk: "Demo only",
      reasoning: "Synthetic server-generated proof used to test OpenTimestamps without writing production data.",
      evidenceUsed: ["demo odds snapshot", "OpenTimestamps demo"]
    }
  };
  const entry = createAuditEntry(match, record);
  entry.externalProof = {
    github: null,
    opentimestamps: await createOpenTimestamp(entry),
    demo: { provider: "demo", note: "Server-generated owner demo. Not stored, not official." }
  };
  return {
    ...entry,
    verified: sha256(entry.canonical) === entry.hash,
    writesProductionData: false
  };
}

module.exports = async function handler(req, res) {
  try {
    const mode = req.query?.mode || req.body?.mode || "";
    if (req.method === "POST" && mode === "demo-ots") {
      verifyAccess(req);
      res.status(200).json({ entry: await demoOpenTimestampProof() });
      return;
    }
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed." });
      return;
    }
    const entries = await auditSnapshot();
    const verifiedEntries = entries.map((entry) => ({
      ...entry,
      verified: sha256(entry.canonical) === entry.hash
    }));
    res.status(200).json({
      count: verifiedEntries.length,
      entries: verifiedEntries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
