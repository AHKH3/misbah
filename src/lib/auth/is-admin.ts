import { SupabaseClient } from '@supabase/supabase-js';

export function getAdminEmails(): string[] {
    const raw = process.env.ADMIN_EMAILS || '';
    return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
}

export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
    const adminEmails = getAdminEmails();
    if (adminEmails.length === 0) return false;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return false;

    return adminEmails.includes(user.email.toLowerCase());
}
