'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { sendEmail } from '@/lib/email/resend';
import ApprovedEmail from '@/lib/email/templates/approved';
import ApprovedFounderEmail from '@/lib/email/templates/approved-founder';
import PaymentConfirmedEmail from '@/lib/email/templates/payment-confirmed';
import RejectedEmail from '@/lib/email/templates/rejected';
import {
  notifyProfileApproved,
  notifyProfileRejected,
  notifyPaymentConfirmed,
} from '@/lib/notifications/telegram';

type AdminAction =
  | 'approve'
  | 'reject'
  | 'request_changes'
  | 'suspend'
  | 'unsuspend'
  | 'send_invitation'
  | 'manual_status_change'
  | 'confirm_payment'
  | 'reject_payment';

import { isAdmin } from '@/lib/auth/is-admin';

// Helper to log admin actions
async function logAdminAction(
  supabase: Awaited<ReturnType<typeof createClient>>,
  adminId: string,
  profileId: string,
  action: AdminAction,
  previousStatus: string,
  newStatus: string,
  notes?: string
) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';

  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    profile_id: profileId,
    action,
    previous_status: previousStatus,
    new_status: newStatus,
    notes,
    ip_address: ip,
    user_agent: userAgent,
  });
}

/**
 * Approve profile and send email
 * - If is_founding = true: Send invitation email directly (no payment)
 * - If is_founding = false: Send "pay now" email
 */
export async function approveProfile(profileId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase))) return { error: 'Unauthorized' };

  // Get current profile
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('status, full_name, misbah_email, is_founding, slug')
    .eq('id', profileId)
    .single();

  if (fetchError || !profile) return { error: 'Profile not found' };

  const isFounder = profile.is_founding || false;

  if (isFounder) {
    // ===== FOUNDING TEACHER PATH =====
    // Generate invitation token (72h expiry)
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        status: 'approved',
        invitation_token: invitationToken,
        invitation_sent_at: new Date().toISOString(),
        invitation_expires_at: expiresAt.toISOString(),
      })
      .eq('id', profileId);

    if (updateError) return { error: 'Failed to approve profile' };

    // Send email
    const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${invitationToken}`;
    await sendEmail({
      to: profile.misbah_email,
      subject: 'مبارك! أنت من المعلمين المؤسسين في مصباح 🌟',
      react: ApprovedFounderEmail({
        teacherName: profile.full_name,
        invitationUrl,
        expiryHours: 72,
        profileSlug: profile.slug,
      }),
    });

    // Send Telegram notification
    await notifyProfileApproved({
      fullName: profile.full_name,
      profileId,
      isFounder: true,
    });

    // Log action
    await logAdminAction(supabase, user.id, profileId, 'approve', profile.status, 'approved', 'Founding teacher - no payment');

  } else {
    // ===== REGULAR TEACHER PATH =====
    // Update profile to approved (payment pending)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        status: 'approved',
      })
      .eq('id', profileId);

    if (updateError) return { error: 'Failed to approve profile' };

    // Send email with payment link
    const paymentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/payment?profile=${profileId}`;
    await sendEmail({
      to: profile.misbah_email,
      subject: 'تم قبولك في مصباح - أكمل الدفع الآن 🎉',
      react: ApprovedEmail({
        teacherName: profile.full_name,
        paymentUrl,
        profileId,
      }),
    });

    // Send Telegram notification
    await notifyProfileApproved({
      fullName: profile.full_name,
      profileId,
      isFounder: false,
    });

    // Log action
    await logAdminAction(supabase, user.id, profileId, 'approve', profile.status, 'approved', 'Payment pending');
  }

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Reject profile and apply ban
 * @param banDuration - '30d' | '90d' | 'permanent'
 */
