import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import styles from '../admin.module.css';

async function isAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const adminEmails = ['admin@misbah.site', 'admin@example.com'];
    return user && adminEmails.includes(user.email || '');
}

export default async function AuditLogPage() {
    const isAdminUser = await isAdmin();
    if (!isAdminUser) redirect('/');

    const supabase = await createClient();

    const { data: logs, error } = await supabase
        .from('admin_audit_log')
        .select(`
            *,
            profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>خطأ في تحميل السجل</div>
                </div>
            </main>
        );
    }

    const actionLabels: Record<string, string> = {
        approve: 'قبول',
        reject: 'رفض',
        request_changes: 'طلب تعديل',
        suspend: 'إيقاف',
        unsuspend: 'إلغاء الإيقاف',
        send_invitation: 'إرسال دعوة',
        manual_status_change: 'تغيير يدوي',
    };

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>سجل النشاط</h1>
                    <p className={styles.subtitle}>آخر 100 إجراء</p>
                </header>

                {logs?.length === 0 ? (
                    <div className={styles.emptyState}>لا توجد إجراءات مسجلة</div>
                ) : (
                    <div className={styles.profileList}>
                        {logs?.map((log) => (
                            <div key={log.id} className={styles.profileCard} style={{ display: 'block' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 600 }}>
                                        {actionLabels[log.action] || log.action}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
                                        {new Date(log.created_at).toLocaleString('ar-EG')}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#52525B', marginBottom: '4px' }}>
                                    البروفايل: {(log.profiles as { full_name: string })?.full_name || 'محذوف'}
                                </div>
                                {log.notes && (
                                    <div style={{ fontSize: '0.75rem', color: '#A1A1AA', fontStyle: 'italic' }}>
                                        &quot;{log.notes}&quot;
                                    </div>
                                )}
                                <div style={{ fontSize: '0.625rem', color: '#D4D4D8', marginTop: '8px' }}>
                                    {log.previous_status} → {log.new_status} | IP: {log.ip_address?.slice(0, 15)}...
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
