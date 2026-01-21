// Profile Types — Bilingual Support

// Subjects (from product guidelines)
export type Subject = 'Quran' | 'Tajweed' | 'Arabic' | 'Islamic Studies';

// Teaching Format
export type TeachingFormat = 'online' | 'in_person' | 'hybrid';

// Target Audience
export type Audience = 'Kids' | 'Adults' | 'Females Only' | 'Males Only' | 'Everyone';

// Availability Status
export type AvailabilityStatus = 'accepting' | 'limited' | 'not_accepting';

// Profile Status (from database enum)
export type ProfileStatus =
    | 'pending_payment'
    | 'payment_submitted'
    | 'active'
    | 'inactive'
    | 'rejected';

// Bilingual text field
export interface BilingualText {
    ar: string;
    en: string;
}

// Contact Method
export interface ContactMethod {
    whatsapp?: string;
    email?: string;
    telegram?: string;
    website?: string;
}

// Full Profile (for teacher dashboard/editing)
export interface Profile {
    id: string;
    user_id: string;
    full_name: BilingualText; // Arabic AND English
    country: BilingualText;
    subjects: Subject[];
    audience: Audience[];
    experience_text: BilingualText; // Arabic AND English
    teaching_format: TeachingFormat;
    availability_status: AvailabilityStatus;
    contact_method: ContactMethod;
    video_url?: string;
    status: ProfileStatus;
    created_at: string;
    updated_at: string;
}

// Public Profile (for display - safe fields only)
export interface PublicProfile {
    id: string;
    full_name: BilingualText;
    country: BilingualText;
    subjects: Subject[];
    audience: Audience[];
    experience_text: BilingualText;
    teaching_format: TeachingFormat;
    availability_status: AvailabilityStatus;
    contact_method: ContactMethod;
    video_url?: string;
}

// Helper to get localized text
export function getLocalizedText(text: BilingualText, locale: 'ar' | 'en'): string {
    return text[locale] || text.ar || text.en || '';
}
