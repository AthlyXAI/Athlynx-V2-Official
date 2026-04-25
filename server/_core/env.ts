/**
 * Environment configuration — ATHLYNX
 * All values sourced from Vercel environment variables.
 * NO Manus forge API keys. NO Manus OAuth server URL.
 */
export const ENV = {
  // App identity
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // Owner identity (for admin checks and notifications)
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  ownerEmail: process.env.OWNER_EMAIL ?? "cdozier14@athlynx.ai",

  // Auth0
  auth0Domain: process.env.AUTH0_DOMAIN ?? "",
  auth0ClientId: process.env.AUTH0_CLIENT_ID ?? "",
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET ?? "",
  auth0Audience: process.env.VITE_AUTH0_AUDIENCE ?? "",
  auth0IssuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL ?? "",

  // SendGrid
  sendgridApiKey: process.env.SENDGRID_API_KEY ?? "",
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL ?? "noreply@athlynx.ai",
  sendgridWelcomeTemplateId: process.env.SENDGRID_WELCOME_TEMPLATE_ID ?? "",

  // Twilio
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER ?? "",

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  // AWS S3 (for file storage)
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
  awsS3Bucket: process.env.AWS_S3_BUCKET ?? "",
};
