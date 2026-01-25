'use server';

import { createClient } from '@/utils/supabase/server';
import type { PublicProfile, BilingualText, Subject, TeachingFormat, AvailabilityStatus, ContactMethod } from '@/lib/types/profile';

// Database row type (matches Supabase schema)
interface DatabaseProfile {
    id: string;
    full_name: string;
    country: string | null;
    subjects: string[] | null;
    audience: string[] | null;
    experiences: Array<{
        organization: string;
        role: string;
        startDate: string;
        endDate: string | null;
        description: string;
    }> | null;
    teaching_format: string | null;
    contact_method: {
        whatsapp?: string;
        email?: string;
        telegram?: string;
    } | null;
    video_url: string | null;
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
        fullName = { ar: parsed.ar || db.full_name, en: parsed.en || db.full_name };
    } catch {
        fullName = { ar: db.full_name, en: db.full_name };
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
        full_name: fullName,
        country: country,
        subjects: (db.subjects || []) as Subject[],
        audience: (db.audience || []) as ('Kids' | 'Adults' | 'Females Only' | 'Males Only' | 'Everyone')[],
        experience_text: experienceText,
        teaching_format: (db.teaching_format || 'online') as TeachingFormat,
        availability_status: 'accepting' as AvailabilityStatus, // Default for published profiles
        contact_method: (db.contact_method || {}) as ContactMethod,
        video_url: db.video_url || undefined,
    };
}

/**
 * Fetch all published teacher profiles
 */
export async function getPublishedProfiles(): Promise<PublicProfile[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, country, subjects, audience, experiences, teaching_format, contact_method, video_url, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching published profiles:', error);
        return [];
    }

    return (data || []).map(row => mapToPublicProfile(row as DatabaseProfile));
}

/**
 * Fetch a single published teacher profile by ID
 */
export async function getPublishedProfile(id: string): Promise<PublicProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, country, subjects, audience, experiences, teaching_format, contact_method, video_url, status')
        .eq('id', id)
        .eq('status', 'published')
        .single();

    if (error || !data) {
        return null;
    }

    return mapToPublicProfile(data as DatabaseProfile);
}
