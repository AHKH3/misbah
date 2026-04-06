import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { markAsReviewed } from './actions';
import styles from './page.module.css';

interface DuplicateAlert {
    id: string;
    new_profile_id: string;
    existing_profile_id: string;
    match_score: number;
    matched_fields: Record<string, boolean>;
    reviewed: boolean;
    created_at: string;
    new_profile: {
        full_name: string;
        full_name_en?: string;
        misbah_email: string;
        contact_method: any;
        status: string;
    };
    existing_profile: {
        full_name: string;
        full_name_en?: string;
        misbah_email: string;
        contact_method: any;
        status: string;
    };
}

export default async function DuplicatesPage() {
    const supabase = await createClient();

    // Get all duplicate alerts (unreviewed first)
    const { data: alerts, error } = await supabase
        .from('duplicate_alerts')
        .select(`
            *,
            new_profile:profiles!duplicate_alerts_new_profile_id_fkey(
                full_name,
                full_name_en,
                misbah_email,
                contact_method,
                status
            ),
            existing_profile:profiles!duplicate_alerts_existing_profile_id_fkey(
                full_name,
                full_name_en,
                misbah_email,
                contact_method,
                status
            )
        `)
        .order('reviewed', { ascending: true })
        .order('match_score', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching duplicates:', error);
    }

    const unreviewed = alerts?.filter(a => !a.reviewed) || [];
    const reviewed = alerts?.filter(a => a.reviewed) || [];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>تنبيهات التكرار</h1>
                <Link href="/admin" className={styles.backLink}>
                    ← العودة للأدمن
                </Link>
            </div>

            {/* Summary */}
            <div className={styles.summary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryValue}>{unreviewed.length}</div>
                    <div className={styles.summaryLabel}>تنبيهات جديدة</div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryValue}>{reviewed.length}</div>
                    <div className={styles.summaryLabel}>تمت مراجعتها</div>
                </div>
            </div>

            {/* Unreviewed Alerts */}
            {unreviewed.length > 0 && (
                <section className={styles.section}>
                    <h2>⚠️ تنبيهات تحتاج مراجعة</h2>
                    <div className={styles.alertsList}>
                        {unreviewed.map((alert) => (
                            <DuplicateCard key={alert.id} alert={alert as DuplicateAlert} />
                        ))}
                    </div>
                </section>
            )}

            {/* Reviewed Alerts */}
            {reviewed.length > 0 && (
                <section className={styles.section}>
                    <h2>✅ تنبيهات تمت مراجعتها</h2>
                    <div className={styles.alertsList}>
                        {reviewed.map((alert) => (
                            <DuplicateCard key={alert.id} alert={alert as DuplicateAlert} />
                        ))}
                    </div>
                </section>
            )}

            {unreviewed.length === 0 && reviewed.length === 0 && (
                <div className={styles.empty}>
                    <p>لا توجد تنبيهات تكرار حتى الآن</p>
                </div>
            )}
        </div>
    );
}

function DuplicateCard({ alert }: { alert: DuplicateAlert }) {
    const matchPercentage = (alert.match_score * 100).toFixed(0);
    const severity = alert.match_score >= 0.85 ? 'high' : alert.match_score >= 0.60 ? 'medium' : 'low';

    // Parse full names
    const parseFullName = (fullName: string, fullNameEn?: string) => {
        try {
            const parsed = JSON.parse(fullName);
            return { ar: parsed.ar || fullName, en: parsed.en || fullNameEn || fullName };
        } catch {
            return { ar: fullName, en: fullNameEn || fullName };
        }
    };

    const newName = parseFullName(alert.new_profile.full_name, alert.new_profile.full_name_en);
    const existingName = parseFullName(alert.existing_profile.full_name, alert.existing_profile.full_name_en);

    return (
        <div className={`${styles.alertCard} ${styles[severity]} ${alert.reviewed ? styles.reviewed : ''}`}>
            {/* Header */}
            <div className={styles.alertHeader}>
                <div className={styles.alertScore}>
                    {severity === 'high' && '🔴'}
                    {severity === 'medium' && '🟡'}
                    {severity === 'low' && '🟢'}
                    <span className={styles.scoreValue}>{matchPercentage}%</span>
                    <span className={styles.scoreLabel}>تطابق</span>
                </div>
                <div className={styles.alertMeta}>
                    <span className={styles.alertDate}>
                        {new Date(alert.created_at).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                    {alert.reviewed && (
                        <span className={styles.reviewedBadge}>✓ تمت المراجعة</span>
                    )}
                </div>
            </div>

            {/* Comparison */}
            <div className={styles.comparison}>
                {/* New Profile */}
                <div className={styles.profileColumn}>
                    <div className={styles.profileLabel}>معلم جديد (تحت المراجعة)</div>
                    <div className={styles.profileInfo}>
                        <Link href={`/admin/profile/${alert.new_profile_id}`} className={styles.profileName}>
                            {newName.ar}
                        </Link>
                        <div className={styles.profileDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>الحالة:</span>
                                <span className={styles.detailValue}>{alert.new_profile.status}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>إيميل:</span>
                                <span className={styles.detailValue}>{alert.new_profile.misbah_email}</span>
                            </div>
                            {alert.new_profile.contact_method?.whatsapp && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>واتساب:</span>
                                    <span className={styles.detailValue}>{alert.new_profile.contact_method.whatsapp}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div className={styles.arrow}>↔</div>

                {/* Existing Profile */}
                <div className={styles.profileColumn}>
                    <div className={styles.profileLabel}>معلم موجود</div>
                    <div className={styles.profileInfo}>
                        <Link href={`/admin/profile/${alert.existing_profile_id}`} className={styles.profileName}>
                            {existingName.ar}
                        </Link>
                        <div className={styles.profileDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>الحالة:</span>
                                <span className={styles.detailValue}>{alert.existing_profile.status}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>إيميل:</span>
                                <span className={styles.detailValue}>{alert.existing_profile.misbah_email}</span>
                            </div>
                            {alert.existing_profile.contact_method?.whatsapp && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>واتساب:</span>
                                    <span className={styles.detailValue}>{alert.existing_profile.contact_method.whatsapp}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Matched Fields */}
            <div className={styles.matchedFields}>
                <div className={styles.fieldsLabel}>حقول متطابقة:</div>
                <div className={styles.fieldsTags}>
                    {Object.entries(alert.matched_fields)
                        .filter(([, isMatch]) => isMatch)
                        .map(([field]) => (
                            <span key={field} className={styles.fieldTag}>
                                {getFieldLabel(field)}
                            </span>
                        ))}
                </div>
            </div>

            {/* Actions */}
            {!alert.reviewed && (
                <form action={markAsReviewed} className={styles.actions}>
                    <input type="hidden" name="alertId" value={alert.id} />
                    <button type="submit" className={styles.reviewButton}>
                        ✓ تم المراجعة
                    </button>
                </form>
            )}
        </div>
    );
}

function getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
        name: 'الاسم',
        whatsapp: 'واتساب',
        telegram: 'تليجرام',
        youtube: 'يوتيوب',
        country_subjects: 'البلد والمواد',
        email: 'الإيميل',
    };
    return labels[field] || field;
}
