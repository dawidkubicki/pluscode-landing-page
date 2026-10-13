"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "./locale-context";
import LocaleLink from "./locale-link";
import { ArrowButton } from "./ui";

type FormDict = Dictionary["contact"]["form"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The server refuses anything longer; the inputs stop the visitor first. */
const MAX = { name: 100, email: 200, message: 5000 } as const;

type Field = "firstName" | "lastName" | "email" | "message";
type ErrorKey = Field | "consent";

const EMPTY: Record<Field, string> = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

/* A field is a ruled line, like every list on the site: no box, no fill. An
   invalid one gets a second line of ink under the first, so the state does not
   rest on colour, which this palette could not supply anyway. */
const CONTROL =
  "mt-1 block w-full rounded-none border-0 border-b border-grey-mid bg-transparent px-0 py-3 text-body text-ink transition-colors duration-200 focus:border-ink aria-[invalid=true]:border-ink aria-[invalid=true]:shadow-[0_1px_0_0_var(--color-ink)]";

/**
 * The contact form. It posts to /api/contact, which stores the message in the
 * CMS and emails it to the team.
 *
 * Spam is handled without a third party: a field no person can see or reach,
 * and the time the form was open, both checked on the server. There is no
 * script to load and nothing for the visitor to solve.
 */
export default function ContactForm({
  t,
  newTabLabel,
}: {
  t: FormDict;
  /** Screen reader suffix for the privacy link, which opens beside the form. */
  newTabLabel: string;
}) {
  const locale = useLocale();
  const uid = useId();
  const [values, setValues] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed" | "sent">("idle");

  const statusRef = useRef<HTMLDivElement>(null);
  // Measured with the page's own monotonic clock and sent as a duration, so a
  // visitor whose computer clock is wrong is never mistaken for a script.
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  // The form is gone once the message is sent. Without this the keyboard
  // focus would fall back to the top of the document.
  useEffect(() => {
    if (status === "sent") statusRef.current?.focus();
  }, [status]);

  const id = (name: string) => `${uid}-${name}`;

  /** "Required" left under a field the visitor has just filled reads as broken. */
  const clearError = (key: ErrorKey) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as Field;
    setValues((v) => ({ ...v, [name]: e.target.value }));
    clearError(name);
  };

  const validate = () => {
    const found: Partial<Record<ErrorKey, string>> = {};
    if (!values.firstName.trim()) found.firstName = t.required;
    if (!values.lastName.trim()) found.lastName = t.required;
    if (!values.email.trim()) found.email = t.required;
    else if (!EMAIL_RE.test(values.email.trim())) found.email = t.invalidEmail;
    if (!values.message.trim()) found.message = t.required;
    if (!consent) found.consent = t.consentRequired;
    return found;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate();
    setErrors(found);
    const first = (Object.keys(found) as ErrorKey[])[0];
    if (first) {
      setStatus("idle");
      document.getElementById(id(first))?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          consentTerms: consent,
          locale,
          source: "contact-page",
          website,
          elapsedMs: Math.round(performance.now() - openedAt.current),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  /** Ties a field to its message so a screen reader reads both together. */
  const invalid = (key: ErrorKey) =>
    errors[key]
      ? { "aria-invalid": true as const, "aria-describedby": `${id(key)}-error` }
      : {};

  const message = (key: ErrorKey) =>
    errors[key] ? (
      <p id={`${id(key)}-error`} className="mt-2 text-small font-medium text-ink">
        {errors[key]}
      </p>
    ) : null;

  const sending = status === "sending";

  return (
    <div>
      {status !== "sent" && (
        <form
          onSubmit={onSubmit}
          noValidate
          aria-busy={sending}
          aria-labelledby={id("title")}
        >
          <h2 id={id("title")} className="text-title">
            {t.title}
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <div>
              <label htmlFor={id("firstName")} className="block text-small text-grey">
                {t.firstName}
              </label>
              <input
                id={id("firstName")}
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                maxLength={MAX.name}
                value={values.firstName}
                onChange={onChange}
                className={`${CONTROL} min-h-13`}
                {...invalid("firstName")}
              />
              {message("firstName")}
            </div>

            <div>
              <label htmlFor={id("lastName")} className="block text-small text-grey">
                {t.lastName}
              </label>
              <input
                id={id("lastName")}
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                maxLength={MAX.name}
                value={values.lastName}
                onChange={onChange}
                className={`${CONTROL} min-h-13`}
                {...invalid("lastName")}
              />
              {message("lastName")}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={id("email")} className="block text-small text-grey">
                {t.email}
              </label>
              <input
                id={id("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                maxLength={MAX.email}
                value={values.email}
                onChange={onChange}
                className={`${CONTROL} min-h-13`}
                {...invalid("email")}
              />
              {message("email")}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={id("message")} className="block text-small text-grey">
                {t.message}
              </label>
              <textarea
                id={id("message")}
                name="message"
                rows={5}
                autoComplete="off"
                required
                maxLength={MAX.message}
                value={values.message}
                onChange={onChange}
                className={`${CONTROL} min-h-36 resize-y`}
                {...invalid("message")}
              />
              {message("message")}
            </div>
          </div>

          {/* The trap. Off screen, out of the tab order and out of the
              accessibility tree, so only a script that fills every input it
              finds ever writes here. The name avoids anything a browser's
              autofill recognises (company, address, phone), because a real
              visitor's autofill filling it would silently drop their message. */}
          <div aria-hidden="true" className="absolute -left-[200vw] size-px overflow-hidden">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="mt-8">
            <div className="flex items-start gap-3">
              <input
                id={id("consent")}
                name="consentTerms"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  clearError("consent");
                }}
                className="mt-px size-6 shrink-0 cursor-pointer rounded-none accent-ink"
                {...invalid("consent")}
              />
              <label
                htmlFor={id("consent")}
                className="cursor-pointer pt-0.5 text-small text-grey"
              >
                {t.consent}{" "}
                <LocaleLink
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener"
                  className="pc-link text-ink"
                >
                  {t.consentLink}
                  <span className="sr-only">, {newTabLabel}</span>
                </LocaleLink>
              </label>
            </div>
            {message("consent")}
          </div>

          <div className="mt-8">
            <ArrowButton
              type="submit"
              tone="solid"
              disabled={sending}
              className="min-h-12 px-5 disabled:opacity-60"
            >
              {sending ? t.sending : t.submit}
            </ArrowButton>
          </div>
        </form>
      )}

      {/* One polite live region, mounted from the start so its changes are
          announced: it holds the failure line, and the confirmation that takes
          the form's place. */}
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {status === "failed" && (
          <p className="mt-6 text-small font-medium text-ink">{t.error}</p>
        )}
        {status === "sent" && (
          <>
            <h2 className="text-title">{t.successTitle}</h2>
            <p className="mt-3 text-body text-grey">{t.successText}</p>
          </>
        )}
      </div>
    </div>
  );
}
