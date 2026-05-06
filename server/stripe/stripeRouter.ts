import Stripe from "stripe";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { STRIPE_PLANS, CREDIT_PACKS } from "./products";
import { getUserById } from "../db";

// ─── MASTER ADMIN — Chad A. Dozier Sr. only ───────────────────────────────────
// Never charged. Full admin control. Only account with backend admin access.
const OWNER_EMAILS = [
  "cdozier14@athlynx.ai",
];

// ─── PARTNERS — Full platform access, no paywall, no trial limits ─────────────
// Partners have full access to all platform features but are NOT admins.
// Chad A. Dozier Sr. remains the sole MASTER ADMIN with backend control.
const PARTNER_EMAILS = [
  "gtse@athlynx.ai",           // Glenn Tse — CFO/COO
  "lmarshall@athlynx.ai",      // Lee Marshall — VP Sales
  "leronious@gmail.com",        // Lee Marshall — personal (production test)
  "jboyd@athlynx.ai",          // Jimmy Boyd — VP Real Estate
  "akustes@athlynx.ai",        // Andrew Kustes — VP Technology
];

// ─── FULL ACCESS — owner OR partner ──────────────────────────────────────────
function isOwner(email: string | null | undefined): boolean {
  return !!email && OWNER_EMAILS.includes(email.toLowerCase());
}

function isPartner(email: string | null | undefined): boolean {
  return !!email && PARTNER_EMAILS.includes(email.toLowerCase());
}

function hasFullAccess(email: string | null | undefined): boolean {
  return isOwner(email) || isPartner(email);
}

// Team members eligible for automated Stripe payroll
// Revenue is distributed automatically after each billing cycle
const TEAM_PAYROLL: Array<{
  name: string;
  email: string;
  role: string;
  stripeConnectedAccountId?: string;
  percentageOfRevenue: number;
}> = [
  { name: "Glenn Tse",    email: "gtse@athlynx.ai",     role: "CFO/COO",        percentageOfRevenue: 15 },
  { name: "Lee Marshall", email: "lmarshall@athlynx.ai", role: "VP Sales",       percentageOfRevenue: 10 },
  { name: "Jimmy Boyd",   email: "jboyd@athlynx.ai",    role: "VP Real Estate", percentageOfRevenue: 8  },
  { name: "Andrew Kustes",email: "akustes@athlynx.ai",  role: "VP Technology",  percentageOfRevenue: 10 },
];

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY ?? "";
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
  }
  return _stripe;
}

