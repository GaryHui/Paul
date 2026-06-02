module.exports = function handler(req, res) {
  res.status(200).json({ ok: true, note: "Vercel uses the committed match snapshot." });
};
