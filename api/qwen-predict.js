const { callPaul } = require("./_lib/paul");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const result = await callPaul(payload);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message, detail: error.detail, evidence: error.evidence });
  }
};
