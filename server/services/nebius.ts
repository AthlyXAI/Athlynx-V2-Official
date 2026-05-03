/**
 * Nebius AI Service — AthlynXAI Platform
 * Secondary AI Engine — Nebius AI Cloud (OpenAI-compatible API)
 * Models: meta-llama/Meta-Llama-3.1-70B-Instruct-fast, meta-llama/Meta-Llama-3.1-8B-Instruct-fast
 * $5,000 GPU Credits Active — Tenant: tenant-e00r74k0pbm4nqmw2w
 * Service Account: serviceaccount-e00jhyptxnfgbev15v
 *
 * Use cases:
 * - Fallback when Gemini quota is exhausted
 * - High-throughput batch AI tasks (CRM enrichment, bulk content generation)
 * - Long-context processing (athlete profiles, scouting reports)
 * - Token Factory — AI credits economy
 */

import OpenAI from "openai";

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || "";
const NEBIUS_BASE_URL = "https://api.studio.nebius.com/v1/";

// ─── Models ──────────────────────────────────────────────────────────────────
export const NEBIUS_MODELS = {
  LLAMA_70B: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",   // Most powerful — use for complex tasks
  LLAMA_8B:  "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",    // Fast + cheap — use for bulk tasks
  LLAMA_405B: "meta-llama/Meta-Llama-3.1-405B-Instruct",      // Largest — use for elite analysis
} as const;

export type NebiusModel = typeof NEBIUS_MODELS[keyof typeof NEBIUS_MODELS];

function getClient(): OpenAI {
  if (!NEBIUS_API_KEY) throw new Error("NEBIUS_API_KEY is not set");
  return new OpenAI({
    baseURL: NEBIUS_BASE_URL,
    apiKey: NEBIUS_API_KEY,
  });
}

export interface NebiusMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Generate a completion using Nebius AI (Llama models)
 * Primary fallback when Gemini quota is exhausted
 */
export async function nebiusChat(
  messages: NebiusMessage[],
  model: NebiusModel = NEBIUS_MODELS.LLAMA_70B,
  options?: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const client = getClient();

  const allMessages: NebiusMessage[] = [];

  if (options?.systemPrompt) {
    allMessages.push({ role: "system", content: options.systemPrompt });
  }

  allMessages.push(...messages);

  const response = await client.chat.completions.create({
    model,
    messages: allMessages,
    max_tokens: options?.maxTokens ?? 2048,
    temperature: options?.temperature ?? 0.7,
  });

  return response.choices[0]?.message?.content ?? "";
}

/**
 * Quick single-prompt completion — ideal for CRM enrichment, short AI tasks
 */
export async function nebiusComplete(
  prompt: string,
  systemPrompt?: string,
  model: NebiusModel = NEBIUS_MODELS.LLAMA_8B
): Promise<string> {
  return nebiusChat(
    [{ role: "user", content: prompt }],
    model,
    { systemPrompt }
  );
}

/**
 * Athlete X-Factor Score calculation using Nebius AI
 * Analyzes athlete stats, sport, school, recruiting status, NIL value
 */
export async function calculateXFactorScore(athleteData: {
  name: string;
  sport: string;
  position: string;
  school: string;
  gpa?: number;
  height?: string;
  weight?: number;
  sportStats?: Record<string, string | number>;
  recruitingStatus?: string;
  nilValue?: number;
  followers?: number;
}): Promise<{ score: number; breakdown: string; tier: string }> {
  const prompt = `You are the ATHLYNX X-Factor AI scoring engine. Calculate an X-Factor score (0-100) for this athlete.

Athlete Data:
- Name: ${athleteData.name}
- Sport: ${athleteData.sport}
- Position: ${athleteData.position}
- School: ${athleteData.school}
- GPA: ${athleteData.gpa ?? "N/A"}
- Height: ${athleteData.height ?? "N/A"}
- Weight: ${athleteData.weight ?? "N/A"} lbs
- Sport Stats: ${JSON.stringify(athleteData.sportStats ?? {})}
- Recruiting Status: ${athleteData.recruitingStatus ?? "Available"}
- NIL Value: $${athleteData.nilValue ?? 0}
- Social Followers: ${athleteData.followers ?? 0}

Respond in JSON format only:
{
  "score": <number 0-100>,
  "breakdown": "<2-3 sentence explanation>",
  "tier": "<Elite|High Major D1|Mid Major D1|D2/D3 Prospect|Developing>"
}`;

  try {
    const result = await nebiusComplete(prompt, undefined, NEBIUS_MODELS.LLAMA_70B);
    const parsed = JSON.parse(result.trim());
    return {
      score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
      breakdown: parsed.breakdown || "Strong athlete profile with good fundamentals.",
      tier: parsed.tier || "High Major D1",
    };
  } catch {
    // Fallback scoring
    const baseScore = 70;
    const gpaBonus = athleteData.gpa ? (athleteData.gpa / 4.0) * 10 : 0;
    const nilBonus = athleteData.nilValue ? Math.min(10, athleteData.nilValue / 5000) : 0;
    const score = Math.min(100, Math.round(baseScore + gpaBonus + nilBonus));
    return {
      score,
      breakdown: "Score calculated based on available athlete metrics.",
      tier: score >= 90 ? "Elite" : score >= 80 ? "High Major D1" : score >= 70 ? "Mid Major D1" : "D2/D3 Prospect",
    };
  }
}

/**
 * Bulk CRM enrichment — enrich multiple athlete profiles at once
 * Uses fast 8B model for cost efficiency
 */
export async function enrichAthleteProfile(athleteData: {
  name: string;
  sport: string;
  school: string;
  email?: string;
}): Promise<{
  suggestedNilValue: number;
  recruitingScore: number;
  keyStrengths: string[];
  recommendedActions: string[];
}> {
  const prompt = `You are the ATHLYNX CRM AI. Enrich this athlete profile with insights.

Athlete: ${athleteData.name}
Sport: ${athleteData.sport}
School: ${athleteData.school}

Respond in JSON only:
{
  "suggestedNilValue": <number in dollars>,
  "recruitingScore": <number 0-100>,
  "keyStrengths": ["<strength1>", "<strength2>", "<strength3>"],
  "recommendedActions": ["<action1>", "<action2>"]
}`;

  try {
    const result = await nebiusComplete(prompt, undefined, NEBIUS_MODELS.LLAMA_8B);
    return JSON.parse(result.trim());
  } catch {
    return {
      suggestedNilValue: 5000,
      recruitingScore: 75,
      keyStrengths: ["Athletic potential", "Academic focus", "Team player"],
      recommendedActions: ["Complete athlete profile", "Upload highlight reel"],
    };
  }
}

/**
 * Health check — verify Nebius API is responding
 */
export async function nebiusHealthCheck(): Promise<{ status: "ok" | "error"; model: string; latencyMs: number }> {
  const start = Date.now();
  try {
    await nebiusComplete("Say OK", undefined, NEBIUS_MODELS.LLAMA_8B);
    return { status: "ok", model: NEBIUS_MODELS.LLAMA_8B, latencyMs: Date.now() - start };
  } catch (e) {
    return { status: "error", model: NEBIUS_MODELS.LLAMA_8B, latencyMs: Date.now() - start };
  }
}
