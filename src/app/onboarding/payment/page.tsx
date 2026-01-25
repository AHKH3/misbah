'use client';

import { useActionState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { submitPaymentProof, type PaymentActionState } from './actions';
import styles from '../onboarding.module.css';

const initialState: PaymentActionState = {};

export default function PaymentPage() {
  const { labels } = useI18n();
  const { payment } = labels.onboarding;
  const [state, formAction, isPending] = useActionState(submitPaymentProof, initialState);

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
          <h1 className={styles.title}>{payment.title}</h1>
          <p className={styles.subtitle}>{payment.subtitle}</p>
        </header>

        {/* Pricing Card */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>{payment.pricingTitle}</div>

          <div style={{ marginBlockEnd: 'var(--space-md)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-ink-strong)' }}>
              {payment.price}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)' }}>
              {payment.discount}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)', marginBlockStart: 'var(--space-micro)' }}>
              {payment.renewal}
            </div>
          </div>

          <div className={styles.cardHint}>{payment.transferStart}</div>

          <div style={{
            background: 'var(--color-ground)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-badge)',
            fontSize: '0.9375rem',
            lineHeight: 1.8
          }}>
            <div><strong>{payment.methodName}</strong> 01012345678</div>
          </div>
        </div>

        {/* Upload Form */}
        <form action={formAction} className={styles.form}>
          {state?.error && <div className={styles.error}>{state.error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="proof" className={styles.label}>
              {payment.uploadLabel}
            </label>
            <input
              type="file"
              id="proof"
              name="proof"
              accept="image/*,application/pdf"
              className={styles.input}
              required
            />
            <p className={styles.cardHint}>{payment.uploadHint}</p>
          </div>

          <div className={styles.submitButton}>
            <Button type="submit" variant="primary" fullWidth disabled={isPending}>
              {isPending ? payment.submitting : payment.submit}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
