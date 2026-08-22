"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "./locale-context";
import LocaleLink from "./locale-link";

type FormDict = Dictionary["workshops"]["form"];

/** Optional extra fields, shown per offering. name + email are always shown. */
export type BookingField =
  | "company"
  | "teamSize"
  | "format"
  | "useCase"
  | "timeline"
  | "message";

const fieldCls =
  "w-full rounded-[2px] border border-white/15 bg-night px-4 py-3.5 text-[15px] text-bone placeholder:text-bone-dim outline-none transition-colors focus:border-lime";

export default function BookingForm({
  t,
  offering,
  fields,
  title,
  submitLabel,
  source,
}: {
  t: FormDict;
  offering: string;
  fields: BookingField[];
  /** Optional heading; omitted when the page headline already frames the form. */
  title?: string;
  submitLabel: string;
  source?: string;
}) {
  const locale = useLocale();
  const [form, setForm] = useState<Record<string, string>>({ name: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const has = (f: BookingField) => fields.includes(f);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = t.errName;
    if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t.errEmail;
    if (has("useCase") && !form.useCase?.trim()) e.useCase = t.errUseCase;
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
        body: JSON.stringify({ ...form, offering, locale, source }),
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
      <div className="flex min-h-72 flex-col items-start justify-center rounded border border-white/10 bg-night-soft p-8 sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-lime text-white">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-bone">{t.successTitle}</h3>
        <p className="mt-2 max-w-sm text-[14.5px] text-bone-soft">{t.successMessage}</p>
      </div>
    );
  }

  const Err = ({ k }: { k: string }) =>
    errors[k] ? <span className="mt-1.5 block text-xs text-red-400">{errors[k]}</span> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded border border-white/10 bg-night-soft p-6 sm:p-10">
      {title && <div className="mb-6 text-[19px] font-semibold text-bone">{title}</div>}
      <div className="flex flex-col gap-4">
        <div>
          <input name="name" value={form.name} onChange={onChange} placeholder={t.name} className={fieldCls} />
          <Err k="name" />
        </div>
        <div>
          <input type="email" name="email" value={form.email} onChange={onChange} placeholder={t.email} className={fieldCls} />
          <Err k="email" />
        </div>
        {has("company") && (
          <input name="company" value={form.company ?? ""} onChange={onChange} placeholder={t.company} className={fieldCls} />
        )}
        {(has("teamSize") || has("format")) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {has("teamSize") && (
              <input name="teamSize" value={form.teamSize ?? ""} onChange={onChange} placeholder={t.teamSize} className={fieldCls} />
            )}
            {has("format") && (
              <input name="format" value={form.format ?? ""} onChange={onChange} placeholder={t.format} className={fieldCls} />
            )}
          </div>
        )}
        {has("timeline") && (
          <input name="timeline" value={form.timeline ?? ""} onChange={onChange} placeholder={t.timeline} className={fieldCls} />
        )}
        {has("useCase") && (
          <div>
            <textarea name="useCase" rows={3} value={form.useCase ?? ""} onChange={onChange} placeholder={t.useCase} className={`${fieldCls} resize-y`} />
            <Err k="useCase" />
          </div>
        )}
        {has("message") && (
          <textarea name="message" rows={3} value={form.message ?? ""} onChange={onChange} placeholder={t.message} className={`${fieldCls} resize-y`} />
        )}

        {submitError && (
          <div className="rounded-[2px] border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-300">{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-[2px] bg-lime p-4 text-[15.5px] font-semibold text-white transition-colors duration-300 hover:bg-lime-bright disabled:opacity-60"
        >
          {submitting ? t.sending : submitLabel}
        </button>

        <p className="text-[12.5px] leading-[1.5] text-bone-dim">
          {t.privacyPrefix}{" "}
          <LocaleLink href="/privacy-policy" className="text-lime-soft hover:text-bone">
            {t.privacyLink}
          </LocaleLink>
          {t.privacySuffix}
        </p>
      </div>
    </form>
  );
}
