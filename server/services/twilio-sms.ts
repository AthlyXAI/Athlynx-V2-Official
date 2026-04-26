/**
 * Twilio SMS Service — ATHLYNX
 * Sends SMS messages via Twilio REST API.
 * Uses fetch — no SDK dependency required.
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";
// Use primary number, fall back to secondary/fallback
const TWILIO_FROM =
  process.env.TWILIO_PHONE_NUMBER_PRIMARY ??
  process.env.TWILIO_PHONE_NUMBER ??
  process.env.TWILIO_PHONE_NUMBER_SECONDARY ??
  process.env.TWILIO_PHONE_NUMBER_FALLBACK ??
  "";

/**
 * Send an SMS via Twilio REST API.
 * Returns true on success, false on failure (never throws).
 */
export async function sendSMS(to: string, body: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    console.warn("[Twilio] Missing credentials — skipping SMS to", to);
    return false;
  }

  // Ensure E.164 format
  const toFormatted = to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: TWILIO_FROM,
        To: toFormatted,
        Body: body,
      }).toString(),
    });

    const data = (await response.json()) as any;

    if (response.ok && data?.sid) {
      console.log(`[Twilio] SMS sent to ${toFormatted} — SID: ${data.sid}`);
      return true;
    } else {
      console.warn(`[Twilio] SMS failed to ${toFormatted}:`, data?.message ?? JSON.stringify(data));
      return false;
    }
  } catch (err: any) {
    console.warn(`[Twilio] SMS error to ${toFormatted}:`, err?.message);
    return false;
  }
}

/**
 * Send the ATHLYNX welcome SMS to a new user.
 * Safe to call fire-and-forget — never throws.
 */
export async function sendWelcomeSMS(
  phone: string,
  name: string,
  memberNumber?: number
): Promise<boolean> {
  const memberStr = memberNumber ? ` #${memberNumber}` : "";
  const message =
    `🏆 Welcome to ATHLYNX${memberStr}, ${name}! ` +
    `Your athlete platform is live. Login at https://athlynx.ai ` +
    `— AI Recruiter, NIL Portal, Transfer Portal & more await. Let's go! 🚀`;

  return sendSMS(phone, message);
}

/**
 * Send an SMS alert to the owner when a new user signs up.
 * Safe to call fire-and-forget — never throws.
 */
export async function sendOwnerSignupSMSAlert(opts: {
  name: string;
  email: string;
  memberNumber?: number;
}): Promise<boolean> {
  const ownerPhone = process.env.OWNER_PHONE ?? "";
  if (!ownerPhone) return false;

  const memberStr = opts.memberNumber ? ` #${opts.memberNumber}` : "";
  const message =
    `[ATHLYNX] New member${memberStr}: ${opts.name} (${opts.email}) just signed up! 🏆`;

  return sendSMS(ownerPhone, message);
}
