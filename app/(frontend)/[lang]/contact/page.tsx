import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Contact from "../components/contact";
import Footer from "../components/footer";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { Visual } from "../components/visual";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(resolve(lang)).pages.contact;
  return { title: t.hero.title, description: t.hero.subtitle };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolve(lang);
  const t = getDictionary(locale).pages.contact;
  const faq = Object.values(t.faq.items);

  return (
    <main>
      <PageHero eyebrow={t.breadcrumb} title={t.hero.title} intro={t.hero.subtitle} grid={false} />

      <Contact locale={locale} showIntro={false} />

      {/* Location */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 sm:px-10 sm:py-[6.25rem] lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <div className="font-mono text-[13px] uppercase tracking-[0.14em] text-lime">{t.location.label}</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {t.location.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-[17px] leading-[1.7] text-ink-soft">
                {t.location.description}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded border border-cream-line bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-lime">
                    {t.location.address.title}
                  </p>
                  <p className="mt-3 text-ink">
                    Kosowska 12/3
                    <br />
                    60-464 {t.location.address.line1}
                    <br />
                    {t.location.address.line2}
                  </p>
                </div>
                <div className="rounded border border-cream-line bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-lime">
                    {t.location.hours.title}
                  </p>
                  <p className="mt-3 text-ink">
                    {t.location.hours.weekdays}
                    <br />
                    {t.location.hours.timezone}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="aspect-[4/3] overflow-hidden rounded">
              <Visual kind="grid" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-cream-line bg-cream">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal className="text-center">
            <div className="font-mono text-[13px] uppercase tracking-[0.14em] text-lime">{t.faq.label}</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-4 max-w-xl text-balance text-center font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
              {t.faq.title}
            </h2>
          </Reveal>
          <Stagger className="mt-12 space-y-4" gap={0.06}>
            {faq.map((item) => (
              <StaggerItem key={item.question}>
                <details className="group rounded border border-cream-line bg-white p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                    {item.question}
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-[2px] border border-cream-line text-lime transition-transform duration-300 group-open:rotate-45">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-ink-soft">{item.answer}</p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
