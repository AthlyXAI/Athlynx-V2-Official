import type { Application, Request, Response } from "express";

/**
 * Auth0 handles the OAuth flow on the frontend via @auth0/auth0-react.
 * After Auth0 login, the frontend calls trpc.auth.syncAuth0User to create
 * the session cookie and DB record. This file is kept for legacy route
 * compatibility only.
 */
export function registerOAuthRoutes(app: Application) {
  // Legacy Manus OAuth callback — redirect to homepage
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    res.redirect(302, "/");
  });
}
