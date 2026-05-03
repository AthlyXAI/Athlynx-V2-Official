# ATHLYNX ATHLYNXAI MASTER REFERENCE FILE
## Last Updated: Sunday, May 3, 2026 — Session 17
## Session Summary (May 3 2026 — SESSION 17): GitGuardian security alert resolved — exposed Stripe Webhook Secret rotated, old endpoint deleted, new endpoint created (we_1TT8LBGvvjXZw2uEEIRxkfyM), new secret deployed to Vercel and redeployed to production. Vercel token (manus-deploy-final) secured — confirmed not stored in sandbox or git history. Master reference and S17 handoff written and pushed. Handoff: ATHLYNXAI_HANDOFF_REPORT_MAY3_2026_S17.md
## Last Updated: Sunday, May 3, 2026 — Session 16
## Session Summary (May 3 2026 — SESSION 16): STRIPE_WEBHOOK_SECRET fixed and deployed to production. Stripe monetization loop now fully live — subscriptions activate automatically after payment. Session 16 handoff written. Handoff: ATHLYNXAI_HANDOFF_REPORT_MAY3_2026_S16.md
## Last Updated: Sunday, May 3, 2026 — Session 13 (Social Media + Autonomous Stack)
## Session Summary (May 3 2026 — SESSION 13): Social media posted to all channels (Buffer + Zapier). Gemini API updated (AIzaSyCrriagmLHcCwzqBkt5VBH2A4UyPTI7ydg, Project 752093847574). Jira connected (chaddozier75.atlassian.net, TC project). Confluence + Trello enabled. Employee Portal built (/employee-portal). Full autonomous funnel wired. Admin bypass added to paywall. Mobile hamburger rebuilt full-screen. All team accounts seeded as admin. Operating budget PDF created. Autonomous Operations Blueprint created. Handoff: ATHLYNXAI_HANDOFF_REPORT_MAY3_2026_S13.md
## Last Updated: Sunday, May 3, 2026 — Session 14

## Session Summary (May 3 2026 — SESSION 14):
- **DB Seeding:** Chad, Glenn, Andy, Lee, Jimmy all seeded as `admin` in Neon DB.
- **Trial Reset:** Chad's trial reset to NULL (fresh 7-day countdown).
- **Email Alerts:** Signup alerts now use AWS SES and send to all 5 of Chad's emails.
- **Team Credentials:** Sent full email credentials and setup instructions (iOS/Android/Desktop) to Glenn, Jimmy, Lee, and Andy.
- **Signup Flow:** Rebuilt `/signup` as a full, dedicated form (name, email, phone, sport, school, year, password) with social auth and trial gating.
- **Mobile Nav:** `MobileBottomNav` (Home, Reels, Chat, NIL, Profile) added to ALL 154 platform pages.
- **Hamburger Menus:** Fixed `PlatformLayout` to show ALL apps in a 4-column grid.
- **Sport Pages:** Fixed all `/signin` links to point to `/signup`. Built dedicated `/baseball` public landing page.
- **Reels:** Built full-screen vertical video feed (`/reels`) — Facebook Reels style with swipe, like, comment, share, save. Wired into bottom nav.
- **Handoff:** ATHLYNXAI_HANDOFF_REPORT_MAY3_2026_S14.md

## NEVER RUN manus-config save-config — it overwrites connector settings.
## READ THIS FILE AT THE START OF EVERY NEW SESSION

---

## UNIFIED IDENTITY — 1 PERSON · 1 COMPANY · 1 AI · 1 EMAIL · 1 PHONE · 1 BANK

| Item | Value |
|------|-------|
| **Person** | Chad A. Dozier Sr. — Founder & CEO |
| **Company** | Dozier Holdings Group (DHG) — Parent Company |
| **Primary Email** | cdozier14@athlynx.ai |
| **Phone** | +1-601-498-5282 (USA/MS) |
| **Address** | HQ: 12306 Lake Portal Drive, Houston, TX 77047 | SE: 831 West 28th Street, Laurel, MS 39440 |
| **Website** | athlynx.ai |
| **GitHub Account** | chaddozier75-cmd |
| **GitHub Repo** | AthlyXAI/Athlynx-V2-Official |
| **Bank** | 1 business account — shared across all subsidiaries |

> **Backup emails (READ-ONLY — no accounts, no repos, no services):**
> chaddozier75@gmail.com · chad.dozier@icloud.com · cdozier@dozierholdingsgroup.com · cdozier14@dozierholdingsgroup.com.mx

---

## AI AGENT STACK — ALL UNDER ONE ACCOUNT

