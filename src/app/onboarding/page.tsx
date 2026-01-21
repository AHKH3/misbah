'use client';

import { useActionState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { saveProfileAction, type ActionState } from './actions';
import styles from './onboarding.module.css';

const SUBJECTS = [
  { value: 'Quran', labelAr: 'القرآن الكريم', labelEn: 'Quran' },
  { value: 'Tajweed', labelAr: 'التجويد', labelEn: 'Tajweed' },
  { value: 'Arabic', labelAr: 'اللغة العربية', labelEn: 'Arabic' },
  { value: 'Islamic Studies', labelAr: 'الدراسات الإسلامية', labelEn: 'Islamic Studies' },
];

const AUDIENCES = [
  { value: 'Kids', labelAr: 'الأطفال', labelEn: 'Kids' },
  { value: 'Adults', labelAr: 'الكبار', labelEn: 'Adults' },
  { value: 'Females Only', labelAr: 'الإناث فقط', labelEn: 'Females Only' },
  { value: 'Males Only', labelAr: 'الذكور فقط', labelEn: 'Males Only' },
  { value: 'Everyone', labelAr: 'الجميع', labelEn: 'Everyone' },
];

const FORMATS = [
  { value: 'online', labelAr: 'أونلاين', labelEn: 'Online' },
  { value: 'in_person', labelAr: 'حضوري', labelEn: 'In-Person' },
  { value: 'hybrid', labelAr: 'أونلاين وحضوري', labelEn: 'Hybrid' },
];

const initialState: ActionState = {};

export default function OnboardingPage() {
  const { locale } = useI18n();
  const [state, formAction, isPending] = useActionState(saveProfileAction, initialState);
  const isAr = locale === 'ar';

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${styles.stepActive}`} />
          <div className={styles.step} />
          <div className={styles.step} />
          <div className={styles.step} />
        </div>

        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            {isAr ? 'بيانات الملف الشخصي' : 'Profile Information'}
          </h1>
          <p className={styles.subtitle}>
            {isAr
              ? 'أدخل بياناتك لإنشاء ملفك الشخصي في دليل مصباح'
              : 'Enter your details to create your profile in Misbah directory'}
          </p>
        </header>

        {/* Form */}
        <form action={formAction} className={styles.form}>
          {state?.error && <div className={styles.error}>{state.error}</div>}

          {/* Full Name */}
          <div className={styles.formGroup}>
            <label htmlFor="full_name" className={styles.label}>
              {isAr ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className={styles.input}
              required
            />
            {state?.fieldErrors?.full_name && (
              <div className={styles.error}>{state.fieldErrors.full_name[0]}</div>
            )}
          </div>

          {/* Country */}
          <div className={styles.formGroup}>
            <label htmlFor="country" className={styles.label}>
              {isAr ? 'البلد' : 'Country'}
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className={styles.input}
              required
            />
            {state?.fieldErrors?.country && (
              <div className={styles.error}>{state.fieldErrors.country[0]}</div>
            )}
          </div>

          {/* Subjects */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {isAr ? 'التخصصات' : 'Subjects'}
            </label>
            <div className={styles.checkboxGroup}>
              {SUBJECTS.map((subject) => (
                <label key={subject.value} className={styles.checkboxLabel}>
                  <input type="checkbox" name="subjects" value={subject.value} />
                  {isAr ? subject.labelAr : subject.labelEn}
                </label>
              ))}
            </div>
            {state?.fieldErrors?.subjects && (
              <div className={styles.error}>{state.fieldErrors.subjects[0]}</div>
            )}
          </div>

          {/* Audience */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {isAr ? 'الفئة المستهدفة' : 'Target Audience'}
            </label>
            <div className={styles.checkboxGroup}>
              {AUDIENCES.map((audience) => (
                <label key={audience.value} className={styles.checkboxLabel}>
                  <input type="checkbox" name="audience" value={audience.value} />
                  {isAr ? audience.labelAr : audience.labelEn}
                </label>
              ))}
            </div>
            {state?.fieldErrors?.audience && (
              <div className={styles.error}>{state.fieldErrors.audience[0]}</div>
            )}
          </div>

          {/* Teaching Format */}
          <div className={styles.formGroup}>
            <label htmlFor="teaching_format" className={styles.label}>
              {isAr ? 'طريقة التدريس' : 'Teaching Format'}
            </label>
            <select
              id="teaching_format"
              name="teaching_format"
              className={styles.select}
              required
            >
              <option value="">{isAr ? 'اختر طريقة' : 'Select format'}</option>
              {FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {isAr ? format.labelAr : format.labelEn}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.teaching_format && (
              <div className={styles.error}>{state.fieldErrors.teaching_format[0]}</div>
            )}
          </div>

          {/* Experience */}
          <div className={styles.formGroup}>
            <label htmlFor="experience_text" className={styles.label}>
              {isAr ? 'الخبرة والمؤهلات' : 'Experience & Qualifications'}
            </label>
            <textarea
              id="experience_text"
              name="experience_text"
              className={styles.textarea}
              placeholder={
                isAr
                  ? 'اكتب عن خبرتك وسنوات التدريس ومنهجيتك...'
                  : 'Tell us about your background, years of experience, and methodology...'
              }
              required
            />
            {state?.fieldErrors?.experience_text && (
              <div className={styles.error}>{state.fieldErrors.experience_text[0]}</div>
            )}
          </div>

          {/* Video URL */}
          <div className={styles.formGroup}>
            <label htmlFor="video_url" className={styles.label}>
              {isAr ? 'رابط فيديو تعليمي (YouTube)' : 'Educational Video URL (YouTube)'}
            </label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              className={styles.input}
              placeholder="https://youtube.com/watch?v=..."
              required
            />
            {state?.fieldErrors?.video_url && (
              <div className={styles.error}>{state.fieldErrors.video_url[0]}</div>
            )}
          </div>

          {/* Contact Methods */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              {isAr ? 'طرق التواصل' : 'Contact Methods'}
            </div>
            <p className={styles.cardHint}>
              {isAr ? 'أدخل طريقة تواصل واحدة على الأقل' : 'Provide at least one'}
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="whatsapp" className={styles.label}>
                {isAr ? 'واتساب' : 'WhatsApp'}
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                className={styles.input}
                placeholder="+201234567890"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                {isAr ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telegram" className={styles.label}>
                {isAr ? 'تليجرام' : 'Telegram'}
              </label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                className={styles.input}
                placeholder="@username"
              />
            </div>

            {state?.fieldErrors?.contact_method && (
              <div className={styles.error}>{state.fieldErrors.contact_method[0]}</div>
            )}
          </div>

          {/* Submit */}
          <div className={styles.submitButton}>
            <Button type="submit" variant="primary" fullWidth disabled={isPending}>
              {isPending
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isAr
                  ? 'حفظ والمتابعة'
                  : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
