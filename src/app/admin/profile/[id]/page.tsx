'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { approveProfile, rejectProfile, requestChanges, suspendProfile } from '../../actions';
import styles from '../../admin.module.css';

interface Experience {
    organization: string;
    role: string;
    startDate: string;
    endDate: string | null;
}

interface Profile {
    id: string;
    full_name: string;
    age: number | null;
    country: string;
    subjects: string[];
    audience: string[];
    status: string;
    teaching_format: string;
    video_url: string;
    price_amount: number | null;
    price_currency: string;
    experiences: Experience[];
    contact_method: { whatsapp?: string; email?: string; telegram?: string };
    admin_notes: string | null;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

// This component will fetch profile data client-side for now
// In production, this should be a server component
export default function ProfileReviewPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState<'changes' | 'reject' | 'suspend' | null>(null);
    const [modalMessage, setModalMessage] = useState('');

    // Fetch profile on mount
    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch(`/api/admin/profile/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>جاري التحميل...</div>
                </div>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.emptyState}>البروفايل غير موجود</div>
                </div>
            </main>
        );
    }

    const handleApprove = async () => {
        setActionLoading(true);
        const result = await approveProfile(id);
        setActionLoading(false);
        if (result.success) {
            router.push('/admin');
        }
    };

    const handleReject = async () => {
        if (!modalMessage.trim()) return;
        setActionLoading(true);
        const result = await rejectProfile(id, modalMessage);
        setActionLoading(false);
        if (result.success) {
            setShowModal(null);
            router.push('/admin');
        }
    };

    const handleRequestChanges = async () => {
        if (!modalMessage.trim()) return;
        setActionLoading(true);
        const result = await requestChanges(id, modalMessage);
        setActionLoading(false);
        if (result.success) {
            setShowModal(null);
            router.push('/admin');
        }
    };

    const handleSuspend = async () => {
        if (!modalMessage.trim()) return;
        setActionLoading(true);
        const result = await suspendProfile(id, modalMessage);
        setActionLoading(false);
        if (result.success) {
            setShowModal(null);
            router.push('/admin');
        }
    };

    // Extract YouTube video ID
    const getYouTubeId = (url: string): string | null => {
        const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : null;
    };

    const videoId = profile.video_url ? getYouTubeId(profile.video_url) : null;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <Link href="/admin" style={{ fontSize: '0.875rem', color: '#52525B', marginBottom: '24px', display: 'block' }}>
                    → العودة للوحة الإدارة
                </Link>

                <div className={styles.reviewCard}>
                    {/* Header */}
                    <div className={styles.reviewHeader}>
                        <div>
                            <h1 className={styles.reviewName}>{profile.full_name}</h1>
                            <div className={styles.reviewMeta}>
                                {profile.country} • {profile.subjects?.join('، ')}
                            </div>
                        </div>
                        <div
                            className={styles.statusBadge}
                            style={{
                                backgroundColor:
                                    profile.status === 'under_review' ? '#F59E0B' :
                                        profile.status === 'published' ? '#3B82F6' :
                                            profile.status === 'approved' ? '#10B981' :
                                                profile.status === 'needs_changes' ? '#EF4444' :
                                                    '#6B7280'
                            }}
                        >
                            {profile.status}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>العمر</span>
                            <span className={styles.reviewValue}>{profile.age} سنة</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>صيغة التدريس</span>
                            <span className={styles.reviewValue}>{profile.teaching_format}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>الفئة المستهدفة</span>
                            <span className={styles.reviewValue}>{profile.audience?.join('، ')}</span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>السعر</span>
                            <span className={styles.reviewValue}>
                                {profile.price_amount ? `${profile.price_amount} ${profile.price_currency}` : 'غير محدد'}
                            </span>
                        </div>
                    </div>

                    {/* Experience */}
                    {profile.experiences && profile.experiences.length > 0 && (
                        <div className={styles.reviewItem} style={{ marginBottom: '24px' }}>
                            <span className={styles.reviewLabel}>الخبرات</span>
                            <div style={{ marginTop: '8px' }}>
                                {profile.experiences.map((exp, i) => (
                                    <div key={i} style={{ fontSize: '0.875rem', marginBottom: '8px', padding: '12px', background: '#FAFAFA', borderRadius: '8px' }}>
                                        <strong>{exp.organization}</strong> — {exp.role}
                                        <br />
                                        <span style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
                                            {exp.startDate} → {exp.endDate || 'حتى الآن'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    <div className={styles.reviewItem} style={{ marginBottom: '24px' }}>
                        <span className={styles.reviewLabel}>وسائل التواصل</span>
                        <span className={styles.reviewValue}>
                            {profile.contact_method?.whatsapp && `واتساب: ${profile.contact_method.whatsapp}`}
                            {profile.contact_method?.email && ` | بريد: ${profile.contact_method.email}`}
                            {profile.contact_method?.telegram && ` | تليجرام: ${profile.contact_method.telegram}`}
                        </span>
                    </div>

                    {/* Video */}
                    {videoId && (
                        <div className={styles.videoContainer}>
                            <span className={styles.reviewLabel}>العينة التعليمية</span>
                            <iframe
                                className={styles.videoEmbed}
                                src={`https://www.youtube.com/embed/${videoId}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {/* Admin Notes */}
                    {profile.admin_notes && (
                        <div style={{ background: '#FEF3C7', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                            <span className={styles.reviewLabel}>ملاحظات سابقة</span>
                            <p style={{ margin: '8px 0 0', fontSize: '0.875rem', color: '#92400E' }}>
                                {profile.admin_notes}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={handleApprove}
                            disabled={actionLoading}
                        >
                            ✓ قبول وإرسال دعوة
                        </button>
                        <button
                            className={`${styles.actionBtn} ${styles.changesBtn}`}
                            onClick={() => setShowModal('changes')}
                            disabled={actionLoading}
                        >
                            طلب تعديل
                        </button>
                        <button
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            onClick={() => setShowModal('reject')}
                            disabled={actionLoading}
                        >
                            رفض
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className={styles.modal} onClick={() => setShowModal(null)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <h3 className={styles.modalTitle}>
                                {showModal === 'changes' ? 'طلب تعديل' : showModal === 'reject' ? 'سبب الرفض' : 'سبب الإيقاف'}
                            </h3>
                            <textarea
                                className={styles.modalTextarea}
                                placeholder="اكتب رسالتك هنا..."
                                value={modalMessage}
                                onChange={(e) => setModalMessage(e.target.value)}
                            />
                            <div className={styles.modalActions}>
                                <button className={styles.cancelBtn} onClick={() => setShowModal(null)}>
                                    إلغاء
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${showModal === 'reject' ? styles.rejectBtn : styles.changesBtn}`}
                                    onClick={showModal === 'changes' ? handleRequestChanges : showModal === 'reject' ? handleReject : handleSuspend}
                                    disabled={actionLoading || !modalMessage.trim()}
                                >
                                    {actionLoading ? 'جاري...' : 'تأكيد'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
