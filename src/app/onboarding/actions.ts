'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

// Types for experience and qualification
interface ExperienceEntry {
  id: string;
  organization: string;
  organizationType: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

// Schema for validation
const ProfileSchema = z.object({
  // Step 1
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  full_name_en: z.string().min(2, 'English name must be at least 2 characters'),
  title: z.string().min(1, 'Title is required'),
  gender: z.enum(['male', 'female']),
  birth_date: z.string().min(1, 'Birth date is required'),
  country: z.string().min(2, 'Country is required'),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  specializations: z.any(), // Flexible JSON schema for dynamic options

  // Step 2
  experiences: z.array(z.object({
    id: z.string(),
    organization: z.string(),
    organizationType: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable(),
    description: z.string(),
  })).min(1, 'Add at least one experience'),

  education: z.array(z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable(),
    description: z.string(),
  })), // Removed .min(1) as education might be optional? Let's check constraints. Let's keep it optional for now or require it? Usually required but let's be flexible.

  teaching_types: z.array(z.string()).optional(), // Made optional as it's not in new wizard directly
  madhab: z.string().optional(),

  // Step 3
  audience: z.array(z.string()).min(1, 'Select at least one audience'),
  student_age_min: z.number().nullable().optional(),
  student_age_max: z.number().nullable().optional(),
  student_gender: z.string().optional(),
  price_amount: z.number().nullable().optional(),
  price_currency: z.string().optional(),

  // Step 4
  teaching_format: z.enum(['online', 'in_person', 'hybrid']),
  video_url: z.string().url('Please provide a valid YouTube URL'),
  contact_method: z.object({
    whatsapp: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')).or(z.undefined()),
    telegram: z.string().optional(),
  }).refine(
    (data) => data.whatsapp || data.email || data.telegram,
    'At least one contact method is required'
  ),

  // Step 5
  legal_acknowledgement: z.boolean().refine(val => val === true, 'Legal acknowledgement is required'),
});

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  profileId?: string;
};

export async function submitProfileAction(data: {
  full_name: string;
  full_name_en: string;
  title: string;
  gender: 'male' | 'female';
  birth_date: string;
  country: string;
  subjects: string[];
  specializations: any;
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  teaching_types?: string[];
  madhab?: string;
  audience: string[];
  student_age_min: number | null;
  student_age_max: number | null;
  student_gender: string;
  price_amount: number | null;
  price_currency: string;
  teaching_format: string;
  video_url: string;
  contact_method: {
    whatsapp?: string;
    email?: string;
    telegram?: string;
  };
  legal_acknowledgement: boolean;
}): Promise<ActionState> {

  // Validate
  const validation = ProfileSchema.safeParse(data);
  if (!validation.success) {
    const flattened = validation.error.flatten();
    return {
      error: 'بيانات غير صالحة / Invalid data',
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    };
  }

  // Calculate age from birth_date
  const birth = new Date(data.birth_date);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  const supabase = await createClient();

  // Create profile WITHOUT user_id (auth happens after approval)
  const { data: profile, error: dbError } = await supabase
    .from('profiles')
    .insert({
      // No user_id - will be linked after invitation acceptance
      full_name: data.full_name,
      full_name_en: data.full_name_en,
      title: data.title,
      gender: data.gender,
      birth_date: data.birth_date,
      age: age, // Calculated from birth_date

      country: data.country,
      subjects: data.subjects,
      specializations: data.specializations,

      experiences: data.experiences,
      teaching_types: data.teaching_types || [],
      qualifications: data.education, // Map education to qualifications column
      madhab: data.madhab,

      audience: data.audience,
      student_age_min: data.student_age_min,
      student_age_max: data.student_age_max,
      student_gender: data.student_gender,
      price_amount: data.price_amount,
      price_currency: data.price_currency,

      experience_text: data.experiences.map(e =>
        `${e.organization} - ${e.role}`
      ).join('\n'),

      teaching_format: data.teaching_format,
      video_url: data.video_url,
      contact_method: data.contact_method,
      legal_acknowledgement: data.legal_acknowledgement,

      status: 'under_review', // Goes directly to review
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('Database Error:', dbError);
    return { error: 'فشل في حفظ الملف / Failed to save profile' };
  }

  return {
    success: true,
    profileId: profile.id,
  };
}

// Keep old action for backward compatibility (will be removed later)
export async function saveProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Redirect to new wizard
  return { error: 'Please use the new 5-step wizard at /onboarding/step-1' };
}
