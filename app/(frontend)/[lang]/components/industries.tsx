import { Reveal, Stagger, StaggerItem } from "./motion";
import { TagPill, Pill, Arrow } from "./ui";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const slugs = [
  "finance",
  "healthcare",
  "ecommerce",
  "hr",
  "logistics",
  "ai",
  "saas",
  "manufacturing",
] as const;

export default function Industries({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).industries;

  return (
    <section id="industries" className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <TagPill className="text-ink-soft">{t.cta}</TagPill>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {t.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                {t.subtitle}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Pill variant="dark" href="/contact">
              {t.cta}
            </Pill>
          </Reveal>
        </div>

        <Stagger
          className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line sm:grid-cols-2 lg:grid-cols-4"
          gap={0.06}
        >
          {slugs.map((slug) => (
            <StaggerItem key={slug} className="h-full">
              <LocaleLink
                href={`/industries/${slug}`}
                className="group flex h-full items-center justify-between gap-3 bg-cream p-7 transition-colors duration-300 hover:bg-cream-dim"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors group-hover:text-lime-deep">
                  {t.items[slug]}
                </span>
                <Arrow className="size-4 shrink-0 text-ink-soft transition-all duration-300 group-hover:translate-x-1 group-hover:text-lime-deep" />
              </LocaleLink>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
