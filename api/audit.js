const { auditSnapshot, sha256 } = require("./_lib/audit");

module.exports = async function handler(req, res) {
  try {
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
