import type { ReactNode } from "react";
import Footer from "./footer";
import { Reveal } from "./motion";
import LeadForm from "./lead-form";
import LocaleLink from "./locale-link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CONTACT_PERSON } from "@/lib/contact-person";
import type { Locale } from "@/lib/i18n/config";

type BookingChrome = Dictionary["booking"];
type FormDict = Dictionary["form"];

/** Compact "what you're booking" card, shown beside the form on offering pages. */
export type BookingSummary = {
  meta: string;
  points: string[];
};

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Form-focused booking screen. Opens with a short header, then puts the form
 * front and centre with a lean support column (what you're booking, what
 * happens next, a named point of contact, trust). No marketing sections, so the
 * only thing to do on the page is submit the form.
 */
export function BookingScreen({
  locale,
  form,
  booking,
  clients,
  eyebrow,
  title,
  intro,
  offering,
  submitLabel,
  source,
  summary,
  summaryLabel,
  back,
}: {
  locale: Locale;
  form: FormDict;
  booking: BookingChrome;
  clients: string[];
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  offering: string;
  submitLabel: string;
  source?: string;
  /** Optional "what you're booking" card (offering pages). */
  summary?: BookingSummary;
  /** Heading for the summary card; defaults to the shared label. */
  summaryLabel?: string;
  /** Optional back link rendered beneath the header. */
  back?: { href: string; label: string };
}) {
  return (
    <main>
      {/* The whole screen sits on `night`, one step above the page, so it
          closes with a hairline against the footer and carries a corner glow
          of the accent (`lime` at 18%) to read as lit rather than as a gap. */}
      <section className="relative isolate overflow-hidden border-b border-night-line bg-night text-bone">
        <div className="pointer-events-none absolute -right-44 -top-44 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(51,102,255,0.18)_0%,rgba(51,102,255,0)_65%)]" />

        <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-36 sm:px-10 sm:pb-28 sm:pt-40">
          {/* Header */}
          <div className="max-w-[760px]">
            <Reveal>
              <div className="mb-7 flex items-center gap-2.5">
                <span className="inline-block size-2 rounded-full bg-lime-soft animate-pulse-dot" />
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-bone-dim sm:text-[13px]">
                  {eyebrow}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display text-balance text-4xl sm:text-5xl lg:text-[3.5rem]">
                {title}
              </h1>
            </Reveal>
            {intro && (
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[600px] text-lg leading-[1.65] text-bone-soft">
                  {intro}
                </p>
              </Reveal>
            )}
            {back && (
              <Reveal delay={0.15}>
                <LocaleLink
                  href={back.href}
                  className="mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium text-bone-dim transition-colors hover:text-bone"
                >
                  ← {back.label}
                </LocaleLink>
              </Reveal>
            )}
          </div>

          {/* Form + support column */}
          <div className="mt-14 grid items-start gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
            <Reveal delay={0.1}>
              <LeadForm
                t={form}
                offering={offering}
                submitLabel={submitLabel}
                source={source}
              />
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col gap-7 lg:sticky lg:top-28">
                {summary && (
                  <div className="rounded border border-night-line bg-night-soft p-6 sm:p-7">
                    <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-lime-soft">
                      {summaryLabel ?? booking.summaryTitle}
                    </div>
                    <div className="mt-3 text-[14px] leading-[1.5] text-bone-soft">{summary.meta}</div>
                    <ul className="mt-5 flex flex-col gap-2.5 border-t border-night-line pt-5">
                      {summary.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-bone-soft">
                          <Check className="mt-0.5 size-[15px] shrink-0 text-lime-soft" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What happens next */}
                <div>
                  <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-bone-dim">
                    {booking.nextTitle}
                  </div>
                  <ol className="mt-4 flex flex-col gap-3">
                    {booking.steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-cream-line-strong font-mono text-[11px] text-lime-soft">
                          {i + 1}
                        </span>
                        <span className="text-[14.5px] leading-[1.45] text-bone-soft">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Point of contact */}
                <div className="border-t border-night-line pt-6">
                  <div className="flex items-center gap-3.5">
                    {/* A round photo means "there is a live human here and you
                        can reach them", so the contact is his face rather than
                        his initials. Local file, not CMS: it has to be right on
                        first paint. */}
                    <span className="flex size-11 shrink-0 overflow-hidden rounded-full bg-photo-ground ring-1 ring-cream-line-strong">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={CONTACT_PERSON.photo.url}
                        alt={booking.contactName}
                        width={44}
                        height={44}
                        className="size-full object-cover object-center [filter:grayscale(1)_contrast(1.02)]"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <div>
                      <div className="text-[15px] font-semibold text-bone">{booking.contactName}</div>
                      <div className="text-[13px] text-bone-dim">{booking.contactRole}</div>
                    </div>
                  </div>
                  <p className="mt-3.5 text-[13.5px] text-bone-dim">
                    {booking.emailPrefix}{" "}
                    <a href="mailto:contact@pluscode.io" className="text-lime-soft transition-colors hover:text-bone">
                      contact@pluscode.io
                    </a>
                  </p>
                </div>

                {/* Trust */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-night-line pt-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-dim">
                    {booking.trustTitle}
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px] font-medium text-bone-soft">
                    {clients.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
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
