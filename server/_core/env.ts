export const ENV = {
  appId: process.env.VITE_APP_ID ?? "athlynx",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // ─── Auth0 Athlynx14 ──────────────────────────────────────────────────────
  auth0Domain: process.env.AUTH0_DOMAIN ?? "dev-oy08pgzo48x3u117.us.auth0.com",
  auth0ClientId: process.env.AUTH0_CLIENT_ID ?? "xh4sS3Kqi0Y5poA9LpwjwRDN3ygeOpt9",
  auth0CallbackUrl: process.env.AUTH0_CALLBACK_URL ?? "https://athlynx.ai/callback",
};
