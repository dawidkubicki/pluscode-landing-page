import { PageHero, CtaBand } from "./page-hero";
import Footer from "./footer";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { Eyebrow, Plus } from "./ui";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type IndustrySlug =
  | "finance"
  | "healthcare"
  | "ecommerce"
  | "hr"
  | "logistics"
  | "legal"
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

/* Three bands of the same shape, so the shell and the header are written
   once. Grounds alternate page / off band; the change of ground is the
   separation, so no band carries a hairline of its own. A cell is ruled at
   the top and holds no ground: there are no boxes in this system. */
const BAND = "py-20 md:py-[104px]";
const HEADER = "col-span-4 md:col-span-8";
const CELL = "col-span-4 border-t border-rule pt-8";

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
        cta={{ label: d.cta.button, href: "/contact" }}
      />

      {/* Challenges */}
      <section className={`bg-paper ${BAND}`}>
        <div className="pc-shell">
          <div className="pc-grid">
            <div className={HEADER}>
              <Reveal>
                <Eyebrow>{shared.challengesTitle}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {shared.challengesSubtitle}
                </h2>
              </Reveal>
            </div>
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.07}>
            {challenges.map((c) => (
              <StaggerItem key={c.title} className={`${CELL} md:col-span-6`}>
                <article className="flex gap-5">
                  <Plus className="mt-1 size-5 shrink-0 text-moss" />
                  <div>
                    <h3 className="text-heading-sm text-ink">{c.title}</h3>
                    <p className="mt-3 text-[1.125rem] leading-[1.375] text-moss">
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
      <section className={`bg-paper-dim ${BAND}`}>
        <div className="pc-shell">
          <div className="pc-grid">
            <div className={HEADER}>
              <Reveal>
                <Eyebrow>{shared.solutionsTitle}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {shared.solutionsSubtitle}
                </h2>
              </Reveal>
            </div>
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.07}>
            {solutions.map((s) => (
              <StaggerItem key={s.title} className={`${CELL} md:col-span-3`}>
                <article>
                  <Plus className="size-5 text-moss" />
                  <h3 className="mt-5 text-heading-sm text-ink">{s.title}</h3>
                  <p className="mt-3 text-[1.125rem] leading-[1.375] text-moss">
                    {s.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Use cases */}
      <section className={`bg-paper ${BAND}`}>
        <div className="pc-shell">
          <div className="pc-grid">
            <div className={HEADER}>
              <Reveal>
                <Eyebrow>{shared.useCasesTitle}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {shared.useCasesSubtitle}
                </h2>
              </Reveal>
            </div>
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.07}>
            {useCases.map((u, i) => (
              <StaggerItem key={u.title} className={`${CELL} md:col-span-4`}>
                <article>
                  <span className="text-[0.875rem] tabular-nums text-moss">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-heading-sm text-ink">{u.title}</h3>
                  <p className="mt-3 text-[1.125rem] leading-[1.375] text-moss">
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
