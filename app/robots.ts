import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/company";

/* The CMS and its API are not for crawlers. Uploaded pictures are the one
   exception: Payload serves them from under /api, and an article's cover has
   to stay fetchable for image search and link previews. The longer rule wins,
   so the Allow holds against the Disallow. */
const PRIVATE = ["/admin", "/api"];
const PUBLIC = ["/", "/api/media/"];

/**
 * Crawlers that read for AI models and AI search, plus Bing, which feeds
 * several of them. They would be let in by the `*` group anyway. They are
 * named so that the answer to "may we read this site?" is written down
 * rather than inferred.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: PUBLIC, disallow: PRIVATE },
      // A crawler obeys the most specific group that names it and ignores the
      // rest, so this group has to repeat the Disallow lines.
      { userAgent: AI_CRAWLERS, allow: PUBLIC, disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