| Agent | Role | Account |
|-------|------|---------|
| **AI Agent** | Primary autonomous agent — builds, deploys, manages | cdozier14@athlynx.ai |
| **Google Gemini** | Language + multimodal AI — use via OpenAI SDK with gemini-2.5-flash | cdozier14@athlynx.ai (Google Workspace) |
| **Claude** | Reasoning + document AI — secondary | cdozier14@athlynx.ai |

> **GEMINI NOTE:** Direct REST API is on free tier (quota exhausted daily). Always use via pre-configured OpenAI SDK: `model='gemini-2.5-flash'`

---

## LAYER CAKE ARCHITECTURE (Session 4 — GTC 2026 Jensen Huang Vision)

| Layer | Component | Status |
|-------|-----------|--------|
| **Layer 1** | Neon PostgreSQL (primary) + PlanetScale (auto-failover) | ✅ LIVE |
| **Layer 2** | Gemini 2.5 Flash via aiCommandRouter — runs all apps | ✅ LIVE |
| **Layer 3** | Autonomous Actions — auto-enrich, auto-email, auto-post | ✅ LIVE |
| **Layer 4** | Mobile Command — AIAssistantButton, ReverseFunnel, PWA v2.0 | ✅ LIVE |

---

## CRITICAL PREFERENCES — NEVER IGNORE THESE

1. **ALL PDF and document text must be 20pt or larger, bold, black** — no exceptions.
2. **Always push ALL code changes to GitHub immediately** — never leave code only in the sandbox.
3. **Never change anything on the live site** without explicit instruction.
4. **Show work step by step** — Chad does not trust work he cannot verify.
5. **Do not lie or say something is done when it is not.**
6. **Do not repeat the same mistake twice.**
7. **Always commit and push to GitHub before ending any task.**
8. **NEVER run manus-config save-config** — it overwrites connector settings and disables Vercel and other connectors.
9. **NO SCREENSHOTS, NO PLACEHOLDERS, NO MOCK DATA, NO EMPTY SHELLS** — ever. Use real logos, real data, real content.

---

## TEAM — PERSONAL EMAILS & ROLES

| Name | Role | Personal Email | Platform Email |
|------|------|---------------|----------------|
| Chad A. Dozier Sr. | Founder & CEO | — | cdozier14@athlynx.ai |
| Glenn Tse | CFO / COO | glenn.tse@gmail.com | gtse@athlynx.ai |
| Lee Marshall | VP Sales | leronious@gmail.com | lmarshall@athlynx.ai |
| Jimmy Boyd | VP Real Estate | jboydbamabayou@yahoo.com | jboyd@athlynx.ai |
| Andrew Kustes | VP Technology | andrewkustes1974@gmail.com | akustes@athlynx.ai |
| David Ford | Trusted Advisor | david.ford@aocmedicalllc.com | dford@athlynx.ai |

---

## THREE BUSINESS EMAIL SYSTEMS

| Domain | Password | Purpose |
|--------|----------|---------|
| @athlynx.ai | Athlynx2026! | Main platform |
| @dozierholdingsgroup.com.mx | Dozier1975! | DHG Mexico |
| @dozierholdingsgroup.com | ToTheMoon25! | DHG US |

---

## COMPANIES & BRANDS

| Company | Domain | Purpose |
|---------|--------|---------|
| ATHLYNX AI | athlynx.ai | Main athlete platform |
| Dozier Holdings Group | dozierholdingsgroup.com | Parent holding company |
| Diamond Grind Baseball | athlynx.ai/baseball | Baseball training platform |
| Warriors Playbook | athlynx.ai/warriors-playbook | Football platform |
| DHG Empire | athlynx.ai/dhg | Holdings group page |
| **ConCreator™** | **athlynx.ai/softmor** | **B2B Data Intelligence & AI Credits** |

---

## CONCREATOR™ — B2B AI SERVICES (Session 4 Addition)

| Tier | Price/Machine/Mo | AI Credits | Stripe Price ID |
|------|-----------------|------------|-----------------|
| Pulse | $297 | 500 | price_1TSno2RjBH07kRLYhcLTOiWk |
| Insight | $597 | 2,000 | price_1TSno2RjBH07kRLY4TxrGTu9 |
| **Command ★** | **$997** | **5,000** | **price_1TSno2RjBH07kRLYMSX2RcDm** |
| Enterprise | $1,997 | Unlimited | price_1TSno2RjBH07kRLYIX9Q1qR8 |

**Product ID:** prod_URh8TjRyhtfthD
**First client:** CementCo Technologies (Telly Walsworth) — Command tier, 10 machines = $9,970/mo
**Revenue flows to:** DHG bank account via Stripe LIVE mode
**IP owned by:** Dozier Holdings Group & Softmor Inc.

---

## PRO TEAMS STRIPE PRICES (Session 4 Addition)

