'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Button, Icons } from '@/components/ui';
import { useWizardStore } from '../stores/wizard-store';
import { submitProfileAction } from '../actions';
import {
    SUBJECT_LABELS,
    QURAN_TYPE_LABELS,
    ARABIC_AREA_LABELS,
    ARABIC_CURRICULUM_LABELS,
    READING_CURRICULUM_LABELS,
    ISLAMIC_SECTION_LABELS,
    PROFICIENCY_LABELS
} from '../stores/wizard-store';
import styles from '../wizard.module.css';

export default function Step6Page() {
    const { labels, locale } = useI18n();
    const router = useRouter();
    const store = useWizardStore();
    const { step1, step2, step3, step4, step5, step6, updateStep6, setStep, getTotalExperienceYears, reset } = store;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isAr = locale === 'ar';
    const totalYears = getTotalExperienceYears();

    // Default subjects for backwards compatibility with old persisted state
    const currentSubjects = step2.subjects ?? [];

    // Reconstruct detailed specializations for display
    const renderSpecializations = () => {
        const specs = [];

        // Quran
        if (currentSubjects.includes('quran')) {
            const types = step2.specializations.quranTypes.map(t => QURAN_TYPE_LABELS[t]).join(isAr ? '، ' : ', ');
            specs.push(`${isAr ? 'القرآن الكريم' : 'Holy Quran'} (${types || (isAr ? 'عام' : 'General')})`);
        }

        // Arabic
        if (currentSubjects.includes('arabic')) {
            const areas = step2.specializations.arabicAreas.map(a => ARABIC_AREA_LABELS[a]);
            const details = [];

            if (step2.specializations.arabicCurricula.length > 0) {
                const curs = step2.specializations.arabicCurricula.map(c => ARABIC_CURRICULUM_LABELS[c]).join(isAr ? '، ' : ', ');
                details.push(`${isAr ? 'مناهج' : 'Curricula'}: ${curs}`);
            }
            if (step2.specializations.readingCurricula.length > 0) {
                const curs = step2.specializations.readingCurricula.map(c => READING_CURRICULUM_LABELS[c]).join(isAr ? '، ' : ', ');
                details.push(`${isAr ? 'قرائية' : 'Reading'}: ${curs}`);
            }
            if (step2.specializations.arabicOther) {
                details.push(step2.specializations.arabicOther);
            }

            const areaStr = areas.join(isAr ? '، ' : ', ');
            const detailStr = details.length > 0 ? ` - ${details.join(' | ')}` : '';
            specs.push(`${isAr ? 'اللغة العربية' : 'Arabic'} (${areaStr}${detailStr})`);
        }

        // Islamic Studies
        if (currentSubjects.includes('islamic_studies')) {
            const sections = step2.specializations.islamicSections.map(s => ISLAMIC_SECTION_LABELS[s]).join(isAr ? '، ' : ', ');
            specs.push(`${isAr ? 'الدراسات الإسلامية' : 'Islamic Studies'} (${sections || (isAr ? 'عام' : 'General')})`);
        }

        return specs.map((s, i) => <div key={i} className={styles.specItem}>• {s}</div>);
    };


    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!step6.whatsapp.trim() && !step6.telegram.trim()) {
            newErrors.contact = 'أضف واتساب أو تيليجرام على الأقل للتواصل مع الطلاب';
        }

        // Validate misbahEmail (required for Misbah communication)
        if (!step6.misbahEmail.trim()) {
            newErrors.misbahEmail = 'البريد الإلكتروني مطلوب للتواصل معك بخصوص نتيجة المراجعة';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step6.misbahEmail)) {
            newErrors.misbahEmail = 'البريد الإلكتروني غير صالح';
        }

        if (!step6.personalTeaching || !step6.noRedirection || !step6.violationConsequences || !step6.legalAcknowledgement) {
            newErrors.legal = labels.onboarding.errors.legal;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        setStep(5);
        router.push('/onboarding/step-5');
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formattedEducation = step3.education.map(edu => ({
                id: edu.id,
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.specialization,
                startDate: `${edu.startYear}-01-01`,
                endDate: edu.endYear ? `${edu.endYear}-01-01` : null,
                description: edu.notes || '',
            }));

            const formattedExperience = step3.experiences.map(exp => ({
                id: exp.id,
                organization: exp.organization,
                organizationType: exp.organizationType,
                role: exp.role,
                startDate: `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}-01`,
                endDate: exp.endYear && exp.endMonth
                    ? `${exp.endYear}-${String(exp.endMonth).padStart(2, '0')}-01`
                    : null,
                description: exp.description || '',
            }));

            const profileData = {
                full_name: step1.fullName,
                full_name_en: step1.fullNameEn,
                title: step1.title as string,
                gender: step1.gender as 'male' | 'female',
                country: step1.country,
                birth_date: step1.birthDate,
                subjects: currentSubjects,
                specializations: step2.specializations,
                languages: step2.languages || [],
                education: formattedEducation,
                experiences: formattedExperience,
                student_age_min: step4.studentAgeMin,
                student_age_max: step4.studentAgeMax,
                student_gender: step4.studentGender || '',
                price_amount: step4.priceAmount,
                price_currency: step4.priceCurrency || 'EGP',
                bio_text_ar: step4.bioTextAr,
                bio_text_en: step4.bioTextEn,
                video_url: step5.videoUrl,
                contact_method: {
                    misbahEmail: step6.misbahEmail,
                    whatsapp: step6.whatsapp || undefined,
                    telegram: step6.telegram || undefined,
                },
                teaching_format: 'online' as const,
                legal_acknowledgement: step6.legalAcknowledgement,
                personalTeaching: step6.personalTeaching,
                noRedirection: step6.noRedirection,
                violationConsequences: step6.violationConsequences,
            };

            const result = await submitProfileAction(profileData);

            if (result.error) {
                setErrors({ submit: result.error });
            } else {
                reset();
                router.push('/onboarding/success');
            }
        } catch {
            setErrors({ submit: isAr ? 'حدث خطأ غير متوقع. حاول مرة أخرى.' : 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>{labels.onboarding.profile.contactTitle}</h2>
            <p className={styles.stepDescription}>
                {labels.onboarding.profile.contactHint}
            </p>

            {/* Contact Methods */}
            <div className={styles.formGroup}>
                <label className={styles.label}>{labels.onboarding.profile.contactTitle} *</label>
                <p className={styles.hint}>
                    {labels.onboarding.hints.contact}
                </p>

                <div className={styles.cardGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="whatsapp" className={styles.smallLabel}>{labels.onboarding.labels.whatsapp}</label>
                        <input
                            type="tel"
                            id="whatsapp"
                            className={styles.input}
                            value={step6.whatsapp}
                            onChange={(e) => updateStep6({ whatsapp: e.target.value })}
                            placeholder={labels.onboarding.placeholders.whatsapp}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="telegram" className={styles.smallLabel}>{labels.onboarding.labels.telegram}</label>
                        <input
                            type="text"
                            id="telegram"
                            className={styles.input}
                            value={step6.telegram}
                            onChange={(e) => updateStep6({ telegram: e.target.value })}
                            placeholder={labels.onboarding.placeholders.telegram}
                        />
                    </div>
                </div>

                {errors.contact && <span className={styles.error}>{errors.contact}</span>}
            </div>

            {/* Misbah Communication Email - NEW */}
            <div className={styles.formGroup}>
                <label htmlFor="misbahEmail" className={styles.label}>بريدك الإلكتروني (للتواصل مع مصباح)</label>
                <p className={styles.hint}>
                    سنستخدم هذا البريد للتواصل معك بخصوص نتيجة المراجعة وإرسال رابط إنشاء حسابك (لن يظهر للطلاب)
                </p>
                <input
                    type="email"
                    id="misbahEmail"
                    className={styles.input}
                    value={step6.misbahEmail}
                    onChange={(e) => updateStep6({ misbahEmail: e.target.value })}
                    placeholder="example@email.com"
                    dir="ltr"
                />
                {errors.misbahEmail && <span className={styles.error}>{errors.misbahEmail}</span>}
            </div>

            {/* Teaching Format - Fixed to Online */}
            <div className={styles.formGroup}>
                <label className={styles.label}>{labels.onboarding.labels.teachingFormat}</label>
                <div className={styles.fixedValue}>
                    {labels.teacher.online}
                </div>
                <input type="hidden" name="teachingFormat" value="online" />
            </div>

            {/* Preview Section */}
            <div className={styles.previewSection}>
                <h3 className={styles.previewTitle}>{labels.onboarding.preview.title}</h3>
                <div className={styles.previewGrid}>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.fullName}</span>
                        <div className={styles.previewValue}>
                            <div>{step1.fullName || '—'}</div>
                            <div className={styles.previewValueSecondary}>{step1.fullNameEn || '—'}</div>
                        </div>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.country}</span>
                        <span className={styles.previewValue}>{step1.country || '—'}</span>
                    </div>
                    <div className={`${styles.previewItem} ${styles.previewItemFull}`}>
                        <span className={styles.previewLabel}>{labels.onboarding.labels.languages}</span>
                        <div className={styles.previewValue}>
                            {step2.languages && step2.languages.length > 0 ? (
                                <div className={styles.previewValueWrap}>
                                    {step2.languages.map((lang) => (
                                        <span key={lang.id} className={styles.specItem}>
                                            {lang.language} ({PROFICIENCY_LABELS[lang.proficiency]})
                                        </span>
                                    ))}
                                </div>
                            ) : '—'}
                        </div>
                    </div>
                    <div className={`${styles.previewItem} ${styles.previewItemFull}`}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.subjects}</span>
                        <div className={`${styles.previewValue} ${styles.previewValueColumn}`}>
                            {renderSpecializations()}
                        </div>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.experience}</span>
                        <span className={styles.previewValue}>{totalYears} {isAr ? 'سنة' : 'Years'}</span>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.video}</span>
                        <span className={styles.previewValue}>
                            {step5.videoUrl ? labels.onboarding.preview.videoAttached : labels.onboarding.preview.videoMissing}
                        </span>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.price}</span>
                        <span className={styles.previewValue}>
                            {step4.priceAmount ? `${step4.priceAmount} ${step4.priceCurrency}` : '—'}
                        </span>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.ageRange}</span>
                        <span className={styles.previewValue}>
                            {step4.studentAgeMin && step4.studentAgeMax
                                ? `${step4.studentAgeMin} - ${step4.studentAgeMax} ${isAr ? 'سنة' : 'Years'}`
                                : '—'}
                        </span>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.education}</span>
                        <span className={styles.previewValue}>{step3.education.length}</span>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>{labels.onboarding.preview.experiences}</span>
                        <span className={styles.previewValue}>{step3.experiences.length}</span>
                    </div>
                </div>
            </div>

            {/* Legal Acknowledgement */}
            <div className={styles.legalSection}>
                <h4 className={styles.legalTitle}>{labels.onboarding.step5.legal.title}</h4>
                <div className={styles.legalText}>
                    {labels.onboarding.step5.legal.text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>

                {/* Anti-Redirection Checkboxes */}
                <div className={styles.antiRedirectionSection}>
                    <label className={styles.legalCheckbox}>
                        <input
                            type="checkbox"
                            checked={step6.personalTeaching}
                            onChange={(e) => updateStep6({ personalTeaching: e.target.checked })}
                        />
                        <span>{labels.onboarding.step5.legal.personalTeaching}</span>
                    </label>

                    <label className={styles.legalCheckbox}>
                        <input
                            type="checkbox"
                            checked={step6.noRedirection}
                            onChange={(e) => updateStep6({ noRedirection: e.target.checked })}
                        />
                        <span>{labels.onboarding.step5.legal.noRedirection}</span>
                    </label>

                    <label className={styles.legalCheckbox}>
                        <input
                            type="checkbox"
                            checked={step6.violationConsequences}
                            onChange={(e) => updateStep6({ violationConsequences: e.target.checked })}
                        />
                        <span>{labels.onboarding.step5.legal.violationConsequences}</span>
                    </label>
                </div>

                <label className={styles.legalCheckbox}>
                    <input
                        type="checkbox"
                        checked={step6.legalAcknowledgement}
                        onChange={(e) => updateStep6({ legalAcknowledgement: e.target.checked })}
                    />
                    <span>{labels.onboarding.step5.legal.checkbox}</span>
                </label>
                {errors.legal && <span className={styles.error}>{errors.legal}</span>}
            </div>

            {errors.submit && <div className={styles.error}>{errors.submit}</div>}

            {/* Navigation */}
            <div className={styles.navigation}>
                <button type="button" className={styles.backBtn} onClick={handleBack} disabled={isSubmitting}>
                    {locale === 'ar' ? '→' : '←'} {labels.directory.pagination.previous}
                </button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !step6.personalTeaching || !step6.noRedirection || !step6.violationConsequences || !step6.legalAcknowledgement}
                >
                    {isSubmitting ? labels.onboarding.profile.submitting : (
                        <>
                            {labels.onboarding.profile.submit}
                            <Icons.Check size={16} style={{ marginInlineStart: '8px' }} />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
