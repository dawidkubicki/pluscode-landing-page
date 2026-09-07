import type { ReactNode } from "react";
import Footer from "./footer";
import { Reveal } from "./motion";
import LeadForm from "./lead-form";
import LocaleLink from "./locale-link";
import { Eyebrow } from "./ui";
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
 *
 * The screen sits on the page ground, on the same 12 column grid and with the
 * same header inset as `PageHero`: the header is fixed, so `pt-40` is what
 * leaves clear ground under it. What is gone is the lifted `night` plate, the
 * accent glow in its corner and the pulsing dot beside the eyebrow. There are
 * no glows in this system and the dot was a lit accent marker with nothing
 * left to be lit in; the label carries itself. The form is a white plate whose
 * focus ring has to be ink, which an `on-dark` band would repaint white.
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
      <section className="bg-paper pb-20 pt-40 md:pb-[104px] md:pt-48">
        <div className="pc-shell">
          {/* Header */}
          <div className="pc-grid">
            <div className="col-span-4 md:col-span-8">
              <Reveal>
                <Eyebrow>{eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="mt-4 text-heading-xl text-ink">{title}</h1>
              </Reveal>
              {intro && (
                <Reveal delay={0.1}>
                  <p className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
                    {intro}
                  </p>
                </Reveal>
              )}
              {back && (
                <Reveal delay={0.15}>
                  <LocaleLink
                    href={back.href}
                    className="pc-link mt-8 inline-block text-[1.125rem] text-moss"
                  >
                    ← {back.label}
                  </LocaleLink>
                </Reveal>
              )}
            </div>
          </div>

          {/* Form, then the support column in the last four columns */}
          <div className="pc-grid mt-16 md:mt-24">
            <Reveal delay={0.1} className="col-span-4 md:col-span-7">
              <LeadForm
                t={form}
                offering={offering}
                submitLabel={submitLabel}
                source={source}
              />
            </Reveal>

            <Reveal
              delay={0.15}
              className="col-span-4 md:col-start-9"
            >
              <div className="flex flex-col gap-10 md:sticky md:top-28">
                {summary && (
                  <div className="border-t border-rule pt-8">
                    <Eyebrow>{summaryLabel ?? booking.summaryTitle}</Eyebrow>
                    <div className="mt-3 text-[1rem] leading-[1.375] text-ink">
                      {summary.meta}
                    </div>
                    <ul className="mt-5 flex flex-col gap-2.5 border-t border-rule pt-5">
                      {summary.points.map((p) => (
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
                )}

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

                {/* Point of contact */}
                <div className="border-t border-rule pt-8">
                  <div className="flex items-center gap-3.5">
                    {/* A photograph means "there is a live human here and you
                        can reach them", so the contact is his face rather than
                        his initials. Square like every other image on the site,
                        and a local file rather than the CMS: it has to be right
                        on first paint. */}
                    <span className="flex size-11 shrink-0 overflow-hidden bg-paper-dim">
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
                      <div className="text-[1.125rem] leading-[1.375] text-ink">
                        {booking.contactName}
                      </div>
                      <div className="text-[0.875rem] text-moss">
                        {booking.contactRole}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-[1rem] leading-[1.375] text-moss">
                    {booking.emailPrefix}{" "}
                    <a href="mailto:contact@pluscode.io" className="pc-link text-ink">
                      contact@pluscode.io
                    </a>
                  </p>
                </div>

                {/* Trust */}
                <div className="border-t border-rule pt-8">
                  <Eyebrow>{booking.trustTitle}</Eyebrow>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[1rem] text-ink">
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
