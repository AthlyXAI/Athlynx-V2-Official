/**
 * Vercel Cron Endpoint — ATHLYNX Social Post Automation
 * Triggered by Vercel's built-in cron scheduler (vercel.json)
 * Runs at 8am, 12pm, 6pm CST (14:00, 18:00, 00:00 UTC)
 *
 * IMPORTANT: This file is compiled by esbuild to CJS (--format=cjs).
 * Do NOT use top-level ESM import/export syntax — use module.exports.
 * The build:vercel script compiles this separately from server/entry.ts.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { runSocialPostCron } = require("../../server/jobs/socialPostCron");

module.exports = async function handler(req: any, res: any) {
  // Vercel automatically adds the Authorization header for cron jobs
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await runSocialPostCron();
    return res.status(200).json({ ok: true, ...result, timestamp: new Date().toISOString() });
  } catch (err: any) {
    console.error("[Cron/SocialPost] Fatal error:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
};
