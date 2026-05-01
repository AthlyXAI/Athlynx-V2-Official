/**
 * ATHLYNX Investor Request Router
 * Handles gated investor page access requests
 * Notifies cdozier14@athlynx.ai + gtse@athlynx.ai on every submission
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { sendEmail } from "../services/aws-ses";

export const investorRouter = router({
  /**
   * Submit investor access request
   * Sends notification emails to Chad + Glenn
   */
  submitRequest: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(2, "Full name required"),
        email: z.string().email("Valid email required"),
        phone: z.string().optional(),
        company: z.string().optional(),
        title: z.string().optional(),
        investmentRange: z.enum([
          "Under $50K",
          "$50K – $250K",
          "$250K – $500K",
          "$500K – $1M",
          "$1M+",
        ]),
        accredited: z.boolean(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        fullName,
        email,
        phone,
        company,
        title,
        investmentRange,
        accredited,
        message,
      } = input;

      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
        dateStyle: "full",
        timeStyle: "short",
      });

      // ── Email to Chad + Glenn ──────────────────────────────────────────────
      const adminHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:28px 32px;text-align:center;">
  <div style="font-size:32px;font-weight:900;color:#fff;letter-spacing:4px;">ATHLYNX</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:6px;margin-top:4px;">NEW INVESTOR REQUEST</div>
</td></tr>
<tr><td style="padding:32px;">
  <h2 style="color:#fff;font-size:20px;margin:0 0 6px;">🏆 New Investor Access Request</h2>
  <p style="color:#94a3b8;font-size:13px;margin:0 0 24px;">${timestamp} CST</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;overflow:hidden;margin-bottom:24px;">
    <tr><td style="padding:12px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:11px;display:block;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Full Name</span>
      <span style="color:#fff;font-size:15px;font-weight:bold;">${fullName}</span>
    </td></tr>
    <tr><td style="padding:12px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:11px;display:block;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Email</span>
      <span style="color:#00c2ff;font-size:15px;">${email}</span>
    </td></tr>
    ${phone ? `<tr><td style="padding:12px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:11px;display:block;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Phone</span>
      <span style="color:#fff;font-size:15px;">${phone}</span>
    </td></tr>` : ""}
    ${company ? `<tr><td style="padding:12px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:11px;display:block;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Company / Fund</span>
      <span style="color:#fff;font-size:15px;">${company}${title ? ` — ${title}` : ""}</span>
    </td></tr>` : ""}
    <tr><td style="padding:12px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:11px;display:block;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Investment Range</span>
      <span style="color:#00c2ff;font-size:16px;font-weight:bold;">${investmentRange}</span>
    </td></tr>
    <tr><td style="padding:12px 18px;${message ? "border-bottom:1px solid #1e3a6e;" : ""}">
      <span style="color:#94a3b8;font-size:11px;display:block;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Accredited Investor</span>
      <span style="color:${accredited ? "#22c55e" : "#ef4444"};font-size:15px;font-weight:bold;">${accredited ? "✅ YES — Accredited" : "❌ NO — Not Accredited"}</span>
    </td></tr>
    ${message ? `<tr><td style="padding:12px 18px;">
      <span style="color:#94a3b8;font-size:11px;display:block;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Message</span>
      <span style="color:#e2e8f0;font-size:14px;line-height:1.5;">${message}</span>
    </td></tr>` : ""}
  </table>
  <div style="text-align:center;margin-top:20px;">
    <a href="mailto:${email}" style="background:#0066ff;color:#fff;font-weight:bold;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;display:inline-block;">
      Reply to ${fullName}
    </a>
  </div>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #1e3a6e;text-align:center;">
  <p style="color:#475569;font-size:11px;margin:0;">ATHLYNX AI · Dozier Holdings Group · Humble, TX 77346</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

      // ── Confirmation email to the requester ───────────────────────────────
      const confirmHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:28px;text-align:center;">
  <div style="font-size:32px;font-weight:900;color:#fff;letter-spacing:4px;">ATHLYNX</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:6px;margin-top:4px;">INVESTOR INQUIRY RECEIVED</div>
</td></tr>
<tr><td style="padding:32px;">
  <h2 style="color:#fff;font-size:20px;margin:0 0 12px;">Thank you, ${fullName}.</h2>
  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
    Your investor inquiry has been received. Our team will review your request and reach out within <strong style="color:#00c2ff;">1–2 business days</strong>.
  </p>
  <div style="background:#0a1628;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
    <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Investment Range Submitted</p>
    <p style="color:#00c2ff;font-size:18px;font-weight:bold;margin:0;">${investmentRange}</p>
  </div>
  <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 20px;">
    For immediate inquiries, contact Chad A. Dozier Sr. directly:<br>
    📧 <a href="mailto:cdozier14@athlynx.ai" style="color:#00c2ff;">cdozier14@athlynx.ai</a><br>
    📞 <a href="tel:+16014985282" style="color:#00c2ff;">+1 (601) 498-5282</a>
  </p>
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #1e3a6e;text-align:center;">
  <p style="color:#475569;font-size:11px;margin:0;">CONFIDENTIAL — FOR ACCREDITED INVESTOR USE ONLY · © 2026 Dozier Holdings Group, LLC · ATHLYNX, Inc.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

      // Send both emails in parallel
      const subject = `🏆 New Investor Request — ${fullName} (${investmentRange})`;

      await Promise.allSettled([
        sendEmail({ to: "cdozier14@athlynx.ai", subject, html: adminHtml }),
        sendEmail({ to: "gtse@athlynx.ai", subject, html: adminHtml }),
        sendEmail({
          to: email,
          subject: "ATHLYNX — Your Investor Inquiry Was Received",
          html: confirmHtml,
        }),
      ]);

      return { success: true, message: "Request submitted. We will be in touch within 1–2 business days." };
    }),
});
