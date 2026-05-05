/**
 * ATHLYNX Stripe Products & Pricing Configuration
 * All prices are in USD cents.
 *
 * Live Price IDs (created April 26, 2026 — acct_1SkhxSDWqFuLp4sz):
 *   Athlete Free    → price_1TQalMGvvjXZw2uEAgeLldvx  ($0.00/month — 7-day trial)
 *   Athlete Starter → price_1TPlWnGvvjXZw2uERob8Jumv  ($9.99/month) | price_1TPlWoGvvjXZw2uE8PUwJd0Z (yearly)
 *   Athlete Pro     → price_1TSbsrGvvjXZw2uENz7ZGGud  ($19.99/month) | price_1TSbssGvvjXZw2uE1vgkuxQy (yearly)
 *   Athlete Elite   → price_1TSbstGvvjXZw2uERYqPeuTR  ($39.99/month) | price_1TSbsuGvvjXZw2uEE2GpcYXs (yearly)
 *   Athlete Champion → price_1TRP8fGvvjXZw2uEkSzl2zwi ($59.99/month)
 *   Athlete MVP     → price_1TRP8hGvvjXZw2uEeZcjmeaD  ($99.99/month)
 *   100 AI Credits  → price_1TPlWvGvvjXZw2uETBtpFhqU  ($9.99)
 *   500 AI Credits  → price_1TPlWxGvvjXZw2uEW8Ww1qi1  ($39.99)
 *   1000 AI Credits → price_1TPlWyGvvjXZw2uET83zN0aZ  ($69.99)
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
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER ?? process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "price_1TPlWnGvvjXZw2uERob8Jumv",
    stripePriceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? "price_1TPlWoGvvjXZw2uE8PUwJd0Z",
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
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO ?? process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_1TSbsrGvvjXZw2uENz7ZGGud",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "price_1TSbssGvvjXZw2uE1vgkuxQy",
    badge: "Most Popular",
    color: "#00c2ff",
    trialDays: 7,
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "The complete ATHLYNX experience — NIL management, brand deals, and 1-on-1 strategy.",
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
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ELITE ?? "price_1TSbstGvvjXZw2uERYqPeuTR",
    stripePriceIdYearly: process.env.STRIPE_PRICE_ELITE_YEARLY ?? "price_1TSbsuGvvjXZw2uEE2GpcYXs",
    badge: "Best Value",
    color: "#7c3aed",
    trialDays: 7,
  },
  {
    id: "athlete_champion",
    name: "Athlete Champion",
    description: "Advanced NIL analytics, custom athlete page, and early access to new features.",
    priceMonthly: 5999, // $59.99/month
    priceYearly: 57588, // $575.88/yr ($47.99/mo)
    features: [
      "Everything in Elite",
      "Advanced NIL Analytics",
      "Custom Athlete Page",
      "Early Access Features",
      "Priority Deal Matching",
      "Champion Badge",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_CHAMPION ?? "price_1TRP8fGvvjXZw2uEkSzl2zwi",
    stripePriceIdYearly: process.env.STRIPE_PRICE_CHAMPION_YEARLY ?? "price_1TRP8fGvvjXZw2uEkSzl2zwi",
    badge: "Champion Tier",
    color: "#f59e0b",
    trialDays: 7,
  },
  {
    id: "athlete_mvp",
    name: "Athlete MVP",
    description: "1-on-1 strategy, VIP network, unlimited credits, and white-glove service.",
    priceMonthly: 9999, // $99.99/month
    priceYearly: 95988, // $959.88/yr ($79.99/mo)
    features: [
      "Everything in Champion",
      "1-on-1 Strategy Sessions",
      "VIP Athlete Network",
      "Unlimited AI Credits",
      "White-Glove Service",
      "MVP Badge & Verified",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_MVP ?? "price_1TRP8hGvvjXZw2uEeZcjmeaD",
    stripePriceIdYearly: process.env.STRIPE_PRICE_MVP_YEARLY ?? "price_1TRP8hGvvjXZw2uEeZcjmeaD",
    badge: "MVP — Top Tier",
    color: "#ef4444",
    trialDays: 7,
  },
  {
    id: "pro_teams",
    name: "Pro Teams",
    description: "Full platform access for professional sports organizations — NFL, NBA, MLB, NHL, MLS, WNBA, Pro Soccer, Pro Baseball. Roster management, contract tracking, AI scouting, training, and brand deals.",
    priceMonthly: 250000, // $2,500/month
    priceYearly: 2400000, // $24,000/yr ($2,000/mo)
    features: [
      "Up to 100 roster slots",
      "Contract tracking & cap management",
      "AI Scouting Intelligence",
      "Team messaging & scheduling",
      "Training & performance logs",
      "Brand deals & NIL management",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "API access",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_TEAMS ?? "price_1TTaLGGvvjXZw2uE1SEgjs9h",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_TEAMS_YEARLY ?? "price_1TTaLIGvvjXZw2uEsFcEfdWF",
    badge: "Pro Teams",
    color: "#ef4444",
    trialDays: 30,
  }
] as const;

export type PlanId = (typeof STRIPE_PLANS)[number]["id"];

export const CREDIT_PACKS = [
  {
    id: "credits_100",
    name: "100 Credits",
    description: "100 AI credits — use for AI Trainers, Teammates & Companions.",
    credits: 100,
    price: 999,   // $9.99
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_100 ?? "price_1TPlWvGvvjXZw2uETBtpFhqU",
  },
  {
    id: "credits_500",
    name: "500 Credits",
    description: "500 AI credits — best value for active users.",
    credits: 500,
    price: 3999,  // $39.99
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_500 ?? "price_1TPlWxGvvjXZw2uEW8Ww1qi1",
  },
  {
    id: "credits_1000",
    name: "1,000 Credits",
    description: "1,000 AI credits — power users and teams.",
    credits: 1000,
    price: 6999,  // $69.99
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_1000 ?? "price_1TPlWyGvvjXZw2uET83zN0aZ",
  },
] as const;
