'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { useWizardStore } from '../stores/wizard-store';
import styles from '../wizard.module.css';

export default function Step3Page() {
    const { labels } = useI18n();
    const router = useRouter();
    const { step3, updateStep3, setStep } = useWizardStore();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const audiences = [
        { value: 'Kids', label: labels.teacher?.audiences?.kids || 'أطفال' },
        { value: 'Adults', label: labels.teacher?.audiences?.adults || 'بالغين' },
        { value: 'Females Only', label: labels.teacher?.audiences?.femalesOnly || 'إناث' },
        { value: 'Males Only', label: labels.teacher?.audiences?.malesOnly || 'ذكور' },
        { value: 'Everyone', label: labels.teacher?.audiences?.everyone || 'الجميع' },
    ];

    const handleAudienceChange = (value: string, checked: boolean) => {
        const newAudience = checked
            ? [...step3.audience, value]
            : step3.audience.filter(a => a !== value);
        updateStep3({ audience: newAudience });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (step3.audience.length === 0) {
            newErrors.audience = 'اختر فئة واحدة على الأقل';
        }

        if (step3.priceAmount && step3.priceAmount < 0) {
            newErrors.price = 'السعر يجب أن يكون رقم موجب';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        setStep(2);
        router.push('/onboarding/step-2');
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep(4);
            router.push('/onboarding/step-4');
        }
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>الفئة المستهدفة والسعر</h2>
            <p className={styles.stepDescription}>من تُدرّس؟ وما سعر الحصة؟</p>

            {/* Target Audience */}
            <div className={styles.formGroup}>
                <label className={styles.label}>الفئة المستهدفة *</label>
                <div className={styles.checkboxGroup}>
                    {audiences.map((aud) => (
                        <label key={aud.value} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={step3.audience.includes(aud.value)}
                                onChange={(e) => handleAudienceChange(aud.value, e.target.checked)}
                            />
                            <span>{aud.label}</span>
                        </label>
                    ))}
                </div>
                {errors.audience && <span className={styles.error}>{errors.audience}</span>}
            </div>

            {/* Student Age Range */}
            <div className={styles.cardGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="ageMin" className={styles.label}>سن الطالب (من)</label>
                    <input
                        type="number"
                        id="ageMin"
                        className={styles.input}
                        value={step3.studentAgeMin || ''}
                        onChange={(e) => updateStep3({ studentAgeMin: parseInt(e.target.value) || null })}
                        min={3}
                        max={100}
                        placeholder="مثال: 6"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="ageMax" className={styles.label}>سن الطالب (إلى)</label>
                    <input
                        type="number"
                        id="ageMax"
                        className={styles.input}
                        value={step3.studentAgeMax || ''}
                        onChange={(e) => updateStep3({ studentAgeMax: parseInt(e.target.value) || null })}
                        min={3}
                        max={100}
                        placeholder="مثال: 60"
                    />
                </div>
            </div>

            {/* Student Gender */}
            <div className={styles.formGroup}>
                <label htmlFor="studentGender" className={styles.label}>نوع الطلاب</label>
                <select
                    id="studentGender"
                    className={styles.select}
                    value={step3.studentGender}
                    onChange={(e) => updateStep3({ studentGender: e.target.value as 'males' | 'females' | 'both' })}
                >
                    <option value="both">ذكور وإناث</option>
                    <option value="males">ذكور فقط</option>
                    <option value="females">إناث فقط</option>
                </select>
            </div>

            {/* Pricing */}
            <div className={styles.formGroup}>
                <label className={styles.label}>سعر الحصة (مرجعي)</label>
                <p className={styles.stepDescription} style={{ fontSize: '0.8rem', marginTop: '-4px' }}>
                    هذا السعر للاسترشاد فقط. مصباح لا يتدخل في الدفع.
                </p>

                <div className={styles.cardGrid}>
                    <div className={styles.formGroup}>
                        <input
                            type="number"
                            className={styles.input}
                            value={step3.priceAmount || ''}
                            onChange={(e) => updateStep3({ priceAmount: parseFloat(e.target.value) || null })}
                            min={0}
                            placeholder="السعر"
                        />
                        {errors.price && <span className={styles.error}>{errors.price}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            className={styles.select}
                            value={step3.priceCurrency}
                            onChange={(e) => updateStep3({ priceCurrency: e.target.value as 'EGP' | 'USD' })}
                        >
                            <option value="EGP">جنيه مصري (EGP)</option>
                            <option value="USD">دولار أمريكي (USD)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>
                    → السابق
                </button>
                <Button variant="primary" onClick={handleNext}>
                    التالي ←
                </Button>
            </div>
        </div>
    );
}
