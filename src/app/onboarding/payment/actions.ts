'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type PaymentActionState = {
  error?: string;
} | void;

export async function submitPaymentProof(prevState: PaymentActionState, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('proof') as File;
  if (!file) {
    return { error: 'Please select a file' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File size must be less than 5MB' };
  }

  // Upload to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('payment_proofs')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return { error: 'Failed to upload image' };
  }

  // Get Public URL? No, bucket is private. We store the path.
  // Or we store the signed URL? Signed URLs expire.
  // We should store the filePath or the "public" URL if we made it public.
  // But strictly, we should construct the path and let Admin generate signed URL.
  // Let's store the full path in storage: `payment_proofs/filePath`

  // Actually, let's store the relative path and bucket. Or full path.
  // Let's store the full storage path for simplicity in Admin UI retrieval.
  // Actually, standard is to store just the path inside the bucket if we know the bucket.

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      payment_proof_url: filePath,
      payment_status: 'proof_submitted',
      // We don't change 'status' (profile status) here. It remains 'approved' or 'under_review'?
      // Wait, profile status flow: 
      // draft -> under_review -> approved (invite sent) -> published.
      // AFTER invitation, user is created.
      // Does Payment happen BEFORE or AFTER invitation?
      // "Phase 1... Admin Actions: ... invitationToken ... approved"
      // So profile is 'approved'.
      // After invitation, user logs in.
      // Then pays.
      // So payment happens when status is 'approved'.
      // After payment confirmed, status -> 'published'.
    })
    .eq('user_id', user.id);

  if (updateError) {
    return { error: 'Failed to update profile status' };
  }

  revalidatePath('/onboarding/payment');
  redirect('/onboarding/success');
}
