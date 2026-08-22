import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Footer from "../components/footer";
import Contact from "../components/contact";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { Arrow } from "../components/ui";
import LocaleLink from "../components/locale-link";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

/** Offering index, aligned with the order of `offerings.items` in the dict. */
const SLUGS = [
  "ai-opportunity-workshop",
  "ai-discovery-sprint",
  "genai-proof-of-concept",
  "fractional-ai-team",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const idx = getDictionary(resolve(lang)).workshops.index;
  return { title: idx.metaTitle, description: idx.metaDescription };
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function WorkshopsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const dict = getDictionary(locale);
  const idx = dict.workshops.index;
  const o = dict.offerings;

  return (
    <main>
      <PageHero eyebrow={idx.eyebrow} title={idx.title} intro={idx.subtitle} visual="grid" />

      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-10 sm:py-20">
          <Stagger className="grid gap-5 sm:grid-cols-2" gap={0.08}>
            {o.items.map((item, i) => {
              const slug = SLUGS[i];
              return (
                <StaggerItem key={slug} className="h-full">
                  <div
                    className={`relative flex h-full flex-col rounded border p-7 transition-colors duration-300 sm:p-8 ${
                      item.featured ? "border-lime bg-cream" : "border-cream-line bg-white hover:border-ink/20"
                    }`}
                  >
                    {item.featured && (
                      <span className="absolute -top-3 left-8 rounded-[2px] bg-lime px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white">
                        {o.featuredLabel}
                      </span>
                    )}
                    <h2 className="font-serif text-[1.7rem] font-medium leading-tight text-ink">
                      {item.name}
                    </h2>
                    <div className="mt-2.5 font-mono text-[12.5px] uppercase tracking-[0.1em] text-lime">
                      {item.meta}
                    </div>
                    <p className="mt-5 text-[15px] leading-[1.65] text-ink-soft">{item.desc}</p>

                    <div className="mt-5 text-[12px] uppercase tracking-[0.12em] text-ink-mute">
                      {o.forLabel}
                      <span className="ml-2 normal-case tracking-normal text-ink-soft">{item.for}</span>
                    </div>

                    <ul className="mt-6 flex flex-col gap-2.5 border-t border-cream-line pt-6">
                      {item.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                          <Check className="mt-0.5 size-4 shrink-0 text-lime" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                      <LocaleLink
                        href={`/workshops/${slug}`}
                        className="group inline-flex items-center gap-2.5 rounded-[2px] bg-lime px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-lime-bright"
                      >
                        {item.cta}
                        <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                      </LocaleLink>
                      <LocaleLink
                        href={`/workshops/${slug}`}
                        className="text-[14.5px] font-medium text-ink-soft underline-offset-4 transition-colors hover:text-lime hover:underline"
                      >
                        {idx.detailsCta}
                      </LocaleLink>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal>
            <p className="mx-auto mt-12 max-w-2xl text-center text-[15px] leading-[1.6] text-ink-soft">
              {o.note}
            </p>
          </Reveal>
        </div>
      </section>

      <Contact locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
