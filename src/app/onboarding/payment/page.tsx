'use client';

import { useActionState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button, Card } from '@/components/ui';
import { submitPaymentProof, type PaymentActionState } from './actions';
import styles from '../onboarding.module.css';

const initialState: PaymentActionState = {};

export default function PaymentPage() {
  const { locale } = useI18n();
  const [state, formAction, isPending] = useActionState(submitPaymentProof, initialState);
  const isAr = locale === 'ar';

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${styles.stepComplete}`} />
          <div className={`${styles.step} ${styles.stepActive}`} />
          <div className={styles.step} />
          <div className={styles.step} />
        </div>

        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {isAr ? 'تفعيل الملف الشخصي' : 'Activate Your Profile'}
          </h1>
          <p className={styles.subtitle}>
            {isAr
              ? 'قم بتحويل رسوم الاشتراك ثم أرفق إثبات الدفع'
              : 'Transfer the subscription fee and upload payment proof'}
          </p>
        </header>

        {/* Pricing Card */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            {isAr ? 'الاشتراك السنوي' : 'Annual Subscription'}
          </div>

          <div style={{ marginBlockEnd: 'var(--space-md)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-ink-strong)' }}>
              {isAr ? '٣٠٠ جنيه' : '300 EGP'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)' }}>
              {isAr ? 'السنة الأولى (خصم ٥٠٪)' : 'First year (50% discount)'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)', marginBlockStart: 'var(--space-micro)' }}>
              {isAr ? 'التجديد: ٦٠٠ جنيه / سنة' : 'Renewal: 600 EGP / year'}
            </div>
          </div>

          <div className={styles.cardHint}>
            {isAr ? 'حوّل المبلغ إلى:' : 'Transfer to:'}
          </div>

          <div style={{
            background: 'var(--color-ground)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-badge)',
            fontSize: '0.9375rem',
            lineHeight: 1.8
          }}>
            <div><strong>{isAr ? 'فودافون كاش:' : 'Vodafone Cash:'}</strong> 01012345678</div>
          </div>
        </div>

        {/* Upload Form */}
        <form action={formAction} className={styles.form}>
          {state?.error && <div className={styles.error}>{state.error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="proof" className={styles.label}>
              {isAr ? 'أرفق إثبات الدفع' : 'Upload Payment Proof'}
            </label>
            <input
              type="file"
              id="proof"
              name="proof"
              accept="image/*,application/pdf"
              className={styles.input}
              required
            />
            <p className={styles.cardHint}>
              {isAr
                ? 'صورة أو PDF لإيصال التحويل'
                : 'Screenshot or PDF of transfer receipt'}
            </p>
          </div>

          <div className={styles.submitButton}>
            <Button type="submit" variant="primary" fullWidth disabled={isPending}>
              {isPending
                ? isAr
                  ? 'جاري الرفع...'
                  : 'Uploading...'
                : isAr
                  ? 'إرسال إثبات الدفع'
                  : 'Submit Payment Proof'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
