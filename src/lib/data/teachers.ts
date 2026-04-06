'use server';

import { createClient } from '@/utils/supabase/server';
import type {
    PublicProfile,
    BilingualText,
    SubjectDB,
    TeachingFormat,
    AvailabilityStatus,
    ContactMethod,
    TeacherTitle,
    SubjectSpecializations,
    EducationEntry,
    ExperienceEntry,
    Pricing,
    TargetStudents
} from '@/lib/types/profile';

// Database row type (matches Supabase schema)
interface DatabaseProfile {
    id: string;
    slug?: string | null;

    // Identity
    full_name: string;
    full_name_en?: string | null;  // Optional until migration is applied
    title: string | null;
    country: string | null;

    // Teaching
    subjects: string[] | null;
    specializations: Record<string, unknown> | null;
    languages: Array<{
        id: string;
        language: string;
        proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    }> | null;

    // Background
    qualifications: Array<{
        id: string;
        type?: string;
        degree: string;
        institution: string;
        specialization: string;
        startYear: number;
        endYear: number | null;
        notes?: string;
    }> | null;
    experiences: Array<{
        id: string;
        organization: string;
        organizationType?: string;
        role: string;
        startYear: number;
        startMonth: number;
        endYear: number | null;
        endMonth: number | null;
        description?: string;
    }> | null;

    // Target Audience
    student_age_min: number | null;
    student_age_max: number | null;
    student_gender: string | null;
    audience: string[] | null;

    // Pricing
    price_amount: number | null;
    price_currency: string | null;

    // Logistics
    teaching_format: string | null;
    availability_status: string | null;
    contact_method: {
        whatsapp?: string;
        email?: string;
        telegram?: string;
        website?: string;
    } | null;

    // Media
    video_url: string | null;
    bio_text_ar?: string;
    bio_text_en?: string;

    // System
    status: string;
}

/**
 * Convert database profile to public profile format
 */
function mapToPublicProfile(db: DatabaseProfile): PublicProfile {
    // Parse full_name - could be JSON or plain text
    let fullName: BilingualText;
    try {
        const parsed = JSON.parse(db.full_name);
        fullName = { ar: parsed.ar || db.full_name, en: parsed.en || (db.full_name_en ?? db.full_name) };
    } catch {
        fullName = { ar: db.full_name, en: db.full_name_en ?? db.full_name };
    }

    // Parse country
    let country: BilingualText;
    try {
        const parsed = db.country ? JSON.parse(db.country) : { ar: '', en: '' };
        country = { ar: parsed.ar || db.country || '', en: parsed.en || db.country || '' };
    } catch {
        country = { ar: db.country || '', en: db.country || '' };
    }

    // Build experience_text from experiences array
    let experienceText: BilingualText = { ar: '', en: '' };
    if (db.experiences && db.experiences.length > 0) {
        const descriptions = db.experiences
            .map(exp => exp.description)
            .filter(Boolean)
            .join('\n');
        experienceText = { ar: descriptions, en: descriptions };
    }

    return {
        id: db.id,
        slug: db.slug || undefined,

        // Identity
        full_name: fullName,
        title: (db.title || null) as TeacherTitle | null,
        country: country,

        // Teaching
        subjects: (db.subjects || []) as SubjectDB[],
        specializations: (db.specializations || null) as SubjectSpecializations | null,
        languages: (db.languages || []) as { id: string; language: string; proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native' }[],

        // Background - Map qualifications to education
        education: (db.qualifications || []) as EducationEntry[],
        experiences: (db.experiences || []) as ExperienceEntry[],
        experience_text: experienceText,

        // Target Audience
        target_students: {
            ageMin: db.student_age_min,
            ageMax: db.student_age_max,
            gender: (db.student_gender || 'both') as 'males' | 'females' | 'both',
        },
        audience: (db.audience || []) as ('Kids' | 'Adults' | 'Females Only' | 'Males Only' | 'Everyone')[],

        // Pricing
        pricing: db.price_amount ? {
            amount: db.price_amount,
            currency: (db.price_currency || 'EGP') as 'EGP' | 'USD',
        } : null,

        // Logistics
        teaching_format: (db.teaching_format || 'online') as TeachingFormat,
        availability_status: (db.availability_status || 'accepting') as AvailabilityStatus,
        contact_method: (db.contact_method || {}) as ContactMethod,

        // Media
        video_url: db.video_url || undefined,
        bio_text_ar: db.bio_text_ar,
        bio_text_en: db.bio_text_en,
    };
}

/**
 * Fetch all published teacher profiles
 */
export async function getPublishedProfiles(): Promise<PublicProfile[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id,
            slug,
            full_name,
            title,
            country,
            subjects,
            specializations,
            qualifications,
            experiences,
            student_age_min,
            student_age_max,
            student_gender,
            audience,
            price_amount,
            price_currency,
            teaching_format,
            availability_status,
            contact_method,
            video_url,
            status,
            bio_text_ar,
            bio_text_en
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching published profiles:', error);
        return [];
    }

    return (data || []).map(row => mapToPublicProfile(row as unknown as DatabaseProfile));
}

