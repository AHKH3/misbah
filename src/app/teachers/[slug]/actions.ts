'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import crypto from 'crypto';

const trackViewSchema = z.object({
    profileId: z.string().uuid(),
    sessionId: z.string().uuid(),
    referrer: z.string().optional(),
});

export async function trackContactView(data: unknown) {
    const validated = trackViewSchema.parse(data);
    const supabase = await createClient();
    const headersList = await headers();

    // Get IP address (hashed for privacy)
    const ip = headersList.get('x-forwarded-for') ||
        headersList.get('x-real-ip') ||
        'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Get user agent
    const userAgent = headersList.get('user-agent') || null;

    // Check if this session already viewed this profile (prevent double-counting)
    const { data: existing } = await supabase
        .from('profile_contact_views')
        .select('id')
        .eq('session_id', validated.sessionId)
        .eq('profile_id', validated.profileId)
        .single();

    if (existing) {
        // Already tracked, skip
        return { success: true, alreadyTracked: true };
    }

    // Insert tracking record
    const { error } = await supabase
        .from('profile_contact_views')
        .insert({
            profile_id: validated.profileId,
            ip_hash: ipHash,
            user_agent: userAgent,
            referrer: validated.referrer || null,
            session_id: validated.sessionId,
        });

    if (error) {
        console.error('Failed to track contact view:', error);
        throw new Error('Tracking failed');
    }

    return { success: true, alreadyTracked: false };
}

const reportSchema = z.object({
    profileId: z.string().uuid(),
    reportType: z.enum(['teacher_redirection', 'price_mismatch', 'inappropriate_behavior', 'other']),
    description: z.string().min(20).max(1000),
    reporterContact: z.string().email().optional().nullable(),
});

export async function submitReport(data: unknown) {
    const validated = reportSchema.parse(data);
    const supabase = await createClient();

    const { error } = await supabase
        .from('reports')
        .insert({
            profile_id: validated.profileId,
            report_type: validated.reportType,
            description: validated.description,
            reporter_contact: validated.reporterContact,
            status: 'pending',
        });

    if (error) {
        throw new Error('Failed to submit report');
    }

    return { success: true };
}
