import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ReviewList from './review/ReviewList';
import styles from './admin.module.css';

// Admin check - in production should use proper role-based auth
async function isAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin (simple email check for MVP)
    // In production, use a proper admin table or role field
    const adminEmails = ['admin@misbah.com', 'admin@example.com'];
    return user && adminEmails.includes(user.email || '');
}

export default async function AdminPage() {
    const isAdminUser = await isAdmin();

    if (!isAdminUser) {
        redirect('/');
    }

    const supabase = await createClient();

    // Fetch pending profiles with subscriptions
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
      *,
      subscriptions (*)
    `)
        .eq('status', 'payment_submitted');

    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>خطأ في تحميل البيانات</div>
                </div>
            </main>
        );
    }

    const pendingProfiles = profiles?.filter(p => p.subscriptions && p.subscriptions.length > 0) || [];

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>لوحة الإدارة</h1>
                    <p className={styles.subtitle}>مراجعة الطلبات المعلقة</p>
                </header>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>طلبات معلقة</div>
                        <div className={styles.statValue}>{pendingProfiles.length}</div>
                    </div>
                </div>

                {/* Queue */}
                {pendingProfiles.length === 0 ? (
                    <div className={styles.emptyState}>لا توجد طلبات معلقة</div>
                ) : (
                    <ReviewList items={pendingProfiles} />
                )}
            </div>
        </main>
    );
}