export const stripeRouter = router({
  /** Return all available plans for the frontend */
  getPlans: publicProcedure.query(() => {
    return STRIPE_PLANS.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      features: plan.features,
      badge: plan.badge,
      color: plan.color,
    }));
  }),

  /** Return all credit packs */
  getCreditPacks: publicProcedure.query(() => {
    return CREDIT_PACKS.map(p => ({
      id: p.id,
      name: p.name,
      credits: p.credits,
      price: p.price,
    }));
  }),

  /** Create a Stripe Checkout Session for a subscription plan */
  createSubscriptionCheckout: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        interval: z.enum(["month", "year"]),
        origin: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Owner + Partner bypass — never charge full-access accounts
      if (hasFullAccess(ctx.user.email)) {
        return { url: input.origin + "/feed?access=full" };
      }
      const stripe = getStripe();
      const plan = STRIPE_PLANS.find(p => p.id === input.planId);
      if (!plan) throw new Error("Plan not found");

      const priceId =
        input.interval === "month"
          ? plan.stripePriceIdMonthly
          : plan.stripePriceIdYearly;

      // If no Stripe price ID configured yet, create an inline price
      const lineItem = priceId
        ? { price: priceId, quantity: 1 }
        : {
            price_data: {
              currency: "usd",
              product_data: { name: plan.name, description: plan.description },
              unit_amount: input.interval === "month" ? plan.priceMonthly : plan.priceYearly,
              recurring: { interval: input.interval },
            },
            quantity: 1,
          };

      // Use existing Stripe customer ID if available to avoid duplicate customers
      const dbUser = await getUserById(ctx.user.id);
      const customerField: Record<string, string | undefined> = dbUser?.stripeCustomerId
        ? { customer: dbUser.stripeCustomerId }
        : { customer_email: ctx.user.email ?? undefined };

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [lineItem],
        ...customerField,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
          plan_id: input.planId,
          plan_name: plan.name,          // ← FIX: was missing, needed for confirmation email
          interval: input.interval,
        },
        // 7-day free trial — card required upfront, no charge until day 8
        subscription_data: {
          trial_period_days: plan.trialDays ?? 7,
          trial_settings: {
            end_behavior: { missing_payment_method: "cancel" },
          },
          metadata: {
            user_id: ctx.user.id.toString(),
            plan_id: input.planId,
            plan_name: plan.name,
          },
        },
        payment_method_collection: "always",
        allow_promotion_codes: true,
        success_url: `${input.origin}/billing?success=1&plan=${input.planId}&trial=1`,
        cancel_url: `${input.origin}/pricing?cancelled=1`,
      });

      return { url: session.url };
    }),

  /** Create a Stripe Checkout Session for a credit pack (one-time payment) */
  createCreditsCheckout: protectedProcedure
    .input(
      z.object({
        packId: z.string(),
        origin: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const pack = CREDIT_PACKS.find(p => p.id === input.packId);
      if (!pack) throw new Error("Credit pack not found");

      const lineItem = pack.stripePriceId
        ? { price: pack.stripePriceId, quantity: 1 }
        : {
            price_data: {
              currency: "usd",
              product_data: { name: pack.name },
              unit_amount: pack.price,
            },
            quantity: 1,
          };

      // Use existing Stripe customer ID if available to avoid 400 email conflicts
      const dbUser = await getUserById(ctx.user.id);
      const customerField: Record<string, string | undefined> = dbUser?.stripeCustomerId
        ? { customer: dbUser.stripeCustomerId }
        : { customer_email: ctx.user.email ?? undefined };

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [lineItem],
        ...customerField,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
          pack_id: input.packId,
          plan_name: pack.name,          // ← FIX: consistent plan_name for email
          credits: pack.credits.toString(),
        },
        allow_promotion_codes: true,
        success_url: `${input.origin}/billing?success=1&credits=${pack.credits}`,
        cancel_url: `${input.origin}/pricing?cancelled=1`,
      });

      return { url: session.url };
    }),

  /** Open Stripe Customer Portal for managing billing */
  createBillingPortal: protectedProcedure
    .input(z.object({ origin: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const user = await getUserById(ctx.user.id);
      if (!user?.stripeCustomerId) {
        throw new Error("No billing account found. Please subscribe first.");
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${input.origin}/billing`,
      });

      return { url: session.url };
    }),

  /** Create a one-time product checkout session for Marketplace purchases */
  createProductCheckout: protectedProcedure
    .input(
      z.object({
        productName: z.string(),
        productDescription: z.string(),
        priceInCents: z.number().int().positive(),
        quantity: z.number().int().positive().default(1),
        origin: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: input.productName,
                description: input.productDescription,
              },
              unit_amount: input.priceInCents,
            },
            quantity: input.quantity,
          },
        ],
        customer_email: ctx.user.email ?? undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
          product_name: input.productName,
          plan_name: input.productName,
        },
        allow_promotion_codes: true,
        success_url: `${input.origin}/marketplace?success=1&product=${encodeURIComponent(input.productName)}`,
        cancel_url: `${input.origin}/marketplace`,
      });
      return { url: session.url };
    }),

  /** ─── STRIPE CONNECT PAYROLL ─────────────────────────────────────────────
   * Automated revenue distribution to team members via Stripe Connect
   * Each team member needs a Stripe Connect Express account
   * Chad triggers payroll manually after each billing cycle
   */

  /** Get payroll config — MASTER ADMIN (Chad) only */
  getPayrollConfig: protectedProcedure.query(async ({ ctx }) => {
    if (!isOwner(ctx.user.email)) throw new Error("Unauthorized — Master Admin only");
    return TEAM_PAYROLL.map(member => ({
      name: member.name,
      email: member.email,
      role: member.role,
      percentageOfRevenue: member.percentageOfRevenue,
      connected: !!member.stripeConnectedAccountId,
      connectedAccountId: member.stripeConnectedAccountId ?? null,
    }));
  }),

  /** Create Stripe Connect onboarding link for a team member — MASTER ADMIN only */
  createConnectOnboardingLink: protectedProcedure
    .input(z.object({ email: z.string().email(), origin: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!isOwner(ctx.user.email)) throw new Error("Unauthorized — Master Admin only");
      const stripe = getStripe();
      const account = await stripe.accounts.create({
        type: "express",
        email: input.email,
        capabilities: { transfers: { requested: true } },
        business_type: "individual",
        metadata: { platform: "athlynxai", invited_by: ctx.user.email ?? "" },
      });
      const link = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${input.origin}/admin?payroll=refresh`,
        return_url: `${input.origin}/admin?payroll=connected&account=${account.id}`,
        type: "account_onboarding",
      });
      return { url: link.url, accountId: account.id };
    }),

  /** Process payroll — MASTER ADMIN (Chad) only */
  processPayroll: protectedProcedure
    .input(z.object({ netRevenue: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      if (!isOwner(ctx.user.email)) throw new Error("Unauthorized — Master Admin only");
      const stripe = getStripe();
      const results: Array<{ name: string; amount: number; status: string; error?: string }> = [];

      for (const member of TEAM_PAYROLL) {
        if (!member.stripeConnectedAccountId) {
          results.push({ name: member.name, amount: 0, status: "not_connected", error: "No Stripe Connect account" });
          continue;
        }
        const amountCents = Math.floor((input.netRevenue * member.percentageOfRevenue / 100) * 100);
        if (amountCents < 100) {
          results.push({ name: member.name, amount: amountCents, status: "skipped", error: "Amount too small" });
          continue;
        }
        try {
          await stripe.transfers.create({
            amount: amountCents,
            currency: "usd",
            destination: member.stripeConnectedAccountId,
            description: `AthlynXAI payroll — ${member.role} — ${member.percentageOfRevenue}% of $${(input.netRevenue).toFixed(2)}`,
            metadata: { platform: "athlynxai", recipient: member.email, role: member.role },
          });
          results.push({ name: member.name, amount: amountCents, status: "paid" });
        } catch (err: any) {
          results.push({ name: member.name, amount: amountCents, status: "failed", error: err.message });
        }
      }
      return {
        success: true,
        results,
        totalDistributed: results.filter(r => r.status === "paid").reduce((sum, r) => sum + r.amount, 0),
      };
    }),

  /** Get current subscription status */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    // Master Admin bypass — Chad always has full owner plan
    if (isOwner(ctx.user.email)) {
      return {
        plan: "owner",
        status: "active",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    // Partner bypass — full access, no subscription required
    if (isPartner(ctx.user.email)) {
      return {
        plan: "partner",
        status: "active",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    const user = await getUserById(ctx.user.id);
    if (!user?.stripeCustomerId || !user?.stripeSubscriptionId) {
      return { status: "none", plan: null };
    }

    try {
      const subscription = await getStripe().subscriptions.retrieve(
        user.stripeSubscriptionId
      );
      return {
        status: subscription.status,
        plan: user.stripePlanId ?? null,
        currentPeriodEnd: (subscription as any).current_period_end,
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      };
    } catch {
      return { status: "none", plan: null };
    }
  }),

  /** List all active products from Stripe for the Store */
  getStoreProducts: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      try {
        const stripe = getStripe();
        const products = await stripe.products.list({
          active: true,
          limit: input.limit,
          expand: ["data.default_price"],
        });

        return products.data
          .filter((p: any) => !input.category || p.metadata?.category === input.category)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            image: p.images?.[0] || null,
            category: p.metadata?.category || "general",
            sku: p.metadata?.sku || p.id,
            price: p.default_price?.unit_amount ?? 0,
            currency: p.default_price?.currency ?? "usd",
            priceId: p.default_price?.id ?? null,
            requiresQuote: p.metadata?.requires_quote === "true",
            inStock: p.metadata?.in_stock !== "false",
            rating: parseFloat(p.metadata?.rating || "5.0"),
            reviews: parseInt(p.metadata?.reviews || "0"),
          }));
      } catch {
        return [];
      }
    }),
});
