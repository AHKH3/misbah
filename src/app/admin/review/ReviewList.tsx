'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { approveListing, rejectListing } from '../actions';
import styles from '../admin.module.css';

interface ProfileWithSubscription {
  id: string;
  full_name: string;
  country: string;
  subjects: string[];
  audience: string[];
  experience_text: string;
  teaching_format: string;
  video_url?: string;
  subscriptions: Array<{
    id: string;
    payment_proof_url: string;
  }>;
}

export default function ReviewList({ items }: { items: ProfileWithSubscription[] }) {
  const [rejectModal, setRejectModal] = useState<{
    profileId: string;
    subId: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  if (items.length === 0) {
    return <div className={styles.emptyState}>لا توجد طلبات معلقة</div>;
  }

  const handleApprove = async (profileId: string, subId: string) => {
    if (!confirm('تفعيل هذا الملف الشخصي؟')) return;
    setLoading(profileId);
    await approveListing(profileId, subId);
    setLoading(null);
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason) return;
    setLoading(rejectModal.profileId);
    await rejectListing(rejectModal.profileId, rejectModal.subId, rejectReason);
    setLoading(null);
    setRejectModal(null);
    setRejectReason('');
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
          const sub = profile.subscriptions?.[0];
          if (!sub) return null;

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
                  <div style={{ marginBlockEnd: 'var(--space-base)' }}>
                    <strong>الخبرة:</strong> {profile.experience_text.slice(0, 200)}...
                  </div>
                  {sub.payment_proof_url && (
                    <a
                      href={sub.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.proofLink}
                    >
                      عرض إثبات الدفع
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.queueActions}>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(profile.id, sub.id)}
                  disabled={loading === profile.id}
                >
                  {loading === profile.id ? 'جاري...' : 'تفعيل'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setRejectModal({ profileId: profile.id, subId: sub.id })}
                  disabled={loading === profile.id}
                >
                  رفض
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className={styles.modal} onClick={() => setRejectModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>سبب الرفض</h3>
            <textarea
              className={styles.modalInput}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="اكتب سبب الرفض..."
            />
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
