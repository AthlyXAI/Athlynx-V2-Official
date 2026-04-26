import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { users, creditTransactions } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

// Credit costs per AI action (in credits)
const CREDIT_COSTS: Record<string, number> = {
  generateBrandPitch: 15,
  analyzeDeal: 10,
  optimizeProfile: 10,
  generateCoachEmail: 8,
  generateCaption: 5,
  generateBio: 8,
  generateContentPlan: 12,
  robotChat: 5,
  getRecruitingAdvice: 10,
  generateTrainingPlan: 10,
  wizardAdvice: 10,
  scheduleToBuffer: 3,   // social post scheduling
};

/**
 * Deduct credits before running an AI action.
 * Throws FORBIDDEN if balance is insufficient.
 * Writes an audit row to credit_transactions (non-blocking).
 */
async function deductCredits(userId: number, action: string): Promise<number> {
  const cost = CREDIT_COSTS[action] ?? 5;
  const db = await getDb();
  if (!db) return cost;
  const [user] = await db.select({ credits: users.credits }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return cost;
  if ((user.credits ?? 0) < cost) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Insufficient credits. This action costs ${cost} credits. You have ${user.credits ?? 0} credits. Purchase more credits to continue.`,
    });
  }
  await db.update(users).set({ credits: sql`${users.credits} - ${cost}` }).where(eq(users.id, userId));
  const balanceAfter = (user.credits ?? 0) - cost;
  // Audit log — non-blocking, never fail the AI call over a log write
  db.insert(creditTransactions).values({
    userId,
    type: "deduction",
    amount: -cost,
    balanceAfter,
    description: `AI action: ${action}`,
    aiAction: action,
  }).catch((e) => console.warn(`[Credits] Audit log failed for ${action}:`, e?.message));
  return cost;
}

export const aiRouter = router({
  // AI SALES — Brand pitch & deal analysis
  generateBrandPitch: protectedProcedure
    .input(z.object({
      athleteName: z.string(),
      sport: z.string(),
      school: z.string().optional(),
      followers: z.number().optional(),
      brandName: z.string(),
      brandCategory: z.string(),
      dealValue: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateBrandPitch");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an elite NIL (Name, Image, Likeness) deal strategist for college athletes. 
You write compelling, professional brand partnership pitches that convert. 
Keep responses concise, punchy, and results-focused. Format with clear sections.`,
          },
          {
            role: "user",
            content: `Write a professional brand partnership pitch for:
- Athlete: ${input.athleteName}
- Sport: ${input.sport}
- School: ${input.school ?? "College Athlete"}
- Social Following: ${input.followers?.toLocaleString() ?? "Growing"} followers
- Brand: ${input.brandName} (${input.brandCategory})
${input.dealValue ? `- Target Deal Value: $${input.dealValue.toLocaleString()}` : ""}

Include: Opening hook, athlete value proposition, brand alignment, deliverables, and a strong close. Keep it under 300 words.`,
          },
        ],
      });
      return { pitch: String(response.choices[0].message.content ?? "") };
    }),

  analyzeDeal: protectedProcedure
    .input(z.object({
      brandName: z.string(),
      dealValue: z.number(),
      deliverables: z.string(),
      athleteFollowers: z.number().optional(),
      sport: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "analyzeDeal");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are an expert NIL deal analyst. Evaluate deals objectively and provide actionable insights. Be direct and specific.",
          },
          {
            role: "user",
            content: `Analyze this NIL deal:
- Brand: ${input.brandName}
- Offer: $${input.dealValue.toLocaleString()}
- Deliverables: ${input.deliverables}
- Athlete Followers: ${input.athleteFollowers?.toLocaleString() ?? "Unknown"}
- Sport: ${input.sport ?? "College Sport"}

Provide: Deal rating (1-10), fair market value assessment, red flags if any, negotiation tips, and final recommendation. Be direct.`,
          },
        ],
      });
      return { analysis: String(response.choices[0].message.content ?? "") };
    }),

  // AI RECRUITER — Profile optimization & coach outreach
  optimizeProfile: protectedProcedure
    .input(z.object({
      sport: z.string(),
      position: z.string().optional(),
      school: z.string().optional(),
      gpa: z.number().optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      bio: z.string().optional(),
      achievements: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "optimizeProfile");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a top college recruiting consultant who has helped hundreds of athletes get scholarships. 
You know exactly what coaches look for and how to make profiles stand out. Be specific and actionable.`,
          },
          {
            role: "user",
            content: `Optimize this athlete's recruiting profile:
- Sport: ${input.sport}
- Position: ${input.position ?? "Not specified"}
- Current School: ${input.school ?? "Not specified"}
- GPA: ${input.gpa ?? "Not specified"}
- Height/Weight: ${input.height ?? "?"} / ${input.weight ?? "?"}
- Current Bio: ${input.bio ?? "None provided"}
- Achievements: ${input.achievements ?? "None listed"}

Provide: 1) Rewritten bio (under 150 words), 2) Top 3 profile improvements, 3) Key stats to highlight, 4) Recruiting strategy tip. Format clearly.`,
          },
        ],
      });
      return { optimized: String(response.choices[0].message.content ?? "") };
    }),

  generateCoachEmail: protectedProcedure
    .input(z.object({
      athleteName: z.string(),
      sport: z.string(),
      position: z.string().optional(),
      school: z.string().optional(),
      targetSchool: z.string(),
      coachName: z.string().optional(),
      gpa: z.number().optional(),
      achievements: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateCoachEmail");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a recruiting expert who writes compelling, professional outreach emails to college coaches. Emails should be personal, specific, and action-oriented. Keep them under 200 words.",
          },
          {
            role: "user",
            content: `Write a coach outreach email for:
