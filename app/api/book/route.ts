import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPayloadClient } from "@/lib/getPayload";

const resend = new Resend(process.env.RESEND_API_KEY);

const OFFERINGS = new Set([
  "ai-opportunity-workshop",
  "ai-discovery-sprint",
  "genai-proof-of-concept",
  "fractional-ai-team",
  "general",
]);

const OFFERING_LABELS: Record<string, string> = {
  "ai-opportunity-workshop": "AI Opportunity Workshop",
  "ai-discovery-sprint": "AI Discovery Sprint",
  "genai-proof-of-concept": "GenAI Proof-of-Concept",
  "fractional-ai-team": "Fractional AI Team",
  general: "General enquiry",
};

/** Must stay in sync with `hearAboutOptions` in the dictionaries. */
const HEAR_ABOUT = new Set([
  "search",
  "recommendation",
  "social",
  "event",
  "content",
  "other",
]);

const HEAR_ABOUT_LABELS: Record<string, string> = {
  search: "Search engine",
  recommendation: "Recommendation or referral",
  social: "Social media",
  event: "Event or conference",
  content: "Blog, article, or newsletter",
  other: "Other",
};

interface BookingBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  hearAbout?: string;
  message?: string;
  consentTerms?: boolean;
  consentMarketing?: boolean;
  offering?: string;
  locale?: string;
  source?: string;
}

const esc = (s?: string) =>
  (s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

const row = (label: string, value?: string) =>
  value ? `<p style="margin:8px 0"><strong>${label}:</strong> ${esc(value)}</p>` : "";

export async function POST(request: NextRequest) {
  try {
    const body: BookingBody = await request.json();
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();
    const hearAbout = body.hearAbout?.trim();
    const offering = OFFERINGS.has(body.offering ?? "") ? body.offering! : "general";

    // Consent is a legal record, not a preference: refuse the submission rather
    // than storing personal data the visitor did not agree to us holding.
    if (
      !firstName ||
      !lastName ||
      !message ||
      !hearAbout ||
      !HEAR_ABOUT.has(hearAbout) ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      body.consentTerms !== true
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const data = {
      firstName,
      lastName,
      email,
      offering,
      hearAbout,
      message,
      consentTerms: true,
      consentMarketing: body.consentMarketing === true,
      phone: body.phone?.trim() || undefined,
      locale: body.locale?.trim() || undefined,
      source: body.source?.trim() || undefined,
    };
    const fullName = `${firstName} ${lastName}`;

    // 1) Persist to Payload so submissions are counted in the CMS. Degrade
    //    gracefully: if the DB is unreachable we still email and succeed.
    let stored = false;
    try {
      const payload = await getPayloadClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: "bookings" as any, data: data as any });
      stored = true;
    } catch (err) {
      console.warn(
        "[book] could not store submission in Payload:",
        err instanceof Error ? err.message : err,
      );
    }

    // 2) Notify the team via Resend (if configured).
    let emailed = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const toEmail = process.env.CONTACT_EMAIL || "contact@pluscode.io";
        const label = OFFERING_LABELS[offering];
        const { error } = await resend.emails.send({
        from: "Pluscode Bookings <noreply@pluscode.io>",
        to: [toEmail],
        replyTo: email,
        subject: `New booking: ${label} — ${fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color:#0a1929;border-bottom:2px solid #2b5cff;padding-bottom:10px;">
              New ${esc(label)} request
            </h2>
            <div style="margin:16px 0;">
              ${row("Name", fullName)}
              ${row("Email", email)}
              ${row("Phone", data.phone)}
              ${row("Heard about us via", HEAR_ABOUT_LABELS[hearAbout])}
              ${row("Language", data.locale)}
              ${row("Page", data.source)}
              ${row("Marketing consent", data.consentMarketing ? "yes" : "no")}
            </div>
            <div style="background:#f7f8fa;padding:16px;border-radius:8px;margin:16px 0;">
              <h3 style="color:#0a1929;margin:0 0 8px;">About the project</h3>
              <p style="white-space:pre-wrap;color:#333;margin:0;">${esc(message)}</p>
            </div>
            <p style="color:#888;font-size:12px;">Stored in CMS: ${stored ? "yes" : "no (DB unavailable, this email is the record)"}.</p>
          </div>`,
        });
        if (error) console.error("[book] Resend error:", error);
        else emailed = true;
      } catch (err) {
        console.error("[book] Resend threw:", err instanceof Error ? err.message : err);
      }
    } else {
      console.warn("[book] RESEND_API_KEY not set, skipping email.", { offering, stored });
    }

    // Never lose a lead silently. If neither the DB nor email captured it, log
    // the full submission. In production we ask the user to email us; in dev we
    // still return success so the form flow stays testable without a database.
    if (!stored && !emailed) {
      console.error("[book] SUBMISSION NOT CAPTURED. Data:", JSON.stringify(data));
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Could not submit right now. Please email contact@pluscode.io." },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ success: true, stored, emailed }, { status: 200 });
  } catch (error) {
    console.error("[book] unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}
