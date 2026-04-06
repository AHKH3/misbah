'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth/is-admin';

export async function markAsReviewed(formData: FormData): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !(await isAdmin(supabase))) {
        return;
    }

    const alertId = formData.get('alertId') as string;

    const { error } = await supabase
        .from('duplicate_alerts')
        .update({
            reviewed: true,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
        })
        .eq('id', alertId);

    if (error) {
        console.error('Failed to mark as reviewed:', error);
        return;
    }

    revalidatePath('/admin/duplicates');
}
