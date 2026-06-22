const crypto = require("crypto");
const OpenTimestamps = require("opentimestamps");
const { getAuditLog, setAuditEntry } = require("./store");

const proofVersion = "paul-proof-v2";
const openTimestampsTimeoutMs = Number(process.env.OPENTIMESTAMPS_TIMEOUT_MS || 7000);

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function kickoffAt(match) {
  const date = new Date(`${match.date} 20:00:00 GMT+0000`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function compactPrediction(analysis = {}) {
  return {
    winnerCode: analysis.winnerCode || analysis.winner || null,
    winnerName: analysis.winnerName || null,
    confidence: analysis.confidence || null,
    predictedScore: analysis.predictedScore || analysis.score || null,
    scoreScenarios: Array.isArray(analysis.scoreScenarios)
      ? analysis.scoreScenarios.slice(0, 5).map((item) => ({
          score: item.score || null,
          probability: item.probability ?? null,
          rank: item.rank ?? null
        }))
      : null,
    probabilities: analysis.probabilities || null,
    upsetRisk: analysis.upsetRisk || null,
    reasoning: analysis.reasoning || null,
    evidenceUsed: analysis.evidenceUsed || null,
    marketBaseline: analysis.marketBaseline || null,
    ratingBaseline: analysis.ratingBaseline || null,
    calibrationNote: analysis.calibrationNote || null,
    upsetCase: analysis.upsetCase || null
  };
}

function compactEvidence(evidence = {}) {
  return {
    generatedAt: evidence.generatedAt || null,
    hasPrimaryEvidence: Boolean(evidence.hasPrimaryEvidence),
    missing: evidence.missing || [],
    market: evidence.market
      ? {
          source: evidence.market.source || null,
          provider: evidence.market.provider || null,
          eventId: evidence.market.eventId || null,
          updatedAt: evidence.market.updatedAt || null,
          bookmakerCount: evidence.market.bookmakerCount || null,
          sampleBookmakers: evidence.market.sampleBookmakers || null,
          odds: evidence.market.odds || null,
          probabilities: evidence.market.probabilities || null
        }
      : null,
    ratings: evidence.ratings || null,
    form: evidence.form || null,
    poisson: evidence.poisson || null,
    modelBlend: evidence.modelBlend || null,
    baselines: evidence.baselines || null,
    paulEdge: evidence.paulEdge || null,
    searchFallback: Boolean(evidence.searchFallback)
  };
}

function buildProofPayload(match, record, nonce) {
  return {
    version: proofVersion,
    matchId: match.id,
    round: match.round,
    match: `${match.teamA.name} vs ${match.teamB.name}`,
    teams: {
      home: { code: match.teamA.code, name: match.teamA.name },
      away: { code: match.teamB.code, name: match.teamB.name }
    },
    kickoffAt: kickoffAt(match),
    lockedAt: record.generatedAt,
    model: record.model || "PAUL",
    prediction: compactPrediction(record.analysis),
    evidence: compactEvidence(record.evidence),
    nonce
  };
}

function createAuditEntry(match, record) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = buildProofPayload(match, record, nonce);
  const canonical = stableStringify(payload);
  const hash = sha256(canonical);
  const isBeforeKickoff = payload.kickoffAt ? new Date(payload.lockedAt).getTime() < new Date(payload.kickoffAt).getTime() : null;
  return {
    id: `${match.id}:${hash.slice(0, 16)}`,
    version: proofVersion,
    matchId: match.id,
    round: match.round,
    match: payload.match,
    lockedAt: payload.lockedAt,
    kickoffAt: payload.kickoffAt,
    isBeforeKickoff,
    hash,
    algorithm: "sha256",
    canonical,
    payload,
    externalProof: null,
    createdAt: new Date().toISOString()
  };
}

function githubConfig() {
  const token = process.env.GITHUB_AUDIT_TOKEN || process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_AUDIT_REPO || process.env.GITHUB_REPOSITORY || "GaryHui/Paul";
  const branch = process.env.GITHUB_AUDIT_BRANCH || "main";
  const path = process.env.GITHUB_AUDIT_PATH || "data/audit-log.json";
  return { token, repo, branch, path };
}

async function publishAuditToGitHub(entry) {
  const { token, repo, branch, path } = githubConfig();
  if (!token || !repo) return null;
  const apiBase = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "paul-proof-audit"
  };

  let sha = null;
  let log = [];
  const current = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
  if (current.ok) {
    const data = await current.json();
    sha = data.sha;
    try {
      log = JSON.parse(Buffer.from(data.content || "", "base64").toString("utf8"));
      if (!Array.isArray(log)) log = [];
    } catch {
      log = [];
    }
  } else if (current.status !== 404) {
    throw new Error(`GitHub audit read failed: ${current.status}`);
  }

  if (!log.some((item) => item.hash === entry.hash)) {
    log.push({
      id: entry.id,
      matchId: entry.matchId,
      match: entry.match,
      lockedAt: entry.lockedAt,
      kickoffAt: entry.kickoffAt,
      hash: entry.hash,
      algorithm: entry.algorithm,
      isBeforeKickoff: entry.isBeforeKickoff
    });
  }

  const body = {
    message: `Audit PAUL prediction proof for match ${entry.matchId}`,
    content: Buffer.from(`${JSON.stringify(log, null, 2)}\n`).toString("base64"),
    branch
  };
  if (sha) body.sha = sha;

  const response = await fetch(apiBase, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub audit write failed: ${response.status} ${text.slice(0, 200)}`);
  }
  const data = await response.json();
  return {
    provider: "github",
    committedAt: new Date().toISOString(),
    commitSha: data.commit?.sha || null,
    commitUrl: data.commit?.html_url || null,
    fileUrl: data.content?.html_url || null
  };
}

async function createOpenTimestamp(entry) {
  if (process.env.OPENTIMESTAMPS_DISABLED === "1") return null;
  const hash = Buffer.from(entry.hash, "hex");
  const detached = OpenTimestamps.DetachedTimestampFile.fromHash(new OpenTimestamps.Ops.OpSHA256(), hash);
  await Promise.race([
    OpenTimestamps.stamp(detached),
    new Promise((_, reject) => setTimeout(() => reject(new Error("OpenTimestamps calendar request timed out.")), openTimestampsTimeoutMs))
  ]);
  const bytes = Buffer.from(detached.serializeToBytes());
  return {
    provider: "opentimestamps",
    status: "pending-bitcoin-confirmation",
    createdAt: new Date().toISOString(),
    hash: entry.hash,
    otsBase64: bytes.toString("base64"),
    otsBytes: bytes.length,
    note: "OpenTimestamps proof created from the SHA-256 hash of canonical proof JSON. It may need later upgrading before Bitcoin block verification is final."
  };
}

async function attachAuditProof(match, record) {
  if (record.proof?.hash) return record;
  const entry = createAuditEntry(match, record);
  const externalProof = {};
  try {
    externalProof.github = await publishAuditToGitHub(entry);
  } catch (error) {
    externalProof.github = { provider: "github", error: error.message };
  }
  try {
    externalProof.opentimestamps = await createOpenTimestamp(entry);
  } catch (error) {
    externalProof.opentimestamps = { provider: "opentimestamps", error: error.message };
  }
  if (!externalProof.github && !externalProof.opentimestamps) entry.externalProof = null;
  else entry.externalProof = externalProof;
  await setAuditEntry(entry);
  return {
    ...record,
    proof: {
      id: entry.id,
      hash: entry.hash,
      algorithm: entry.algorithm,
      lockedAt: entry.lockedAt,
      kickoffAt: entry.kickoffAt,
      isBeforeKickoff: entry.isBeforeKickoff,
      externalProof: entry.externalProof
    }
  };
}

async function auditSnapshot() {
  const entries = await getAuditLog();
  return Object.values(entries).sort((a, b) => new Date(b.lockedAt) - new Date(a.lockedAt));
}

module.exports = {
  attachAuditProof,
  auditSnapshot,
  createAuditEntry,
  createOpenTimestamp,
  sha256,
  stableStringify
};
