'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useWizardStore } from '../stores/wizard-store';
import { submitProfileAction } from '../actions';
import {
    SUBJECT_LABELS,
    QURAN_TYPE_LABELS,
    ARABIC_AREA_LABELS,
    ARABIC_CURRICULUM_LABELS,
    READING_CURRICULUM_LABELS,
    ISLAMIC_SECTION_LABELS
} from '../stores/wizard-store';
import styles from '../wizard.module.css';

export default function Step5Page() {
    const router = useRouter();
    const store = useWizardStore();
    const { step1, step2, step3, step4, step5, updateStep4, updateStep5, setStep, getTotalExperienceYears, reset } = store;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const totalYears = getTotalExperienceYears();

    // Reconstruct detailed specializations for display
    const renderSpecializations = () => {
        const specs = [];

        // Quran
        if (step1.subjects.includes('quran')) {
            const types = step1.specializations.quranTypes.map(t => QURAN_TYPE_LABELS[t]).join('، ');
            specs.push(`القرآن الكريم (${types || 'عام'})`);
        }

        // Arabic
        if (step1.subjects.includes('arabic')) {
            const areas = step1.specializations.arabicAreas.map(a => ARABIC_AREA_LABELS[a]);
            const details = [];

            // Add curricula details if selected
            if (step1.specializations.arabicCurricula.length > 0) {
                const curs = step1.specializations.arabicCurricula.map(c => ARABIC_CURRICULUM_LABELS[c]).join('، ');
                details.push(`مناهج: ${curs}`);
            }
            if (step1.specializations.readingCurricula.length > 0) {
                const curs = step1.specializations.readingCurricula.map(c => READING_CURRICULUM_LABELS[c]).join('، ');
                details.push(`قرائية: ${curs}`);
            }
            if (step1.specializations.arabicOther) {
                details.push(step1.specializations.arabicOther);
            }

            const areaStr = areas.join('، ');
            const detailStr = details.length > 0 ? ` - ${details.join(' | ')}` : '';
            specs.push(`اللغة العربية (${areaStr}${detailStr})`);
        }

        // Islamic Studies
        if (step1.subjects.includes('islamic_studies')) {
            const sections = step1.specializations.islamicSections.map(s => ISLAMIC_SECTION_LABELS[s]).join('، ');
            specs.push(`الدراسات الإسلامية (${sections || 'عام'})`);
        }

        return specs.map((s, i) => <div key={i} className={styles.specItem}>• {s}</div>);
    };

    const formats = [
        { value: 'online', label: 'أونلاين' },
        { value: 'in_person', label: 'حضوري' },
        { value: 'hybrid', label: 'أونلاين وحضوري' },
    ];

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // At least one contact method required
        if (!step4.whatsapp.trim() && !step4.email.trim() && !step4.telegram.trim()) {
            newErrors.contact = 'وسيلة تواصل واحدة على الأقل مطلوبة';
        }

        // Email validation if provided
        if (step4.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step4.email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح';
        }

        // Teaching format required
        if (!step4.teachingFormat) {
            newErrors.format = 'صيغة التدريس مطلوبة';
        }

        // Legal acknowledgement required
        if (!step5.legalAcknowledgement) {
            newErrors.legal = 'يجب الموافقة على الإقرار القانوني';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        setStep(4);
        router.push('/onboarding/step-4');
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Compile all data
            // Format education entries
            const formattedEducation = step2.education.map(edu => ({
                id: edu.id,
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.specialization,
                startDate: `${edu.startYear}-01-01`,
                endDate: edu.endYear ? `${edu.endYear}-01-01` : null,
                description: edu.notes || '',
            }));

            // Format experience entries
            const formattedExperience = step2.experiences.map(exp => ({
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
                // Step 1
                full_name: step1.fullName,
                full_name_en: step1.fullNameEn,
                title: step1.title as string,
                gender: step1.gender as 'male' | 'female',
                country: step1.country,
                birth_date: step1.birthDate,
                subjects: step1.subjects,
                specializations: step1.specializations,

                // Step 2
                education: formattedEducation,
                experiences: formattedExperience,
                madhab: step2.madhab,

                // Step 3
                audience: step3.audience,
                student_age_min: step3.studentAgeMin,
                student_age_max: step3.studentAgeMax,
                student_gender: step3.studentGender || '',
                price_amount: step3.priceAmount,
                price_currency: step3.priceCurrency || 'EGP',

                // Step 4 + 5
                contact_method: {
                    whatsapp: step4.whatsapp || undefined,
                    email: step4.email || undefined,
                    telegram: step4.telegram || undefined,
                },
                video_url: step4.videoUrl,
                teaching_format: step4.teachingFormat as 'online' | 'in_person' | 'hybrid',

                // Legal
                legal_acknowledgement: step5.legalAcknowledgement,
            };

            const result = await submitProfileAction(profileData);

            if (result.error) {
                setErrors({ submit: result.error });
            } else {
                // Clear wizard state and redirect to success
                reset();
                router.push('/onboarding/success');
            }
        } catch {
            setErrors({ submit: 'حدث خطأ غير متوقع. حاول مرة أخرى.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>التواصل والإرسال</h2>
            <p className={styles.stepDescription}>
                كيف يتواصل معك الطلاب؟ وتأكد من مراجعة بياناتك قبل الإرسال.
            </p>

            {/* Contact Methods */}
            <div className={styles.formGroup}>
                <label className={styles.label}>وسائل التواصل *</label>
                <p className={styles.hint}>
                    أدخل وسيلة واحدة على الأقل. التواصل سيتم مباشرة بينك وبين الطالب — مصباح لا يتدخل.
                </p>

                <div className={styles.cardGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="whatsapp" className={styles.smallLabel}>واتساب</label>
                        <input
                            type="tel"
                            id="whatsapp"
                            className={styles.input}
                            value={step4.whatsapp}
                            onChange={(e) => updateStep4({ whatsapp: e.target.value })}
                            placeholder="+201234567890"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="telegram" className={styles.smallLabel}>تليجرام</label>
                        <input
                            type="text"
                            id="telegram"
                            className={styles.input}
                            value={step4.telegram}
                            onChange={(e) => updateStep4({ telegram: e.target.value })}
                            placeholder="@username"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.smallLabel}>بريد إلكتروني (للتواصل معك)</label>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={step4.email}
                        onChange={(e) => updateStep4({ email: e.target.value })}
                        placeholder="example@email.com"
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                    <p className={styles.hint} style={{ fontSize: '0.7rem' }}>
                        💡 هذا الإيميل للتواصل فقط — لن يُنشأ حساب إلا بعد قبول ملفك.
                    </p>
                </div>

                {errors.contact && <span className={styles.error}>{errors.contact}</span>}
            </div>

            {/* Teaching Format */}
            <div className={styles.formGroup}>
                <label htmlFor="format" className={styles.label}>صيغة التدريس *</label>
                <select
                    id="format"
                    className={styles.select}
                    value={step4.teachingFormat}
                    onChange={(e) => updateStep4({ teachingFormat: e.target.value as 'online' | 'in_person' | 'hybrid' | '' })}
                >
                    <option value="">اختر...</option>
                    {formats.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>
                {errors.format && <span className={styles.error}>{errors.format}</span>}
            </div>

            {/* Preview Section */}
            <div className={styles.previewSection}>
                <h3 className={styles.previewTitle}>ملخص بياناتك</h3>
                <div className={styles.previewGrid}>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>الاسم</span>
                        <div className={styles.previewValue}>
                            <div>{step1.fullName || '—'}</div>
                            <div style={{ fontSize: '0.8em', color: '#666' }}>{step1.fullNameEn || '—'}</div>
                        </div>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>البلد</span>
                        <span className={styles.previewValue}>{step1.country || '—'}</span>
                    </div>
                    <div className={styles.previewItem} style={{ gridColumn: 'span 2' }}>
                        <span className={styles.previewLabel}>التخصصات</span>
                        <div className={styles.previewValue} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {renderSpecializations()}
                        </div>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>سنوات الخبرة</span>
                        <span className={styles.previewValue}>{totalYears} سنة</span>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>الفئة المستهدفة</span>
                        <span className={styles.previewValue}>{step3.audience.join('، ') || '—'}</span>
                    </div>
                    <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>الفيديو</span>
                        <span className={styles.previewValue}>{step4.videoUrl ? '✓ مرفق' : '✗ ناقص'}</span>
                    </div>
                </div>
            </div>

            {/* Legal Acknowledgement */}
            <div className={styles.legalSection}>
                <h4 className={styles.legalTitle}>الإقرار القانوني</h4>
                <p className={styles.legalText}>
                    بإرسال هذا الطلب، أقر بأن:
                    <br />• جميع المعلومات المقدمة صحيحة ودقيقة
                    <br />• لا أنتحل شخصية أي شخص آخر
                    <br />• أتحمل المسؤولية الكاملة عن أي تواصل مع الطلاب
                    <br />• مصباح دليل عام ولا يتحمل مسؤولية العلاقة بيني وبين الطلاب
                </p>
                <label className={styles.legalCheckbox}>
                    <input
                        type="checkbox"
                        checked={step5.legalAcknowledgement}
                        onChange={(e) => updateStep5({ legalAcknowledgement: e.target.checked })}
                    />
                    <span>أوافق على الإقرار القانوني أعلاه</span>
                </label>
                {errors.legal && <span className={styles.error}>{errors.legal}</span>}
            </div>

            {errors.submit && <div className={styles.error} style={{ textAlign: 'center' }}>{errors.submit}</div>}

            {/* Navigation */}
            <div className={styles.navigation}>
                <button type="button" className={styles.backBtn} onClick={handleBack} disabled={isSubmitting}>
                    → السابق
                </button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !step5.legalAcknowledgement}
                >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب ✓'}
                </Button>
            </div>
        </div>
    );
}
