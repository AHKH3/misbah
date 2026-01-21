'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type PaymentActionState = {
  error?: string;
  success?: boolean;
};

export async function submitPaymentProof(
  prevState: PaymentActionState,
  formData: FormData
): Promise<PaymentActionState> {
  const supabase = await createClient();

  // Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'يجب تسجيل الدخول أولاً / Please sign in first' };
  }

  // Get the profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: 'الملف الشخصي غير موجود / Profile not found' };
  }

  // Get the file
  const file = formData.get('proof') as File;
  if (!file || file.size === 0) {
    return { error: 'يرجى تحميل إثبات الدفع / Please upload payment proof' };
  }

  // Upload to storage
  const fileName = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return { error: 'فشل في تحميل الملف / Failed to upload file' };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(fileName);

  // Create subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .insert({
      profile_id: profile.id,
      plan_id: 'annual',
      payment_proof_url: urlData.publicUrl,
      status: 'pending',
    });

  if (subError) {
    console.error('Subscription Error:', subError);
    return { error: 'فشل في إنشاء الاشتراك / Failed to create subscription' };
  }

  // Update profile status
  await supabase
    .from('profiles')
    .update({ status: 'payment_submitted' })
    .eq('id', profile.id);

  revalidatePath('/onboarding');
  redirect('/onboarding/success');
}
