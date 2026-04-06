/**
 * Slug Generator for Teacher Profiles
 *
 * Generates SEO-friendly slugs in the format:
 * firstname-lastname-country-subject
 *
 * Example: ahmed-ali-egypt-quran
 */

import { createClient } from '@/utils/supabase/server';

/**
 * Transliterate Arabic to English (basic mapping)
 */
function transliterateArabic(text: string): string {
    const arabicToLatin: Record<string, string> = {
        'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a',
        'ب': 'b',
        'ت': 't',
        'ث': 'th',
        'ج': 'j',
        'ح': 'h',
        'خ': 'kh',
        'د': 'd',
        'ذ': 'dh',
        'ر': 'r',
        'ز': 'z',
        'س': 's',
        'ش': 'sh',
        'ص': 's',
        'ض': 'd',
        'ط': 't',
        'ظ': 'z',
        'ع': 'a',
        'غ': 'gh',
        'ف': 'f',
        'ق': 'q',
        'ك': 'k',
        'ل': 'l',
        'م': 'm',
        'ن': 'n',
        'ه': 'h',
        'و': 'w',
        'ي': 'y',
        'ى': 'a',
        'ة': 'a',
        'ء': 'a',
        'ئ': 'y',
        'ؤ': 'w',
        ' ': '-',
    };

    return text
        .split('')
        .map(char => arabicToLatin[char] || char)
        .join('')
        .toLowerCase();
}

/**
 * Slugify a string (make it URL-safe)
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD') // Normalize unicode
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
        .trim()
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Map internal subject codes to SEO-friendly terms
 */
function subjectToSlugTerm(subject: string): string {
    const mapping: Record<string, string> = {
        'quran': 'quran',
        'arabic': 'arabic',
        'islamic_studies': 'islamic-studies',
        'القرآن الكريم': 'quran',
        'اللغة العربية': 'arabic',
        'الدراسات الإسلامية': 'islamic-studies',
    };

    return mapping[subject.toLowerCase()] || slugify(subject);
}

/**
 * Map country names to English slugs
 */
function countryToSlug(country: string): string {
    const mapping: Record<string, string> = {
        'مصر': 'egypt',
        'السعودية': 'saudi-arabia',
        'الإمارات': 'uae',
        'الكويت': 'kuwait',
        'قطر': 'qatar',
        'البحرين': 'bahrain',
        'عُمان': 'oman',
        'الأردن': 'jordan',
        'فلسطين': 'palestine',
        'لبنان': 'lebanon',
        'سوريا': 'syria',
        'العراق': 'iraq',
        'اليمن': 'yemen',
        'ليبيا': 'libya',
        'تونس': 'tunisia',
        'الجزائر': 'algeria',
        'المغرب': 'morocco',
        'السودان': 'sudan',
        'موريتانيا': 'mauritania',
        'الصومال': 'somalia',
        'جيبوتي': 'djibouti',
        'جزر القمر': 'comoros',
        'تركيا': 'turkey',
        'ماليزيا': 'malaysia',
        'إندونيسيا': 'indonesia',
        'باكستان': 'pakistan',
        'بنغلاديش': 'bangladesh',
        'الهند': 'india',
        'المملكة المتحدة': 'uk',
        'الولايات المتحدة': 'usa',
        'كندا': 'canada',
        'فرنسا': 'france',
        'ألمانيا': 'germany',
        'إيطاليا': 'italy',
        'إسبانيا': 'spain',
        'هولندا': 'netherlands',
        'بلجيكا': 'belgium',
        'السويد': 'sweden',
        'النرويج': 'norway',
        'الدنمارك': 'denmark',
        'سنغافورة': 'singapore',
        'تايلاند': 'thailand',
        'اليابان': 'japan',
        'كوريا الجنوبية': 'south-korea',
        'الفلبين': 'philippines',
        'أستراليا': 'australia',
        'نيوزيلندا': 'new-zealand',
        'جنوب أفريقيا': 'south-africa',
    };

    return mapping[country] || slugify(transliterateArabic(country));
}

/**
 * Extract first and last name from full name
 */
function extractFirstLastName(fullName: string): { first: string; last: string } {
    const parts = fullName.trim().split(/\s+/);

    if (parts.length === 0) {
        return { first: 'teacher', last: '' };
    }

    if (parts.length === 1) {
        return { first: parts[0], last: '' };
    }

    // First name = first part, Last name = last part
    return {
        first: parts[0],
        last: parts[parts.length - 1]
    };
}

/**
 * Generate base slug from profile data
 */
function generateBaseSlug(
    fullNameEn: string,
    country: string,
    primarySubject: string
): string {
    // Use English name if available, otherwise transliterate Arabic
    const { first, last } = extractFirstLastName(fullNameEn);

    const firstSlug = slugify(first);
    const lastSlug = last ? slugify(last) : '';
    const countrySlug = countryToSlug(country);
    const subjectSlug = subjectToSlugTerm(primarySubject);

    // Format: firstname-lastname-country-subject
    const parts = [firstSlug, lastSlug, countrySlug, subjectSlug].filter(Boolean);
    return parts.join('-');
}

/**
 * Check if slug exists in database
 */
async function slugExists(slug: string): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', slug)
        .single();

    return !error && data !== null;
}

/**
 * Generate unique slug by appending number if needed
 */
async function makeSlugUnique(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await slugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

/**
 * Main function: Generate unique slug for a teacher profile
 */
export async function generateProfileSlug(
    fullNameEn: string,
    country: string,
    subjects: string[] // Array of subject codes like ['quran', 'arabic']
): Promise<string> {
    // Use first subject as primary
    const primarySubject = subjects[0] || 'teacher';

    const baseSlug = generateBaseSlug(fullNameEn, country, primarySubject);
    const uniqueSlug = await makeSlugUnique(baseSlug);

    return uniqueSlug;
}

/**
 * Regenerate slug for existing profile (admin function)
 */
export async function regenerateProfileSlug(profileId: string): Promise<string | null> {
    const supabase = await createClient();

    // Fetch profile data
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name_en, country, subjects')
        .eq('id', profileId)
        .single();

    if (error || !profile) {
        console.error('Error fetching profile for slug regeneration:', error);
        return null;
    }

    // Generate new slug
    const newSlug = await generateProfileSlug(
        profile.full_name_en,
        profile.country,
        profile.subjects as string[]
    );

    // Update profile
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ slug: newSlug })
        .eq('id', profileId);

    if (updateError) {
        console.error('Error updating profile slug:', updateError);
        return null;
    }

    return newSlug;
}
