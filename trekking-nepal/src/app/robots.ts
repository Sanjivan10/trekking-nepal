import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.txt — explicitly welcomes AI/answer-engine crawlers so our content
 * is eligible for citation in ChatGPT, Claude, Perplexity, Gemini and Copilot.
 * Admin surfaces are disallowed for every agent.
 */
const DISALLOW = ["/admin", "/admin/", "/api/admin", "/api/admin/"];

const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google AI
  "Google-Extended",
  // Apple / Microsoft / Amazon
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  // ByteDance
  "Bytespider",
  "ByteDance",
  "TikTokSpider",
  // Meta
  "meta-externalagent",
  "FacebookBot",
  // Common Crawl (feeds most LLM training sets)
  "CCBot",
  // Others
  "cohere-ai",
  "Diffbot",
  "omgili",
  "YouBot",
  "Timpibot",
  "DuckAssistBot",
  "MistralAI-User",
];

const SEARCH_CRAWLERS = [
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-News",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "Applebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicit allow for the major search engines.
      ...SEARCH_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
      // Explicit allow for AI / answer-engine crawlers (AEO + GEO).
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
      // Everyone else.
      {
        userAgent: "*",
        allow: "/",
        disallow: [...DISALLOW, "/*?*sort=", "/*?*ref="],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
