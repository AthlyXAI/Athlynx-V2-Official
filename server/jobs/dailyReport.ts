/**
 * Daily User Report — AthlynXAI
 * Runs every day at 8:00 AM CST (14:00 UTC)
 * Sends a daily signup summary email to Chad Dozier
 */
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { sql, gte } from "drizzle-orm";
import { sendCustomEmail } from "../services/email";

const OWNER_EMAIL = "cdozier14@athlynx.ai";

export async function sendDailyReport(): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[DailyReport] Database not available — skipping");
      return;
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const [newTodayResult, totalResult, loginMethods] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, yesterday)),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ method: users.loginMethod, count: sql<number>`count(*)` })
        .from(users)
        .where(gte(users.createdAt, yesterday))
        .groupBy(users.loginMethod),
    ]);

    const newToday = Number(newTodayResult[0]?.count ?? 0);
    const total = Number(totalResult[0]?.count ?? 0);

    const dateStr = now.toLocaleDateString("en-US", {
      timeZone: "America/Chicago",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const methodRows = loginMethods.length > 0
      ? loginMethods.map((m: { method: string | null; count: number }) =>
          `<tr style="background:#0c1a32;">
            <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#94a3b8;font-size:13px;">${m.method ?? "unknown"}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e3a6e;color:#fff;font-size:13px;text-align:right;font-weight:bold;">${m.count}</td>
          </tr>`
        ).join("")
      : `<tr><td colspan="2" style="padding:10px 16px;color:#475569;text-align:center;font-size:13px;">No new signups today</td></tr>`;

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:28px 32px;">
  <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:3px;">ATHLYNXAI</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:5px;margin-top:4px;">DAILY GROWTH REPORT</div>
</td></tr>
<tr><td style="padding:32px;">
  <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">${dateStr} &bull; Generated at <strong style="color:#fff;">${timeStr}</strong></p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td width="50%" style="text-align:center;padding:20px;background:#0a1628;border-radius:12px;">
        <div style="font-size:48px;font-weight:900;color:#00c2ff;">${newToday}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;letter-spacing:1px;">NEW TODAY</div>
      </td>
      <td width="8px"></td>
      <td width="50%" style="text-align:center;padding:20px;background:#0a1628;border-radius:12px;">
        <div style="font-size:48px;font-weight:900;color:#0066ff;">${total}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:4px;letter-spacing:1px;">TOTAL USERS</div>
      </td>
    </tr>
  </table>
  ${newToday > 0 ? `
  <h3 style="color:#fff;font-size:14px;font-weight:700;margin:0 0 12px;letter-spacing:2px;text-transform:uppercase;">Today's Signups by Method</h3>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #1e3a6e;margin-bottom:24px;">
    <tr style="background:#1e3a6e;">
      <td style="padding:10px 16px;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Method</td>
      <td style="padding:10px 16px;color:#94a3b8;font-size:12px;letter-spacing:1px;text-transform:uppercase;text-align:right;">Count</td>
    </tr>
    ${methodRows}
  </table>` : ''}
  <div style="text-align:center;padding:20px;background:#0a1628;border-radius:12px;margin-bottom:24px;">
    <a href="https://athlynx.ai/admin" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:1px;">VIEW ADMIN DASHBOARD</a>
  </div>
  <p style="color:#475569;font-size:11px;text-align:center;margin:0;">AthlynXAI &bull; A Dozier Holdings Group Company &bull; Houston, TX</p>
  <p style="color:#475569;font-size:11px;text-align:center;margin:4px 0 0;">"Iron Sharpens Iron" — Proverbs 27:17</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    const subject = `AthlynXAI Daily Report — ${newToday} new signup${newToday !== 1 ? 's' : ''} today | ${total} total users`;
    const text = `AthlynXAI Daily Report\n${dateStr}\n\nNew signups today: ${newToday}\nTotal users: ${total}\n\nView dashboard: https://athlynx.ai/admin\n\nIron Sharpens Iron — Proverbs 27:17`;

    await sendCustomEmail(OWNER_EMAIL, subject, html, text);
    console.log(`[DailyReport] Sent — ${newToday} new signups, ${total} total users`);
  } catch (err) {
    console.error("[DailyReport] Failed:", err);
  }
}
