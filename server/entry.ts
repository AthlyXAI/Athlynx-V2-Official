import "dotenv/config";
import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerStripeWebhook } from "../server/stripe/webhook";
import { registerJotformWaitlistWebhook } from "../server/webhooks/jotformWaitlist";
import { runMigrations } from "../server/migrate";
import { runDualMigrations } from "../server/migrate-dual";

const app = express();

// CORS — allow the frontend origin with credentials (needed for session cookies)
app.use(cors({
  origin: ["https://athlynx.ai", "http://localhost:5173"],
  credentials: true,
}));

// Stripe webhook MUST be before json middleware (needs raw body)
registerStripeWebhook(app);

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Cookie parser — required for reading/writing session cookies
app.use(cookieParser());

// JotForm waitlist webhook — registered after body parsers so urlencoded payload is parsed
registerJotformWaitlistWebhook(app);

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", platform: "ATHLYNX", version: "1.0.3", timestamp: new Date().toISOString() });
});

// Run DB migrations on first cold-start (non-blocking — errors are logged, not thrown)
// DATABASE_URL is available in the Vercel runtime env but NOT during the build step,
// which is why we run migrations here rather than in the build:vercel script.
// Run migrations on both TiDB (primary) and PlanetScale (backup) on every cold-start
runDualMigrations().catch((err) =>
  console.error("[entry] runDualMigrations unexpected error:", err)
);

// ESM default export — esbuild --format=cjs wraps this correctly for Vercel's Node runtime.
export default app;
