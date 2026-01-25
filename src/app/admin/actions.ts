'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

type AdminAction =
  | 'approve'
  | 'reject'
  | 'request_changes'
  | 'suspend'
  | 'unsuspend'
  | 'send_invitation'
  | 'manual_status_change';

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

// Approve profile and send invitation
export async function approveProfile(profileId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Get current profile
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('status, contact_method')
    .eq('id', profileId)
    .single();

  if (fetchError || !profile) return { error: 'Profile not found' };

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

  // Log action
  await logAdminAction(supabase, user.id, profileId, 'approve', profile.status, 'approved');

  revalidatePath('/admin');
  return { success: true, invitationToken };
}

// Reject profile
export async function rejectProfile(profileId: string, reason: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', profileId)
    .single();

  if (!profile) return { error: 'Profile not found' };

  // Delete profile (rejected profiles are not kept)
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId);

  if (deleteError) return { error: 'Failed to reject profile' };

  // Log action
  await logAdminAction(supabase, user.id, profileId, 'reject', profile.status, 'deleted', reason);

  revalidatePath('/admin');
  return { success: true };
}

// Request changes
export async function requestChanges(profileId: string, message: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

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

// Suspend profile
export async function suspendProfile(profileId: string, reason: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

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

// Change status manually
export async function changeStatus(profileId: string, newStatus: string, reason: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

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