export async function rejectProfile(
  profileId: string,
  reason: string,
  banDuration: '30d' | '90d' | 'permanent' = '30d'
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase))) return { error: 'Unauthorized' };

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, full_name, misbah_email')
    .eq('id', profileId)
    .single();

  if (!profile) return { error: 'Profile not found' };

  // Calculate ban_until date
  let banUntil: Date | null = null;
  if (banDuration === '30d') {
    banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + 30);
  } else if (banDuration === '90d') {
    banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + 90);
  } else if (banDuration === 'permanent') {
    banUntil = new Date('2099-12-31'); // Far future date
  }

  // Update profile (mark as rejected, set ban)
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      status: 'rejected',
      ban_until: banUntil?.toISOString() || null,
      ban_reason: reason,
    })
    .eq('id', profileId);

  if (updateError) return { error: 'Failed to reject profile' };

  // Send rejection email
  const reapplyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding`;
  await sendEmail({
    to: profile.misbah_email,
    subject: 'نتيجة طلب الانضمام إلى مصباح',
    react: RejectedEmail({
      teacherName: profile.full_name,
      rejectionReason: reason,
      canReapplyDate: banUntil ? banUntil.toLocaleDateString('ar-EG') : undefined,
      reapplyUrl,
    }),
  });

  // Send Telegram notification
  await notifyProfileRejected({
    fullName: profile.full_name,
    reason,
    bannedUntil: banUntil ? banUntil.toLocaleDateString('en-US') : undefined,
  });

  // Log action
  await logAdminAction(
    supabase,
    user.id,
    profileId,
    'reject',
    profile.status,
    'rejected',
    `${reason} | Ban: ${banDuration}`
  );

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Request changes to profile
 */
export async function requestChanges(profileId: string, message: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase))) return { error: 'Unauthorized' };

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', profileId)
    .single();

  if (!profile) return { error: 'Profile not found' };

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      status: 'needs_changes',
      admin_notes: message,
    })
    .eq('id', profileId);

  if (updateError) return { error: 'Failed to update profile' };

  // Log action
  await logAdminAction(supabase, user.id, profileId, 'request_changes', profile.status, 'needs_changes', message);

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Suspend a published profile
 */
export async function suspendProfile(profileId: string, reason: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase))) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', profileId)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ status: 'suspended', admin_notes: reason })
    .eq('id', profileId);

  if (updateError) return { error: 'Failed to suspend profile' };

  await logAdminAction(supabase, user.id, profileId, 'suspend', profile.status, 'suspended', reason);

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Change status manually (advanced admin function)
 */
export async function changeStatus(profileId: string, newStatus: string, reason: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase))) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', profileId)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', profileId);

  if (updateError) return { error: 'Failed to change status' };

  await logAdminAction(supabase, user.id, profileId, 'manual_status_change', profile.status, newStatus, reason);

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Confirm payment and send invitation
 * This is called AFTER admin verifies the payment proof screenshot
 */
export async function confirmPayment(profileId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase))) return { error: 'Unauthorized' };

  // Get profile data
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('full_name, misbah_email, slug, payment_status')
    .eq('id', profileId)
    .single();

  if (fetchError || !profile) return { error: 'Profile not found' };

  // Generate invitation token
  const invitationToken = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 72);

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      payment_status: 'confirmed',
      payment_confirmed_at: new Date().toISOString(),
      invitation_token: invitationToken,
      invitation_sent_at: new Date().toISOString(),
      invitation_expires_at: expiresAt.toISOString(),
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // 1 year
    })
    .eq('id', profileId);

  if (error) return { error: error.message };

  // Send invitation email
  const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${invitationToken}`;
  await sendEmail({
    to: profile.misbah_email,
    subject: 'تم تأكيد الدفع - أنشئ كلمة مرورك 🎊',
    react: PaymentConfirmedEmail({
      teacherName: profile.full_name,
      invitationUrl,
      expiryHours: 72,
      profileSlug: profile.slug,
    }),
  });

  // Send Telegram notification
  await notifyPaymentConfirmed({
    fullName: profile.full_name,
    profileSlug: profile.slug,
  });

  await logAdminAction(supabase, user.id, profileId, 'confirm_payment', profile.payment_status || 'proof_submitted', 'confirmed');
  revalidatePath('/admin/payments');
  revalidatePath('/directory'); // Update directory when published
  return { success: true };
}

/**
 * Reject payment proof
 */
export async function rejectPayment(profileId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isAdmin(supabase))) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('profiles')
    .update({
      payment_status: 'rejected',
      payment_proof_url: null, // Remove the rejected screenshot
      admin_notes: reason,
    })
    .eq('id', profileId);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, profileId, 'reject_payment', 'proof_submitted', 'rejected', reason);
  revalidatePath('/admin/payments');
  return { success: true };
}
