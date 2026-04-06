'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function verifyInvitationToken(token: string) {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, invitation_expires_at')
        .eq('invitation_token', token)
        .single();

    if (error || !profile) {
        return { error: 'Invalid invitation token' };
    }

    if (new Date(profile.invitation_expires_at) < new Date()) {
        return { error: 'Invitation expired' };
    }

    // Check if profile already has a user_id (already claimed)
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', profile.id)
        .single();

    if (existingUser?.user_id) {
        return { error: 'Invitation already used' };
    }

    return { success: true, profile };
}

export async function createAccountFromInvitation(
    token: string,
    formData: FormData
) {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    if (password.length < 8) {
        return { error: 'Password must be at least 8 characters' };
    }

    const supabase = await createClient();

    // 1. Validate token again
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, contact_method, invitation_expires_at')
        .eq('invitation_token', token)
        .single();

    if (!profile) return { error: 'Invalid token' };

    if (new Date(profile.invitation_expires_at) < new Date()) {
        return { error: 'Invitation expired' };
    }

    // 2. Create Auth User
    // Note: We use the email from contact_method
    const email = profile.contact_method?.email;
    if (!email) return { error: 'Profile has no email address' };

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: profile.full_name, // Assuming it's a string, or pick one localized
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (authError) return { error: authError.message };
    if (!authData.user) return { error: 'Failed to create user' };

    // 3. Link profile to user
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            user_id: authData.user.id,
            invitation_token: null, // Consume token
        })
        .eq('id', profile.id);

    if (updateError) {
        // Rollback would be ideal but complex here. 
        // For MVP, we log error. User exists but not linked.
        console.error('Failed to link profile:', updateError);
        return { error: 'Failed to link profile to account' };
    }

    // 4. Redirect to dashboard (or login)
    redirect('/login?verified=true');
}
