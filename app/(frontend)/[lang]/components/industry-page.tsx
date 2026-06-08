import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { TagPill, Plus } from "./ui";
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
      <section className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <TagPill className="text-ink-soft">{shared.challengesTitle}</TagPill>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {shared.challengesSubtitle}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2" gap={0.08}>
            {challenges.map((c) => (
              <StaggerItem key={c.title}>
                <article className="flex h-full gap-5 rounded-3xl border border-cream-line bg-cream-dim/40 p-7">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-lime/15 text-lime-deep">
                    <Plus className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-medium text-ink">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
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
      <section className="px-2 py-6 sm:px-3">
        <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-night px-5 py-24 text-bone sm:px-10 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <Reveal>
              <TagPill className="text-bone-soft">{shared.solutionsTitle}</TagPill>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-2xl text-balance text-4xl font-medium leading-[1.08] tracking-tight text-bone sm:text-5xl">
                {shared.solutionsSubtitle}
              </h2>
            </Reveal>
            <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
              {solutions.map((s) => (
                <StaggerItem key={s.title}>
                  <article className="flex h-full flex-col rounded-3xl border border-night-line bg-night-soft p-6">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-lime/15 text-lime">
                      <Plus className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-medium text-bone">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-bone-soft">
                      {s.description}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <TagPill className="text-ink-soft">{shared.useCasesTitle}</TagPill>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {shared.useCasesSubtitle}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-5 lg:grid-cols-3" gap={0.08}>
            {useCases.map((u, i) => (
              <StaggerItem key={u.title}>
                <article className="flex h-full flex-col rounded-3xl border border-cream-line bg-cream-dim/40 p-7">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-xl font-medium text-ink">{u.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
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
