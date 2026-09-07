"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "./locale-context";
import LocaleLink from "./locale-link";

type FormDict = Dictionary["form"];

/* The form sits on the page ground now, so a field is a white plate with a
   hairline: square, no radius, 18px ink text. The focus state moves the
   border to ink and nothing else. The outline is deliberately not set here,
   because the global `:focus-visible` rule in globals.css already draws the
   2px ink ring with its 2px offset on every input on this ground. */
const FIELD =
  "w-full border border-rule bg-white px-4 py-3.5 text-[1.125rem] leading-[1.375] text-ink placeholder:text-moss transition-colors duration-300 ease-io-attio focus:border-ink focus:duration-50";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fields the visitor fills in. Consent is tracked separately, as booleans. */
type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hearAbout: string;
  message: string;
};

const EMPTY: Values = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  hearAbout: "",
  message: "",
};

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.875rem] text-moss">
      {children}
      {required && <span className="ml-0.5 text-ink">*</span>}
    </label>
  );
}

/**
 * The single lead form used everywhere on the site: /book-a-call, the workshop
 * booking pages and the contact section. One shape means one place to keep the
 * consent wording correct, and every submission lands in the same collection
 * with the same columns.
 */
export default function LeadForm({
  t,
  offering,
  submitLabel,
  source,
  title,
}: {
  t: FormDict;
  /** Which page the request came from; drives the label in the notification. */
  offering: string;
  submitLabel: string;
  source?: string;
  /** Optional heading; omitted when the page headline already frames the form. */
  title?: string;
}) {
  const locale = useLocale();
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const id = (name: string) => `${uid}-${name}`;

  /** Leaving "required" under a field the visitor just filled in reads as broken. */
  const clearError = (name: string) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    clearError(name);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.firstName.trim()) e.firstName = t.errRequired;
    if (!values.lastName.trim()) e.lastName = t.errRequired;
    if (!values.email.trim()) e.email = t.errRequired;
    else if (!EMAIL_RE.test(values.email.trim())) e.email = t.errEmail;
    if (!values.hearAbout) e.hearAbout = t.errRequired;
    if (!values.message.trim()) e.message = t.errRequired;
    if (!consentTerms) e.consentTerms = t.errRequired;
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          consentTerms,
          consentMarketing,
          offering,
          locale,
          source,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.error);
      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-72 flex-col items-start justify-center border border-rule bg-white p-8 sm:p-10">
        {/* A filled ink square, not a coloured badge: the confirmation is a
            change of ground, which is the only emphasis this system has. */}
        <span className="flex size-12 items-center justify-center bg-ink text-white">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 text-heading-sm text-ink">{t.successTitle}</h3>
        <p className="mt-3 max-w-[46ch] text-[1.125rem] leading-[1.375] text-moss">
          {t.successMessage}
        </p>
      </div>
    );
  }

  /* The one colour on the site that is not in the palette. An invalid field
     has to read as invalid, and every palette value here is either the body
     colour or a hairline, so a validation message drawn in any of them says
     nothing. Red 700 measures 5.9:1 on white. */
  const Err = ({ k }: { k: string }) =>
    errors[k] ? (
      <span
        id={`${id(k)}-error`}
        className="mt-1.5 block text-[0.875rem] text-red-700"
      >
        {errors[k]}
      </span>
    ) : null;

  /** Shared wiring so an invalid field announces its message to screen readers. */
  const a11y = (k: string) =>
    errors[k]
      ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-error` }
      : {};

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border border-rule bg-white p-6 sm:p-10"
    >
      {title && <div className="mb-6 text-heading-sm text-ink">{title}</div>}
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor={id("firstName")} required>
              {t.firstName}
            </Label>
            <input
              id={id("firstName")}
              name="firstName"
              autoComplete="given-name"
              value={values.firstName}
              onChange={onChange}
              className={FIELD}
              {...a11y("firstName")}
            />
            <Err k="firstName" />
          </div>
          <div>
            <Label htmlFor={id("lastName")} required>
              {t.lastName}
            </Label>
            <input
              id={id("lastName")}
              name="lastName"
              autoComplete="family-name"
              value={values.lastName}
              onChange={onChange}
              className={FIELD}
              {...a11y("lastName")}
            />
            <Err k="lastName" />
          </div>
        </div>

        <div>
          <Label htmlFor={id("email")} required>
            {t.email}
          </Label>
          <input
            id={id("email")}
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={onChange}
            className={FIELD}
            {...a11y("email")}
          />
          <Err k="email" />
        </div>

        <div>
          <Label htmlFor={id("phone")}>{t.phone}</Label>
          <input
            id={id("phone")}
            type="tel"
            name="phone"
            autoComplete="tel"
            value={values.phone}
            onChange={onChange}
            className={FIELD}
          />
        </div>

        <div>
          <Label htmlFor={id("hearAbout")} required>
            {t.hearAbout}
          </Label>
          <div className="relative">
            <select
              id={id("hearAbout")}
              name="hearAbout"
              value={values.hearAbout}
              onChange={onChange}
              className={`${FIELD} appearance-none pr-11 ${values.hearAbout ? "" : "text-moss"}`}
              {...a11y("hearAbout")}
            >
              <option value="">{t.hearAboutPlaceholder}</option>
              {t.hearAboutOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-white text-ink">
                  {o.label}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-moss"
              fill="none"
            >
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Err k="hearAbout" />
        </div>

        <div>
          <Label htmlFor={id("message")} required>
            {t.message}
          </Label>
          <textarea
            id={id("message")}
            name="message"
            rows={4}
            value={values.message}
            onChange={onChange}
            className={`${FIELD} resize-y`}
            {...a11y("message")}
          />
          <Err k="message" />
        </div>

        <div className="flex flex-col gap-3.5 border-t border-rule pt-5">
          <div>
            <div className="flex items-start gap-3">
              <input
                id={id("consentTerms")}
                type="checkbox"
                checked={consentTerms}
                onChange={(e) => {
                  setConsentTerms(e.target.checked);
                  clearError("consentTerms");
                }}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-ink"
                {...a11y("consentTerms")}
              />
              <label
                htmlFor={id("consentTerms")}
                className="cursor-pointer text-[0.875rem] leading-[1.5] text-moss"
              >
                {t.consentTermsPrefix}{" "}
                <LocaleLink href="/terms-of-use" className="text-ink underline underline-offset-2 transition-colors duration-300 ease-io-attio hover:text-moss hover:duration-50">
                  {t.consentTermsLink}
                </LocaleLink>{" "}
                {t.consentTermsMiddle}{" "}
                <LocaleLink href="/privacy-policy" className="text-ink underline underline-offset-2 transition-colors duration-300 ease-io-attio hover:text-moss hover:duration-50">
                  {t.consentPrivacyLink}
                </LocaleLink>
                {t.consentTermsSuffix}
                <span className="ml-0.5 text-ink">*</span>
              </label>
            </div>
            <Err k="consentTerms" />
          </div>

          <div className="flex items-start gap-3">
            <input
              id={id("consentMarketing")}
              type="checkbox"
              checked={consentMarketing}
              onChange={(e) => setConsentMarketing(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-ink"
            />
            <div>
              <label
                htmlFor={id("consentMarketing")}
                className="cursor-pointer text-[0.875rem] leading-[1.5] text-moss"
              >
                {t.consentMarketing}
              </label>
              <details className="group mt-1">
                <summary className="cursor-pointer list-none text-[0.875rem] text-moss underline underline-offset-2 transition-colors duration-300 ease-io-attio hover:text-ink hover:duration-50">
                  {t.consentDetailsLabel}
                </summary>
                <p className="mt-2 text-[0.875rem] leading-[1.55] text-moss">
                  {t.consentDetailsText}
                </p>
              </details>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="border border-rule bg-paper-dim px-4 py-3">
            <p className="text-[1rem] text-red-700">{submitError}</p>
          </div>
        )}

        {/* The sanctioned dark button, stretched. `.btn` carries the size,
            the square edge, the hover step and the focus ring, so the only
            thing this call site adds is the full width. */}
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full disabled:opacity-60"
        >
          {submitting ? t.sending : submitLabel}
        </button>
      </div>
    </form>
  );
}
