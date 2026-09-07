import Footer from "./footer";
import LeadForm from "./lead-form";
import LocaleLink from "./locale-link";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { Arrow, BandGlow, Eyebrow } from "./ui";
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

/** Simple check row, lifted one step off the band (outcomes, audience, prep). */
function CheckRow({ text }: { text: string }) {
  return (
    <div className="flex h-full items-start gap-3 rounded-xl border border-cream-line bg-cream-surface p-5">
      <Check className="mt-0.5 size-5 shrink-0 text-ink-mute" />
      <span className="text-[15px] leading-[1.6] text-ink">{text}</span>
    </div>
  );
}

/**
 * Full marketing page for a single workshop offering: page-ground hero with
 * meta chips, overview, outcomes, agenda, audience, optional prep and progression
 * sections, FAQ, and the same booking form the standalone booking screen uses,
 * anchored at #book so the hero CTA can jump straight to it. Only the closing
 * two bands sit on the lifted `night` ground, which is where the ask lives.
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
  const faqGround = hasPrep ? "bg-cream-dim" : "bg-cream";
  const chips = [
    page.meta.duration,
    page.meta.format,
    page.meta.price,
    page.meta.audience,
  ];

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-cream-line bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-36 sm:px-10 lg:pb-18 lg:pt-40 xl:pb-20 xl:pt-46">
          <Reveal>
            <Eyebrow>{page.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display mt-6 max-w-[16em] text-balance text-heading-md text-ink sm:text-heading-lg xl:text-heading-xl">
              {page.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[34em] text-[17px] leading-[1.65] text-ink-soft">
              {page.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-lg border border-cream-line bg-cream-surface px-3 py-1.5 text-[13px] text-ink-soft"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9">
              <a href="#book" className="btn btn-primary">
                {page.form.cta}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal>
            <h2 className="display max-w-[22em] text-balance text-heading-md text-ink lg:text-heading-lg">
              {page.overview.title}
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5">
            {page.overview.paragraphs.map((p, i) => (
              <Reveal key={p} delay={0.05 + i * 0.04}>
                <p
                  className={
                    i === 0
                      ? "text-[19px] leading-[1.7] text-ink"
                      : "text-[16px] leading-[1.75] text-ink-soft"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-cream-line bg-cream-dim">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <SectionHeading title={page.outcomes.title} className="mb-14" />
          <Stagger className="grid gap-4 sm:grid-cols-2" gap={0.05}>
            {page.outcomes.items.map((item) => (
              <StaggerItem key={item} className="h-full">
                <CheckRow text={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Agenda */}
      <section className="border-t border-cream-line bg-cream">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <SectionHeading
            eyebrow={page.eyebrow}
            title={page.agenda.title}
            className="mb-14"
          />
          <Stagger
            className="grid border-l border-t border-cream-line sm:grid-cols-2 lg:grid-cols-3"
            gap={0.08}
          >
            {page.agenda.steps.map((s) => (
              <StaggerItem key={s.num} className="h-full">
                <div className="flex h-full flex-col border-b border-r border-cream-line p-7 sm:p-8">
                  <span className="display text-heading-sm text-ink-mute">
                    {s.num}
                  </span>
                  <h3 className="mt-7 text-[19px] font-semibold leading-[1.25] text-ink">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">
                    {s.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Audience */}
      <section className="border-t border-cream-line bg-cream-dim">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <SectionHeading title={page.audience.title} className="mb-14" />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.05}>
            {page.audience.items.map((item) => (
              <StaggerItem key={item} className="h-full">
                <CheckRow text={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How to prepare */}
      {hasPrep && page.prep && (
        <section className="border-t border-cream-line bg-cream">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <SectionHeading
              title={page.prep.title}
              intro={page.prep.intro}
              className="mb-14"
            />
            <Stagger className="grid gap-4 sm:grid-cols-2" gap={0.05}>
              {page.prep.items.map((item) => (
                <StaggerItem key={item} className="h-full">
                  <CheckRow text={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* FAQ */}
      {page.faq.length > 0 && (
        <section className={`border-t border-cream-line ${faqGround}`}>
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <Reveal>
              <h2 className="display text-balance text-center text-heading-md text-ink lg:text-heading-lg">
                {idx.faqTitle}
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-4" gap={0.06}>
              {page.faq.map((item) => (
                <StaggerItem key={item.q}>
                  <details className="group rounded-[20px] border border-cream-line bg-cream-surface px-[23px] pb-[23px] pt-[21px]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                      {item.q}
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-cream-line text-ink-mute transition-transform duration-300 group-open:rotate-45">
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
      )}

      {/* Where this leads next */}
      {page.next && (
        <section className="border-t border-night-line bg-night text-bone">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <Reveal>
              <h2 className="display max-w-[12em] text-balance text-heading-md lg:text-heading-lg">
                {page.next.title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="max-w-[34em] text-[17px] leading-[1.65] text-bone-soft">
                  {page.next.text}
                </p>
                {page.next.linkLabel && (
                  <LocaleLink
                    href={page.next.slug ? `/workshops/${page.next.slug}` : "/book-a-call"}
                    className="btn btn-primary group mt-8"
                  >
                    {page.next.linkLabel}
                    <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </LocaleLink>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Booking */}
      <section
        id="book"
        className="relative isolate scroll-mt-24 overflow-hidden border-y border-night-line bg-night text-bone"
      >
        <BandGlow />
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <div className="max-w-[720px]">
            <Reveal>
              <h2 className="display max-w-[16em] text-balance text-heading-md lg:text-heading-lg">
                {page.form.title}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-5 max-w-[34em] text-[17px] leading-[1.65] text-bone-soft">
                {page.form.note}
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
            <Reveal delay={0.08}>
              <LeadForm
                t={dict.form}
                offering={slug}
                submitLabel={page.form.cta}
                source={`/workshops/${slug}`}
              />
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col gap-7 lg:sticky lg:top-28">
                {/* What you're booking */}
                <div className="rounded-[20px] border border-night-line bg-night-soft p-6 sm:p-7">
                  <div className="text-[13px] font-semibold text-bone">
                    {booking.summaryTitle}
                  </div>
                  <div className="mt-3 text-[14px] leading-[1.5] text-bone-soft">
                    {[page.meta.duration, page.meta.format, page.meta.price].join(" · ")}
                  </div>
                  <ul className="mt-5 flex flex-col gap-2.5 border-t border-night-line pt-5">
                    {page.outcomes.items.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-bone-soft"
                      >
                        <Check className="mt-0.5 size-[15px] shrink-0 text-bone-dim" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What happens next */}
                <div>
                  <div className="text-[13px] font-semibold text-bone">
                    {booking.nextTitle}
                  </div>
                  <ol className="mt-4 flex flex-col gap-3">
                    {booking.steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-night-line text-[11px] font-semibold text-bone-soft">
                          {i + 1}
                        </span>
                        <span className="text-[14.5px] leading-[1.45] text-bone-soft">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Back to all engagements */}
                <div className="border-t border-night-line pt-6">
                  <LocaleLink
                    href="/workshops"
                    className="inline-flex items-center gap-2 text-[14.5px] font-medium text-bone-dim transition-colors duration-300 ease-io-attio hover:text-bone hover:duration-50"
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
