/**
 * ATHLYNX Stripe Products & Pricing Configuration
 * All prices are in USD cents.
 *
 * Live Price IDs (created April 26, 2026 — acct_1SkhxSDWqFuLp4sz):
 *   Athlete Free    → price_1TQalMGvvjXZw2uEAgeLldvx  ($0.00/month — 7-day trial, converts to Starter)
 *   Athlete Starter → price_1TQalOGvvjXZw2uEP2eqJJAE  ($9.99/month)
 *   Athlete Pro     → price_1TQalQGvvjXZw2uEjYMwKUgW  ($19.99/month)
 *   Athlete Elite   → (set STRIPE_PRICE_ELITE in Vercel)  ($39.99/month)
 *
 * Env vars (set in Vercel dashboard):
 *   STRIPE_PRICE_FREE, STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO, STRIPE_PRICE_ELITE
 *
 * Free Trial Flow:
 *   User signs up → 7-day free trial → auto-converts to Athlete Starter ($9.99/mo) on day 8
 *   Card required at signup but NOT charged for 7 days.
 */
export const STRIPE_PLANS = [
  {
    id: "athlete_free",
    name: "Athlete Free",
    description: "Get started at no cost. 7-day free trial — converts to Starter ($9.99/mo) on day 8.",
    priceMonthly: 0, // $0/month (trial)
    priceYearly: 0,
    features: [
      "Basic Athlete Profile",
      "NIL Deal Discovery",
      "Community Feed",
      "Transfer Portal Access",
      "7-Day Free Trial",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_FREE ?? "price_1TQalMGvvjXZw2uEAgeLldvx",
    stripePriceIdYearly: process.env.STRIPE_PRICE_FREE ?? "price_1TQalMGvvjXZw2uEAgeLldvx",
    badge: "Free Trial",
    color: "#0066ff",
    trialDays: 7,
    trialConvertsTo: "athlete_starter",
  },
  {
    id: "athlete_starter",
    name: "Athlete Starter",
    description: "Essential access to the ATHLYNX platform — NIL discovery, messaging, and community features.",
    priceMonthly: 999,  // $9.99/month
    priceYearly: 9588,  // $95.88/yr ($7.99/mo)
    features: [
      "Basic Athlete Profile",
      "NIL Deal Discovery",
      "Community Messaging",
      "Transfer Portal Access",
      "Diamond Grind Training",
      "7-Day Free Trial",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER ?? process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "price_1TQalOGvvjXZw2uEP2eqJJAE",
    stripePriceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? "price_1TQalOGvvjXZw2uEP2eqJJAE",
    badge: "Best for Beginners",
    color: "#0099ff",
    trialDays: 7,
  },
  {
    id: "athlete_pro",
    name: "Athlete Pro",
    description: "Full platform access with AI recruiting, NIL deal tracking, and transfer portal intelligence.",
    priceMonthly: 1999, // $19.99/month
    priceYearly: 19188, // $191.88/yr ($15.99/mo)
    features: [
      "Everything in Starter",
      "AI Recruiter Tools",
      "NIL Deal Marketplace",
      "Warriors Playbook",
      "AI Sales Automation",
      "Priority Support",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO ?? process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_1TQalQGvvjXZw2uEjYMwKUgW",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "price_1TQalQGvvjXZw2uEjYMwKUgW",
    badge: "Most Popular",
    color: "#00c2ff",
    trialDays: 7,
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "The complete ATHLYNX experience — white-glove NIL management, brand deals, and 1-on-1 strategy.",
    priceMonthly: 3999, // $39.99/month
    priceYearly: 38388, // $383.88/yr ($31.99/mo)
    features: [
      "Everything in Pro",
      "NIL Vault (Contract Archive)",
      "Brand Deal Negotiation AI",
      "Dedicated Account Manager",
      "White-label Branding",
      "API Access",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ELITE ?? process.env.STRIPE_PRICE_ELITE_MONTHLY ?? "price_1TQalQGvvjXZw2uEjYMwKUgW",
    stripePriceIdYearly: process.env.STRIPE_PRICE_ELITE_YEARLY ?? "price_1TQalQGvvjXZw2uEjYMwKUgW",
    badge: "Best Value",
    color: "#7c3aed",
    trialDays: 7,
  },
] as const;

export type PlanId = (typeof STRIPE_PLANS)[number]["id"];

export const CREDIT_PACKS = [
  {
    id: "credits_100",
    name: "100 Credits",
    description: "100 AI credits — use for AI Trainers, Teammates & Companions.",
    credits: 100,
    price: 999,   // $9.99
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_100 ?? "price_1TPlXLGvvjXZw2uE9BVsgXi8",
  },
  {
    id: "credits_500",
    name: "500 Credits",
    description: "500 AI credits — best value for active users.",
    credits: 500,
    price: 3999,  // $39.99
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_500 ?? "price_1TPlXNGvvjXZw2uEybgWAotO",
  },
  {
    id: "credits_1000",
    name: "1,000 Credits",
    description: "1,000 AI credits — power users and teams.",
    credits: 1000,
    price: 6999,  // $69.99
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_1000 ?? "price_1TPlXPGvvjXZw2uE2UckX9uN",
  },
] as const;
