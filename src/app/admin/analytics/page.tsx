import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import styles from './page.module.css';

interface ContactClickStats {
    profile_id: string;
    full_name_ar: string;
    full_name_en: string;
    total_clicks: number;
    whatsapp_clicks: number;
    telegram_clicks: number;
    email_clicks: number;
    website_clicks: number;
    last_clicked_at: string;
}

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // Get all clicks with profile info
    const { data: clicksData, error } = await supabase
        .from('contact_clicks')
        .select(`
            *,
            profiles!inner(
                id,
                full_name,
                full_name_en,
                status
            )
        `)
        .eq('profiles.status', 'published')
        .order('clicked_at', { ascending: false });

    if (error) {
        console.error('Error fetching clicks:', error);
    }

    // Calculate aggregate stats
    const statsMap = new Map<string, ContactClickStats>();

    clicksData?.forEach((click: any) => {
        const profileId = click.profile_id;
        const profile = click.profiles;

        if (!statsMap.has(profileId)) {
            // Parse full_name
            let fullNameAr = '';
            let fullNameEn = '';
            try {
                const parsed = JSON.parse(profile.full_name);
                fullNameAr = parsed.ar || profile.full_name;
                fullNameEn = parsed.en || profile.full_name_en || profile.full_name;
            } catch {
                fullNameAr = profile.full_name;
                fullNameEn = profile.full_name_en || profile.full_name;
            }

            statsMap.set(profileId, {
                profile_id: profileId,
                full_name_ar: fullNameAr,
                full_name_en: fullNameEn,
                total_clicks: 0,
                whatsapp_clicks: 0,
                telegram_clicks: 0,
                email_clicks: 0,
                website_clicks: 0,
                last_clicked_at: click.clicked_at,
            });
        }

        const stat = statsMap.get(profileId)!;
        stat.total_clicks++;

        if (click.contact_type === 'whatsapp') stat.whatsapp_clicks++;
        if (click.contact_type === 'telegram') stat.telegram_clicks++;
        if (click.contact_type === 'email') stat.email_clicks++;
        if (click.contact_type === 'website') stat.website_clicks++;

        // Update last_clicked_at if this click is more recent
        if (new Date(click.clicked_at) > new Date(stat.last_clicked_at)) {
            stat.last_clicked_at = click.clicked_at;
        }
    });

    const stats = Array.from(statsMap.values()).sort((a, b) => b.total_clicks - a.total_clicks);

    // Calculate totals
    const totalTeachers = stats.length;
    const totalClicks = stats.reduce((sum, s) => sum + s.total_clicks, 0);
    const totalWhatsApp = stats.reduce((sum, s) => sum + s.whatsapp_clicks, 0);
    const totalTelegram = stats.reduce((sum, s) => sum + s.telegram_clicks, 0);
    const totalEmail = stats.reduce((sum, s) => sum + s.email_clicks, 0);
    const totalWebsite = stats.reduce((sum, s) => sum + s.website_clicks, 0);

    // Calculate daily clicks (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentClicks = clicksData?.filter((c: any) => 
        new Date(c.clicked_at) >= thirtyDaysAgo
    ) || [];

    const dailyClicks = calculateDailyClicks(recentClicks);

    return (
        <div className={styles.analyticsPage}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <h1>تحليلات التواصل</h1>
                <Link href="/admin" style={{ fontSize: '0.875rem' }}>← العودة للأدمن</Link>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryCards}>
                <div className={styles.card}>
                    <div className={styles.cardValue}>{totalTeachers}</div>
                    <div className={styles.cardLabel}>معلمين نشطين</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardValue}>{totalClicks}</div>
                    <div className={styles.cardLabel}>إجمالي الضغطات</div>
                </div>
                <div className={styles.card} style={{ backgroundColor: 'rgba(37, 211, 102, 0.05)' }}>
                    <div className={styles.cardValue}>📞 {totalWhatsApp}</div>
                    <div className={styles.cardLabel}>واتساب</div>
                </div>
                <div className={styles.card} style={{ backgroundColor: 'rgba(46, 170, 220, 0.05)' }}>
                    <div className={styles.cardValue}>💬 {totalTelegram}</div>
                    <div className={styles.cardLabel}>تليجرام</div>
                </div>
                <div className={styles.card} style={{ backgroundColor: 'rgba(234, 67, 53, 0.05)' }}>
                    <div className={styles.cardValue}>✉️ {totalEmail}</div>
                    <div className={styles.cardLabel}>إيميل</div>
                </div>
                <div className={styles.card} style={{ backgroundColor: 'rgba(128, 128, 128, 0.05)' }}>
                    <div className={styles.cardValue}>🌐 {totalWebsite}</div>
                    <div className={styles.cardLabel}>موقع</div>
                </div>
            </div>

            {/* Distribution Chart */}
            <section className={styles.section}>
                <h2>توزيع الضغطات حسب النوع</h2>
                <div className={styles.chartContainer}>
                    {totalClicks > 0 ? (
                        <ContactTypeChart 
                            whatsapp={totalWhatsApp}
                            telegram={totalTelegram}
                            email={totalEmail}
                            website={totalWebsite}
                        />
                    ) : (
                        <p className={styles.noData}>لا توجد بيانات لعرضها</p>
                    )}
                </div>
            </section>

            {/* Daily Clicks Chart */}
            <section className={styles.section}>
                <h2>الضغطات اليومية (آخر 30 يوم)</h2>
                <div className={styles.chartContainer}>
                    {dailyClicks.length > 0 ? (
                        <SimpleBarChart data={dailyClicks} />
                    ) : (
                        <p className={styles.noData}>لا توجد بيانات لعرضها</p>
                    )}
                </div>
            </section>

            {/* Teacher Ranking */}
            <section className={styles.section}>
                <h2>ترتيب المعلمين حسب الضغطات</h2>
                {stats.length > 0 ? (
                    <TeacherRankingTable stats={stats} />
                ) : (
                    <p className={styles.noData}>لا توجد بيانات لعرضها</p>
                )}
            </section>
        </div>
    );
}