/**
 * Fetch a single published teacher profile by ID
 */
export async function getPublishedProfile(id: string): Promise<PublicProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id,
            slug,
            full_name,
            title,
            country,
            subjects,
            specializations,
            qualifications,
            experiences,
            student_age_min,
            student_age_max,
            student_gender,
            audience,
            price_amount,
            price_currency,
            teaching_format,
            availability_status,
            contact_method,
            video_url,
            status,
            bio_text_ar,
            bio_text_en
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single();

    if (error || !data) {
        return null;
    }

    return mapToPublicProfile(data as unknown as DatabaseProfile);
}

/**
 * Fetch a single published teacher profile by slug
 */
export async function getPublishedProfileBySlug(slug: string): Promise<PublicProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id,
            slug,
            full_name,
            full_name_en,
            title,
            country,
            subjects,
            specializations,
            languages,
            qualifications,
            experiences,
            student_age_min,
            student_age_max,
            student_gender,
            audience,
            price_amount,
            price_currency,
            teaching_format,
            availability_status,
            contact_method,
            video_url,
            status,
            bio_text_ar,
            bio_text_en
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error || !data) {
        return null;
    }

    return mapToPublicProfile(data as unknown as DatabaseProfile);
}

/**
 * Filters for directory/find routes
 */
export interface TeacherFilters {
    subject?: SubjectDB;
    gender?: 'male' | 'female';
    audience?: 'kids' | 'adults';
    language?: string;
    languageLevel?: 'beginner' | 'intermediate' | 'advanced' | 'native';
    priceMin?: number;
    priceMax?: number;
    currency?: 'EGP' | 'USD';
}

/**
 * Fetch filtered teacher profiles
 * Used for /find/ routes with dynamic filters
 */
export async function getFilteredProfiles(filters: TeacherFilters = {}): Promise<PublicProfile[]> {
    const supabase = await createClient();

    let query = supabase
        .from('profiles')
        .select(`
            id,
            slug,
            full_name,
            full_name_en,
            title,
            country,
            subjects,
            specializations,
            languages,
            qualifications,
            experiences,
            student_age_min,
            student_age_max,
            student_gender,
            audience,
            price_amount,
            price_currency,
            teaching_format,
            availability_status,
            contact_method,
            video_url,
            status,
            bio_text_ar,
            bio_text_en
        `)
        .eq('status', 'published');

    // Filter by subject
    if (filters.subject) {
        query = query.contains('subjects', [filters.subject]);
    }

    // Filter by teacher gender (student_gender field represents which gender the teacher accepts)
    if (filters.gender) {
        // If filtering by 'male', show male teachers who accept either 'males' or 'both'
        // If filtering by 'female', show female teachers who accept either 'females' or 'both'
        // Note: The filter.gender represents the teacher's gender, not student gender
        // We need to check the profile's gender field (not exposed in PublicProfile currently)
        // For now, we'll skip this filter until gender field is added to query
    }

    // Filter by audience (kids/adults)
    if (filters.audience) {
        if (filters.audience === 'kids') {
            // Show teachers who accept kids (ageMin <= 17)
            query = query.lte('student_age_min', 17);
        } else if (filters.audience === 'adults') {
            // Show teachers who accept adults (ageMax >= 18)
            query = query.gte('student_age_max', 18);
        }
    }

    // Filter by price range
    if (filters.priceMin !== undefined) {
        query = query.gte('price_amount', filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
        query = query.lte('price_amount', filters.priceMax);
    }
    if (filters.currency) {
        query = query.eq('price_currency', filters.currency);
    }

    // Sort: accepting status first, then newest
    query = query
        .order('availability_status', { ascending: true })
        .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching filtered profiles:', error);
        return [];
    }

    let profiles = (data || []).map(row => mapToPublicProfile(row as unknown as DatabaseProfile));

    // Client-side filter for language (requires checking languages array)
    if (filters.language) {
        profiles = profiles.filter(p =>
            p.languages.some(lang => lang.language.toLowerCase() === filters.language?.toLowerCase())
        );
    }

    // Client-side filter for language level
    if (filters.languageLevel) {
        profiles = profiles.filter(p =>
            p.languages.some(lang => lang.proficiency === filters.languageLevel)
        );
    }

    return profiles;
}
