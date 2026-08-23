import Footer from "./footer";
import LeadForm from "./lead-form";
import LocaleLink from "./locale-link";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { Arrow } from "./ui";
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

/** Simple check row on a light surface (outcomes, audience, prep). */
function CheckRow({ text }: { text: string }) {
  return (
    <div className="flex h-full items-start gap-3 rounded border border-cream-line bg-white p-5">
      <Check className="mt-0.5 size-5 shrink-0 text-lime" />
      <span className="text-[15px] leading-[1.6] text-ink">{text}</span>
    </div>
  );
}

/**
 * Full marketing page for a single workshop offering: dark hero with meta
 * chips, overview, outcomes, agenda, audience, optional prep and progression
 * sections, FAQ, and the same booking form the standalone booking screen uses,
 * anchored at #book so the hero CTA can jump straight to it.
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
  const chips = [
    page.meta.duration,
    page.meta.format,
    page.meta.price,
    page.meta.audience,
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-night text-bone">
        <div className="blueprint-grid absolute inset-0 -z-10" />
        <div className="absolute -right-44 -top-44 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,rgba(16,185,129,0)_65%)]" />

        <div className="mx-auto max-w-[1240px] px-5 pb-16 pt-40 sm:px-10 sm:pb-20 sm:pt-[11rem]">
          <Reveal>
            <div className="mb-7 flex items-center gap-2.5">
              <span className="inline-block size-2 rounded-full bg-lime animate-pulse-dot" />
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-bone-dim sm:text-[13px]">
                {page.eyebrow}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display max-w-[940px] text-balance text-5xl sm:text-6xl lg:text-[4.5rem]">
              {page.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-[620px] text-lg leading-[1.65] text-bone-soft sm:text-[19px]">
              {page.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-block rounded-[2px] border border-white/15 px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-bone-soft"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <a
                href="#book"
                className="group inline-flex items-center gap-3 rounded-[2px] bg-lime px-[30px] py-4 text-[15.5px] font-semibold text-night transition-colors hover:bg-lime-bright"
              >
                {page.form.cta}
                <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <Reveal>
            <h2 className="text-balance font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
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
      <section className="border-t border-cream-line bg-cream">
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
      <section className="border-t border-cream-line bg-white">
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
                <div className="flex h-full flex-col border-b border-r border-cream-line bg-white p-7 sm:p-8">
                  <span className="font-serif text-5xl font-light text-lime">
                    {s.num}
                  </span>
                  <h3 className="mt-7 text-lg font-semibold text-ink">{s.title}</h3>
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
      <section className="border-t border-cream-line bg-cream">
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
      {page.prep && page.prep.items.length > 0 && (
        <section className="border-t border-cream-line bg-white">
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
        <section className="border-t border-cream-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-10 sm:py-[6.25rem]">
            <Reveal>
              <h2 className="text-balance text-center font-serif text-[2.5rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink sm:text-5xl">
                {idx.faqTitle}
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-4" gap={0.06}>
              {page.faq.map((item) => (
                <StaggerItem key={item.q}>
                  <details className="group rounded border border-cream-line bg-white p-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
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
      )}

      {/* Where this leads next */}
      {page.next && (
        <section className="border-t border-night-line bg-night text-bone">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <Reveal>
              <h2 className="display text-balance text-4xl leading-[1.1] sm:text-5xl">
                {page.next.title}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="text-[16px] leading-[1.7] text-bone-soft">
                  {page.next.text}
                </p>
                {page.next.linkLabel && (
                  <LocaleLink
                    href={page.next.slug ? `/workshops/${page.next.slug}` : "/book-a-call"}
                    className="group mt-7 inline-flex items-center gap-2.5 rounded-[2px] bg-lime px-7 py-4 text-[15px] font-semibold text-night transition-colors duration-300 hover:bg-lime-bright"
                  >
                    {page.next.linkLabel}
                    <Arrow className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
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
        className="scroll-mt-24 border-t border-night-line bg-night text-bone"
      >
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-10 sm:py-[6.25rem]">
          <div className="max-w-[720px]">
            <Reveal>
              <h2 className="display text-balance text-4xl sm:text-5xl">
                {page.form.title}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-5 text-[16px] leading-[1.7] text-bone-soft">
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
                <div className="rounded border border-white/10 bg-night-soft p-6 sm:p-7">
                  <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-lime-soft">
                    {booking.summaryTitle}
                  </div>
                  <div className="mt-3 text-[14px] leading-[1.5] text-bone-soft">
                    {[page.meta.duration, page.meta.format, page.meta.price].join(" · ")}
                  </div>
                  <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5">
                    {page.outcomes.items.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-bone-soft"
                      >
                        <Check className="mt-0.5 size-[15px] shrink-0 text-lime" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What happens next */}
                <div>
                  <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-bone-dim">
                    {booking.nextTitle}
                  </div>
                  <ol className="mt-4 flex flex-col gap-3">
                    {booking.steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-[11px] text-lime-soft">
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
                <div className="border-t border-white/10 pt-6">
                  <LocaleLink
                    href="/workshops"
                    className="inline-flex items-center gap-2 text-[14.5px] font-medium text-bone-dim transition-colors hover:text-bone"
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
