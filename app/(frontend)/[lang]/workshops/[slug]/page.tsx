import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "../../components/page-hero";
import Footer from "../../components/footer";
import BookingForm, { type BookingField } from "../../components/booking-form";
import { Reveal, Stagger, StaggerItem } from "../../components/motion";
import LocaleLink from "../../components/locale-link";
import { type VisualKind } from "../../components/visual";
import { isLocale, defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type WorkshopPage = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: { duration: string; format: string; price: string; audience: string };
  overview: { title: string; paragraphs: string[] };
  outcomes: { title: string; items: string[] };
  agenda: { title: string; steps: { num: string; title: string; desc: string }[] };
  audience: { title: string; items: string[] };
  faq: { q: string; a: string }[];
  form: { title: string; note: string; cta: string };
};

const CONFIG: Record<string, { fields: BookingField[]; visual: VisualKind }> = {
  "ai-opportunity-workshop": {
    fields: ["company", "teamSize", "format", "useCase", "message"],
    visual: "aurora",
  },
  "ai-discovery-sprint": {
    fields: ["company", "teamSize", "useCase", "timeline", "message"],
    visual: "nodes",
  },
  "genai-proof-of-concept": {
    fields: ["company", "useCase", "timeline", "message"],
    visual: "grid",
  },
  "fractional-ai-team": {
    fields: ["company", "teamSize", "useCase", "timeline", "message"],
    visual: "mesh",
  },
};

const resolve = (lang: string): Locale => (isLocale(lang) ? lang : defaultLocale);

function getPage(locale: Locale, slug: string): WorkshopPage | null {
  const pages = getDictionary(locale).workshops.pages as unknown as Record<
    string,
    WorkshopPage
  >;
  return pages[slug] ?? null;
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    Object.keys(CONFIG).map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const wp = getPage(resolve(lang), slug);
  if (!wp) return {};
  return { title: wp.title, description: wp.subtitle };
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = resolve(lang);
  const wp = getPage(locale, slug);
  const cfg = CONFIG[slug];
  if (!wp || !cfg) notFound();

  const dict = getDictionary(locale);
  const idx = dict.workshops.index;

  return (
    <main>
      <PageHero eyebrow={wp.eyebrow} title={wp.title} intro={wp.subtitle} visual={cfg.visual} />

      {/* At a glance + overview */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-10 sm:py-20">
          <div className="grid gap-4 border-y border-cream-line py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[
              [idx.durationLabel, wp.meta.duration],
              ["Format", wp.meta.format],
              ["Scope", wp.meta.price],
              [idx.forLabel, wp.meta.audience],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-mute">
                  {label}
                </div>
                <div className="mt-1.5 text-[16px] font-medium text-ink">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">
            <div>
              <Reveal>
                <h2 className="font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-ink sm:text-[2.75rem]">
                  {wp.overview.title}
                </h2>
              </Reveal>
              <div className="mt-6 flex flex-col gap-4">
                {wp.overview.paragraphs.map((p, i) => (
                  <Reveal key={i} delay={0.05 + i * 0.05}>
                    <p className="max-w-[560px] text-[16.5px] leading-[1.7] text-ink-soft">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="rounded border border-cream-line bg-cream p-7 sm:p-8">
                <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-lime">
                  {wp.outcomes.title}
                </div>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {wp.outcomes.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15.5px] text-ink">
                      <Check className="mt-0.5 size-[18px] shrink-0 text-lime" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <LocaleLink
                  href="#book"
                  className="mt-7 inline-flex w-full items-center justify-center rounded-[2px] bg-lime px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-lime-bright"
                >
                  {wp.form.cta}
                </LocaleLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Agenda + audience */}
      <section className="border-t border-cream-line bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-10 sm:py-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_360px] lg:gap-20">
            <div>
              <Reveal>
                <h2 className="font-serif text-[2rem] font-medium tracking-[-0.01em] text-ink sm:text-[2.5rem]">
                  {wp.agenda.title}
                </h2>
              </Reveal>
              <Stagger className="mt-10 flex flex-col" gap={0.08}>
                {wp.agenda.steps.map((step) => (
                  <StaggerItem key={step.num}>
                    <div className="grid gap-2 border-t border-cream-line py-7 sm:grid-cols-[minmax(0,72px)_1fr] sm:gap-x-10">
                      <div className="font-serif text-[2.25rem] font-light leading-none text-[#c3cede]">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                        <p className="mt-1.5 max-w-[520px] text-[15px] leading-[1.6] text-ink-soft">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <Reveal delay={0.1}>
              <div className="lg:pt-2">
                <h3 className="font-serif text-2xl font-medium text-ink">{wp.audience.title}</h3>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {wp.audience.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15.5px] leading-[1.5] text-ink-soft">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-cream-line bg-white">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-10 sm:py-20">
          <Reveal>
            <h2 className="text-balance text-center font-serif text-[2rem] font-medium tracking-[-0.01em] text-ink sm:text-[2.5rem]">
              {idx.faqTitle}
            </h2>
          </Reveal>
          <Stagger className="mt-10 space-y-4" gap={0.06}>
            {wp.faq.map((item) => (
              <StaggerItem key={item.q}>
                <details className="group rounded border border-cream-line bg-white p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink">
                    {item.q}
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-[2px] border border-cream-line text-lime transition-transform duration-300 group-open:rotate-45">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-ink-soft">{item.a}</p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="relative isolate scroll-mt-24 overflow-hidden bg-night text-bone">
        <div className="blueprint-grid absolute inset-0 -z-10 opacity-80" />
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 py-20 sm:px-10 sm:py-[6.25rem] lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-balance font-serif text-[2.25rem] font-medium leading-[1.1] tracking-[-0.01em] sm:text-[3rem]">
                {wp.form.title}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-5 max-w-[440px] text-[16.5px] leading-[1.7] text-bone-soft">
                {wp.form.note}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <LocaleLink
                href="/workshops"
                className="mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium text-bone-dim transition-colors hover:text-bone"
              >
                ← {idx.backToAll}
              </LocaleLink>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <BookingForm
              t={dict.workshops.form}
              offering={slug}
              fields={cfg.fields}
              title={wp.form.title}
              note={wp.form.note}
              submitLabel={wp.form.cta}
              source={`/workshops/${slug}`}
            />
          </Reveal>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
