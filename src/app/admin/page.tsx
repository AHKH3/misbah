import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

// Admin check - in production should use proper role-based auth
async function isAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin (simple email check for MVP)
    // In production, use a proper admin table or role field
    const adminEmails = ['admin@misbah.site', 'admin@example.com'];
    return user && adminEmails.includes(user.email || '');
}

type ProfileStatus = 'draft' | 'under_review' | 'needs_changes' | 'approved' | 'published' | 'suspended';

const STATUS_LABELS: Record<ProfileStatus, string> = {
    draft: 'مسودة',
    under_review: 'قيد المراجعة',
    needs_changes: 'يحتاج تعديل',
    approved: 'مقبول (ينتظر الحساب)',
    published: 'منشور',
    suspended: 'موقوف',
};

const STATUS_COLORS: Record<ProfileStatus, string> = {
    draft: '#6B7280',
    under_review: '#F59E0B',
    needs_changes: '#EF4444',
    approved: '#10B981',
    published: '#3B82F6',
    suspended: '#DC2626',
};

export default async function AdminPage() {
    const isAdminUser = await isAdmin();

    if (!isAdminUser) {
        redirect('/');
    }

    const supabase = await createClient();

    // Fetch all profiles with subscriptions
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>خطأ في تحميل البيانات</div>
                </div>
            </main>
        );
    }

    // Group by status
    const groupedProfiles: Record<string, typeof profiles> = {};
    (profiles || []).forEach(p => {
        const status = p.status || 'draft';
        if (!groupedProfiles[status]) groupedProfiles[status] = [];
        groupedProfiles[status].push(p);
    });

    const underReview = groupedProfiles['under_review'] || [];
    const needsChanges = groupedProfiles['needs_changes'] || [];
    const approved = groupedProfiles['approved'] || [];
    const published = groupedProfiles['published'] || [];
    const suspended = groupedProfiles['suspended'] || [];

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>لوحة الإدارة</h1>
                    <p className={styles.subtitle}>مراجعة وإدارة طلبات المعلمين</p>
                </header>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>قيد المراجعة</div>
                        <div className={styles.statValue} style={{ color: STATUS_COLORS.under_review }}>
                            {underReview.length}
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>يحتاج تعديل</div>
                        <div className={styles.statValue} style={{ color: STATUS_COLORS.needs_changes }}>
                            {needsChanges.length}
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>مقبول</div>
                        <div className={styles.statValue} style={{ color: STATUS_COLORS.approved }}>
                            {approved.length}
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>منشور</div>
                        <div className={styles.statValue} style={{ color: STATUS_COLORS.published }}>
                            {published.length}
                        </div>
                    </div>
                </div>

                {/* Under Review Queue */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        طلبات قيد المراجعة
                        <span className={styles.count}>{underReview.length}</span>
                    </h2>
                    {underReview.length === 0 ? (
                        <div className={styles.emptyState}>لا توجد طلبات معلقة</div>
                    ) : (
                        <div className={styles.profileList}>
                            {underReview.map((profile) => (
                                <Link
                                    key={profile.id}
                                    href={`/admin/profile/${profile.id}`}
                                    className={styles.profileCard}
                                >
                                    <div className={styles.profileInfo}>
                                        <div className={styles.profileName}>{profile.full_name}</div>
                                        <div className={styles.profileMeta}>
                                            {profile.country} • {profile.subjects?.join('، ')}
                                        </div>
                                    </div>
                                    <div
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: STATUS_COLORS.under_review }}
                                    >
                                        {STATUS_LABELS.under_review}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Needs Changes */}
                {needsChanges.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            يحتاج تعديل
                            <span className={styles.count}>{needsChanges.length}</span>
                        </h2>
                        <div className={styles.profileList}>
                            {needsChanges.map((profile) => (
                                <Link
                                    key={profile.id}
                                    href={`/admin/profile/${profile.id}`}
                                    className={styles.profileCard}
                                >
                                    <div className={styles.profileInfo}>
                                        <div className={styles.profileName}>{profile.full_name}</div>
                                        <div className={styles.profileMeta}>
                                            {profile.admin_notes}
                                        </div>
                                    </div>
                                    <div
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: STATUS_COLORS.needs_changes }}
                                    >
                                        {STATUS_LABELS.needs_changes}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Published Profiles */}
                {published.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            منشور في الدليل
                            <span className={styles.count}>{published.length}</span>
                        </h2>
                        <div className={styles.profileList}>
                            {published.slice(0, 5).map((profile) => (
                                <Link
                                    key={profile.id}
                                    href={`/admin/profile/${profile.id}`}
                                    className={styles.profileCard}
                                >
                                    <div className={styles.profileInfo}>
                                        <div className={styles.profileName}>{profile.full_name}</div>
                                        <div className={styles.profileMeta}>
                                            {profile.country}
                                        </div>
                                    </div>
                                    <div
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: STATUS_COLORS.published }}
                                    >
                                        {STATUS_LABELS.published}
                                    </div>
                                </Link>
                            ))}
                            {published.length > 5 && (
                                <div className={styles.moreLink}>
                                    + {published.length - 5} أخرى
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Audit Log Link */}
                <div className={styles.auditLink}>
                    <Link href="/admin/audit">عرض سجل النشاط →</Link>
                </div>
            </div>
        </main>
    );
}
