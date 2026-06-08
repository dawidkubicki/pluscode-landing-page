import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import Contact from "../components/contact";
import Footer from "../components/footer";
import { Reveal, Stagger, StaggerItem } from "../components/motion";
import { TagPill } from "../components/ui";
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
      <PageHero eyebrow={t.breadcrumb} title={t.hero.title} intro={t.hero.subtitle} />

      <Contact locale={locale} showIntro={false} />

      {/* Location */}
      <section className="bg-cream px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <TagPill className="text-ink-soft">{t.location.label}</TagPill>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {t.location.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
                {t.location.description}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-cream-line bg-cream-dim/40 p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep">
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
                <div className="rounded-2xl border border-cream-line bg-cream-dim/40 p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime-deep">
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
            <div className="aspect-[4/3] overflow-hidden rounded-3xl">
              <Visual kind="grid" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-dim px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <TagPill className="text-ink-soft">{t.faq.label}</TagPill>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-6 max-w-xl text-balance text-center text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {t.faq.title}
            </h2>
          </Reveal>
          <Stagger className="mt-12 space-y-4" gap={0.06}>
            {faq.map((item) => (
              <StaggerItem key={item.question}>
                <details className="group rounded-2xl border border-cream-line bg-cream p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                    {item.question}
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-cream-line text-ink-soft transition-transform duration-300 group-open:rotate-45">
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
