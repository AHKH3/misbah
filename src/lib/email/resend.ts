/**
 * Resend Email Client Setup
 *
 * Environment variables required:
 * - RESEND_API_KEY: Your Resend API key
 * - RESEND_FROM_EMAIL: The verified sender email (e.g., noreply@misbah.site)
 */

import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@misbah.site';

/**
 * Send email with error handling
 */
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email Disabled] Would send:', { to, subject });
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const { data, error } = await getResend()!.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      return { success: false, error: error.message };
    }

    console.log('[Email Sent]:', { to, subject, id: data?.id });
    return { success: true, data };
  } catch (error) {
    console.error('[Email Send Failed]:', error);
    return { success: false, error: String(error) };
  }
}
