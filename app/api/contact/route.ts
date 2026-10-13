import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPayloadClient } from "@/lib/getPayload";
import { COMPANY } from "@/lib/company";
import { isLocale } from "@/lib/i18n/config";

// Lazy: `new Resend(undefined)` throws, and this module is evaluated during
// `next build` (page-data collection) where no runtime env exists.
let resendClient: Resend | null = null;
function getResend(): Resend {
  return (resendClient ??= new Resend(process.env.RESEND_API_KEY));
}

/** The form's inputs carry the same limits; these are the ones that count. */
const MAX = { name: 100, email: 200, message: 5000, source: 100 } as const;

/** Nobody reads the form, writes a message and agrees in under three seconds. */
const MIN_FILL_MS = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
  consentTerms?: unknown;
  locale?: unknown;
  source?: unknown;
  /** The honeypot. A person never sees it, so a value means a script. */
  website?: unknown;
  /** How long the form was open before it was sent, measured in the browser. */
  elapsedMs?: unknown;
}

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** A name or an address is one line: it ends up in an email subject. */
const oneLine = (value: unknown) => text(value).replace(/\s+/g, " ");

const esc = (s?: string) =>
  (s ?? "").replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] as string,
  );

const row = (label: string, value?: string) =>
  value ? `<p style="margin:8px 0"><strong>${label}:</strong> ${esc(value)}</p>` : "";

/**
 * What a script gets: the same answer a person gets, so it has nothing to
 * learn from, and nothing is stored or sent.
 */
function accepted(reason?: string) {
  if (reason) console.warn(`[contact] dropped a submission: ${reason}`);
  return NextResponse.json({ success: true }, { status: 200 });
}

const refused = () =>
  NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });

export async function POST(request: NextRequest) {
  try {
    let body: ContactBody;
    try {
      const parsed: unknown = await request.json();
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return refused();
      }
      body = parsed;
    } catch {
      return refused();
    }

    if (text(body.website) !== "") return accepted("honeypot filled");

    const firstName = oneLine(body.firstName);
    const lastName = oneLine(body.lastName);
    const email = oneLine(body.email);
    const message = text(body.message);

    // Consent is a legal record, not a preference: refuse the submission rather
    // than storing personal data the visitor did not agree to us holding.
    if (
      !firstName ||
      firstName.length > MAX.name ||
      !lastName ||
      lastName.length > MAX.name ||
      !email ||
      email.length > MAX.email ||
      !EMAIL_RE.test(email) ||
      !message ||
      message.length > MAX.message ||
      body.consentTerms !== true
    ) {
      return refused();
    }

    const elapsed = body.elapsedMs;
    if (typeof elapsed !== "number" || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
      return accepted("sent too fast, or without a fill time");
    }

    const locale = text(body.locale);
    const data = {
      firstName,
      lastName,
      email,
      // The collection also holds the leads of the earlier booking forms, and
      // this is the value that tells a plain message apart from those.
      offering: "general" as const,
      message,
      consentTerms: true,
      consentMarketing: false,
      locale: isLocale(locale) ? locale : undefined,
      source: text(body.source).slice(0, MAX.source) || undefined,
    };
    const fullName = `${firstName} ${lastName}`;

    // 1) Persist to Payload so messages are kept in the CMS. Degrade
    //    gracefully: if the DB is unreachable we still email and succeed.
    let stored = false;
    try {
      const payload = await getPayloadClient();
      await payload.create({ collection: "bookings", data });
      stored = true;
    } catch (err) {
      console.warn(
        "[contact] could not store the message in Payload:",
        err instanceof Error ? err.message : err,
      );
    }

    // 2) Notify the team via Resend (if configured).
    let emailed = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const toEmail = process.env.CONTACT_EMAIL || COMPANY.email;
        const { error } = await getResend().emails.send({
          from: "Pluscode Website <noreply@pluscode.io>",
          to: [toEmail],
          replyTo: email,
          subject: `New message from ${fullName}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color:#222222;">
            <h2 style="font-weight:500;border-bottom:1px solid #5f91ea;padding-bottom:10px;">
              New message from the contact form
            </h2>
            <div style="margin:16px 0;">
              ${row("Name", fullName)}
              ${row("Email", email)}
              ${row("Language", data.locale)}
              ${row("Sent from", data.source)}
            </div>
            <div style="background:#f0f0f0;padding:16px;margin:16px 0;">
              <h3 style="font-weight:500;margin:0 0 8px;">Message</h3>
              <p style="white-space:pre-wrap;margin:0;">${esc(message)}</p>
            </div>
            <p style="color:#767676;font-size:12px;">Reply to this email to answer ${esc(firstName)} directly. Stored in the CMS: ${stored ? "yes" : "no (database unavailable, this email is the record)"}.</p>
          </div>`,
        });
        if (error) console.error("[contact] Resend error:", error);
        else emailed = true;
      } catch (err) {
        console.error("[contact] Resend threw:", err instanceof Error ? err.message : err);
      }
    } else {
      console.warn("[contact] RESEND_API_KEY not set, skipping email.", { stored });
    }

    // Never lose a message silently. If neither the DB nor email captured it,
    // log the full submission. In production we ask the visitor to email us; in
    // dev we still return success so the form flow stays testable without a
    // database.
    if (!stored && !emailed) {
      console.error("[contact] MESSAGE NOT CAPTURED. Data:", JSON.stringify(data));
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: `Could not send right now. Please email ${COMPANY.email}.` },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[contact] unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}
