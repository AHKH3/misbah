import { createClient } from '@/utils/supabase/server';
import { isAdmin } from '@/lib/auth/is-admin';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    // Check admin auth
    const isAdminUser = await isAdmin(supabase);
    if (!isAdminUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
}
