/**
 * ATHLYNX Stripe Products & Pricing Configuration
 * All prices are in USD cents.
 * Price IDs are hardcoded from the live Stripe account (created April 24, 2026).
 */
export const STRIPE_PLANS = [
  {
    id: "athlete_starter",
    name: "Athlete Starter",
    description: "Essential access to the ATHLYNX platform — NIL discovery, messaging, and community features.",
    priceMonthly: 999, // $9.99/mo
    priceYearly: 9588, // $95.88/yr
    features: [
      "Basic Athlete Profile",
      "NIL Deal Discovery",
      "Community Messaging",
      "Transfer Portal Access",
      "Diamond Grind Training",
      "7-Day Free Trial",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "price_1TPlXCGvvjXZw2uE9zCKwkHU",
    stripePriceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? "price_1TPlXDGvvjXZw2uEPF9vSEb2",
    badge: "Best for Beginners",
    color: "#0066ff",
  },
  {
    id: "athlete_pro",
    name: "Athlete Pro",
    description: "Full platform access with AI recruiting, NIL deal tracking, and transfer portal intelligence.",
    priceMonthly: 4999, // $49.99/mo
    priceYearly: 47988, // $479.88/yr
    features: [
      "Everything in Starter",
      "AI Recruiter Tools",
      "NIL Deal Marketplace",
      "Warriors Playbook",
      "AI Sales Automation",
      "Priority Support",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_1TPlXFGvvjXZw2uEDrmBKYzT",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "price_1TPlXGGvvjXZw2uECx8YfYME",
    badge: "Most Popular",
    color: "#00c2ff",
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "The complete ATHLYNX experience — white-glove NIL management, brand deals, and 1-on-1 strategy.",
    priceMonthly: 9999, // $99.99/mo
    priceYearly: 95988, // $959.88/yr
    features: [
      "Everything in Pro",
      "NIL Vault (Contract Archive)",
      "Brand Deal Negotiation AI",
      "Dedicated Account Manager",
      "White-label Branding",
      "API Access",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ELITE_MONTHLY ?? "price_1TPlXIGvvjXZw2uEA7fsU5Cc",
    stripePriceIdYearly: process.env.STRIPE_PRICE_ELITE_YEARLY ?? "price_1TPlXJGvvjXZw2uEdDcbMrNh",
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
