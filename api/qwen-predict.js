const { callPaul } = require("./_lib/paul");
const { attachAuditProof } = require("./_lib/audit");
const { getPredictions, isSharedStoreConfigured, setPrediction } = require("./_lib/store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const predictions = await getPredictions();
    if (predictions[payload.id]) {
      res.status(200).json({ ...predictions[payload.id], locked: true, persisted: true });
      return;
    }
    const result = await callPaul(payload, { source: "manual-lock" });
    const record = await attachAuditProof(payload, {
      matchId: payload.id,
      generatedAt: new Date().toISOString(),
      model: result.model || "PAUL",
      evidence: result.evidence,
      analysis: result.analysis
    });
    const persisted = await setPrediction(payload.id, record);
    res.status(200).json({ ...record, persisted, sharedStoreConfigured: isSharedStoreConfigured() });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message, detail: error.detail, evidence: error.evidence });
  }
};
