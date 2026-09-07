import Footer from "./footer";
import LeadForm from "./lead-form";
import LocaleLink from "./locale-link";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { Arrow, Eyebrow } from "./ui";
import { Check, SectionHeading } from "./service-page";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Dictionary shape of one workshop detail page (`workshops.pages[slug]`).
 *
 * The dictionaries are ahead of the generated `Dictionary` type while new
 * locales land, so pages read this via a local cast instead of the raw type.
 * `prep` and `next` are optional: a page without them renders exactly as
 * before, so partially translated dictionaries stay safe to ship.
 */
export type WorkshopPage = {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: { duration: string; format: string; price: string; audience: string };
  overview: { title: string; paragraphs: string[] };
  outcomes: { title: string; items: string[] };
  agenda: { title: string; steps: { num: string; title: string; desc: string }[] };
  audience: { title: string; items: string[] };
  /** Optional "how to prepare / who to bring" checklist. */
  prep?: { title: string; intro?: string; items: string[] };
  faq: { q: string; a: string }[];
  /** Optional progression band pointing at the next engagement in the chain. */
  next?: { title: string; text: string; linkLabel?: string; slug?: string | null };
  form: { title: string; note: string; cta: string };
};

/** One checklist line. The cell it sits in carries the hairline, so the row
 *  itself is only the mark and the text. */
function CheckRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Check className="mt-1 size-5 shrink-0 text-ink" />
      <span className="text-[1.125rem] leading-[1.375] text-ink">{text}</span>
    </div>
  );
}

/** A checklist cell: two per row above 768px, ruled at the top. */
const CHECK_CELL = "col-span-4 border-t border-rule pt-6 md:col-span-6";

/**
 * Full marketing page for a single workshop offering: page-ground hero with
 * meta chips, overview, outcomes, agenda, audience, optional prep and progression
 * sections, FAQ, and the same booking form the standalone booking screen uses,
 * anchored at #book so the hero CTA can jump straight to it.
 *
 * Only the progression band is on ink now. The booking band moved to the page
 * ground with the form: the form is a white plate whose focus ring has to be
 * ink, and inside an `on-dark` band the global ring turns white.
 */