function calculateDailyClicks(clicks: Array<{ clicked_at: string }>) {
    const dailyMap = new Map<string, number>();

    clicks.forEach((c) => {
        const date = new Date(c.clicked_at).toISOString().split('T')[0];
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    return Array.from(dailyMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

// Simple bar chart component
function SimpleBarChart({ data }: { data: Array<{ date: string; count: number }> }) {
    const maxCount = Math.max(...data.map((d) => d.count));

    return (
        <div className={styles.barChart}>
            {data.map((item) => {
                const height = (item.count / maxCount) * 100;
                return (
                    <div key={item.date} className={styles.barGroup}>
                        <div
                            className={styles.bar}
                            style={{ height: `${height}%` }}
                            title={`${item.count} clicks`}
                        />
                        <div className={styles.barLabel}>
                            {new Date(item.date).toLocaleDateString('ar-EG', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Contact Type Distribution Chart
function ContactTypeChart({ whatsapp, telegram, email, website }: {
    whatsapp: number;
    telegram: number;
    email: number;
    website: number;
}) {
    const total = whatsapp + telegram + email + website;
    const types = [
        { label: 'واتساب 📞', value: whatsapp, color: '#25D366' },
        { label: 'تليجرام 💬', value: telegram, color: '#2EAADC' },
        { label: 'إيميل ✉️', value: email, color: '#EA4335' },
        { label: 'موقع 🌐', value: website, color: '#808080' },
    ].filter(t => t.value > 0);

    return (
        <div style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {types.map((type) => {
                    const percentage = ((type.value / total) * 100).toFixed(1);
                    return (
                        <div key={type.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{ minWidth: '120px', fontSize: '0.9375rem', fontWeight: 500 }}>
                                {type.label}
                            </div>
                            <div style={{ flex: 1, height: '32px', backgroundColor: 'var(--color-ground)', borderRadius: 'var(--radius-badge)', overflow: 'hidden', position: 'relative' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${percentage}%`,
                                        backgroundColor: type.color,
                                        opacity: 0.2,
                                        transition: 'width 0.5s ease',
                                    }}
                                />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingInline: 'var(--spacing-sm)' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                        {type.value} ({percentage}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Teacher Ranking Table Component
function TeacherRankingTable({ stats }: { stats: ContactClickStats[] }) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>المعلم</th>
                        <th>إجمالي</th>
                        <th>📞 واتساب</th>
                        <th>💬 تليجرام</th>
                        <th>✉️ إيميل</th>
                        <th>🌐 موقع</th>
                        <th>آخر ضغطة</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat, index) => (
                        <tr key={stat.profile_id}>
                            <td>{index + 1}</td>
                            <td>
                                <Link href={`/admin/profile/${stat.profile_id}`}>
                                    {stat.full_name_ar}
                                </Link>
                            </td>
                            <td><strong>{stat.total_clicks}</strong></td>
                            <td>{stat.whatsapp_clicks || '-'}</td>
                            <td>{stat.telegram_clicks || '-'}</td>
                            <td>{stat.email_clicks || '-'}</td>
                            <td>{stat.website_clicks || '-'}</td>
                            <td>{formatDate(stat.last_clicked_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
