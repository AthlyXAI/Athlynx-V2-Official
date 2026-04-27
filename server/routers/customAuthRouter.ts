/**
 * ATHLYNX — Custom Auth Router
 * Firebase-based authentication. Auth0 has been fully removed.
 *
 * Procedures:
 *  - me               : return current session user (protected)
 *  - logout           : clear session cookie (protected)
 *  - syncFirebaseUser : verify Firebase ID token → upsert user → set session cookie (public)
 *  - login            : email/password sign-in → set session cookie (public)
 *  - register         : email/password sign-up → set session cookie (public)
 *  - savePhone        : save phone number to current user (protected)
 *  - resetPassword    : reset password using email + verification code (public)
 */
import { z } from "zod";
import bcrypt from "bcryptjs";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { verifyFirebaseToken } from "../_core/firebaseAdmin";
import { sdk } from "../_core/sdk";
import { getDb, upsertUser, getUserByOpenId } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const customAuthRouter = router({
  // ─── Get current session user ─────────────────────────────────────────────
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // ─── Logout ───────────────────────────────────────────────────────────────
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(COOKIE_NAME, { path: "/" });
    return { success: true };
  }),

  // ─── Firebase social login (Google, Apple, Facebook, Twitter) ────────────
  // Frontend: signInWithGoogle() → get idToken → call this → session cookie set
  syncFirebaseUser: publicProcedure
    .input(
      z.object({
        idToken: z.string().min(1),
        name: z.string().optional().default(""),
        email: z.string().optional().default(""),
        picture: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Verify the Firebase ID token with Google's public JWKS
      const firebasePayload = await verifyFirebaseToken(input.idToken);
      const uid = firebasePayload.uid;
      const openId = `firebase:${uid}`;

      // 2. Resolve display values — prefer Firebase token fields, fall back to input
      const name = firebasePayload.name || input.name || "Athlete";
      const email = firebasePayload.email || input.email || "";
      const loginMethod = firebasePayload.firebase?.sign_in_provider ?? "google.com";

      // 3. Check if user already exists
      const existing = await getUserByOpenId(openId);
      const isNewUser = !existing;

      // 4. Upsert user record
      await upsertUser({
        openId,
        name,
        email: email || undefined,
        loginMethod,
        lastSignedIn: new Date(),
        ...(input.phone ? { phone: input.phone } : {}),
      });

      // 5. Create session JWT and set cookie
      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOpts,
        maxAge: ONE_YEAR_MS,
      });

      // 6. Return the user record
      const user = await getUserByOpenId(openId);
      return { success: true, isNewUser, user };
    }),

  // ─── Email/password login ─────────────────────────────────────────────────
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      const user = rows[0];
      if (!user || !user.passwordHash) {
        throw new Error("Invalid email or password");
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new Error("Invalid email or password");

      // Refresh lastSignedIn
      await upsertUser({ openId: user.openId!, lastSignedIn: new Date() });

      const sessionToken = await sdk.createSessionToken(user.openId!, {
        name: user.name ?? "Athlete",
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOpts,
        maxAge: ONE_YEAR_MS,
      });

      return { success: true, user };
    }),

  // ─── Email/password registration ──────────────────────────────────────────
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check for existing account
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("An account with this email already exists");
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const openId = `email:${Date.now()}:${Math.random().toString(36).slice(2)}`;

      await upsertUser({
        openId,
        name: input.name,
        email: input.email,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      // Store the password hash
      await db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.openId, openId));

      const sessionToken = await sdk.createSessionToken(openId, {
        name: input.name,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOpts,
        maxAge: ONE_YEAR_MS,
      });

      const user = await getUserByOpenId(openId);
      return { success: true, user };
    }),

  // ─── Save phone number ────────────────────────────────────────────────────
  savePhone: protectedProcedure
    .input(z.object({ phone: z.string().min(7) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db
        .update(users)
        .set({ phone: input.phone })
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),

  // ─── Reset password (email + verification code flow) ─────────────────────
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().min(4),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Verify the code via the verification service
      const { verifyCode } = await import("../services/verification");
      const result = await verifyCode(input.email, input.code);
      if (!result.valid) {
        throw new Error(result.error ?? "Invalid or expired verification code");
      }

      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!rows[0]) throw new Error("No account found for this email");

      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.email, input.email));

      return { success: true };
    }),
});
