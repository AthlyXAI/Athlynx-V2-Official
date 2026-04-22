/**
 * Vercel Cron Endpoint — ATHLYNX Social Post Automation
 * Triggered by Vercel's built-in cron scheduler (vercel.json)
 * Runs at 8am, 12pm, 6pm CST (14:00, 18:00, 00:00 UTC)
 * Self-contained — no external triggers, no Manus dependency
 */
import type { VercelRequest as Request, VercelResponse as Response } from "@vercel/node";
import { runSocialPostCron } from "../../server/jobs/socialPostCron";

export default async function handler(req: Request, res: Response) {
  // Vercel automatically adds the Authorization header for cron jobs
  // This prevents unauthorized external calls
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
}
