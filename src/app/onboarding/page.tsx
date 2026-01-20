'use client'

import { useActionState } from 'react'
import { saveProfileAction } from './actions'
import styles from './onboarding.module.css'
import { SubjectEnum, TeachingFormatEnum, AudienceEnum } from '@/lib/types/onboarding'

const initialState = {
  error: null,
  success: false
}

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState(saveProfileAction, initialState)

  const validationErrors = state?.error && typeof state.error !== 'string' ? state.error.fieldErrors : {}
  const formError = state?.error && typeof state.error === 'string' ? state.error : null

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Teacher Profile Setup</h1>
      
      <form action={formAction}>
        {formError && <div className={styles.error} style={{ marginBottom: '1rem' }}>{formError}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="full_name" className={styles.label}>Full Name</label>
          <input type="text" id="full_name" name="full_name" className={styles.input} required />
          {validationErrors.full_name && <div className={styles.error}>{validationErrors.full_name[0]}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Subjects (Select all that apply)</label>
          <div className={styles.checkboxGroup}>
            {SubjectEnum.options.map(subject => (
              <label key={subject} className={styles.checkboxLabel}>
                <input type="checkbox" name="subjects" value={subject} />
                {subject}
              </label>
            ))}
          </div>
          {validationErrors.subjects && <div className={styles.error}>{validationErrors.subjects[0]}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Target Audience</label>
          <div className={styles.checkboxGroup}>
            {AudienceEnum.options.map(audience => (
              <label key={audience} className={styles.checkboxLabel}>
                <input type="checkbox" name="audience" value={audience} />
                {audience}
              </label>
            ))}
          </div>
          {validationErrors.audience && <div className={styles.error}>{validationErrors.audience[0]}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="experience_text" className={styles.label}>Experience & Qualifications</label>
          <textarea 
            id="experience_text" 
            name="experience_text" 
            className={styles.textarea} 
            placeholder="Tell us about your background, years of experience, and methodology..."
            required
          />
          {validationErrors.experience_text && <div className={styles.error}>{validationErrors.experience_text[0]}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="teaching_format" className={styles.label}>Teaching Format</label>
          <select id="teaching_format" name="teaching_format" className={styles.select} required>
            <option value="">Select a format</option>
            {TeachingFormatEnum.options.map(format => (
              <option key={format} value={format}>{format.replace('_', ' ')}</option>
            ))}
          </select>
          {validationErrors.teaching_format && <div className={styles.error}>{validationErrors.teaching_format[0]}</div>}
        </div>

        <div className={styles.card}>
          <div className={styles.label}>Contact Methods</div>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Provide at least one.</p>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone Number</label>
            <input type="tel" id="phone" name="phone" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="whatsapp" className={styles.label}>WhatsApp</label>
            <input type="tel" id="whatsapp" name="whatsapp" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input type="email" id="email" name="email" className={styles.input} />
          </div>
          
          {validationErrors.contact_method && <div className={styles.error}>{validationErrors.contact_method[0]}</div>}
        </div>

        <button type="submit" className={styles.button} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save & Continue'}
        </button>
      </form>
    </div>
  )
}
