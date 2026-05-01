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

      // 4. Set 7-day free trial for new users
      const trialEndsAt = isNewUser ? (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d;
      })() : undefined;

      // 5. Upsert user record
      await upsertUser({
        openId,
        name,
        email: email || undefined,
        loginMethod,
        lastSignedIn: new Date(),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(trialEndsAt ? { trialEndsAt } : {}),
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

      // Fetch Gravatar avatar for new Firebase/Google users
      if (isNewUser && email) {
        try {
          const { getGravatarUrl } = await import("../services/gravatar");
          const gravatarUrl = await getGravatarUrl(email);
          if (gravatarUrl) {
            const db2 = await getDb();
            if (db2) await db2.update(users).set({ avatarUrl: gravatarUrl }).where(eq(users.openId, openId));
          }
        } catch (gravatarErr) {
          console.warn("[AUTH] Gravatar fetch failed:", gravatarErr);
        }
      }

      // Send welcome in-app notification to new user (no banners — messages only)
      if (isNewUser && user) {
        try {
          const { sendWelcomeNotification } = await import("../jobs/platformMessagesJob");
          await sendWelcomeNotification(user.id, name);
        } catch (welcomeNotifErr) {
          console.warn("[AUTH] Welcome notification failed:", welcomeNotifErr);
        }
      }

      // Notify Chad when a brand new user signs up via Google/Firebase
      if (isNewUser) {
        try {
          const { sendEmail } = await import("../services/email");
          const signupTime = new Date().toLocaleString("en-US", {
            timeZone: "America/Chicago",
            dateStyle: "full",
            timeStyle: "short",
          });
          await sendEmail(
          "cdozier14@athlynx.ai",
          "adminNewUser",
          { userName: name, userEmail: email, signupTime }
          );
        } catch (notifyErr) {
          console.error("[AUTH] Admin notification email failed:", notifyErr);
        }
      }

      return { success: true, isNewUser, user };
    }),

  // ─── Email/password login ─────────────────────────────────────────────────
  login: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
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
        email: z.string().min(1),
        password: z.string().min(1),
        phone: z.string().optional(),
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

      // Set 7-day free trial for new users
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      await upsertUser({
        openId,
        name: input.name,
        email: input.email,
        loginMethod: "email",
        lastSignedIn: new Date(),
        trialEndsAt,
        ...(input.phone ? { phone: input.phone } : {}),
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

      // Fetch Gravatar avatar and save it to the user record
      try {
        const { getGravatarUrl } = await import("../services/gravatar");
        const gravatarUrl = await getGravatarUrl(input.email);
        if (gravatarUrl) {
          await db.update(users).set({ avatarUrl: gravatarUrl }).where(eq(users.openId, openId));
        }
      } catch (gravatarErr) {
        console.warn("[AUTH] Gravatar fetch failed:", gravatarErr);
      }

      const user = await getUserByOpenId(openId);

      // Notify Chad every time a new user registers
      try {
        const { sendEmail } = await import("../services/email");
        const signupTime = new Date().toLocaleString("en-US", {
          timeZone: "America/Chicago",
          dateStyle: "full",
          timeStyle: "short",
        });
        await sendEmail(
          "cdozier14@athlynx.ai",
          "adminNewUser",
          { userName: input.name, userEmail: input.email, signupTime }
        );
      } catch (notifyErr) {
        console.error("[AUTH] Admin notification email failed:", notifyErr);
      }

      // Send Welcome Email to the new user
      try {
        const { sendEmail } = await import("../services/email");
        await sendEmail(
          input.email,
          "welcome",
          { name: input.name, email: input.email }
        );
        console.log("[AUTH] Welcome email sent to", input.email);
      } catch (welcomeEmailErr) {
        console.error("[AUTH] Welcome email failed:", welcomeEmailErr);
      }

      // Send welcome in-app notification to new email/password user
      if (user) {
        try {
          const { sendWelcomeNotification } = await import("../jobs/platformMessagesJob");
          await sendWelcomeNotification(user.id, input.name);
        } catch (welcomeNotifErr) {
          console.warn("[AUTH] Welcome notification failed:", welcomeNotifErr);
        }
      }

      // Send Welcome SMS if phone number was provided at registration
      const phoneToSMS = input.phone || user?.phone;
      if (phoneToSMS) {
        try {
          const { sendWelcomeSMS, sendOwnerSignupSMSAlert } = await import("../services/aws-sns");
          await sendWelcomeSMS(phoneToSMS, input.name);
          await sendOwnerSignupSMSAlert({ name: input.name, email: input.email });
          console.log("[AUTH] Welcome SMS sent to", phoneToSMS);
        } catch (smsErr) {
          console.error("[AUTH] Welcome SMS failed:", smsErr);
        }
      }

      return { success: true, user };
    }),

  // ─── Save phone number ────────────────────────────────────────────────────
  savePhone: protectedProcedure
    .input(z.object({ phone: z.string().min(7) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      // Check if this is the first time saving a phone (for Welcome SMS)
      const isFirstPhone = !ctx.user.phone;
      await db
        .update(users)
        .set({ phone: input.phone })
        .where(eq(users.id, ctx.user.id));
      // Send Welcome SMS if this is the first phone number saved
      if (isFirstPhone) {
        try {
          const { sendWelcomeSMS, sendOwnerSignupSMSAlert } = await import("../services/aws-sns");
          await sendWelcomeSMS(input.phone, ctx.user.name ?? "Athlete");
          await sendOwnerSignupSMSAlert({ name: ctx.user.name ?? "Athlete", email: ctx.user.email ?? "" });
          console.log("[AUTH] Welcome SMS sent to", input.phone);
        } catch (smsErr) {
          console.error("[AUTH] Welcome SMS failed:", smsErr);
        }
      }
      return { success: true };
    }),

  // ─── Reset password (email + verification code flow) ─────────────────────
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
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
