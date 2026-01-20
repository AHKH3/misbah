'use client'

import { useActionState } from 'react'
import { submitPaymentProof } from './actions'
import styles from '../onboarding.module.css'

const initialState = {
  error: null,
  success: false
}

export default function PaymentPage() {
  const [state, formAction, isPending] = useActionState(submitPaymentProof, initialState)

  if (state.success) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem' }}>
          <h1 className={styles.title} style={{ color: 'green' }}>Submission Received</h1>
          <p>Your profile and payment proof have been submitted.</p>
          <p>An admin will review your application shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Activate Your Profile</h1>
      
      <div className={styles.card}>
        <h2 className={styles.label} style={{ fontSize: '1.25rem' }}>Monthly Subscription: $10/month</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>
          To activate your profile, please transfer the amount to the following account:
        </p>
        <div style={{ background: '#eee', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Bank:</strong> Islamic Bank<br/>
          <strong>Account:</strong> 1234-5678-90<br/>
          <strong>Name:</strong> Misbah Platform
        </div>
        <p>Once transferred, please upload the screenshot of the transaction below.</p>
      </div>

      <form action={formAction}>
        {state.error && <div className={styles.error} style={{ marginBottom: '1rem' }}>{typeof state.error === 'string' ? state.error : 'Error uploading file'}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="proof" className={styles.label}>Upload Payment Proof</label>
          <input 
            type="file" 
            id="proof" 
            name="proof" 
            accept="image/*,application/pdf"
            className={styles.input} 
            required 
          />
        </div>

        <button type="submit" className={styles.button} disabled={isPending}>
          {isPending ? 'Uploading...' : 'Submit Payment Proof'}
        </button>
      </form>
    </div>
  )
}
