/**
 * ATHLYNX — Social Command Center Router
 * Gemini AI post generation + Buffer (Instagram/Facebook/TikTok/X) + Zapier LinkedIn
 * Gravatar avatar sync
 */
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { chatWithGemini } from "../services/gemini";
import { getGravatarUrl } from "../services/gravatar";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN ?? "";
const ZAPIER_MCP_TOKEN = process.env.ZAPIER_MCP_TOKEN ?? "";

const BUFFER_CHANNELS: Record<string, string> = {
  twitter:   "69e5f1dd031bfa423c2229ad",
  tiktok:    "69e613fb031bfa423c22ac3e",
  facebook:  "69e61f4f031bfa423c22e698",
  instagram: "69e61f6e031bfa423c22e6f4",
};

const PLATFORM_VOICE: Record<string, string> = {
  linkedin:  "professional, thought-leadership, investor-facing, no emojis except 1-2 max, paragraph format",
  instagram: "casual, energetic, heavy emojis, short punchy lines, 5-10 hashtags",
  twitter:   "punchy, under 280 chars, 1-3 hashtags, bold statement or question",
  tiktok:    "Gen-Z energy, hook in first line, call to action, trending hashtags",
  facebook:  "conversational, community-focused, medium length, 3-5 hashtags",
};

async function postToBuffer(channelIds: string[], text: string, imageUrl?: string) {
  if (!BUFFER_TOKEN) return { success: false, error: "Buffer token not configured" };
  const mutation = `mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { ... on Post { id status } ... on PostError { type message } } }`;
  const results: { channel: string; success: boolean; id?: string; error?: string }[] = [];
  for (const [channel, channelId] of Object.entries(BUFFER_CHANNELS)) {
    if (!channelIds.includes(channelId)) continue;
    try {
      const variables: any = { input: { channelId, text, scheduledAt: null } };
      if (imageUrl) variables.input.media = [{ url: imageUrl }];
      const res = await fetch("https://api.buffer.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${BUFFER_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables }),
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
}

async function postToLinkedInViaZapier(text: string, url?: string, title?: string, imageUrl?: string) {
  if (!ZAPIER_MCP_TOKEN) return { success: false, error: "Zapier token not configured" };
  try {
    const body: any = {
      action_key: "share",
      app: "LinkedIn",
      action: "share",
      output: "id",
      instructions: "Post this to LinkedIn immediately",
      params: {
        comment: text,
        visibility__code: "anyone",
      },
    };
    if (url) body.params.content__submitted_url = url;
    if (title) body.params.content__title = title;
    if (imageUrl) body.params.content__submitted_image_url = imageUrl;

    const res = await fetch("https://mcp.zapier.com/api/mcp/v1/tools/execute", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ZAPIER_MCP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json() as any;
    if (data?.results || data?.execution?.status === "SUCCESS") {
      return { success: true, url: data.results };
    }
    return { success: false, error: data?.error || "LinkedIn post failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const socialRouter = router({
  // ─── Generate AI post content for a specific platform ─────────────────────
  generatePost: protectedProcedure
    .input(z.object({
      topic: z.string().min(1).max(500),
      platform: z.enum(["linkedin", "instagram", "twitter", "tiktok", "facebook", "all"]),
      tone: z.enum(["professional", "casual", "hype", "inspirational", "educational"]).default("professional"),
      includeHashtags: z.boolean().default(true),
      includeEmoji: z.boolean().default(true),
      customContext: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const platforms = input.platform === "all"
        ? ["linkedin", "instagram", "twitter", "tiktok", "facebook"]
        : [input.platform];

      const results: Record<string, string> = {};

      for (const platform of platforms) {
        const voice = PLATFORM_VOICE[platform] || "professional";
        const prompt = `You are a world-class social media strategist for ATHLYNX AI — the #1 athlete platform.

Write a ${input.tone} ${platform} post about: "${input.topic}"

Platform voice: ${voice}
${input.customContext ? `Additional context: ${input.customContext}` : ""}
${input.includeHashtags ? "Include relevant hashtags." : "No hashtags."}
${input.includeEmoji ? "Use appropriate emojis." : "No emojis."}

Always include athlynx.ai in the post naturally.
Write ONLY the post text — no explanations, no "Here's your post:", just the post itself.`;

        const text = await chatWithGemini(prompt, {
          temperature: 0.85,
          maxOutputTokens: 1024,
        });
        results[platform] = text.trim();
      }

      return { posts: results };
    }),

  // ─── Publish to Buffer (Instagram, Facebook, TikTok, X) ───────────────────
  publishToBuffer: protectedProcedure
    .input(z.object({
      text: z.string().min(1),
      channels: z.array(z.enum(["twitter", "facebook", "instagram", "tiktok"])).min(1),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const channelIds = input.channels.map(c => BUFFER_CHANNELS[c]).filter(Boolean);
      const result = await postToBuffer(channelIds, input.text, input.imageUrl);
      return result;
    }),

  // ─── Publish to LinkedIn via Zapier ───────────────────────────────────────
  publishToLinkedIn: protectedProcedure
    .input(z.object({
      text: z.string().min(1),
      url: z.string().optional(),
      title: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return postToLinkedInViaZapier(input.text, input.url, input.title, input.imageUrl);
    }),

  // ─── Publish to ALL platforms at once ─────────────────────────────────────
  publishToAll: protectedProcedure
    .input(z.object({
      linkedinText: z.string(),
      socialText: z.string(),
      channels: z.array(z.enum(["twitter", "facebook", "instagram", "tiktok"])).default(["twitter", "facebook", "instagram", "tiktok"]),
      url: z.string().optional(),
      title: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [bufferResult, linkedInResult] = await Promise.all([
        postToBuffer(
          input.channels.map(c => BUFFER_CHANNELS[c]).filter(Boolean),
          input.socialText,
          input.imageUrl
        ),
        postToLinkedInViaZapier(input.linkedinText, input.url, input.title, input.imageUrl),
      ]);
      return {
        buffer: bufferResult,
        linkedin: linkedInResult,
        totalPosted: (bufferResult.results?.filter(r => r.success).length ?? 0) + (linkedInResult.success ? 1 : 0),
      };
    }),

  // ─── Sync Gravatar avatar for current user ────────────────────────────────
  syncGravatar: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const email = ctx.user.email;
      if (!email) throw new Error("No email on account");
      const avatarUrl = await getGravatarUrl(email);
      if (!avatarUrl) return { synced: false, message: "No Gravatar found for this email" };
      await db.update(users).set({ avatarUrl }).where(eq(users.id, ctx.user.id));
      return { synced: true, avatarUrl, message: "Gravatar synced successfully" };
    }),

  // ─── Get Gravatar URL for any email (public) ──────────────────────────────
  getGravatarUrl: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const url = await getGravatarUrl(input.email);
      return { url };
    }),
});
