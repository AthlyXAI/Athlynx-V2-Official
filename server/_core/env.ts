export const ENV = {
  appId: process.env.VITE_APP_ID ?? "athlynx",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // ─── Auth0 (dev-8yqdmei0v8kc3qqy) ────────────────────────────────────────
  auth0Domain: process.env.AUTH0_DOMAIN ?? "dev-8yqdmei0v8kc3qqy.us.auth0.com",
  auth0ClientId: process.env.AUTH0_CLIENT_ID ?? "eDJT34flTy4oOq1cie6ItFubLDPHOrcI",
  auth0CallbackUrl: process.env.AUTH0_CALLBACK_URL ?? "https://athlynx.ai/callback",
};
