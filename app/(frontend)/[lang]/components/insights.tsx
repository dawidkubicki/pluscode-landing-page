import { Reveal, Stagger, StaggerItem } from "./motion";
import LocaleLink from "./locale-link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getInsights, type InsightCard } from "@/lib/insights";

function CardMedia({ insight }: { insight: InsightCard }) {
  return (
    <div className={`relative isolate h-[270px] overflow-hidden ${insight.gradient}`}>
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
  const rest = all.filter((i) => i.slug !== featured.slug);
  const cards = [featured, ...rest].slice(0, 4);

  return (
    <section id="insights" className="bg-night text-bone">
      <div className="mx-auto max-w-[1300px] px-5 pb-20 pt-20 sm:px-10 sm:pb-[5.625rem] sm:pt-[6.25rem]">
        <div className="mb-14 text-center">
          <Reveal>
            <div className="mb-5 font-mono text-[13px] uppercase tracking-[0.18em] text-lime-soft">
              {t.label}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-[2.75rem] font-medium tracking-[-0.01em] sm:text-5xl lg:text-[3.375rem]">
              {t.title}
            </h2>
          </Reveal>
        </div>

        <Stagger className="grid gap-10 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4" gap={0.07}>
          {cards.map((insight) => (
            <StaggerItem key={insight.slug} className="h-full">
              <LocaleLink
                href={`/insights/${insight.slug}`}
                className="group flex h-full flex-col gap-4"
              >
                <CardMedia insight={insight} />
                <div className="text-[13px] text-bone-dim">
                  {t.categories[insight.category]} · {insight.readTime} {t.minRead}
                </div>
                <h3 className="text-xl font-semibold leading-[1.35] text-bone transition-colors group-hover:text-lime-soft">
                  {insight.title} <span className="text-lime-soft">›</span>
                </h3>
              </LocaleLink>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-14 text-center">
            <LocaleLink
              href="/insights"
              className="inline-block rounded-[2px] bg-white px-[34px] py-[15px] text-[15px] font-semibold text-ink transition-colors duration-300 hover:bg-lime"
            >
              {t.viewAll}
            </LocaleLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
