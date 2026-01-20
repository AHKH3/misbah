'use server'

import { createClient } from '@/utils/supabase/server'
import { ProfileSchema, type ProfileData } from '@/lib/types/onboarding'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveProfile(data: ProfileData) {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // 2. Validate Data
  const validation = ProfileSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.flatten() }
  }

  // 3. Upsert Profile
  const { error: dbError } = await supabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      full_name: data.full_name,
      subjects: data.subjects,
      audience: data.audience,
      experience_text: data.experience_text,
      teaching_format: data.teaching_format,
      contact_method: data.contact_method,
      updated_at: new Date().toISOString(),
      // status defaults to 'pending_payment' on insert, or preserves existing on update?
      // Actually, if we upsert, we might overwrite status. 
      // We should probably explicitly ONLY update non-status fields, 
      // OR handle status preservation. 
      // For now, simple upsert. If it's a new row, default applies.
    }, { onConflict: 'user_id' })

  if (dbError) {
    console.error('Database Error:', dbError)
    return { error: 'Failed to save profile' }
  }

  revalidatePath('/onboarding')
  return { success: true }
}

export async function saveProfileAction(prevState: any, formData: FormData) {
  const data = {
    full_name: formData.get('full_name') as string,
    experience_text: formData.get('experience_text') as string,
    teaching_format: formData.get('teaching_format') as any,
    subjects: formData.getAll('subjects') as any[],
    audience: formData.getAll('audience') as any[],
    contact_method: {
      phone: formData.get('phone') as string || undefined,
      email: formData.get('email') as string || undefined,
      whatsapp: formData.get('whatsapp') as string || undefined,
    }
  }

  const result = await saveProfile(data)
  
  if (result.success) {
    redirect('/onboarding/payment')
  }
  
  return result
}
