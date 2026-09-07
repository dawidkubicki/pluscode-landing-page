import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Contact from "../components/contact";
import Footer from "../components/footer";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { Eyebrow } from "../components/ui";
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
      <section className="bg-paper-dim py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-6">
              <Reveal>
                <Eyebrow>{t.location.label}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">
                  {t.location.title}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                  {t.location.description}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="col-span-4 md:col-span-5 md:col-start-8">
              <div className="aspect-[4/3] overflow-hidden bg-paper">
                <Visual kind="grid" />
              </div>
            </Reveal>
          </div>

          {/* The address and the hours are two ruled cells on the grid, not
              two boxes: the hairline is the separation. */}
          <Reveal delay={0.15}>
            <div className="pc-grid mt-12 md:mt-16">
              <div className="col-span-4 border-t border-rule pt-8 md:col-span-3">
                <Eyebrow>{t.location.address.title}</Eyebrow>
                <p className="mt-3 text-[1.125rem] leading-[1.375] text-ink">
                  Kosowska 12/3
                  <br />
                  60-464 {t.location.address.line1}
                  <br />
                  {t.location.address.line2}
                </p>
              </div>
              <div className="col-span-4 border-t border-rule pt-8 md:col-span-3">
                <Eyebrow>{t.location.hours.title}</Eyebrow>
                <p className="mt-3 text-[1.125rem] leading-[1.375] text-ink">
                  {t.location.hours.weekdays}
                  <br />
                  {t.location.hours.timezone}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-8">
              <Reveal>
                <Eyebrow>{t.faq.label}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 text-heading-lg text-ink">{t.faq.title}</h2>
              </Reveal>
            </div>
          </div>
          {/* Each question is a ruled row in a reading column. Nothing is
              centred and nothing is a card. */}
          <Stagger className="pc-grid mt-16 md:mt-20" gap={0.06}>
            {faq.map((item) => (
              <StaggerItem
                key={item.question}
                className="col-span-4 border-t border-rule md:col-span-8"
              >
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.125rem] leading-[1.375] text-ink">
                    {item.question}
                    <span className="flex size-7 shrink-0 items-center justify-center border border-rule text-moss transition-transform duration-300 group-open:rotate-45">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                    {item.answer}
                  </p>
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
