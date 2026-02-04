import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  captchaToken: string;
}

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

// Verify reCAPTCHA v3 token with Google
async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not set');
    return { success: false };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data: RecaptchaResponse = await response.json();
    
    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    // Recommended threshold is 0.5
    const SCORE_THRESHOLD = 0.5;
    
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return { success: false };
    }
    
    if (data.score !== undefined && data.score < SCORE_THRESHOLD) {
      console.warn(`reCAPTCHA score too low: ${data.score}`);
      return { success: false, score: data.score };
    }
    
    return { success: true, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return { success: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, company, message, captchaToken } = body;

    // Validate required fields
    if (!name || !email || !message || !captchaToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA v3
    const recaptchaResult = await verifyRecaptcha(captchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Get the recipient email from environment variable
    const toEmail = process.env.CONTACT_EMAIL || 'contact@pluscode.io';

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'PlusCode Contact Form <noreply@pluscode.io>', // Must be from a verified domain
      to: [toEmail],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p style="margin: 10px 0;"><strong>Company:</strong> ${company}</p>` : ''}
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; color: #333;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="color: #666; font-size: 12px;">
            This email was sent from the PlusCode website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
