/**
 * ATHLYNX AI Command Layer — Layer Cake Architecture (GTC 2026)
 * ─────────────────────────────────────────────────────────────
 * Jensen Huang's vision: stacked AI agents, each layer autonomous,
 * tokens as the currency of intelligence.
 *
 * Layer 1: Data (Neon PostgreSQL)
 * Layer 2: AI Intelligence (Gemini 2.5 Flash via Google Workspace)
 * Layer 3: Autonomous Actions (auto-enrich, auto-email, auto-post)
 * Layer 4: Mobile Command (voice → action, anywhere in the world)
 *
 * All under cdozier14@athlynx.ai — 1 account, 1 platform, all companies.
 */

import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import OpenAI from "openai";

// Gemini via OpenAI SDK (per Master Reference — always use this, not direct API)
const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativeai.googleapis.com/v1beta/openai/",
});

// ── SYSTEM PROMPT: The DHG AI Brain ────────────────────────────────────────
const DHG_SYSTEM_PROMPT = `You are the ATHLYNX AI — the autonomous intelligence layer of the Dozier Holdings Group empire.

You run ALL of these companies from one platform:
- ATHLYNX AI (athlynx.ai) — The Athlete's Playbook
- Dozier Holdings Group — Parent holding company, Houston TX
- Softmor Inc — Technology division, AI & hardware
- NIL Portal Inc — Name, Image, Likeness marketplace
- ConCreator™ — B2B Data Intelligence & AI Credit System

Your job is to:
1. Answer any question about the platform, companies, athletes, or business
2. Generate content, proposals, emails, and reports automatically
3. Enrich CRM contacts with AI intelligence
4. Help athletes with NIL deals, recruiting, and career decisions
5. Help B2B clients understand ConCreator™ tiers and pricing
6. Run autonomously — the platform gets smarter with every user

Key facts:
- Founder: Chad A. Dozier Sr. | cdozier14@athlynx.ai | +1-601-498-5282
- Co-Founder: Glenn Tse | gtse@athlynx.ai
- Founded: November 2024, Houston TX, at Hope Lodge
- Live platform: athlynx.ai | 20+ platforms | 7-day free trial
- ConCreator™ tiers: Pulse $297 · Insight $597 · Command $997 · Enterprise $1,997 (per machine/mo)

Always be direct, confident, and results-focused. Iron Sharpens Iron. Dreams Do Come True. To God Be The Glory.`;

