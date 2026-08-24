/**
 * Publishes the AI-news insight posts (scripts/content/insights-news.ts) into
 * Payload: uploads each cover from scripts/content/covers/, upserts the post
 * by slug with EN content, layers the PL and DE translations on top, and
 * removes the original placeholder posts seeded by scripts/seed.ts.
 *
 * Idempotent — re-running updates the same documents in place.
 *
 * Local:          pnpm seed:insights
 * In production:  docker compose exec landing-pluscode pnpm seed:insights:prod
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../payload.config.ts";
import { posts, type RichBlock } from "./content/insights-news.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** Slugs of the sample posts from scripts/seed.ts, superseded by real content. */
const PLACEHOLDER_SLUGS = [
  "ai-transforming-business",
  "scalable-microservices",
  "startup-to-scaleup",
  "cloud-native-best-practices",
];

// --- minimal Lexical builders (same node shapes payload's editor produces) ---

const text = (t: string) => ({
  type: "text",
  text: t,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
  version: 1,
});

const base = { direction: "ltr" as const, format: "" as const, indent: 0, version: 1 };

function lexical(blocks: RichBlock[]) {
  const children = blocks.map((b) => {
    if (b.h2) return { type: "heading", tag: "h2", children: [text(b.h2)], ...base };
    if (b.ul)
      return {
        type: "list",
        listType: "bullet",
        tag: "ul",
        start: 1,
        children: b.ul.map((item, i) => ({
          type: "listitem",
          value: i + 1,
          children: [text(item)],
          ...base,
        })),
        ...base,
      };
    return { type: "paragraph", textFormat: 0, children: [text(b.p ?? "")], ...base };
  });
  return { root: { type: "root", children, ...base } };
}

// --- publish ---

const payload = await getPayload({ config });

for (const post of posts) {
  const existing = await payload.find({
    collection: "insights",
    where: { slug: { equals: post.slug } },
    limit: 1,
    locale: "en",
  });
  const found = existing.docs[0];

  // Reuse the already-uploaded cover on re-runs; upload it on the first one.
  let coverId = found?.coverImage
    ? typeof found.coverImage === "object"
      ? (found.coverImage as { id: number | string }).id
      : (found.coverImage as number | string)
    : undefined;
  if (!coverId) {
    const media = await payload.create({
      collection: "media",
      data: { alt: post.coverAlt },
      filePath: path.join(root, `scripts/content/covers/${post.slug}.png`),
    });
    coverId = media.id;
    console.log(`  ↑ uploaded cover for ${post.slug}`);
  }

  const en = post.locales.en;
  const dataEn = {
    title: en.title,
    slug: post.slug,
    excerpt: en.excerpt,
    category: post.category,
    coverImage: coverId,
    gradient: post.gradient,
    content: lexical(en.content),
    author: "Pluscode",
    readTime: post.readTime,
    featured: post.featured,
    publishedAt: post.publishedAt,
    seoTitle: en.seoTitle,
    seoDescription: en.seoDescription,
    _status: "published",
  } as never;

  let id: number | string;
  if (found) {
    await payload.update({ collection: "insights", id: found.id, locale: "en", data: dataEn });
    id = found.id;
    console.log(`✓ updated  ${post.slug}`);
  } else {
    const doc = await payload.create({ collection: "insights", locale: "en", data: dataEn });
    id = doc.id;
    console.log(`✓ created  ${post.slug}`);
  }

  for (const loc of ["pl", "de"] as const) {
    const l = post.locales[loc];
    await payload.update({
      collection: "insights",
      id,
      locale: loc,
      data: {
        title: l.title,
        excerpt: l.excerpt,
        content: lexical(l.content),
        seoTitle: l.seoTitle,
        seoDescription: l.seoDescription,
      } as never,
    });
  }
  console.log(`  ↳ localized ${post.slug} (pl, de)`);
}

for (const slug of PLACEHOLDER_SLUGS) {
  const r = await payload.find({
    collection: "insights",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  if (r.docs[0]) {
    await payload.delete({ collection: "insights", id: r.docs[0].id });
    console.log(`✕ removed placeholder ${slug}`);
  }
}

console.log("\nInsights published.");
process.exit(0);
