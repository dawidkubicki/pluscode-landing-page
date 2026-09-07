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

/* Grounds alternate page / off band, and every change of ground also gets a
   hairline. A colour step of three values is not a section break on its own.
   Cells in a ruled grid carry no ground of their own: on a dark page a lifted
   cell is a lighter one, so the hover is `cream-surface` and rest is the band. */
const H2 = "display max-w-[22em] text-balance text-heading-md text-ink lg:text-heading-lg";
const SECTION = "mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]";

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
      <section className="bg-cream">
        <div className={SECTION}>
          <Reveal>
            <Eyebrow>{shared.challengesTitle}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className={`mt-6 ${H2}`}>{shared.challengesSubtitle}</h2>
          </Reveal>
          <Stagger
            className="mt-14 grid border-l border-t border-cream-line sm:grid-cols-2"
            gap={0.07}
          >
            {challenges.map((c) => (
              <StaggerItem key={c.title} className="h-full">
                <article className="flex h-full gap-5 border-b border-r border-cream-line p-7 transition-colors duration-300 ease-io-attio hover:bg-cream-surface hover:duration-50 sm:p-8">
                  <Plus className="mt-1 size-5 shrink-0 text-ink-mute" />
                  <div>
                    <h3 className="text-[19px] font-semibold leading-[1.25] text-ink">
                      {c.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-soft">
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
      <section className="border-t border-cream-line bg-cream-dim">
        <div className={SECTION}>
          <Reveal>
            <Eyebrow>{shared.solutionsTitle}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className={`mt-6 ${H2}`}>{shared.solutionsSubtitle}</h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
            {solutions.map((s) => (
              <StaggerItem key={s.title} className="h-full">
                <article className="flex h-full flex-col rounded-[20px] border border-cream-line bg-cream-surface px-[23px] pb-[23px] pt-[21px]">
                  <Plus className="size-5 text-ink-mute" />
                  <h3 className="mt-5 text-[19px] font-semibold leading-[1.25] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-soft">
                    {s.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-cream-line bg-cream">
        <div className={SECTION}>
          <Reveal>
            <Eyebrow>{shared.useCasesTitle}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className={`mt-6 ${H2}`}>{shared.useCasesSubtitle}</h2>
          </Reveal>
          <Stagger
            className="mt-14 grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-3"
            gap={0.07}
          >
            {useCases.map((u, i) => (
              <StaggerItem key={u.title} className="h-full">
                <article className="flex h-full flex-col border-b border-r border-cream-line p-7 transition-colors duration-300 ease-io-attio hover:bg-cream-surface hover:duration-50 sm:p-8">
                  <span className="text-[13px] tabular-nums text-ink-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[19px] font-semibold leading-[1.25] text-ink">
                    {u.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
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
