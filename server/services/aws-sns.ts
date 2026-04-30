/**
 * AWS SNS SMS Service — AthlynXAI
 * Sends SMS messages via AWS SNS.
 * Replaces Twilio — AWS credentials already configured.
 */
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Send an SMS via AWS SNS.
 * Returns true on success, false on failure (never throws).
 */
export async function sendSMS(to: string, body: string): Promise<boolean> {
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKey || !secretKey) {
    console.warn("[AWS SNS] Missing credentials — skipping SMS to", to);
    return false;
  }

  try {
    const formattedPhone = to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`;

    const command = new PublishCommand({
      PhoneNumber: formattedPhone,
      Message: body,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "ATHLYNXAI",
        },
      },
    });

    await snsClient.send(command);
    console.log(`[AWS SNS] SMS sent to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error("[AWS SNS Error]", error);
    return false;
  }
}

/**
 * Send welcome SMS to a new user.
 */
export async function sendWelcomeSMS(phone: string, name: string): Promise<boolean> {
  const message = `🏆 Welcome to AthlynXAI, ${name}! Your account is now active. Sign in at athlynx.ai. Iron Sharpens Iron. — Chad A. Dozier Sr., Founder`;
  return sendSMS(phone, message);
}

/**
 * Send owner alert when a new user signs up.
 */
export async function sendOwnerSignupSMSAlert(opts: {
  name: string;
  email: string;
  memberNumber?: number;
}): Promise<boolean> {
  const ownerPhone = process.env.OWNER_PHONE ?? "+16014985282";
  const memberStr = opts.memberNumber ? ` #${opts.memberNumber}` : "";
  const message = `[AthlynXAI] New member${memberStr}: ${opts.name} (${opts.email}) just signed up! 🏆`;
  return sendSMS(ownerPhone, message);
}