- Athlete: ${input.athleteName}
- Sport: ${input.sport}, Position: ${input.position ?? "Not specified"}
- Current School: ${input.school ?? "High School/Transfer"}
- Target School: ${input.targetSchool}
- Coach: ${input.coachName ?? "Head Coach"}
- GPA: ${input.gpa ?? "Strong"}
- Key Achievements: ${input.achievements ?? "Competitive athlete"}

Write a professional, genuine email that will get a response. Include subject line.`,
          },
        ],
      });
      return { email: String(response.choices[0].message.content ?? "") };
    }),

  // AI CONTENT — Social media content generation
  generateCaption: protectedProcedure
    .input(z.object({
      platform: z.enum(["instagram", "twitter", "tiktok", "linkedin"]),
      contentType: z.enum(["highlight", "training", "gameday", "nil_deal", "motivation", "recruiting"]),
      context: z.string(),
      athleteName: z.string().optional(),
      sport: z.string().optional(),
      includeHashtags: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateCaption");
      const platformGuides: Record<string, string> = {
        instagram: "engaging, 150-200 chars, story-driven, with emojis",
        twitter: "punchy, under 280 chars, conversational, trending",
        tiktok: "energetic, hook-first, youth-focused, viral potential",
        linkedin: "professional, achievement-focused, career-oriented",
      };
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a social media expert for college athletes. You create viral, authentic content that builds personal brands and attracts NIL deals. You understand each platform's unique voice.`,
          },
          {
            role: "user",
            content: `Generate a ${input.platform} caption for a ${input.contentType} post.
Platform style: ${platformGuides[input.platform]}
Context: ${input.context}
${input.athleteName ? `Athlete: ${input.athleteName}` : ""}
${input.sport ? `Sport: ${input.sport}` : ""}
${input.includeHashtags ? "Include 5-8 relevant hashtags." : "No hashtags."}

Write 3 caption options, numbered. Make them authentic and platform-native.`,
          },
        ],
      });
      return { captions: String(response.choices[0].message.content ?? "") };
    }),

  generateBio: protectedProcedure
    .input(z.object({
      platform: z.enum(["instagram", "twitter", "tiktok", "linkedin"]),
      athleteName: z.string(),
      sport: z.string(),
      school: z.string().optional(),
      position: z.string().optional(),
      achievements: z.string().optional(),
      personality: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateBio");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You write compelling athlete social media bios that attract followers, coaches, and brand deals. Keep them punchy and memorable.",
          },
          {
            role: "user",
            content: `Write a ${input.platform} bio for:
- Name: ${input.athleteName}
- Sport: ${input.sport} | Position: ${input.position ?? ""}
- School: ${input.school ?? "College Athlete"}
- Achievements: ${input.achievements ?? "Competitive athlete"}
- Personality: ${input.personality ?? "Driven, focused, team player"}

Write 2 bio options. Keep each under 150 characters for Instagram/Twitter, or 3 sentences for LinkedIn.`,
          },
        ],
      });
      return { bios: String(response.choices[0].message.content ?? "") };
    }),

  generateContentPlan: protectedProcedure
    .input(z.object({
      sport: z.string(),
      season: z.enum(["preseason", "in-season", "offseason", "postseason"]),
      goals: z.string(),
      platforms: z.array(z.string()),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateContentPlan");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are a digital marketing strategist specializing in athlete personal branding. You create actionable 30-day content plans that grow audiences and attract NIL deals.",
          },
          {
            role: "user",
            content: `Create a 30-day content plan for a ${input.sport} athlete:
- Season: ${input.season}
- Goals: ${input.goals}
- Platforms: ${input.platforms.join(", ")}

Provide: Weekly themes, 3 content ideas per week, best posting times, and one viral content idea. Format as a clear schedule.`,
          },
        ],
      });
      return { plan: String(response.choices[0].message.content ?? "") };
    }),

  // AI ROBOT COMPANION — Conversational robot assistant for athletes
  robotChat: protectedProcedure
    .input(z.object({
      message: z.string(),
      scenario: z.string().optional(),
      sport: z.string().optional(),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "robotChat");
      const systemPrompt = `You are LYNX — the ATHLYNX AI Robot Companion. You are a friendly, knowledgeable, and motivating AI assistant built specifically for athletes.

You help athletes with:
- Training tips, drills, and workout plans for any sport
- Recruiting advice and college selection
- NIL deals, brand partnerships, and contract guidance
- Game strategy, film review, and play analysis
- Recovery, nutrition, and wellness
- Mental performance and pre-game preparation
- Social media growth and personal branding
- Academic balance and time management
- Transfer portal decisions
- Anything an athlete needs in the stands, on the field, in the locker room, or at home

Current scenario: ${input.scenario ?? "General athlete assistance"}
Athlete's sport: ${input.sport ?? "Not specified"}

Be encouraging, specific, and practical. Use sports terminology naturally. Keep responses focused and actionable. You are their robot teammate who never sleeps.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...(input.history ?? []).map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
        { role: "user" as const, content: input.message },
      ];

      const response = await invokeLLM({ messages });
      return { reply: String(response.choices[0].message.content ?? "") };
    }),

  // AI PLAYBOOK — The Athlete Playbook recruiting intelligence
  getRecruitingAdvice: protectedProcedure
    .input(z.object({
      sport: z.string(),
      position: z.string().optional(),
      currentSchool: z.string().optional(),
      targetLevel: z.enum(["D1", "D2", "D3", "NAIA", "JUCO", "Transfer"]),
      gpa: z.number().optional(),
      question: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "getRecruitingAdvice");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are "The Athlete Playbook" — ATHLYNX's AI recruiting intelligence engine. 
You have deep knowledge of college recruiting timelines, NCAA rules, NIL regulations, and what coaches want.
You help athletes from all backgrounds — especially those from smaller schools — maximize their recruiting potential.
Be specific, encouraging, and actionable. Reference real recruiting timelines and NCAA rules where relevant.`,
          },
          {
            role: "user",
            content: `Athlete Profile:
- Sport: ${input.sport}
- Position: ${input.position ?? "Not specified"}
- Current School: ${input.currentSchool ?? "Not specified"}
- Target Level: ${input.targetLevel}
- GPA: ${input.gpa ?? "Not specified"}

Question: ${input.question}

Provide a detailed, actionable answer. Include specific next steps, timelines, and resources.`,
          },
        ],
      });
      return { advice: String(response.choices[0].message.content ?? "") };
    }),

  // AI TRAINING BOT — Personalized training plan generator
  generateTrainingPlan: protectedProcedure
    .input(z.object({
      prompt: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "generateTrainingPlan");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are LYNX — the ATHLYNX AI Training Coach. You create detailed, personalized training plans for athletes of all sports and levels.
Your plans are sport-specific, periodized, and include strength, conditioning, skill work, recovery, nutrition, and hydration guidance.
Format your response with clear sections: Overview, Weekly Schedule (Mon-Sun), Nutrition & Hydration, Recovery Protocol, and Key Metrics to Track.
Be motivating, specific, and actionable. The athlete should be able to start this plan immediately.`,
          },
          {
            role: "user",
            content: `Create a complete personalized training plan:\n${input.prompt}\n\nProvide a full, detailed, ready-to-execute training plan.`,
          },
        ],
      });
      return { result: String(response.choices[0].message.content ?? "") };
    }),

  // WIZARD AI — Powers all 8 wizard pages with real AI advice
  wizardAdvice: protectedProcedure
    .input(z.object({
      wizardType: z.enum(["career", "transfer", "scout", "scholarship", "life", "lawyer", "financial", "agent"]),
      context: z.string().min(1).max(3000),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "wizardAdvice");
      const systemPrompts: Record<string, string> = {
        career: `You are the ATHLYNX Career Wizard — an elite athletic career advisor. Create a personalized, actionable career roadmap. Include: Immediate Actions (next 30 days), 6-Month Milestones, Long-Term Goals, and Key Resources. Be specific, motivating, and practical. Use clear sections and bullet points.`,
        transfer: `You are the ATHLYNX Transfer Wizard — an NCAA Transfer Portal expert. Guide the athlete through every step: eligibility rules, waiver process, finding the right programs, communicating with coaches, and making the best decision. Include specific timelines and NCAA rules.`,
        scout: `You are the ATHLYNX Scout Wizard — a professional recruiting and scouting advisor. Help the athlete get noticed by coaches and scouts. Provide specific advice on highlight reels, showcase events, recruiting profiles, coach outreach, and positioning for the next level.`,
        scholarship: `You are the ATHLYNX Scholarship Wizard — an expert on athletic and academic scholarships. Help the athlete find, apply for, and win scholarships. Include specific scholarship opportunities, application tips, deadlines, and how to maximize financial aid packages.`,
        life: `You are the ATHLYNX Life Wizard — a life skills and personal development coach for athletes. Help with time management, mental health, relationships, social media, money management, and life after sports. Be empathetic, practical, and actionable.`,
        lawyer: `You are the ATHLYNX Legal Wizard — a sports law educator (providing legal education, not legal advice). Help athletes understand NIL contracts, agent agreements, endorsement deals, eligibility rules, and their rights. Always recommend consulting a licensed attorney for specific legal matters.`,
        financial: `You are the ATHLYNX Financial Wizard — a financial literacy coach for athletes. Help with budgeting, NIL income management, taxes, investing, building credit, and long-term wealth. Be practical and specific with numbers and examples.`,
        agent: `You are the ATHLYNX Agent Wizard — an expert on finding, evaluating, and working with sports agents and advisors. Help athletes understand agent contracts, NCPA/NFLPA certified agents, red flags to avoid, negotiation basics, and how to build the right team around them.`,
      };
      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompts[input.wizardType] },
          { role: "user", content: input.context },
        ],
      });
      return { result: String(response.choices[0].message.content ?? "") };
    }),

  // GET CREDITS — Returns the user's current credit balance
  getCredits: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { credits: 0 };
      const [user] = await db.select({ credits: users.credits }).from(users).where(eq(users.id, ctx.user!.id)).limit(1);
      return { credits: user?.credits ?? 0 };
    }),

  // BUFFER SCHEDULING — Schedule a post to Buffer social channels
  scheduleToBuffer: protectedProcedure
    .input(z.object({
      text: z.string(),
      channels: z.array(z.enum(["twitter", "facebook", "instagram", "tiktok"])).default(["twitter", "instagram"]),
    }))
    .mutation(async ({ input, ctx }) => {
      await deductCredits(ctx.user!.id, "scheduleToBuffer");
      const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
      if (!BUFFER_TOKEN) throw new Error("Buffer not configured");
      const CHANNEL_IDS: Record<string, string> = {
        twitter:   "69e5f1dd031bfa423c2229ad",
        tiktok:    "69e613fb031bfa423c22ac3e",
        facebook:  "69e61f4f031bfa423c22e698",
        instagram: "69e61f6e031bfa423c22e6f4",
      };
      const mutation = `mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { ... on Post { id status } ... on PostError { type message } } }`;
      const results: { channel: string; success: boolean; id?: string; error?: string }[] = [];
      for (const channel of input.channels) {
        const channelId = CHANNEL_IDS[channel];
        if (!channelId) continue;
        try {
          const res = await fetch("https://api.buffer.com/graphql", {
            method: "POST",
            headers: { "Authorization": `Bearer ${BUFFER_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify({ query: mutation, variables: { input: { channelId, text: input.text, scheduledAt: null } } }),
          });
          const data = await res.json() as any;
          const post = data?.data?.createPost;
          if (post?.id) results.push({ channel, success: true, id: post.id });
          else results.push({ channel, success: false, error: post?.message || "Unknown error" });
        } catch (err: any) {
          results.push({ channel, success: false, error: err.message });
        }
      }
      return { results, posted: results.filter(r => r.success).length };
    }),
});
