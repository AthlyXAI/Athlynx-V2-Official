/**
 * ATHLYNX Social Post Automation
 * Runs 3x/day via Vercel Cron (8am, 12pm, 6pm CST)
 * Posts to: Facebook, X (Twitter), Instagram via Buffer GraphQL API
 * Posts to: LinkedIn via Zapier MCP
 * TikTok: requires video — text-only posts skipped
 *
 * BUFFER API NOTES (May 2, 2026):
 * - Use schedulingType: automatic + mode: shareNow
 * - Return type is PostActionPayload — use __typename, NOT "... on Post { id }"
 * - Token: kB3LprBJtIH1-1F1v_DQcjOIRFdX13YFQVPXrpz9gD_ (AthlynXAI, expires May 2, 2027)
 */

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN!;
const ZAPIER_MCP_TOKEN = process.env.ZAPIER_MCP_TOKEN!;
const ATHLYNX_LOGO = "https://athlynx.ai/athlynx-og-social.png";

// Buffer channel IDs — ALL 10 channels (from cdozier14@athlynx.ai account)
const BUFFER_CHANNELS = {
  instagram_chad_dozier:   "69e6cca6031bfa423c26478e", // chad_dozier (Instagram)
  linkedin:                "69e6cd3f031bfa423c264c63", // chad-a-dozier-494391136 (LinkedIn)
  youtube:                 "69e6cd7c031bfa423c264dd5", // Chad A. Dozier (YouTube)
  tiktok_chad:             "69e6cd99031bfa423c264e8c", // chadadozierdozier (TikTok — video only)
  google_business:         "69e6cdf3031bfa423c2650a8", // VCT Holdings Group LLC
  twitter:                 "69e6ce05031bfa423c265121", // ChadADozier2 (X/Twitter)
  tiktok_cdozier75:        "69e6ce56031bfa423c2652c8", // cdozier75 (TikTok — video only)
  instagram_chaddozier14:  "69e6ce77031bfa423c265389", // chaddozier14 (Instagram)
  facebook_athlynx:        "69f29ddf5c4c051afaf3e12e", // Athlynx - The Complete Athlete Ecosystem
  facebook_chad:           "69f3f06f5c4c051afaf9eeb7", // Chad Allen Dozier Sr (Facebook)
};

// Text-only channels (TikTok requires video — excluded from text posts)
const TEXT_CHANNELS = [
  BUFFER_CHANNELS.instagram_chad_dozier,
  BUFFER_CHANNELS.twitter,
  BUFFER_CHANNELS.instagram_chaddozier14,
  BUFFER_CHANNELS.facebook_athlynx,
  BUFFER_CHANNELS.facebook_chad,
  BUFFER_CHANNELS.google_business,
];

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
    text: "💎 THE DIAMOND GRIND IS REAL.\n\nBaseball athletes — ATHLYNX tracks your stats, connects you to scouts, and finds your NIL deals.\n\nYour next level starts here 👉 https://athlynx.ai\n\n#ATHLYNX #BaseballRecruiting #NIL #CollegiateBaseball",
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
  {
    text: "⚾ DIAMOND GRIND BASEBALL.\n\nFrom Little League to the pros — ATHLYNX tracks every pitch, every at-bat, and every recruiting opportunity.\n\nGet started 👉 https://athlynx.ai/diamond-grind\n\n#DiamondGrind #BaseballNIL #ATHLYNX #CollegiateBaseball",
    link: "https://athlynx.ai/diamond-grind",
  },
  {
    text: "🏈 WARRIORS PLAYBOOK — FOOTBALL DOMINANCE.\n\nATHLYNX's football platform gives players the edge in recruiting, film study, and NIL deals.\n\nOwn the field 👉 https://athlynx.ai/warriors-playbook\n\n#WarriorsPlaybook #FootballNIL #ATHLYNX #CollegiateFootball",
    link: "https://athlynx.ai/warriors-playbook",
  },
  {
    text: "💡 BUILT FOR LESS THAN $145,000.\n\nATHLYNX AI — 142 pages. 75,662 lines of code. 34 database tables. Dual AI engines.\n\nA traditional team would charge $2,074,000. We built it for $145K.\n\nPre-Seed round open → cdozier14@athlynx.ai\n\n#ATHLYNX #SportsTech #Startup #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🎯 SIGNING DAY IS EVERY DAY ON ATHLYNX.\n\nTrack your letter of intent, manage your commitments, and celebrate your signing day with the ATHLYNX community.\n\nhttps://athlynx.ai\n\n#SigningDay #CollegeRecruiting #ATHLYNX #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🧠 YOUR AI TRAINER KNOWS YOU.\n\nATHLYNX's personal AI Trainer Bot remembers every conversation, every workout, and every goal.\n\nStart training smarter 👉 https://athlynx.ai\n\n#AITrainer #AthletePerformance #ATHLYNX #SportsAI",
    link: "https://athlynx.ai",
  },
];

function getPostForToday(): typeof POST_LIBRARY[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const hourSlot = new Date().getUTCHours() < 14 ? 0 : new Date().getUTCHours() < 18 ? 1 : 2;
  const index = (dayOfYear * 3 + hourSlot) % POST_LIBRARY.length;
  return POST_LIBRARY[index];
}

/**
 * Post to Buffer using the correct GraphQL schema.
 * IMPORTANT: schedulingType + mode are REQUIRED.
 * Return type is PostActionPayload — use __typename only.
 * Do NOT use "... on Post { id }" fragments.
 */
async function postToBuffer(channelIds: string[], text: string): Promise<void> {
  const mutation = `
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
  `;

  for (const channelId of channelIds) {
    try {
      const response = await fetch("https://api.buffer.com/graphql", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BUFFER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation, variables: { channelId, text } }),
      });
      const result = await response.json() as any;
      const typename = result?.data?.createPost?.__typename;
      if (typename === "PostActionSuccess") {
        console.log(`[Buffer] ✅ Channel ${channelId}: PostActionSuccess`);
      } else {
        console.error(`[Buffer] ❌ Channel ${channelId}:`, JSON.stringify(result?.errors || result?.data));
      }
    } catch (err) {
      console.error(`[Buffer] Error posting to channel ${channelId}:`, err);
    }
  }
}

async function postToLinkedInViaZapier(text: string): Promise<void> {
  try {
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
          visibility__code: "anyone",
          content__submitted_url: "https://athlynx.ai",
          content__title: "ATHLYNX AI — The Athlete's Playbook",
          content__submitted_image_url: ATHLYNX_LOGO,
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

  // Post to text-capable Buffer channels (excludes TikTok — requires video)
  await postToBuffer(TEXT_CHANNELS, post.text);

  // Post to LinkedIn via Zapier
  await postToLinkedInViaZapier(post.text);

  console.log("[SocialPostCron] Completed at", new Date().toISOString());
  return { success: true, message: `Posted: ${post.text.slice(0, 60)}...` };
}
