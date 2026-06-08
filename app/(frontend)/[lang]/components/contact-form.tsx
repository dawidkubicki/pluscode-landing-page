"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Arrow } from "./ui";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocaleLink from "./locale-link";

type ContactDict = Dictionary["contact"];

type FieldErrors = { name?: string; email?: string; message?: string };

const fieldCls =
  "w-full rounded-xl border border-night-line bg-night-soft px-4 py-3 text-sm text-bone placeholder:text-bone-soft/60 outline-none transition-colors focus:border-lime/60";
const labelCls =
  "font-mono text-[11px] uppercase tracking-[0.16em] text-bone-soft";

export default function ContactForm({ t }: { t: ContactDict }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!form.name.trim()) e.name = t.validation.nameRequired;
    else if (form.name.trim().length < 2) e.name = t.validation.nameMinLength;
    if (!form.email.trim()) e.email = t.validation.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t.validation.emailInvalid;
    if (!form.message.trim()) e.message = t.validation.messageRequired;
    else if (form.message.trim().length < 10)
      e.message = t.validation.messageMinLength;
    return e;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      let captchaToken = "";
      if (executeRecaptcha) {
        captchaToken = await executeRecaptcha("contact_form");
      }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSent(true);
      setForm({ name: "", email: "", company: "", message: "" });
      setErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to send message.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-72 flex-col items-start justify-center rounded-3xl border border-night-line bg-night-soft p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-lime text-ink">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 text-2xl font-medium text-bone">{t.success.title}</h3>
        <p className="mt-2 max-w-sm text-sm text-bone-soft">{t.success.message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-4 rounded-3xl border border-night-line bg-night-soft/50 p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelCls}>{t.form.name}</span>
          <input name="name" value={form.name} onChange={onChange} className={fieldCls} />
          {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
        </label>
        <label className="grid gap-2">
          <span className={labelCls}>{t.form.company}</span>
          <input name="company" value={form.company} onChange={onChange} className={fieldCls} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className={labelCls}>{t.form.email}</span>
        <input type="email" name="email" value={form.email} onChange={onChange} className={fieldCls} />
        {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
      </label>
      <label className="grid gap-2">
        <span className={labelCls}>{t.form.message}</span>
        <textarea name="message" rows={4} value={form.message} onChange={onChange} className={`${fieldCls} resize-none`} />
        {errors.message && <span className="text-xs text-red-400">{errors.message}</span>}
      </label>

      {submitError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-300">{submitError}</p>
        </div>
      )}

      <div className="mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center gap-2.5 rounded-full bg-lime px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-lime-deep disabled:opacity-60"
        >
          {submitting ? t.form.sending : t.form.submit}
          {!submitting && (
            <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </button>
      </div>

      <p className="text-xs leading-relaxed text-bone-soft/70">
        {t.form.privacyPrefix}{" "}
        <LocaleLink href="/privacy-policy" className="text-bone-soft underline underline-offset-2 hover:text-bone">
          {t.form.privacyLink}
        </LocaleLink>
        {t.form.privacySuffix}
      </p>
    </form>
  );
}
