/**
 * Telegram Bot Notifications
 *
 * Sends real-time alerts to admin via Telegram Bot API
 *
 * Environment variables required:
 * - TELEGRAM_BOT_TOKEN: Your bot token from @BotFather
 * - TELEGRAM_CHAT_ID: Your chat/channel ID
 *
 * Setup:
 * 1. Create a bot via @BotFather on Telegram
 * 2. Get the bot token
 * 3. Start a chat with your bot
 * 4. Get your chat ID (use @userinfobot or API method)
 * 5. Add both to .env.local
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  disable_web_page_preview?: boolean;
}

/**
 * Send a notification to Telegram
 */
export async function sendTelegramNotification(
  message: string,
  options?: {
    parseMode?: 'HTML' | 'Markdown';
    disablePreview?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  // Check if Telegram is configured
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[Telegram Disabled] Would send:', message);
    return { success: false, error: 'Telegram not configured' };
  }

  const payload: TelegramMessage = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: options?.parseMode || 'HTML',
    disable_web_page_preview: options?.disablePreview ?? true,
  };

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('[Telegram Error]:', data);
      return { success: false, error: data.description || 'Unknown error' };
    }

    console.log('[Telegram Sent]:', message.substring(0, 50) + '...');
    return { success: true };
  } catch (error) {
    console.error('[Telegram Failed]:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send notification about new teacher registration
 */
export async function notifyNewTeacherRegistration(data: {
  fullName: string;
  fullNameEn: string;
  country: string;
  subjects: string[];
  profileId: string;
}) {
  const subjectsText = data.subjects.join(', ');

  const message = `
📝 <b>New Teacher Registration</b>

<b>Name:</b> ${data.fullName} / ${data.fullNameEn}
<b>Country:</b> ${data.country}
<b>Subjects:</b> ${subjectsText}

<b>Review:</b> https://misbah.site/admin/review/${data.profileId}
  `.trim();

  return sendTelegramNotification(message);
}

/**
 * Send notification about duplicate detection
 */
export async function notifyDuplicateDetection(data: {
  fullName: string;
  fullNameEn: string;
  subjects: string[];
  matchScore: number;
  profileId: string;
}) {
  const alertLevel = data.matchScore >= 85 ? '🔴 RED ALERT' : '⚠️ Warning';
  const subjectsText = data.subjects.join(', ');

  const message = `
${alertLevel}: <b>Duplicate Detection</b>

<b>Match Score:</b> ${data.matchScore}%
<b>Name:</b> ${data.fullName} / ${data.fullNameEn}
<b>Subjects:</b> ${subjectsText}

<b>Review:</b> https://misbah.site/admin/review/${data.profileId}
  `.trim();

  return sendTelegramNotification(message);
}

/**
 * Send notification about payment proof submission
 */
export async function notifyPaymentProofSubmitted(data: {
  fullName: string;
  profileId: string;
  paymentMethod: string;
}) {
  const message = `
💰 <b>Payment Proof Submitted</b>

<b>Teacher:</b> ${data.fullName}
<b>Method:</b> ${data.paymentMethod}

<b>Review Payment:</b> https://misbah.site/admin/payments
  `.trim();

  return sendTelegramNotification(message);
}

/**
 * Send notification about profile approval
 */
export async function notifyProfileApproved(data: {
  fullName: string;
  profileId: string;
  isFounder: boolean;
}) {
  const founderBadge = data.isFounder ? '🌟 Founding Teacher' : '';

  const message = `
✅ <b>Profile Approved</b> ${founderBadge}

<b>Teacher:</b> ${data.fullName}

Email sent to teacher.
  `.trim();

  return sendTelegramNotification(message);
}

/**
 * Send notification about profile rejection
 */
export async function notifyProfileRejected(data: {
  fullName: string;
  reason: string;
  bannedUntil?: string;
}) {
  const banInfo = data.bannedUntil
    ? `\n<b>Banned until:</b> ${data.bannedUntil}`
    : '';

  const message = `
❌ <b>Profile Rejected</b>

<b>Teacher:</b> ${data.fullName}
<b>Reason:</b> ${data.reason}${banInfo}

Email sent to teacher.
  `.trim();

  return sendTelegramNotification(message);
}

/**
 * Send notification about payment confirmation
 */
export async function notifyPaymentConfirmed(data: {
  fullName: string;
  profileSlug: string;
}) {
  const message = `
💳 <b>Payment Confirmed</b>

<b>Teacher:</b> ${data.fullName}

Invitation email sent.
<b>Profile URL:</b> https://misbah.site/teachers/${data.profileSlug}
  `.trim();

  return sendTelegramNotification(message);
}
