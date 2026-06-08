/**
 * Seeds the CMS with a starter admin user and sample content.
 *
 * Run with env loaded:
 *   pnpm seed
 * (which is: node --env-file=.env --import tsx scripts/seed.ts)
 *
 * Safe to re-run — it skips records that already exist.
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";

/** Build a minimal Lexical rich-text value from plain paragraphs. */
function richText(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [
          {
            type: "text",
            text,
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
            version: 1,
          },
        ],
      })),
    },
  };
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@pluscode.io";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "changeme123";

async function ensure(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "users" | "team" | "case-studies" | "insights" | "announcements",
  where: Record<string, unknown>,
  data: Record<string, unknown>,
  label: string,
) {
  const existing = await payload.find({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: collection as any,
    where: where as never,
    limit: 1,
  });
  if (existing.docs.length > 0) {
    console.log(`• ${collection}: "${label}" already exists — skipped`);
    return existing.docs[0];
  }
  const doc = await payload.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collection: collection as any,
    data: data as never,
  });
  console.log(`✓ ${collection}: created "${label}"`);
  return doc;
}

async function seed() {
  const payload = await getPayload({ config });

  // --- Admin user ---
  await ensure(
    payload,
    "users",
    { email: { equals: ADMIN_EMAIL } },
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "Pluscode Admin" },
    ADMIN_EMAIL,
  );

  // --- Team ---
  const team = [
    {
      name: "Dawid Kubicki",
      role: "CEO & Founder",
      bio: "Passionate about technology and its potential to transform businesses. We start with people, not technology.",
      email: "contact@pluscode.io",
      phone: "+48 667 688 927",
      linkedin: "https://www.linkedin.com/company/pluscode",
      featuredOnHome: true,
      order: 0,
    },
    {
      name: "Engineering Lead",
      role: "Head of Engineering",
      bio: "Building scalable solutions with cutting-edge technologies.",
      email: "contact@pluscode.io",
      order: 1,
    },
    {
      name: "Design Lead",
      role: "Head of Design",
      bio: "Creating beautiful, intuitive experiences that users love.",
      email: "contact@pluscode.io",
      order: 2,
    },
  ];
  for (const m of team) {
    await ensure(payload, "team", { name: { equals: m.name } }, m, m.name);
  }

  // --- Announcement ---
  await ensure(
    payload,
    "announcements",
    { title: { equals: "AI consultations for startups" } },
    {
      title: "AI consultations for startups",
      text: "New: We're now offering free AI consultations for startups.",
      linkText: "Learn more",
      linkUrl: "/contact",
      isActive: true,
    },
    "AI consultations for startups",
  );

  // --- Case studies ---
  const caseStudies = [
    {
      title: "System Architecture for Autonomous Stores by Żabka",
      slug: "zabka",
      category: "Cloud Development",
      client: "Żabka",
      excerpt:
        "Planning, designing, implementing, and maintaining autonomous stores architecture for a major retail chain.",
      gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400",
      featured: true,
      order: 0,
      publishedAt: new Date().toISOString(),
      _status: "published",
      overview: richText([
        "Żabka set out to scale a fleet of autonomous, cashier-less stores. We partnered with their team to design and run the cloud architecture behind it.",
      ]),
      challenge: richText([
        "Autonomous retail demands real-time computer vision, inventory sync and payments at the edge — across hundreds of locations, with zero tolerance for downtime.",
      ]),
      solution: richText([
        "We built an event-driven, cloud-native platform: containerised services on Kubernetes, infrastructure as code, and edge connectivity with automated failover and observability end to end.",
      ]),
      results: richText([
        "The platform now powers autonomous stores at scale, with resilient operations and a foundation that the in-house team owns and extends.",
      ]),
      stats: [
        { value: "99.9%", label: "Uptime" },
        { value: "100+", label: "Stores supported" },
        { value: "Real-time", label: "Inventory sync" },
      ],
    },
    {
      title: "Team extension for mobile design revamp at speed",
      slug: "ubs",
      category: "Mobile App Redesign",
      client: "UBS",
      excerpt:
        "A seamless, consistent experience with unified payment flows and easier in-app navigation.",
      gradient: "bg-gradient-to-br from-indigo-500 via-blue-600 to-slate-700",
      featured: true,
      order: 1,
      publishedAt: new Date().toISOString(),
      _status: "published",
      overview: richText([
        "We extended UBS's product team to accelerate a redesign of their mobile banking experience without slowing delivery.",
      ]),
      challenge: richText([
        "Fragmented flows and inconsistent UI made everyday banking harder than it needed to be — and the roadmap couldn't wait.",
      ]),
      solution: richText([
        "Embedded engineers and designers integrated with the existing team, unifying payment flows, rebuilding navigation and shipping behind a shared design system.",
      ]),
      results: richText([
        "A consistent, intuitive app experience delivered at speed, with patterns the internal team reuses across features.",
      ]),
      stats: [
        { value: "2x", label: "Faster delivery" },
        { value: "1", label: "Unified design system" },
      ],
    },
  ];
  for (const c of caseStudies) {
    await ensure(payload, "case-studies", { slug: { equals: c.slug } }, c, c.title);
  }

  // --- Insights ---
  const insights = [
    {
      title: "How AI is Transforming Business Operations in 2025",
      slug: "ai-transforming-business",
      category: "ai",
      excerpt:
        "The key ways artificial intelligence is revolutionizing how companies operate, from automated workflows to predictive analytics.",
      gradient: "bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400",
      author: "Pluscode",
      readTime: 8,
      featured: true,
      publishedAt: new Date().toISOString(),
      _status: "published",
      content: richText([
        "Artificial intelligence has moved from experiment to operating model. The companies pulling ahead are the ones embedding it into everyday workflows.",
        "From automated document processing to predictive analytics that anticipate demand, AI is quietly reshaping how decisions get made — and how fast.",
      ]),
    },
    {
      title: "Building Scalable Microservices Architecture",
      slug: "scalable-microservices",
      category: "development",
      excerpt:
        "A practical guide to designing and implementing microservices that grow with your business needs.",
      gradient: "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400",
      author: "Pluscode",
      readTime: 5,
      featured: false,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      _status: "published",
      content: richText([
        "Microservices promise scale and autonomy — but only if the boundaries are right. Start with the domain, not the org chart.",
      ]),
    },
    {
      title: "From Startup to Scale-up: Lessons Learned",
      slug: "startup-to-scaleup",
      category: "business",
      excerpt:
        "Key insights from our experience helping startups navigate rapid growth phases.",
      gradient: "bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400",
      author: "Pluscode",
      readTime: 6,
      featured: false,
      publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      _status: "published",
      content: richText([
        "Scaling is less about doing more and more about doing the right things repeatably. Here's what we've learned alongside fast-growing teams.",
      ]),
    },
    {
      title: "Cloud-Native Development Best Practices",
      slug: "cloud-native-best-practices",
      category: "technology",
      excerpt:
        "Essential patterns and practices for building resilient cloud applications.",
      gradient: "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400",
      author: "Pluscode",
      readTime: 4,
      featured: false,
      publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      _status: "published",
      content: richText([
        "Cloud-native is a set of habits: immutable infrastructure, automated delivery, and observability built in from day one.",
      ]),
    },
  ];
  for (const i of insights) {
    await ensure(payload, "insights", { slug: { equals: i.slug } }, i, i.title);
  }

  console.log("\nSeed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
