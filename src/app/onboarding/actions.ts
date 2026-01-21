'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Schema for validation
const ProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(2, 'Country is required'),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  audience: z.array(z.string()).min(1, 'Select at least one audience'),
  experience_text: z.string().min(20, 'Please provide more detail'),
  teaching_format: z.enum(['online', 'in_person', 'hybrid']),
  video_url: z.string().url('Please provide a valid YouTube URL'),
  contact_method: z.object({
    whatsapp: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    telegram: z.string().optional(),
  }).refine(
    (data) => data.whatsapp || data.email || data.telegram,
    'At least one contact method is required'
  ),
});

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function saveProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'يجب تسجيل الدخول أولاً / Please sign in first' };
  }

  // Parse form data
  const data = {
    full_name: formData.get('full_name') as string,
    country: formData.get('country') as string,
    subjects: formData.getAll('subjects') as string[],
    audience: formData.getAll('audience') as string[],
    experience_text: formData.get('experience_text') as string,
    teaching_format: formData.get('teaching_format') as string,
    video_url: formData.get('video_url') as string,
    contact_method: {
      whatsapp: (formData.get('whatsapp') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      telegram: (formData.get('telegram') as string) || undefined,
    },
  };

  // Validate
  const validation = ProfileSchema.safeParse(data);
  if (!validation.success) {
    const flattened = validation.error.flatten();
    return {
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    };
  }

  // Save to database
  const { error: dbError } = await supabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      full_name: data.full_name,
      country: data.country,
      subjects: data.subjects,
      audience: data.audience,
      experience_text: data.experience_text,
      teaching_format: data.teaching_format,
      video_url: data.video_url,
      contact_method: data.contact_method,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (dbError) {
    console.error('Database Error:', dbError);
    return { error: 'فشل في حفظ الملف / Failed to save profile' };
  }

  revalidatePath('/onboarding');
  redirect('/onboarding/payment');
}
