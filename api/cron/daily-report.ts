/**
 * Vercel Cron Endpoint — AthlynXAI Daily Report
 * Triggered by Vercel's built-in cron scheduler (vercel.json)
 * Runs at 8:00 AM CST (14:00 UTC) every day
 */
const { sendDailyReport } = require("../../server/jobs/dailyReport");

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await sendDailyReport();
    return res.status(200).json({ ok: true, message: "Daily report sent" });
  } catch (err: any) {
    console.error("[DailyReport Cron] Error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
