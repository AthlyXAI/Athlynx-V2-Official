"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/jobs/socialPostCron.ts
var socialPostCron_exports = {};
__export(socialPostCron_exports, {
  runSocialPostCron: () => runSocialPostCron
});
function getPostForToday() {
  const dayOfYear = Math.floor((Date.now() - new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 0).getTime()) / 864e5);
  const hourSlot = (/* @__PURE__ */ new Date()).getUTCHours() < 14 ? 0 : (/* @__PURE__ */ new Date()).getUTCHours() < 18 ? 1 : 2;
  const index = (dayOfYear * 3 + hourSlot) % POST_LIBRARY.length;
  return POST_LIBRARY[index];
}
async function postToBuffer(channelIds, text) {
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              channelId,
              text,
              scheduledAt: null
              // Post immediately
            }
          }
        })
      });
      const result = await response.json();
      console.log(`[Buffer] Channel ${channelId}:`, JSON.stringify(result?.data?.createPost || result?.errors));
    } catch (err) {
      console.error(`[Buffer] Error posting to channel ${channelId}:`, err);
    }
  }
}
async function postToLinkedInViaZapier(text) {
  try {
    const response = await fetch("https://mcp.zapier.com/api/mcp/v1/execute", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ZAPIER_MCP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serverId: "3d496f1b-ba2b-49df-8c05-b69e4ed3ce10",
        toolName: "linkedin_create_share_update",
        params: {
          comment: text,
          instructions: `Post this to LinkedIn: ${text}`
        }
      })
    });
    const result = await response.json();
    console.log("[Zapier/LinkedIn]:", JSON.stringify(result).slice(0, 200));
  } catch (err) {
    console.error("[Zapier/LinkedIn] Error:", err);
  }
}
async function runSocialPostCron() {
  console.log("[SocialPostCron] Starting at", (/* @__PURE__ */ new Date()).toISOString());
  const post = getPostForToday();
  const channelIds = [
    BUFFER_CHANNELS.facebook,
    BUFFER_CHANNELS.twitter,
    BUFFER_CHANNELS.tiktok,
    BUFFER_CHANNELS.instagram
  ];
  await postToBuffer(channelIds, post.text);
  await postToLinkedInViaZapier(post.text);
  console.log("[SocialPostCron] Completed at", (/* @__PURE__ */ new Date()).toISOString());
  return { success: true, message: `Posted: ${post.text.slice(0, 60)}...` };
}
var BUFFER_TOKEN, ZAPIER_MCP_TOKEN, BUFFER_CHANNELS, POST_LIBRARY;
var init_socialPostCron = __esm({
  "server/jobs/socialPostCron.ts"() {
    "use strict";
    BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
    ZAPIER_MCP_TOKEN = process.env.ZAPIER_MCP_TOKEN;
    BUFFER_CHANNELS = {
      twitter: "69e5f1dd031bfa423c2229ad",
      // ChadADozier2 (X)
      tiktok: "69e613fb031bfa423c22ac3e",
      // chadadozierdozier
      facebook: "69e61f4f031bfa423c22e698",
      // Athlynx - The Complete Athlete Ecosystem
      instagram: "69e61f6e031bfa423c22e6f4"
      // chadallendozier
    };
    POST_LIBRARY = [
      {
        text: "\u{1F3C6} ATHLYNX.AI \u2014 The #1 AI Platform for Athletes & NIL Deals.\n\nYour career. Your brand. Your future \u2014 all in one place.\n\n\u2705 AI-powered NIL marketplace\n\u2705 Real-time recruiting analytics\n\u2705 20+ integrated platforms\n\nhttps://athlynx.ai\n\n#ATHLYNX #NIL #SportsAI #AthleteMarketing",
        link: "https://athlynx.ai"
      },
      {
        text: "\u26A1 ONE PLATFORM. EVERY EDGE.\n\nATHLYNX gives athletes the tools to get recruited, get paid, and get ahead.\n\n\u{1F3AF} NIL deals\n\u{1F3AF} Transfer portal analytics\n\u{1F3AF} AI coaching insights\n\nhttps://athlynx.ai\n\n#ATHLYNX #CollegiateAthletes #NIL #RecruitingEdge",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F48E} THE DIAMOND GRIND IS REAL.\n\nBaseball athletes \u2014 ATHLYNX tracks your stats, connects you to scouts, and finds your NIL deals.\n\nYour next level starts here \u{1F449} https://athlynx.ai\n\n#ATHLYNX #BaseballRecruting #NIL #CollegiateBaseball",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F916} YOUR AI COACH NEVER SLEEPS.\n\nWhile you rest, ATHLYNX is analyzing your performance, finding opportunities, and building your brand.\n\n24/7 AI-powered athlete management \u{1F449} https://athlynx.ai\n\n#ATHLYNX #AICoach #SportsAI #AthletePerformance",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F3C8} FOOTBALL ATHLETES \u2014 YOUR NIL ERA IS NOW.\n\nATHLYNX connects you directly to brands, boosters, and NIL deals.\n\nNo agents. No middlemen. Just results.\n\nhttps://athlynx.ai\n\n#ATHLYNX #FootballNIL #NILDeals #CollegiateFootball",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F3C0} BASKETBALL PLAYERS \u2014 LEVEL UP YOUR RECRUITING.\n\nATHLYNX gives you real-time analytics, NIL opportunities, and a global athlete network.\n\nJoin the movement \u{1F449} https://athlynx.ai\n\n#ATHLYNX #BasketballRecruiting #NIL #HoopsDreams",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F30D} ATHLETES CONNECT GLOBALLY ON ATHLYNX.\n\nShare schedules. Compare recruiting efforts. Build your brand worldwide.\n\nThe Athlete Playbook starts here \u{1F449} https://athlynx.ai\n\n#ATHLYNX #GlobalAthletes #AthletePlaybook #NIL",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F680} FROM UNRECRUITED TO UNSTOPPABLE.\n\nATHLYNX's Transfer Portal analytics help athletes at smaller schools get seen, get recruited, and increase their NIL value.\n\nhttps://athlynx.ai\n\n#ATHLYNX #TransferPortal #NIL #CollegiateAthletes",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F4B0} YOUR NAME. YOUR IMAGE. YOUR LIKENESS. YOUR MONEY.\n\nATHLYNX's AI-powered NIL marketplace connects athletes with brands that want to pay them.\n\nStart earning \u{1F449} https://athlynx.ai\n\n#ATHLYNX #NILMarketplace #AthleteMarketing #GetPaid",
        link: "https://athlynx.ai"
      },
      {
        text: "\u{1F4CA} DATA-DRIVEN RECRUITING.\n\nATHLYNX gives coaches and athletes real-time analytics to make smarter recruiting decisions.\n\n20+ integrated platforms. One dashboard.\n\nhttps://athlynx.ai\n\n#ATHLYNX #RecruitingAnalytics #SportsData #CoachingEdge",
        link: "https://athlynx.ai"
      }
    ];
  }
});

// server/cron-src/social-post.ts
var { runSocialPostCron: runSocialPostCron2 } = (init_socialPostCron(), __toCommonJS(socialPostCron_exports));
module.exports = async function handler(req, res) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await runSocialPostCron2();
    return res.status(200).json({ ok: true, ...result, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  } catch (err) {
    console.error("[Cron/SocialPost] Fatal error:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
};
