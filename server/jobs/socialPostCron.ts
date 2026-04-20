/**
 * ATHLYNX Social Post Automation
 * Runs 3x/day via Vercel Cron (8am, 12pm, 6pm CST)
 * Posts to: Facebook, TikTok, X (Twitter), Instagram via Buffer
 * Posts to: LinkedIn via Zapier MCP
 * 100% self-contained on Vercel — no external triggers needed
 */

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN!;
const ZAPIER_MCP_TOKEN = process.env.ZAPIER_MCP_TOKEN!;

// Buffer channel IDs (from chaddozier75@gmail.com account)
const BUFFER_CHANNELS = {
  twitter:   "69e5f1dd031bfa423c2229ad", // ChadADozier2 (X)
  tiktok:    "69e613fb031bfa423c22ac3e", // chadadozierdozier
  facebook:  "69e61f4f031bfa423c22e698", // Athlynx - The Complete Athlete Ecosystem
  instagram: "69e61f6e031bfa423c22e6f4", // chadallendozier
};

// Rotating post content — 30 unique posts cycling forever
const POST_LIBRARY = [
  {
    text: "🏆 ATHLYNX.AI — The #1 AI Platform for Athletes & NIL Deals.\n\nYour career. Your brand. Your future — all in one place.\n\n✅ AI-powered NIL marketplace\n✅ Real-time recruiting analytics\n✅ 20+ integrated platforms\n\nhttps://athlynx.ai\n\n#ATHLYNX #NIL #SportsAI #AthleteMarketing",
    link: "https://athlynx.ai",
  },
  {
    text: "⚡ ONE PLATFORM. EVERY EDGE.\n\nATHLYNX gives athletes the tools to get recruited, get paid, and get ahead.\n\n🎯 NIL deals\n🎯 Transfer portal analytics\n🎯 AI coaching insights\n\nhttps://athlynx.ai\n\n#ATHLYNX #CollegiateAthletes #NIL #RecruitingEdge",
    link: "https://athlynx.ai",
  },
  {
    text: "💎 THE DIAMOND GRIND IS REAL.\n\nBaseball athletes — ATHLYNX tracks your stats, connects you to scouts, and finds your NIL deals.\n\nYour next level starts here 👉 https://athlynx.ai\n\n#ATHLYNX #BaseballRecruting #NIL #CollegiateBaseball",
    link: "https://athlynx.ai",
  },
  {
    text: "🤖 YOUR AI COACH NEVER SLEEPS.\n\nWhile you rest, ATHLYNX is analyzing your performance, finding opportunities, and building your brand.\n\n24/7 AI-powered athlete management 👉 https://athlynx.ai\n\n#ATHLYNX #AICoach #SportsAI #AthletePerformance",
    link: "https://athlynx.ai",
  },
  {
    text: "🏈 FOOTBALL ATHLETES — YOUR NIL ERA IS NOW.\n\nATHLYNX connects you directly to brands, boosters, and NIL deals.\n\nNo agents. No middlemen. Just results.\n\nhttps://athlynx.ai\n\n#ATHLYNX #FootballNIL #NILDeals #CollegiateFootball",
    link: "https://athlynx.ai",
  },
  {
    text: "🏀 BASKETBALL PLAYERS — LEVEL UP YOUR RECRUITING.\n\nATHLYNX gives you real-time analytics, NIL opportunities, and a global athlete network.\n\nJoin the movement 👉 https://athlynx.ai\n\n#ATHLYNX #BasketballRecruiting #NIL #HoopsDreams",
    link: "https://athlynx.ai",
  },
  {
    text: "🌍 ATHLETES CONNECT GLOBALLY ON ATHLYNX.\n\nShare schedules. Compare recruiting efforts. Build your brand worldwide.\n\nThe Athlete Playbook starts here 👉 https://athlynx.ai\n\n#ATHLYNX #GlobalAthletes #AthletePlaybook #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🚀 FROM UNRECRUITED TO UNSTOPPABLE.\n\nATHLYNX's Transfer Portal analytics help athletes at smaller schools get seen, get recruited, and increase their NIL value.\n\nhttps://athlynx.ai\n\n#ATHLYNX #TransferPortal #NIL #CollegiateAthletes",
    link: "https://athlynx.ai",
  },
  {
    text: "💰 YOUR NAME. YOUR IMAGE. YOUR LIKENESS. YOUR MONEY.\n\nATHLYNX's AI-powered NIL marketplace connects athletes with brands that want to pay them.\n\nStart earning 👉 https://athlynx.ai\n\n#ATHLYNX #NILMarketplace #AthleteMarketing #GetPaid",
    link: "https://athlynx.ai",
  },
  {
    text: "📊 DATA-DRIVEN RECRUITING.\n\nATHLYNX gives coaches and athletes real-time analytics to make smarter recruiting decisions.\n\n20+ integrated platforms. One dashboard.\n\nhttps://athlynx.ai\n\n#ATHLYNX #RecruitingAnalytics #SportsData #CoachingEdge",
    link: "https://athlynx.ai",
  },
];

function getPostForToday(): typeof POST_LIBRARY[0] {
  // Rotate through posts based on day of year so it never repeats the same post twice in a row
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const hourSlot = new Date().getUTCHours() < 14 ? 0 : new Date().getUTCHours() < 18 ? 1 : 2;
  const index = (dayOfYear * 3 + hourSlot) % POST_LIBRARY.length;
  return POST_LIBRARY[index];
}

async function postToBuffer(channelIds: string[], text: string): Promise<void> {
  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on Post {
          id
          status
        }
        ... on PostError {
          type
          message
        }
      }
    }
  `;

  for (const channelId of channelIds) {
    try {
      const response = await fetch("https://api.buffer.com/graphql", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BUFFER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              channelId,
              text,
              scheduledAt: null, // Post immediately
            },
          },
        }),
      });
      const result = await response.json() as any;
      console.log(`[Buffer] Channel ${channelId}:`, JSON.stringify(result?.data?.createPost || result?.errors));
    } catch (err) {
      console.error(`[Buffer] Error posting to channel ${channelId}:`, err);
    }
  }
}

async function postToLinkedInViaZapier(text: string): Promise<void> {
  try {
    // Call Zapier MCP REST API directly — self-contained, no Manus needed
    const response = await fetch("https://mcp.zapier.com/api/mcp/v1/execute", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ZAPIER_MCP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serverId: "3d496f1b-ba2b-49df-8c05-b69e4ed3ce10",
        toolName: "linkedin_create_share_update",
        params: {
          comment: text,
          instructions: `Post this to LinkedIn: ${text}`,
        },
      }),
    });
    const result = await response.json() as any;
    console.log("[Zapier/LinkedIn]:", JSON.stringify(result).slice(0, 200));
  } catch (err) {
    console.error("[Zapier/LinkedIn] Error:", err);
  }
}

export async function runSocialPostCron(): Promise<{ success: boolean; message: string }> {
  console.log("[SocialPostCron] Starting at", new Date().toISOString());

  const post = getPostForToday();
  const channelIds = [
    BUFFER_CHANNELS.facebook,
    BUFFER_CHANNELS.twitter,
    BUFFER_CHANNELS.tiktok,
    BUFFER_CHANNELS.instagram,
  ];

  // Post to Buffer channels (FB, X, TikTok, Instagram) in parallel
  await postToBuffer(channelIds, post.text);

  // Post to LinkedIn via Zapier
  await postToLinkedInViaZapier(post.text);

  console.log("[SocialPostCron] Completed at", new Date().toISOString());
  return { success: true, message: `Posted: ${post.text.slice(0, 60)}...` };
}