| Billing | Price | Stripe ID |
|---------|-------|-----------|
| Monthly | $2,500/mo | price_1TSnkERjBH07kRLYYlitSqLm |
| Yearly | $24,000/yr | price_1TSnkMRjBH07kRLYf8UZwzKf |

---

## PLATFORM REPOSITORY — ONE REPO ONLY

| Item | Value |
|------|-------|
| **Repo** | https://github.com/AthlyXAI/Athlynx-V2-Official |
| **Branch** | main — auto-deploys to Vercel on every push |
| **Rule** | ALWAYS push here. No other repos. No exceptions. |

---

## LIVE DEPLOYMENT

| Service | URL / Details |
|---------|--------------|
| **Live Site** | https://athlynx.ai |
| **Vercel Project** | athlynx-platform (chad-a-doziers-projects) |
| **Vercel Dashboard** | https://vercel.com/chad-a-doziers-projects/athlynx-platform |
| **GitHub Main Branch** | main — auto-deploys to Vercel on every push |

---

## DATABASE — DUAL FAILOVER (NEVER LOSES CONNECTION)

| DB | Role | Env Var |
|----|------|---------|
| **Neon PostgreSQL** | Primary — 34 tables | DATABASE_URL |
| **PlanetScale** | Auto-failover backup | PLANETSCALE_DATABASE_URL |

Auto-failover code in `server/db.ts` — tries Neon first, falls back to PlanetScale automatically.

---

## BUFFER API — CRITICAL (NEVER CHANGE THIS)

| Item | Value |
|------|-------|
| **Token (AthlynXAI)** | kB3LprBJtIH1-1F1v_DQcjOIRFdX13YFQVPXrpz9gD_ |
| **Org ID** | 69e5eb4fa8900ccfe436f53a |
| **Expires** | May 2, 2027 |
| **API Endpoint** | https://api.buffer.com/graphql |

**CORRECT GraphQL mutation (NEVER use fragments or scheduledAt: null):**
```graphql
mutation CreatePost($channelId: String!, $text: String!) {
  createPost(input: {
    channelId: $channelId
    text: $text
    schedulingType: automatic
    mode: shareNow
  }) {
    __typename
  }
}
```
Success = `PostActionSuccess`. **NEVER use `... on Post { id }` — return type is PostActionPayload.**

**All 10 Channel IDs:**
- Instagram chad_dozier: `69e6cca6031bfa423c26478e`
- LinkedIn: `69e6cd3f031bfa423c264c63`
- YouTube: `69e6cd7c031bfa423c264dd5`
- TikTok chadadozierdozier: `69e6cd99031bfa423c264e8c` *(video only)*
- Google Business: `69e6cdf3031bfa423c2650a8`
- X/Twitter ChadADozier2: `69e6ce05031bfa423c265121`
- TikTok cdozier75: `69e6ce56031bfa423c2652c8` *(video only)*
- Instagram chaddozier14: `69e6ce77031bfa423c265389`
- Facebook Athlynx Ecosystem: `69f29ddf5c4c051afaf3e12e`
- Facebook Chad Allen Dozier Sr: `69f3f06f5c4c051afaf9eeb7`

---

## REAL ATHLYNX LOGO

**File in repo:** `/client/public/athlynx-icon.png` — this is the REAL logo (phone + blue arrow + AthlynxAI text)
**Live URL:** `https://athlynx.ai/athlynx-icon.png`
**Use this everywhere. Never use athlynx-sports-brand.png (was a screenshot — now fixed).**

---

## GRAVATAR

- **Chad's Gravatar email:** `chaddozier75@gmail.com` (not cdozier14@athlynx.ai)
- **Gravatar URL:** `https://www.gravatar.com/avatar/400fe18dbc29cd824f277af7e41710b0?s=200&d=mp`
- **DB updated:** Chad's avatarUrl in Neon DB set to this URL

---

## CONNECTOR APPS — ALL UNDER cdozier14@athlynx.ai

| Connector | Purpose |
|-----------|----------|
| GitHub | Code — AthlyXAI/Athlynx-V2-Official |
| Vercel | Deployment — athlynx.ai |
| Stripe | Payments + subscriptions (LIVE mode) |
| Supabase | Database |
| Cloudflare | DNS + CDN + security |
| Jotform | Waitlist + forms |
| Fireflies | Meeting transcription |
| Gmail | Email |
| Google Calendar | Scheduling |
| Google Drive | File storage |
| Outlook Mail | Secondary email (backup) |
| Outlook Calendar | Secondary calendar (backup) |
| Instagram | Social media |
| Meta Ads Manager | Advertising |
| Zapier | Automation workflows |
| Neon | Postgres database (primary) |
| PlanetScale | Postgres database (auto-failover backup) |
| Twilio | SMS notifications (replaced by AWS SNS — LIVE) |
| AWS | Cloud infrastructure — SES LIVE, SNS LIVE |
| OpenAI | AI features |
| Google Cloud | OAuth + APIs + Gemini |
| Buffer | Social media scheduling (AthlynXAI token) |

