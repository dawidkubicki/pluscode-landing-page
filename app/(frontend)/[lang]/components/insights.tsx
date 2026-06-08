import { Reveal, Stagger, StaggerItem } from "./motion";
import { TagPill, Pill, Arrow } from "./ui";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getInsights, type InsightCard } from "@/lib/insights";

function CardMedia({
  insight,
  className = "",
}: {
  insight: InsightCard;
  className?: string;
}) {
  return (
    <div className={`relative isolate overflow-hidden ${insight.gradient} ${className}`}>
      {insight.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={insight.image.url}
          alt={insight.image.alt}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </div>
  );
}

export default async function Insights({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).insights;
  const all = await getInsights(locale);
  if (all.length === 0) return null;

  const featured = all.find((i) => i.featured) ?? all[0];
  const recent = all.filter((i) => i.slug !== featured.slug).slice(0, 3);

  const categoryLabel = (c: InsightCard["category"]) => t.categories[c];

  return (
    <section id="insights" className="bg-cream-dim px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <TagPill className="text-ink-soft">{t.label}</TagPill>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {t.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t.subtitle}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Pill variant="dark" href="/insights">
              {t.viewAll}
            </Pill>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Featured */}
          <Reveal>
            <LocaleLink
              href={`/insights/${featured.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cream-line bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]"
            >
              <CardMedia insight={featured} className="h-60 lg:h-72" />
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep">
                  <span>{categoryLabel(featured.category)}</span>
                  <span className="text-ink-soft">· {featured.readTime} {t.minRead}</span>
                </div>
                <h3 className="mt-3 text-2xl font-medium text-ink transition-colors group-hover:text-lime-deep sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-ink-soft">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep">
                  {t.readMore}
                  <Arrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </LocaleLink>
          </Reveal>

          {/* Recent */}
          <Stagger className="grid gap-6" gap={0.08}>
            {recent.map((insight) => (
              <StaggerItem key={insight.slug}>
                <LocaleLink
                  href={`/insights/${insight.slug}`}
                  className="group flex h-full gap-5 overflow-hidden rounded-3xl border border-cream-line bg-cream p-4 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40"
                >
                  <CardMedia insight={insight} className="hidden h-auto w-32 shrink-0 rounded-2xl sm:block" />
                  <div className="flex flex-1 flex-col py-2 pr-2">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-deep">
                      <span>{categoryLabel(insight.category)}</span>
                      <span className="text-ink-soft">· {insight.readTime} {t.minRead}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-ink transition-colors group-hover:text-lime-deep">
                      {insight.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                      {insight.excerpt}
                    </p>
                  </div>
                </LocaleLink>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
