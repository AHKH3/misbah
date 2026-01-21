'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button, Card } from '@/components/ui';
import styles from '../onboarding.module.css';

export default function SuccessPage() {
    const { locale } = useI18n();
    const isAr = locale === 'ar';

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* Step Indicator - All complete */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.step} ${styles.stepComplete}`} />
                    <div className={`${styles.step} ${styles.stepComplete}`} />
                    <div className={`${styles.step} ${styles.stepComplete}`} />
                    <div className={`${styles.step} ${styles.stepComplete}`} />
                </div>

                {/* Header */}
                <header className={styles.header} style={{ textAlign: 'center' }}>
                    <h1 className={styles.title}>
                        {isAr ? 'تم استلام طلبك' : 'Submission Received'}
                    </h1>
                    <p className={styles.subtitle}>
                        {isAr
                            ? 'شكراً لتسجيلك في دليل مصباح'
                            : 'Thank you for registering with Misbah'}
                    </p>
                </header>

                {/* Info Card */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        {isAr ? 'ماذا يحدث الآن؟' : 'What happens next?'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <div>
                            <strong>{isAr ? '١. مراجعة الطلب' : '1. Application Review'}</strong>
                            <p style={{ color: 'var(--color-ink-subtle)', marginBlockStart: 'var(--space-micro)' }}>
                                {isAr
                                    ? 'سيقوم فريق مصباح بمراجعة بياناتك وإثبات الدفع'
                                    : 'Misbah team will review your profile and payment proof'}
                            </p>
                        </div>

                        <div>
                            <strong>{isAr ? '٢. المدة المتوقعة' : '2. Expected Timeline'}</strong>
                            <p style={{ color: 'var(--color-ink-subtle)', marginBlockStart: 'var(--space-micro)' }}>
                                {isAr
                                    ? 'خلال ٢٤ ساعة من تقديم الطلب'
                                    : 'Within 24 hours of submission'}
                            </p>
                        </div>

                        <div>
                            <strong>{isAr ? '٣. الإشعار' : '3. Notification'}</strong>
                            <p style={{ color: 'var(--color-ink-subtle)', marginBlockStart: 'var(--space-micro)' }}>
                                {isAr
                                    ? 'سنتواصل معك عبر البريد الإلكتروني بنتيجة المراجعة'
                                    : 'We will contact you via email with the review result'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Disclaimer (Mandatory per Section 8.3) */}
                <div className={styles.card} style={{ marginBlockStart: 'var(--space-md)' }}>
                    <div className={styles.cardTitle}>
                        {isAr ? 'إقرار مهم' : 'Important Notice'}
                    </div>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-ink-body)' }}>
                        {isAr
                            ? 'أقر بأن مصباح هو دليل عام للمعلمين وليس أكاديمية أو منصة توظيف. المعلومات التي قدمتها صحيحة ولم أبالغ في مؤهلاتي. أفهم أن مصباح لا يتدخل في التواصل أو الاتفاقات بيني وبين الطلاب.'
                            : 'I acknowledge that Misbah is a public directory and not an academy or employment platform. The information I provided is accurate and I have not exaggerated my qualifications. I understand that Misbah does not mediate communication or agreements between me and students.'}
                    </p>
                </div>

                {/* Back to Home */}
                <div style={{ marginBlockStart: 'var(--space-lg)', textAlign: 'center' }}>
                    <Link href="/">
                        <Button variant="ghost">
                            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
