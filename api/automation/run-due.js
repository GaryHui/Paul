module.exports = function handler(req, res) {
  res.status(200).json({
    events: [],
    summary: {
      note: "Scheduled locking requires persistent storage or Vercel Cron integration."
    }
  });
};
