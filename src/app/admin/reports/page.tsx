import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

interface Report {
    id: string;
    profile_id: string;
    report_type: string;
    description: string;
    reporter_contact: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
    profiles: {
        full_name: { ar: string; en: string };
    };
}

export default async function ReportsPage() {
    const supabase = await createClient();

    // Get all reports with profile information
    const { data: reports, error } = await supabase
        .from('reports')
        .select(`
            *,
            profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Error fetching reports:', error);
    }

    // Count by status
    const counts = {
        pending: reports?.filter((r) => r.status === 'pending').length || 0,
        investigating: reports?.filter((r) => r.status === 'investigating').length || 0,
        resolved: reports?.filter((r) => r.status === 'resolved').length || 0,
        dismissed: reports?.filter((r) => r.status === 'dismissed').length || 0,
    };

    return (
        <div className={styles.reportsPage}>
            <h1>تقارير المخالفات</h1>

            {/* Status Tabs */}
            <div className={styles.statusTabs}>
                <StatusTab label="قيد المراجعة" count={counts.pending} active />
                <StatusTab label="قيد التحقيق" count={counts.investigating} />
                <StatusTab label="تم الحل" count={counts.resolved} />
                <StatusTab label="مرفوض" count={counts.dismissed} />
            </div>

            {/* Reports List */}
            {reports && reports.length > 0 ? (
                <div className={styles.reportsList}>
                    {reports.map((report) => (
                        <ReportCard key={report.id} report={report as Report} />
                    ))}
                </div>
            ) : (
                <p className={styles.noReports}>لا توجد تقارير</p>
            )}
        </div>
    );
}

function StatusTab({ label, count, active }: { label: string; count: number; active?: boolean }) {
    return (
        <div className={`${styles.statusTab} ${active ? styles.active : ''}`}>
            <span className={styles.tabLabel}>{label}</span>
            <span className={styles.tabCount}>{count}</span>
        </div>
    );
}

function ReportCard({ report }: { report: Report }) {
    const reportTypeLabels: Record<string, string> = {
        teacher_redirection: 'تحويل لمعلم آخر',
        price_mismatch: 'اختلاف الأسعار',
        inappropriate_behavior: 'سلوك غير لائق',
        other: 'أخرى',
    };

    const statusLabels: Record<string, string> = {
        pending: 'قيد المراجعة',
        investigating: 'قيد التحقيق',
        resolved: 'تم الحل',
        dismissed: 'مرفوض',
    };

    const statusColors: Record<string, string> = {
        pending: styles.statusPending,
        investigating: styles.statusInvestigating,
        resolved: styles.statusResolved,
        dismissed: styles.statusDismissed,
    };

    return (
        <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                    <a href={`/teachers/${report.profile_id}`} className={styles.teacherLink}>
                        {report.profiles.full_name.ar}
                    </a>
                    <span className={`${styles.status} ${statusColors[report.status]}`}>
                        {statusLabels[report.status]}
                    </span>
                </div>
                <div className={styles.cardMeta}>
                    <span className={styles.reportType}>
                        {reportTypeLabels[report.report_type]}
                    </span>
                    <span className={styles.reportDate}>
                        {formatDate(report.created_at)}
                    </span>
                </div>
            </div>

            <div className={styles.cardBody}>
                <p className={styles.description}>{report.description}</p>

                {report.reporter_contact && (
                    <p className={styles.contact}>
                        <strong>جهة التواصل:</strong> {report.reporter_contact}
                    </p>
                )}

                {report.admin_notes && (
                    <div className={styles.adminNotes}>
                        <strong>ملاحظات الإدارة:</strong>
                        <p>{report.admin_notes}</p>
                    </div>
                )}
            </div>

            <div className={styles.cardActions}>
                <a href={`/admin/reports/${report.id}`} className={styles.actionButton}>
                    عرض التفاصيل
                </a>
                <a href={`/admin/profile/${report.profile_id}`} className={styles.actionButton}>
                    بروفايل المعلم
                </a>
            </div>
        </div>
    );
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
