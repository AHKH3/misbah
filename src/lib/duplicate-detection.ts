/**
 * Duplicate Detection System
 *
 * Weighted matching algorithm to detect potential duplicate profile submissions.
 * Used for fraud prevention.
 *
 * Weights:
 * - Name (AR or EN): 30%
 * - WhatsApp: 25%
 * - YouTube URL: 20%
 * - Country + Subjects: 15%
 * - Telegram: 10%
 *
 * Thresholds:
 * - ≥60%: Normal alert
 * - ≥85%: Red alert (likely same person)
 */

import { createClient } from '@/utils/supabase/server';

interface ProfileMatchData {
    id: string;
    full_name: string;
    full_name_en: string;
    whatsapp: string | null;
    telegram: string | null;
    video_url: string;
    country: string;
    subjects: string[]; // Assuming JSONB array
}

interface MatchedFields {
    name?: number;
    whatsapp?: number;
    youtube?: number;
    country_subjects?: number;
    telegram?: number;
}

interface DuplicateMatch {
    existingProfileId: string;
    matchScore: number; // 0-100
    matchedFields: MatchedFields;
}

/**
 * Normalize string for comparison (lowercase, remove spaces/diacritics)
 */
function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
    if (!url) return null;

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Calculate similarity between two strings (Levenshtein distance normalized)
 */
function stringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);

    if (maxLen === 0) return 1;

    // Levenshtein distance matrix
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    const distance = matrix[len1][len2];
    return 1 - distance / maxLen;
}

/**
 * Calculate match score between new profile and existing profile
 */
function calculateMatchScore(
    newProfile: Omit<ProfileMatchData, 'id'>,
    existingProfile: ProfileMatchData
): { score: number; fields: MatchedFields } {
    const matchedFields: MatchedFields = {};
    let totalScore = 0;

    // 1. Name matching (30%)
    const nameArNorm = normalizeString(newProfile.full_name);
    const nameEnNorm = normalizeString(newProfile.full_name_en);
    const existingNameArNorm = normalizeString(existingProfile.full_name);
    const existingNameEnNorm = normalizeString(existingProfile.full_name_en);

    const nameArSimilarity = stringSimilarity(nameArNorm, existingNameArNorm);
    const nameEnSimilarity = stringSimilarity(nameEnNorm, existingNameEnNorm);
    const nameSimilarity = Math.max(nameArSimilarity, nameEnSimilarity);

    if (nameSimilarity > 0.7) { // 70% similar names
        const nameScore = nameSimilarity * 30;
        matchedFields.name = Math.round(nameScore);
        totalScore += nameScore;
    }

    // 2. WhatsApp matching (25%)
    if (newProfile.whatsapp && existingProfile.whatsapp) {
        const whatsappNorm = normalizeString(newProfile.whatsapp);
        const existingWhatsappNorm = normalizeString(existingProfile.whatsapp);

        if (whatsappNorm === existingWhatsappNorm) {
            matchedFields.whatsapp = 25;
            totalScore += 25;
        }
    }

    // 3. YouTube URL matching (20%)
    const newYoutubeId = extractYouTubeId(newProfile.video_url);
    const existingYoutubeId = extractYouTubeId(existingProfile.video_url);

    if (newYoutubeId && existingYoutubeId && newYoutubeId === existingYoutubeId) {
        matchedFields.youtube = 20;
        totalScore += 20;
    }

    // 4. Country + Subjects matching (15%)
    const countryMatch = normalizeString(newProfile.country) === normalizeString(existingProfile.country);

    // Check subject overlap
    const newSubjects = new Set(newProfile.subjects.map(normalizeString));
    const existingSubjects = new Set(existingProfile.subjects.map(normalizeString));
    const commonSubjects = [...newSubjects].filter(s => existingSubjects.has(s));
    const subjectOverlap = commonSubjects.length > 0;

    if (countryMatch && subjectOverlap) {
        matchedFields.country_subjects = 15;
        totalScore += 15;
    }

    // 5. Telegram matching (10%)
    if (newProfile.telegram && existingProfile.telegram) {
        const telegramNorm = normalizeString(newProfile.telegram);
        const existingTelegramNorm = normalizeString(existingProfile.telegram);

        if (telegramNorm === existingTelegramNorm) {
            matchedFields.telegram = 10;
            totalScore += 10;
        }
    }

    return {
        score: Math.round(totalScore),
        fields: matchedFields
    };
}

/**
 * Check for duplicate profiles and return matches above 60% threshold
 */
export async function checkForDuplicates(
    newProfileData: Omit<ProfileMatchData, 'id'>
): Promise<DuplicateMatch[]> {
    const supabase = await createClient();

    // Fetch all profiles except rejected and suspended
    // (we want to catch resubmissions from banned users)
    const { data: existingProfiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, full_name_en, whatsapp, telegram, video_url, country, subjects')
        .neq('status', 'draft'); // Check against all non-draft profiles

    if (error || !existingProfiles) {
        console.error('Error fetching profiles for duplicate check:', error);
        return [];
    }

    const matches: DuplicateMatch[] = [];

    for (const existing of existingProfiles) {
        const { score, fields } = calculateMatchScore(newProfileData, existing as ProfileMatchData);

        // Only report matches ≥60%
        if (score >= 60) {
            matches.push({
                existingProfileId: existing.id,
                matchScore: score,
                matchedFields: fields
            });
        }
    }

    // Sort by score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return matches;
}

/**
 * Save duplicate alert to database
 */
export async function saveDuplicateAlert(
    newProfileId: string,
    match: DuplicateMatch
): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('duplicate_alerts')
        .insert({
            new_profile_id: newProfileId,
            existing_profile_id: match.existingProfileId,
            match_score: match.matchScore,
            matched_fields: match.matchedFields
        });

    if (error) {
        console.error('Error saving duplicate alert:', error);
    }
}

/**
 * Get all unreviewed duplicate alerts
 */
export async function getUnreviewedDuplicates() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('duplicate_alerts')
        .select(`
            *,
            new_profile:profiles!duplicate_alerts_new_profile_id_fkey(id, full_name, full_name_en, status),
            existing_profile:profiles!duplicate_alerts_existing_profile_id_fkey(id, full_name, full_name_en, status)
        `)
        .eq('reviewed', false)
        .order('match_score', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching unreviewed duplicates:', error);
        return [];
    }

    return data;
}

/**
 * Mark duplicate alert as reviewed
 */
export async function markDuplicateAsReviewed(
    alertId: string,
    adminId: string
): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('duplicate_alerts')
        .update({
            reviewed: true,
            reviewed_by: adminId,
            reviewed_at: new Date().toISOString()
        })
        .eq('id', alertId);

    if (error) {
        console.error('Error marking duplicate as reviewed:', error);
    }
}
