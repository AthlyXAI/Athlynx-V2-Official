import "dotenv/config";
import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerStripeWebhook } from "../server/stripe/webhook";

const app = express();

// CORS — allow the frontend origin with credentials (needed for session cookies)
app.use(cors({
  origin: ["https://athlynx.ai", "http://localhost:5173"],
  credentials: true,
}));

// Stripe webhook MUST be before json middleware
registerStripeWebhook(app);

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Cookie parser — required for reading/writing session cookies
app.use(cookieParser());

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

export default app;
// Vercel serverless CJS compatibility: module.exports must equal the Express app
// so Vercel's runtime can call it as a request handler.
module.exports = app;
