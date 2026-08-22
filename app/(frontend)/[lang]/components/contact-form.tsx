"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import LocaleLink from "./locale-link";

type ContactDict = Dictionary["contact"];

type FieldErrors = { name?: string; email?: string; message?: string };

const fieldCls =
  "w-full rounded-[2px] border border-white/15 bg-night px-4 py-3.5 text-[15px] text-bone placeholder:text-bone-dim outline-none transition-colors focus:border-lime";

export default function ContactForm({ t }: { t: ContactDict }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
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
      <div className="flex min-h-72 flex-col items-start justify-center rounded border border-white/10 bg-night-soft p-8 sm:p-[42px]">
        <span className="flex size-12 items-center justify-center rounded-full bg-lime text-white">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-bone">{t.success.title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone-soft">
          {t.success.message}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded border border-white/10 bg-night-soft p-6 sm:p-[42px]"
    >
      <div className="mb-6 text-[19px] font-semibold text-bone">{t.formTitle}</div>
      <div className="flex flex-col gap-4">
        <div>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder={t.form.name}
            className={fieldCls}
          />
          {errors.name && (
            <span className="mt-1.5 block text-xs text-red-400">{errors.name}</span>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder={t.form.email}
            className={fieldCls}
          />
          {errors.email && (
            <span className="mt-1.5 block text-xs text-red-400">{errors.email}</span>
          )}
        </div>
        <div>
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={onChange}
            placeholder={t.form.message}
            className={`${fieldCls} resize-y`}
          />
          {errors.message && (
            <span className="mt-1.5 block text-xs text-red-400">{errors.message}</span>
          )}
        </div>

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
          {submitting ? t.form.sending : t.form.submit}
        </button>

        <p className="text-[12.5px] leading-[1.5] text-bone-dim">
          {t.form.privacyPrefix}{" "}
          <LocaleLink href="/privacy-policy" className="text-lime-soft hover:text-bone">
            {t.form.privacyLink}
          </LocaleLink>
          {t.form.privacySuffix}
        </p>
      </div>
    </form>
  );
}
