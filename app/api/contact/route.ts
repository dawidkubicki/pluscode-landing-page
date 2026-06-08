import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  captchaToken?: string;
}

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  "error-codes"?: string[];
}

/** Verify reCAPTCHA v3 token with Google. Skipped when no secret is configured. */
async function verifyRecaptcha(
  token: string | undefined,
): Promise<{ success: boolean }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return { success: true }; // not configured → allow (dev)
  if (!token) return { success: false };

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      },
    );
    const data: RecaptchaResponse = await response.json();
    if (!data.success) return { success: false };
    if (data.score !== undefined && data.score < 0.5) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, company, message, captchaToken } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const recaptcha = await verifyRecaptcha(captchaToken);
    if (!recaptcha.success) {
      return NextResponse.json(
        { error: "Security verification failed. Please try again." },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      // No mail provider configured — log and report success so local dev works.
      console.warn("[contact] RESEND_API_KEY not set — skipping email send.");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const toEmail = process.env.CONTACT_EMAIL || "contact@pluscode.io";
    const { data, error } = await resend.emails.send({
      from: "Pluscode Contact Form <noreply@pluscode.io>",
      to: [toEmail],
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a0e17; border-bottom: 2px solid #3ba5f5; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p style="margin: 10px 0;"><strong>Company:</strong> ${company}</p>` : ""}
          </div>
          <div style="background-color: #f4f6fb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0a0e17; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; color: #333;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">Sent from the Pluscode website contact form.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}
