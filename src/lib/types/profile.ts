// Profile Types — Bilingual Support

// Subjects - Database format (matches wizard store)
export type SubjectDB = 'quran' | 'arabic' | 'islamic_studies';

// Subjects - Display format (for UI)
export type Subject = 'Quran' | 'Tajweed' | 'Arabic' | 'Islamic Studies';

// Mapping function for subjects
export function toDisplaySubject(dbSubject: SubjectDB): Subject {
  const map: Record<SubjectDB, Subject> = {
    quran: 'Quran',
    arabic: 'Arabic',
    islamic_studies: 'Islamic Studies',
  };
  return map[dbSubject] || (dbSubject as Subject);
}

export function toDBSubject(displaySubject: Subject): SubjectDB {
  const map: Record<Subject, SubjectDB> = {
    'Quran': 'quran',
    'Tajweed': 'quran', // Tajweed is a specialization of Quran
    'Arabic': 'arabic',
    'Islamic Studies': 'islamic_studies',
  };
  return map[displaySubject] || (displaySubject.toLowerCase() as SubjectDB);
}

// Professional Title
export type TeacherTitle = 'sheikh' | 'ustaz' | 'muallim';

// Gender
export type Gender = 'male' | 'female';

// Teaching Format (online-only)
export type TeachingFormat = 'online';

// Target Audience
export type Audience = 'Kids' | 'Adults' | 'Females Only' | 'Males Only' | 'Everyone';

// Availability Status
export type AvailabilityStatus = 'accepting' | 'limited' | 'not_accepting';

// Language Proficiency Levels
export type LanguageProficiency = 'beginner' | 'intermediate' | 'advanced' | 'native';

// Language Entry
export interface LanguageEntry {
    id: string;
    language: string;
    proficiency: LanguageProficiency;
}

// Profile Status (from database enum - 6 states)
export type ProfileStatus =
    | 'draft'
    | 'under_review'
    | 'needs_changes'
    | 'approved'
    | 'published'
    | 'suspended';

// Bilingual text field
export interface BilingualText {
    ar: string;
    en: string;
}

// Subject Specializations (matches wizard store structure)
export interface SubjectSpecializations {
  quranTypes: ('tahfiz' | 'tilawa' | 'ijaza' | 'review')[];
  arabicAreas: ('arabic_second_lang' | 'reading' | 'grammar' | 'conversation' | 'other')[];
  arabicCurricula: ('arabiya_bayna_yadayk' | 'madinah' | 'custom')[];
  readingCurricula: ('noor_albayan' | 'qaida_noorania')[];
  arabicOther: string;
  islamicSections: ('fiqh' | 'aqeedah' | 'tafsir' | 'hadith' | 'seerah')[];
  [key: string]: unknown; // Index signature for compatibility with Record<string, unknown>
}

// Education Entry (timeline format)
export interface EducationEntry {
  id: string;
  type: 'religious' | 'academic' | 'ijaza' | 'course' | 'other';
  degree: 'secondary' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'other';
  institution: string;
  specialization: string;
  startYear: number;
  endYear: number | null;
  notes?: string;
}

// Experience Entry (timeline format)
export interface ExperienceEntry {
  id: string;
  organization: string;
  organizationType: 'academy' | 'center' | 'mosque' | 'private' | 'online' | 'other';
  role: string;
  startYear: number;
  startMonth: number;
  endYear: number | null;
  endMonth: number | null;
  description?: string;
}

// Pricing Information
export interface Pricing {
  amount: number | null;
  currency: 'EGP' | 'USD';
}

// Target Students Information
export interface TargetStudents {
  ageMin: number | null;
  ageMax: number | null;
  gender: 'males' | 'females' | 'both';
}

// Contact Method
export interface ContactMethod {
    whatsapp?: string;
    email?: string;
    telegram?: string;
    website?: string;
}

// Full Profile (for teacher dashboard/editing - all fields)
export interface Profile {
    id: string;
    user_id: string | null;

    // Identity
    full_name: BilingualText;
    title: TeacherTitle | null;
    gender: Gender | null;
    birth_date: string | null;
    age: number | null;
    country: BilingualText;

    // Teaching
    subjects: SubjectDB[];
    specializations: SubjectSpecializations | null;

    // Background
    education: EducationEntry[];
    experiences: ExperienceEntry[];
    experience_text: BilingualText; // Generated summary for backwards compatibility

    // Target Audience
    target_students: TargetStudents | null;
    audience: Audience[]; // Legacy field for backwards compatibility

    // Pricing
    pricing: Pricing | null;

    // Logistics
    teaching_format: TeachingFormat;
    availability_status: AvailabilityStatus;
    contact_method: ContactMethod;
    languages: LanguageEntry[];

    // Media
    video_url?: string;
    bio_text_ar?: string;
    bio_text_en?: string;

    // System
    status: ProfileStatus;
    legal_acknowledgement: boolean;
    created_at: string;
    updated_at: string;
}

// Public Profile (for display - safe fields only, excludes user_id and internal flags)
export interface PublicProfile {
    id: string;
    slug?: string;

    // Identity (gender and birth_date hidden for privacy)
    full_name: BilingualText;
    title: TeacherTitle | null;
    country: BilingualText;

    // Teaching
    subjects: SubjectDB[];
    specializations: SubjectSpecializations | null;

    // Background
    education: EducationEntry[];
    experiences: ExperienceEntry[];
    experience_text: BilingualText;

    // Target Audience
    target_students: TargetStudents | null;
    audience: Audience[];

    // Pricing (optional visibility)
    pricing: Pricing | null;

    // Logistics
    teaching_format: TeachingFormat;
    availability_status: AvailabilityStatus;
    contact_method: ContactMethod;
    languages: LanguageEntry[];

    // Media
    video_url?: string;
    bio_text_ar?: string;
    bio_text_en?: string;
}

// Helper to get localized text
export function getLocalizedText(text: BilingualText, locale: 'ar' | 'en'): string {
    return text[locale] || text.ar || text.en || '';
}
