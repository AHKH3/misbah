'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveListing(profileId: string, subscriptionId: string) {
  const supabase = await createClient()

  // Auth Check (should match RLS technically, but good to check here too)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@example.com') {
    return { error: 'Unauthorized' }
  }

  // Transaction-like update? Supabase doesn't support transactions via client easily yet.
  // We'll do sequential updates.

  // 1. Update Subscription
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'verified',
      verified_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days
    })
    .eq('id', subscriptionId)

  if (subError) return { error: 'Failed to verify subscription' }

  // 2. Update Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', profileId)

  if (profileError) return { error: 'Failed to activate profile' }

  revalidatePath('/admin/review')
  return { success: true }
}

export async function rejectListing(profileId: string, subscriptionId: string, reason: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'admin@example.com') {
    return { error: 'Unauthorized' }
  }

  // 1. Update Subscription
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'rejected',
      rejection_reason: reason
    })
    .eq('id', subscriptionId)

  if (subError) return { error: 'Failed to reject subscription' }

  // 2. Update Profile (Revert to pending_payment? Or inactive? Spec says "Reject". 
  // If rejected, maybe they need to resubmit. 
  // Let's set to 'inactive' or keep 'payment_submitted' but with rejected sub? 
  // Probably set back to 'pending_payment' so they can try again?)
  // Let's set to 'pending_payment'.
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ status: 'pending_payment' })
    .eq('id', profileId)

  if (profileError) return { error: 'Failed to update profile' }

  revalidatePath('/admin/review')
  return { success: true }
}
