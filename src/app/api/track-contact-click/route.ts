import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const trackClickSchema = z.object({
    profileId: z.string().uuid(),
    contactType: z.enum(['whatsapp', 'telegram', 'email', 'website']),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = trackClickSchema.parse(body);

        const supabase = await createClient();

        // Insert click record (anonymous - no session tracking)
        const { error } = await supabase
            .from('contact_clicks')
            .insert({
                profile_id: validated.profileId,
                contact_type: validated.contactType,
            });

        if (error) {
            console.error('Failed to track contact click:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to track click' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Invalid request:', error);
        return NextResponse.json(
            { success: false, error: 'Invalid request' },
            { status: 400 }
        );
    }
}