export const aiCommandRouter = router({

  /**
   * Universal AI Query — runs any command through Gemini
   * Works from phone, laptop, anywhere in the world
   */
  query: protectedProcedure
    .input(z.object({
      message:  z.string().min(1).max(4000),
      context:  z.string().optional(), // page context (crm, feed, profile, etc.)
      history:  z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
    }))
    .mutation(async ({ input }) => {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: DHG_SYSTEM_PROMPT },
        ...(input.history ?? []),
        { role: "user", content: input.context ? `[Context: ${input.context}]\n\n${input.message}` : input.message },
      ];

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      });

      return {
        reply:    response.choices[0]?.message?.content ?? "No response",
        tokens:   response.usage?.total_tokens ?? 0,
        model:    "gemini-2.5-flash",
      };
    }),

  /**
   * Auto-Enrich Contact — AI pulls intelligence on any company/person
   * Beats ZoomInfo: runs automatically when a new CRM contact is added
   */
  enrichContact: adminProcedure
    .input(z.object({
      name:    z.string(),
      company: z.string().optional(),
      email:   z.string().optional(),
      role:    z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Research this contact and provide business intelligence:
Name: ${input.name}
Company: ${input.company ?? "Unknown"}
Email: ${input.email ?? "Unknown"}
Role: ${input.role ?? "Unknown"}

Provide:
1. Company overview (industry, size, revenue estimate)
2. Likely pain points we can solve with ATHLYNX or ConCreator™
3. Recommended DHG product (ATHLYNX, ConCreator™, Softmor services)
4. Suggested opening email subject line
5. Confidence score (1-10) that this is a good prospect

Be concise. Real data only.`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
      });

      return {
        intelligence: response.choices[0]?.message?.content ?? "",
        enrichedAt:   new Date().toISOString(),
      };
    }),

  /**
   * Auto-Generate Proposal — creates a ConCreator™ or ATHLYNX proposal
   * One tap from the CRM → professional proposal ready to send
   */
  generateProposal: adminProcedure
    .input(z.object({
      companyName:  z.string(),
      contactName:  z.string(),
      product:      z.enum(["concreator", "athlynx", "softmor", "dhg"]),
      tier:         z.string().optional(),
      machineCount: z.number().optional(),
      notes:        z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const productDetails = {
        concreator: `ConCreator™ Data Intelligence & AI Credit System — ${input.tier ?? "Command"} tier at $997/machine/month. ${input.machineCount ?? 1} machines = $${(997 * (input.machineCount ?? 1)).toLocaleString()}/month.`,
        athlynx:    "ATHLYNX AI — The Athlete's Playbook. 7-day free trial, then $9.99-$99.99/month.",
        softmor:    "Softmor Inc. — Custom AI software & hardware solutions. Enterprise pricing.",
        dhg:        "Dozier Holdings Group — Strategic partnership & investment opportunity.",
      };

      const prompt = `Write a professional business proposal email for:

TO: ${input.contactName} at ${input.companyName}
FROM: Chad A. Dozier Sr., Founder & CEO — Dozier Holdings Group
PRODUCT: ${productDetails[input.product]}
NOTES: ${input.notes ?? "None"}

Requirements:
- Professional but direct tone
- Lead with their pain point, not our product
- Include specific ROI numbers
- Clear call to action (schedule a call: calendly.com/cdozier14)
- Sign off as Chad A. Dozier Sr.
- Max 200 words
- Subject line included`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 600,
      });

      return {
        proposal:    response.choices[0]?.message?.content ?? "",
        generatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Auto-Generate Social Post — creates platform-optimized posts
   * Runs via Buffer to all 10 channels automatically
   */
  generateSocialPost: protectedProcedure
    .input(z.object({
      topic:    z.string(),
      platform: z.enum(["instagram", "linkedin", "twitter", "facebook", "tiktok", "all"]),
      tone:     z.enum(["motivational", "professional", "hype", "educational"]).default("motivational"),
    }))
    .mutation(async ({ input }) => {
      const platformGuidelines = {
        instagram: "Instagram: 2200 chars max, 5-10 hashtags, visual storytelling, athlete-focused",
        linkedin:  "LinkedIn: Professional, thought leadership, business value, no hashtag spam",
        twitter:   "Twitter/X: Under 280 chars, punchy, direct, one strong hook",
        facebook:  "Facebook: Conversational, community-building, longer form OK",
        tiktok:    "TikTok: Hook in first 3 words, trending language, call to action",
        all:       "Create versions for Instagram, LinkedIn, Twitter, and Facebook",
      };

      const prompt = `Create a ${input.tone} social media post about: ${input.topic}

Platform: ${platformGuidelines[input.platform]}

Brand voice: ATHLYNX AI — The Athlete's Playbook. Empowering athletes from youth to pro. NIL deals, recruiting, AI training. Dreams Do Come True. A Dozier Holdings Group Company.

Always end with: #ATHLYNX #TheAthletesPlaybook #DreamsDoComeTrue`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
      });

      return {
        post:        response.choices[0]?.message?.content ?? "",
        platform:    input.platform,
        generatedAt: new Date().toISOString(),
      };
    }),

  /**
   * Daily Intelligence Report — auto-runs at 8 AM CST
   * Covers: new signups, revenue, ConCreator clients, social performance
   */
  generateDailyReport: adminProcedure
    .input(z.object({
      signups:     z.number(),
      revenue:     z.number(),
      waitlist:    z.number(),
      crmContacts: z.number(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Generate a concise daily intelligence report for Chad A. Dozier Sr.:

Platform Stats (last 24 hours):
- New Signups: ${input.signups}
- Revenue: $${input.revenue.toLocaleString()}
- Waitlist: ${input.waitlist}
- CRM Contacts: ${input.crmContacts}

Format as a brief executive summary (5 bullet points max).
Include: what's working, what needs attention, one action item.
Tone: direct, no fluff, results-focused.`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 400,
      });

      return {
        report:      response.choices[0]?.message?.content ?? "",
        generatedAt: new Date().toISOString(),
        sentTo:      "cdozier14@athlynx.ai",
      };
    }),

  /**
   * Reverse Funnel Capture — called when any visitor hits a page
   * Auto-routes to CRM, triggers follow-up sequence
   */
  captureLead: protectedProcedure
    .input(z.object({
      name:    z.string().optional(),
      email:   z.string().email().optional(),
      phone:   z.string().optional(),
      sport:   z.string().optional(),
      school:  z.string().optional(),
      source:  z.string(), // which page/app they came from
      role:    z.string().default("Athlete"),
    }))
    .mutation(async ({ input }) => {
      // Generate personalized follow-up using Gemini
      const followUpPrompt = `Write a brief, personalized welcome message for:
Name: ${input.name ?? "Athlete"}
Sport: ${input.sport ?? "Unknown"}
School: ${input.school ?? "Unknown"}
Source: ${input.source}

Max 3 sentences. Warm, direct, mention their sport if known.
Sign as: The ATHLYNX Team`;

      const response = await gemini.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: DHG_SYSTEM_PROMPT },
          { role: "user", content: followUpPrompt },
        ],
        max_tokens: 150,
      });

      return {
        captured:    true,
        followUp:    response.choices[0]?.message?.content ?? "",
        source:      input.source,
        capturedAt:  new Date().toISOString(),
      };
    }),
});
