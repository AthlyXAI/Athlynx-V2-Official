/**
 * ATHLYNX Stripe Products & Pricing Configuration
 * All prices are in USD cents.
 * Price IDs are hardcoded from the live Stripe account.
 */
export const STRIPE_PLANS = [
  {
    id: "athlete_starter",
    name: "Athlete Starter",
    description: "Essential access to the ATHLYNX platform — NIL discovery, messaging, and community features.",
    priceMonthly: 999, // $9.99/mo
    priceYearly: 9900, // $99/yr
    features: [
      "Basic Athlete Profile",
      "NIL Deal Discovery",
      "Community Messaging",
      "Transfer Portal Access",
      "Diamond Grind Training",
      "7-Day Free Trial",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "price_1TOLaoGvvjXZw2uEESpi5UxO",
    stripePriceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? "price_1TOLaqGvvjXZw2uEC1NCRcO6",
    badge: "Best for Beginners",
    color: "#0066ff",
  },
  {
    id: "athlete_pro",
    name: "Athlete Pro",
    description: "Full platform access with AI recruiting, NIL deal tracking, and transfer portal intelligence.",
    priceMonthly: 4999, // $49.99/mo
    priceYearly: 49900, // $499/yr
    features: [
      "Everything in Starter",
      "AI Recruiter Tools",
      "NIL Deal Marketplace",
      "Warriors Playbook",
      "AI Sales Automation",
      "Priority Support",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_1TOLasGvvjXZw2uEsjiOsuwy",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "price_1TOLauGvvjXZw2uE9t2xdMsf",
    badge: "Most Popular",
    color: "#00c2ff",
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "The complete ATHLYNX experience — white-glove NIL management, brand deals, and 1-on-1 strategy.",
    priceMonthly: 9999, // $99.99/mo
    priceYearly: 99900, // $999/yr
    features: [
      "Everything in Pro",
      "NIL Vault (Contract Archive)",
      "Brand Deal Negotiation AI",
      "Dedicated Account Manager",
      "White-label Branding",
      "API Access",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ELITE_MONTHLY ?? "price_1TOLawGvvjXZw2uEd9VlVziX",
    stripePriceIdYearly: process.env.STRIPE_PRICE_ELITE_YEARLY ?? "price_1TOLayGvvjXZw2uE4eUhWBgs",
    badge: "Best Value",
    color: "#7c3aed",
  },
] as const;

export type PlanId = (typeof STRIPE_PLANS)[number]["id"];

export const CREDIT_PACKS = [
  { id: "credits_100", name: "100 Credits", credits: 100, price: 999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_100 ?? "" },
  { id: "credits_500", name: "500 Credits", credits: 500, price: 3999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_500 ?? "" },
  { id: "credits_1000", name: "1,000 Credits", credits: 1000, price: 6999, stripePriceId: process.env.STRIPE_PRICE_CREDITS_1000 ?? "" },
] as const;