---

## PLATFORM PAGES — ALL LIVE ROUTES

| Page | URL |
|------|-----|
| Homepage | https://athlynx.ai |
| Login | https://athlynx.ai/login |
| Sign Up | https://athlynx.ai/signup |
| Dashboard / Portal | https://athlynx.ai/dashboard |
| Profile | https://athlynx.ai/profile |
| Social Command Center | https://athlynx.ai/social-command |
| Pricing | https://athlynx.ai/pricing |
| AI Wizards | https://athlynx.ai/ai-wizards |
| NIL Portal | https://athlynx.ai/nil-portal |
| Transfer Portal | https://athlynx.ai/transfer-portal |
| Founders | https://athlynx.ai/founders |
| Diamond Grind | https://athlynx.ai/baseball |
| Warriors Playbook | https://athlynx.ai/warriors-playbook |
| AI Recruiter | https://athlynx.ai/ai-recruiter |
| NIL Vault | https://athlynx.ai/nil-vault |
| Faith | https://athlynx.ai/faith |
| AI Sales | https://athlynx.ai/ai-sales |
| Admin CRM | https://athlynx.ai/admin |
| Marketplace | https://athlynx.ai/marketplace |
| AI Content | https://athlynx.ai/ai-content |
| NIL Messenger | https://athlynx.ai/messenger |
| DHG Empire | https://athlynx.ai/dhg |
| Softmor (+ ConCreator™) | https://athlynx.ai/softmor |
| Athlete Life Hub | https://athlynx.ai/athlete-life-hub |
| NIL Jobs | https://athlynx.ai/nil-jobs |
| Athlete Calendar | https://athlynx.ai/athlete-calendar |
| Elite Events | https://athlynx.ai/elite-events |
| X-Factor Feed | https://athlynx.ai/x-factor |
| Partners | https://athlynx.ai/partners |
| Billing | https://athlynx.ai/billing |
| Investor Hub | https://athlynx.ai/investor-hub |
| Investor Deck | https://athlynx.ai/investor-deck |
| Pro Teams | https://athlynx.ai/pro-teams |
| Browse Athletes | https://athlynx.ai/browse-athletes |
| Reels | https://athlynx.ai/reels |

---

## COST & INVESTMENT SUMMARY

| Item | Amount |
|------|--------|
| Total out-of-pocket spend (Dec 2025 – Apr 2026) | $50,000+ |
| AI subscription charges | $20,000+ (documented in Chase dispute) |
| Claude AI subscription | Included in total |
| Vercel, GitHub, Cloudflare, Stripe, Supabase, Neon, Twilio, Zapier, Railway, AWS, PlanetScale, Netlify, domains | Included in total |
| Traditional team equivalent cost | $2,074,000 (12 people, 17 months) |
| Professional invoice value (Invoice DHG-2026-001) | $913,250 |
| **Savings achieved** | **$1,800,000+** |

---

## NON-NEGOTIABLE RULES

1. **1 email everywhere:** cdozier14@athlynx.ai
2. **1 phone everywhere:** +1-601-498-5282
3. **1 repo:** AthlyXAI/Athlynx-V2-Official
4. **1 AI agent stack:** Manus + Gemini + Claude — all same account
5. **Backup emails are READ-ONLY** — no accounts, no repos, no services on them
6. **1 bank account** — all subsidiaries route through DHG parent
7. **No duplicates** — if something exists twice, delete the older one immediately
8. **No breaking changes** — never delete working code without a replacement
9. **Always push to main** — never create new branches without reason
10. **Always commit and push before ending any task**
11. **NEVER run `manus-config save-config`** — it disables ALL connectors in the Manus UI
12. **NO SCREENSHOTS, NO PLACEHOLDERS, NO MOCK DATA** — use real logos, real data, real content always

---

## HOW TO USE THIS FILE

At the start of every new session:

> **"Read ATHLYNXAI_MASTER_REFERENCE.md from GitHub before doing anything. https://github.com/AthlyXAI/Athlynx-V2-Official/blob/main/ATHLYNXAI_MASTER_REFERENCE.md — Verify: https://github.com/AthlyXAI/Athlynx-V2-Official/commits/main — Handoff Report: https://github.com/AthlyXAI/Athlynx-V2-Official/blob/main/ATHLYNXAI_HANDOFF_REPORT_MAY3_2026_S14.md"**

---

*This file is the single source of truth for all ATHLYNX AI platform work.*
*Iron Sharpens Iron — Proverbs 27:17*
*Chad A. Dozier Sr. — Founder & CEO, ATHLYNX AI*
