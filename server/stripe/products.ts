/**
 * ATHLYNX Stripe Products & Pricing Configuration
 * All prices are in USD cents.
 *
 * Live Price IDs (created April 26, 2026 — acct_1SkhxSDWqFuLp4sz):
 *   Athlete Free  → price_1TQalMGvvjXZw2uEAgeLldvx  ($0.00/month)
 *   Athlete Pro   → price_1TQalOGvvjXZw2uEP2eqJJAE  ($19.99/month)
 *   Athlete Elite → price_1TQalQGvvjXZw2uEjYMwKUgW  ($39.99/month)
 *
 * Env vars (set in Vercel dashboard):
 *   STRIPE_PRICE_FREE, STRIPE_PRICE_PRO, STRIPE_PRICE_ELITE
 */
export const STRIPE_PLANS = [
  {
    id: "athlete_free",
    name: "Athlete Free",
    description: "Essential access to the ATHLYNX platform — NIL discovery, community, and basic profile.",
    priceMonthly: 0, // $0/month
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
    badge: "Free Forever",
    color: "#0066ff",
  },
  {
    id: "athlete_pro",
    name: "Athlete Pro",
    description: "Full platform access with AI recruiting, NIL deal tracking, and transfer portal intelligence.",
    priceMonthly: 1999, // $19.99/month
    priceYearly: 19188, // $191.88/yr
    features: [
      "Everything in Free",
      "AI Recruiter Tools",
      "NIL Deal Marketplace",
      "Warriors Playbook",
      "Diamond Grind Training",
      "Priority Support",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO ?? "price_1TQalOGvvjXZw2uEP2eqJJAE",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO ?? "price_1TQalOGvvjXZw2uEP2eqJJAE",
    badge: "Most Popular",
    color: "#00c2ff",
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "The complete ATHLYNX experience — white-glove NIL management, brand deals, and 1-on-1 strategy.",
    priceMonthly: 3999, // $39.99/month
    priceYearly: 38388, // $383.88/yr
    features: [
      "Everything in Pro",
      "NIL Vault (Contract Archive)",
      "Brand Deal Negotiation AI",
      "Dedicated Account Manager",
      "AI Sales Automation",
      "API Access",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ELITE ?? "price_1TQalQGvvjXZw2uEjYMwKUgW",
    stripePriceIdYearly: process.env.STRIPE_PRICE_ELITE ?? "price_1TQalQGvvjXZw2uEjYMwKUgW",
    badge: "Best Value",
    color: "#7c3aed",
  },
] as const;

export type PlanId = (typeof STRIPE_PLANS)[number]["id"];

export const CREDIT_PACKS = [
  { id: "credits_100",  name: "100 Credits",   credits: 100,  price: 999,  stripePriceId: process.env.STRIPE_PRICE_CREDITS_100  ?? "price_1TPlXLGvvjXZw2uE9BVsgXi8" },
  { id: "credits_500",  name: "500 Credits",   credits: 500,  price: 3999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_500  ?? "price_1TPlXNGvvjXZw2uEybgWAotO" },
  { id: "credits_1000", name: "1,000 Credits", credits: 1000, price: 6999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_1000 ?? "price_1TPlXPGvvjXZw2uE2UckX9uN" },
] as const;
