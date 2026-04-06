'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { generateProfileSlug } from '@/lib/slug-generator';
import { checkForDuplicates, saveDuplicateAlert } from '@/lib/duplicate-detection';

// Types for experience and education
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

// ============================================
// Validation Schema (6 Steps)
// ============================================

const ProfileSchema = z.object({
  // Step 1: Personal Information
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
  full_name_en: z.string().min(3, 'English name must be at least 3 characters'),
  title: z.string().min(1, 'Title is required'),
  gender: z.enum(['male', 'female']),
  birth_date: z.string().min(1, 'Birth date is required'),
  country: z.string().min(2, 'Country is required'),

  // Step 2: Specialization & Languages
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  specializations: z.object({
    quranTypes: z.array(z.string()),
    arabicAreas: z.array(z.string()),
    arabicCurricula: z.array(z.string()),
    readingCurricula: z.array(z.string()),
    arabicOther: z.string(),
    islamicSections: z.array(z.string()),
  }),
  languages: z.array(z.object({
    id: z.string(),
    language: z.string(),
    proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'native']),
  })).min(1, 'Add at least one language'),

  // Step 3: Education & Experience
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
  })).min(1, 'Add at least one education entry'),

  // Step 4: Audience, Pricing & Bio
  student_age_min: z.number().nullable().optional(),
  student_age_max: z.number().nullable().optional(),
  student_gender: z.string().optional(),
  price_amount: z.number().nullable().optional(),
  price_currency: z.string().optional(),
  bio_text_ar: z.string().min(50, 'Arabic bio must be at least 50 characters'),
  bio_text_en: z.string().min(50, 'English bio must be at least 50 characters'),

  // Step 5: Video
  video_url: z.string().url('Please provide a valid YouTube URL').refine(
    (url) => url.includes('youtube.com') || url.includes('youtu.be'),
    'Video URL must be from YouTube'
  ),

  // Step 6: Contact & Legal
  teaching_format: z.literal('online'),
  contact_method: z.object({
    whatsapp: z.string().optional(),
    misbahEmail: z.string().email('Valid email required for Misbah communication'),
    telegram: z.string().optional(),
  }).refine(
    (data) => data.whatsapp || data.telegram,
    'At least one contact method (WhatsApp or Telegram) is required'
  ),

  // Legal acknowledgements
  personalTeaching: z.boolean().refine(val => val === true, 'You must confirm personal teaching'),
  noRedirection: z.boolean().refine(val => val === true, 'You must confirm no platform redirection'),
  violationConsequences: z.boolean().refine(val => val === true, 'You must acknowledge violation consequences'),
  legal_acknowledgement: z.boolean().refine(val => val === true, 'Legal acknowledgement is required'),
});

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  profileId?: string;
  bannedUntil?: string;
};

/**
 * Check if user is banned by misbah_email
 */
async function checkBanStatus(email: string): Promise<Date | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('ban_until')
    .eq('misbah_email', email)
    .not('ban_until', 'is', null)
    .gt('ban_until', new Date().toISOString())
    .single();

  if (error || !data) return null;

  return data.ban_until ? new Date(data.ban_until) : null;
}

/**
 * Send Telegram notification to admin (stub for now)
 */
async function sendTelegramNotification(message: string): Promise<void> {
  // TODO: Implement Telegram Bot API
  // For now, just log
  console.log('[Telegram Notification]:', message);

  // Implementation will be:
  // const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  // const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  //
  // await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     chat_id: TELEGRAM_CHAT_ID,
  //     text: message,
  //     parse_mode: 'HTML'
  //   })
  // });
}

/**
 * Main submission action
 */