export default function WorkshopPageView({
  locale,
  slug,
  page,
}: {
  locale: Locale;
  slug: string;
  page: WorkshopPage;
}) {
  const dict = getDictionary(locale);
  const idx = dict.workshops.index;
  const booking = dict.booking;
  const hasPrep = Boolean(page.prep && page.prep.items.length > 0);
  // The prep band is optional, so the page / off band alternation has to be
  // computed. Hard-coding it puts two identical grounds either side of the FAQ
  // on whichever half of the pages does not carry a prep section.
  const faqGround = hasPrep ? "bg-paper-dim" : "bg-paper";
  const chips = [
    page.meta.duration,
    page.meta.format,
    page.meta.price,
    page.meta.audience,
  ];

  return (
    <main>
      {/* Hero. The same inset as `PageHero`: the header is fixed, so the top
          padding is what leaves clear ground under it. */}
      <section className="bg-paper pb-20 pt-40 md:pb-[104px] md:pt-48">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-8">
              <Reveal>
                <Eyebrow>{page.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="mt-4 text-heading-xl text-ink">{page.title}</h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                  {page.subtitle}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center border border-rule px-3 py-1.5 text-[1rem] text-moss"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8">
                  <a href="#book" className="btn btn-primary">
                    {page.form.cta}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-7">
              <Reveal>
                <h2 className="text-heading-lg text-ink">
                  {page.overview.title}
                </h2>
              </Reveal>
              <div className="mt-8 space-y-5">
                {page.overview.paragraphs.map((p, i) => (
                  <Reveal key={p} delay={0.05 + i * 0.04}>
                    <p
                      className={`max-w-[46ch] text-[1.125rem] leading-[1.375] ${
                        i === 0 ? "text-ink" : "text-moss"
                      }`}
                    >
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-paper-dim py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              title={page.outcomes.title}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.05}>
            {page.outcomes.items.map((item) => (
              <StaggerItem key={item} className={CHECK_CELL}>
                <CheckRow text={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Agenda */}
      <section className="bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              eyebrow={page.eyebrow}
              title={page.agenda.title}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.08}>
            {page.agenda.steps.map((s) => (
              <StaggerItem
                key={s.num}
                className="col-span-4 border-t border-rule pt-8 "
              >
                <span className="text-[0.875rem] text-moss">{s.num}</span>
                <h3 className="mt-3 text-heading-sm text-ink">{s.title}</h3>
                <p className="mt-4 text-[1.125rem] leading-[1.375] text-moss">
                  {s.desc}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Audience */}
      <section className="bg-paper-dim py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <SectionHeading
              title={page.audience.title}
              className="col-span-4 md:col-span-8"
            />
          </div>
          <Stagger className="pc-grid mt-16 md:mt-24" gap={0.05}>
            {page.audience.items.map((item) => (
              <StaggerItem key={item} className={CHECK_CELL}>
                <CheckRow text={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How to prepare */}
      {hasPrep && page.prep && (
        <section className="bg-paper py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <SectionHeading
                title={page.prep.title}
                intro={page.prep.intro}
                className="col-span-4 md:col-span-8"
              />
            </div>
            <Stagger className="pc-grid mt-16 md:mt-24" gap={0.05}>
              {page.prep.items.map((item) => (
                <StaggerItem key={item} className={CHECK_CELL}>
                  <CheckRow text={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQ */}
      {page.faq.length > 0 && (
        <section className={`py-20 md:py-[104px] ${faqGround}`}>
          <div className="pc-shell">
            <div className="pc-grid">
              <Reveal className="col-span-4 md:col-span-8">
                <h2 className="text-heading-lg text-ink">{idx.faqTitle}</h2>
              </Reveal>
            </div>
            <Stagger className="pc-grid mt-16 md:mt-20" gap={0.06}>
              {page.faq.map((item) => (
                <StaggerItem
                  key={item.q}
                  className="col-span-4 border-t border-rule md:col-span-8"
                >
                  <details className="group py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.125rem] leading-[1.375] text-ink">
                      {item.q}
                      <span className="flex size-7 shrink-0 items-center justify-center border border-rule text-moss transition-transform duration-300 group-open:rotate-45">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                      {item.a}
                    </p>
                  </details>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Where this leads next. The one dark plate on the page, laid out on
          the header pair every closing band uses. */}
      {page.next && (
        <section className="on-dark bg-ink py-20 md:py-[104px]">
          <div className="pc-shell">
            <div className="pc-grid">
              <Reveal className="col-span-4 md:col-span-6">
                <h2 className="text-heading-lg text-white">{page.next.title}</h2>
              </Reveal>
              <Reveal
                delay={0.08}
                className="col-span-4 flex flex-col items-start gap-5 md:col-span-6 md:items-end md:justify-end"
              >
                <p className="max-w-[46ch] text-[1.125rem] leading-[1.375] text-mist">
                  {page.next.text}
                </p>
                {page.next.linkLabel && (
                  <LocaleLink
                    href={page.next.slug ? `/workshops/${page.next.slug}` : "/book-a-call"}
                    className="btn btn-invert"
                  >
                    {page.next.linkLabel}
                    <Arrow className="size-4" />
                  </LocaleLink>
                )}
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Booking */}
      <section id="book" className="scroll-mt-24 bg-paper py-20 md:py-[104px]">
        <div className="pc-shell">
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-8">
              <Reveal>
                <h2 className="text-heading-lg text-ink">{page.form.title}</h2>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                  {page.form.note}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="pc-grid mt-16 md:mt-24">
            <Reveal delay={0.08} className="col-span-4 md:col-span-7">
              <LeadForm
                t={dict.form}
                offering={slug}
                submitLabel={page.form.cta}
                source={`/workshops/${slug}`}
              />
            </Reveal>

            <Reveal
              delay={0.12}
              className="col-span-4 md:col-start-9"
            >
              <div className="flex flex-col gap-10 md:sticky md:top-28">
                {/* What you're booking */}
                <div className="border-t border-rule pt-8">
                  <Eyebrow>{booking.summaryTitle}</Eyebrow>
                  <div className="mt-3 text-[1rem] leading-[1.375] text-ink">
                    {[page.meta.duration, page.meta.format, page.meta.price].join(" · ")}
                  </div>
                  <ul className="mt-5 flex flex-col gap-2.5 border-t border-rule pt-5">
                    {page.outcomes.items.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-[1rem] leading-[1.375] text-moss"
                      >
                        <Check className="mt-1 size-4 shrink-0 text-ink" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What happens next */}
                <div className="border-t border-rule pt-8">
                  <Eyebrow>{booking.nextTitle}</Eyebrow>
                  <ol className="mt-4 flex flex-col gap-3">
                    {booking.steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center border border-rule text-[0.875rem] text-moss">
                          {i + 1}
                        </span>
                        <span className="text-[1rem] leading-[1.375] text-ink">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Back to all engagements */}
                <div className="border-t border-rule pt-8">
                  <LocaleLink
                    href="/workshops"
                    className="pc-link inline-block text-[1.125rem] text-moss"
                  >
                    ← {idx.backToAll}
                  </LocaleLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
