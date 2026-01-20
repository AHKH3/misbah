'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitPaymentProof(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // 2. Get File
  const file = formData.get('proof') as File
  if (!file || file.size === 0) {
    return { error: 'Please upload a valid file' }
  }

  // 3. Upload to Storage
  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${Date.now()}.${fileExt}`
  
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('payment-proofs')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    return { error: 'Failed to upload image' }
  }

  // 4. Get Public URL (or signed, but let's assume public bucket for simplicity as per spec check? 
  // Spec says "Admin... View profile details and the uploaded payment proof". 
  // Migrations said "public: false". So we need signed URL or Admin access.
  // We'll store the path or the Signed URL? Storing path is better.
  // We'll store the full path or just the relative path. 
  // `uploadData.path` gives the relative path.
  
  // 5. Create Subscription
  // First get profile id
  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
  
  if (!profile) {
    return { error: 'Profile not found' }
  }

  const { error: subError } = await supabase.from('subscriptions').insert({
    profile_id: profile.id,
    plan_id: 'monthly',
    payment_proof_url: uploadData.path,
    status: 'pending'
  })

  if (subError) {
    console.error('Subscription Error:', subError)
    return { error: 'Failed to create subscription record' }
  }

  // 6. Update Profile Status
  const { error: profileError } = await supabase.from('profiles')
    .update({ status: 'payment_submitted' })
    .eq('id', profile.id)

  if (profileError) {
    return { error: 'Failed to update profile status' }
  }

  // 7. Success
  return { success: true }
}
