import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { Plus } from "./ui";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type IndustrySlug =
  | "finance"
  | "healthcare"
  | "ecommerce"
  | "hr"
  | "logistics"
  | "ai"
  | "saas"
  | "manufacturing";

type Entry = { title: string; description: string };
type IndustryData = {
  label: string;
  title: string;
  subtitle: string;
  challenges: Record<string, Entry>;
  solutions: Record<string, Entry>;
  useCases: Record<string, Entry>;
  cta: { title: string; subtitle: string; button: string };
};

const visualForSlug = (slug: IndustrySlug) =>
  slug === "ai" ? "nodes" : slug === "saas" ? "mesh" : "grid";

export default function IndustryPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: IndustrySlug;
}) {
  const dict = getDictionary(locale);
  const shared = dict.pages.industries.shared;
  const d = dict.pages.industries[slug] as unknown as IndustryData;

  const challenges = Object.values(d.challenges);
  const solutions = Object.values(d.solutions);
  const useCases = Object.values(d.useCases);

  return (
    <main>
      <PageHero
        eyebrow={d.label}
        title={d.title}
        intro={d.subtitle}
        visual={visualForSlug(slug)}
        cta={{ label: d.cta.button, href: "/contact" }}
      />

      {/* Challenges */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
              {shared.challengesTitle}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-3xl text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
              {shared.challengesSubtitle}
            </h2>
          </Reveal>
          <Stagger
            className="mt-14 grid border-l border-t border-cream-line sm:grid-cols-2"
            gap={0.08}
          >
            {challenges.map((c) => (
              <StaggerItem key={c.title} className="h-full">
                <article className="flex h-full gap-5 border-b border-r border-cream-line bg-white p-7 transition-colors duration-300 hover:bg-cream sm:p-8">
                  <Plus className="mt-1 size-5 shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{c.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-[1.65] text-ink-soft">
                      {c.description}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Solutions */}
      <section className="relative isolate overflow-hidden bg-night text-bone">
        <div className="absolute -left-52 -bottom-64 -z-10 size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(43,92,255,0.18)_0%,rgba(43,92,255,0)_65%)]" />
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime-soft">
              {shared.solutionsTitle}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-3xl text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] sm:text-5xl">
              {shared.solutionsSubtitle}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
            {solutions.map((s) => (
              <StaggerItem key={s.title} className="h-full">
                <article className="flex h-full flex-col rounded border border-white/10 bg-night-soft p-6 sm:p-7">
                  <Plus className="size-5" />
                  <h3 className="mt-5 text-lg font-semibold text-bone">{s.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.65] text-bone-soft">
                    {s.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[0.14em] text-lime">
              {shared.useCasesTitle}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-3xl text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
              {shared.useCasesSubtitle}
            </h2>
          </Reveal>
          <Stagger
            className="mt-14 grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-3"
            gap={0.08}
          >
            {useCases.map((u, i) => (
              <StaggerItem key={u.title} className="h-full">
                <article className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 transition-colors duration-300 hover:bg-cream sm:p-8">
                  <span className="font-mono text-xs text-ink-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{u.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
                    {u.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={d.cta.title}
        text={d.cta.subtitle}
        cta={{ label: d.cta.button, href: "/contact" }}
      />
      <Footer locale={locale} />
    </main>
  );
}

export function industryMetadata(locale: Locale, slug: IndustrySlug) {
  const d = getDictionary(locale).pages.industries[
    slug
  ] as unknown as IndustryData;
  return { title: d.title, description: d.subtitle };
}
