'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { approveProfile, rejectProfile } from '../actions';
import styles from '../admin.module.css';

interface Profile {
  id: string;
  full_name: string;
  country: string;
  subjects: string[];
  audience: string[];
  experience_text: string;
  teaching_format: string;
  video_url?: string;
  availability_status: string;
}

export default function ReviewList({ items }: { items: Profile[] }) {
  const [rejectModal, setRejectModal] = useState<{
    profileId: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [banDuration, setBanDuration] = useState<'30d' | '90d' | 'permanent'>('30d');
  const [loading, setLoading] = useState<string | null>(null);

  if (items.length === 0) {
    return <div className={styles.emptyState}>لا توجد طلبات معلقة</div>;
  }

  const handleApprove = async (profileId: string) => {
    if (!confirm('تفعيل هذا الملف الشخصي؟')) return;
    setLoading(profileId);
    await approveProfile(profileId);
    setLoading(null);
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason) return;
    setLoading(rejectModal.profileId);
    await rejectProfile(rejectModal.profileId, rejectReason, banDuration);
    setLoading(null);
    setRejectModal(null);
    setRejectReason('');
    setBanDuration('30d'); // Reset to default
  };

  const SUBJECT_LABELS: Record<string, string> = {
    Quran: 'القرآن',
    Tajweed: 'التجويد',
    Arabic: 'العربية',
    'Islamic Studies': 'الدراسات الإسلامية',
  };

  return (
    <>
      <div className={styles.queue}>
        {items.map((profile) => {
          return (
            <div key={profile.id} className={styles.queueItem}>
              <div className={styles.queueInfo}>
                <h2 className={styles.queueName}>{profile.full_name}</h2>
                <p className={styles.queueMeta}>{profile.country}</p>

                <div className={styles.queueDetails}>
                  <div style={{ marginBlockEnd: 'var(--space-base)' }}>
                    <strong>التخصصات:</strong>{' '}
                    {profile.subjects.map(s => SUBJECT_LABELS[s] || s).join('، ')}
                  </div>
                  {profile.experience_text && (
                    <div style={{ marginBlockEnd: 'var(--space-base)' }}>
                      <strong>الخبرة:</strong> {profile.experience_text.slice(0, 200)}...
                    </div>
                  )}
                  {profile.video_url && (
                    <a
                      href={profile.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.proofLink}
                    >
                      مراجعة الفيديو
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.queueActions}>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(profile.id)}
                  disabled={loading === profile.id}
                >
                  {loading === profile.id ? 'جاري...' : 'تفعيل'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setRejectModal({ profileId: profile.id })}
                  disabled={loading === profile.id}
                >
                  رفض
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Modal with Ban Duration */}
      {rejectModal && (
        <div className={styles.modal} onClick={() => setRejectModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>رفض المعلم</h3>
            
            <div style={{ marginBlockEnd: 'var(--space-md)' }}>
              <label htmlFor="rejectReason" style={{ display: 'block', marginBlockEnd: 'var(--space-sm)', fontWeight: 500 }}>
                سبب الرفض
              </label>
              <textarea
                id="rejectReason"
                className={styles.modalInput}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="اكتب سبب الرفض بوضوح..."
                rows={4}
              />
            </div>

            <div style={{ marginBlockEnd: 'var(--space-lg)' }}>
              <label htmlFor="banDuration" style={{ display: 'block', marginBlockEnd: 'var(--space-sm)', fontWeight: 500 }}>
                مدة الحظر
              </label>
              <select
                id="banDuration"
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value as '30d' | '90d' | 'permanent')}
                className={styles.modalSelect}
              >
                <option value="30d">30 يوم (افتراضي)</option>
                <option value="90d">90 يوم (متكرر)</option>
                <option value="permanent">دائم (محتال)</option>
              </select>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)', marginBlockStart: 'var(--space-micro)' }}>
                {banDuration === '30d' && 'يمكن للمعلم إعادة التسجيل بعد 30 يوم'}
                {banDuration === '90d' && 'يمكن للمعلم إعادة التسجيل بعد 90 يوم'}
                {banDuration === 'permanent' && 'لن يتمكن المعلم من التسجيل مجدداً'}
              </p>
            </div>

            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => setRejectModal(null)}>
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={handleReject}
                disabled={!rejectReason || loading !== null}
              >
                تأكيد الرفض
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
