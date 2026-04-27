
import bcrypt from "bcryptjs";
import { COOKIE_NAME, ONE_YEAR_MS } from "../_core/constants";
import { getSessionCookieOptions } from "../_core/cookies";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const customAuthRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(COOKIE_NAME);
    return { success: true };
  }),

  syncAuth0User: publicProcedure
    .input(z.object({ token: z.string() }).optional())
    .mutation(async () => {
      // Auth0 removed — return success to prevent 500 errors
      return { success: true, user: null };
    }),
});