export async function submitProfileAction(
  data: z.infer<typeof ProfileSchema>
): Promise<ActionState> {

  // 1. Validate input
  const validation = ProfileSchema.safeParse(data);
  if (!validation.success) {
    const flattened = validation.error.flatten();
    return {
      error: 'بيانات غير صالحة / Invalid data',
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    };
  }

  // 2. Check ban status
  const bannedUntil = await checkBanStatus(data.contact_method.misbahEmail);
  if (bannedUntil) {
    return {
      error: `تم حظرك حتى ${bannedUntil.toLocaleDateString('ar-EG')} / You are banned until ${bannedUntil.toLocaleDateString('en-US')}`,
      bannedUntil: bannedUntil.toISOString(),
    };
  }

  // 3. Calculate age from birth_date
  const birth = new Date(data.birth_date);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  // Ensure age >= 18
  if (age < 18) {
    return {
      error: 'يجب أن يكون عمرك 18 عاماً على الأقل / You must be at least 18 years old',
    };
  }

  // 4. Generate unique slug
  const slug = await generateProfileSlug(
    data.full_name_en,
    data.country,
    data.subjects
  );

  const supabase = await createClient();

  // 5. Create profile WITHOUT user_id (auth happens after approval)
  const { data: profile, error: dbError } = await supabase
    .from('profiles')
    .insert({
      // No user_id - will be linked after invitation acceptance
      full_name: data.full_name,
      full_name_en: data.full_name_en,
      slug: slug,
      title: data.title,
      gender: data.gender,
      birth_date: data.birth_date,
      age: age,

      country: data.country,
      subjects: data.subjects,
      specializations: data.specializations,
      languages: data.languages,

      experiences: data.experiences,
      qualifications: data.education, // Map education to qualifications column

      student_age_min: data.student_age_min,
      student_age_max: data.student_age_max,
      student_gender: data.student_gender,
      price_amount: data.price_amount,
      price_currency: data.price_currency,

      bio_text_ar: data.bio_text_ar,
      bio_text_en: data.bio_text_en,

      experience_text: data.experiences.map(e =>
        `${e.organization} - ${e.role}`
      ).join('\n'),

      teaching_format: data.teaching_format,
      video_url: data.video_url,

      // Contact methods
      whatsapp: data.contact_method.whatsapp || null,
      telegram: data.contact_method.telegram || null,
      misbah_email: data.contact_method.misbahEmail,

      legal_acknowledgement: data.legal_acknowledgement,
      status: 'under_review', // Goes directly to review
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('Database Error:', dbError);
    return { error: 'فشل في حفظ الملف / Failed to save profile' };
  }

  // 6. Check for duplicates
  try {
    const duplicateMatches = await checkForDuplicates({
      full_name: data.full_name,
      full_name_en: data.full_name_en,
      whatsapp: data.contact_method.whatsapp || null,
      telegram: data.contact_method.telegram || null,
      video_url: data.video_url,
      country: data.country,
      subjects: data.subjects,
    });

    // Save duplicate alerts
    for (const match of duplicateMatches) {
      await saveDuplicateAlert(profile.id, match);
    }

    // Send Telegram notification with duplicate info if any
    if (duplicateMatches.length > 0) {
      const highestScore = duplicateMatches[0].matchScore;
      const alertLevel = highestScore >= 85 ? '🔴 RED ALERT' : '⚠️ Warning';

      await sendTelegramNotification(
        `${alertLevel}: New profile with ${highestScore}% match detected!\n\n` +
        `Name: ${data.full_name} / ${data.full_name_en}\n` +
        `Subjects: ${data.subjects.join(', ')}\n` +
        `Review: /admin/review/${profile.id}`
      );
    }
  } catch (error) {
    console.error('Error checking duplicates:', error);
    // Don't fail the submission if duplicate check fails
  }

  // 7. Send Telegram notification to admin
  await sendTelegramNotification(
    `📝 New Teacher Registration\n\n` +
    `Name: ${data.full_name} / ${data.full_name_en}\n` +
    `Country: ${data.country}\n` +
    `Subjects: ${data.subjects.join(', ')}\n\n` +
    `Review: /admin/review/${profile.id}`
  );

  return {
    success: true,
    profileId: profile.id,
  };
}
