'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { useWizardStore } from '../stores/wizard-store';
import styles from '../wizard.module.css';

export default function Step4Page() {
    const { labels, locale } = useI18n();
    const router = useRouter();
    const { step4, updateStep4, setStep } = useWizardStore();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateAndProceed = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Age range validation
        if (step4.studentAgeMin !== null && step4.studentAgeMax !== null) {
            if (step4.studentAgeMin > step4.studentAgeMax) {
                newErrors.ageRange = labels.onboarding.errors.ageRange;
            }
        }

        if (step4.priceAmount !== null && step4.priceAmount < 0) {
            newErrors.price = labels.onboarding.errors.price;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        setStep(3);
        router.push('/onboarding/step-3');
    };

    const handleNext = () => {
        if (validateAndProceed()) {
            setStep(5);
            router.push('/onboarding/step-5');
        }
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>الجمهور والسعر والبايو</h2>
            <p className={styles.stepDescription}>
                حدد الفئة المستهدفة من الطلاب والسعر ونبذة تعريفية عنك
            </p>

            {/* Student Age Range */}
            <div className={styles.cardGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="ageMin" className={styles.label}>{labels.onboarding.labels.ageMin}</label>
                    <input
                        type="number"
                        id="ageMin"
                        className={styles.input}
                        value={step4.studentAgeMin || ''}
                        onChange={(e) => updateStep4({ studentAgeMin: parseInt(e.target.value) || null })}
                        min={3}
                        max={100}
                        placeholder={labels.onboarding.placeholders.ageMin}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="ageMax" className={styles.label}>{labels.onboarding.labels.ageMax}</label>
                    <input
                        type="number"
                        id="ageMax"
                        className={styles.input}
                        value={step4.studentAgeMax || ''}
                        onChange={(e) => updateStep4({ studentAgeMax: parseInt(e.target.value) || null })}
                        min={3}
                        max={100}
                        placeholder={labels.onboarding.placeholders.ageMax}
                    />
                </div>
            </div>
            {errors.ageRange && <span className={`${styles.error} ${styles.errorBlock}`}>{errors.ageRange}</span>}

            {/* Student Gender */}
            <div className={styles.formGroup}>
                <label htmlFor="studentGender" className={styles.label}>{labels.onboarding.labels.studentGender}</label>
                <select
                    id="studentGender"
                    className={styles.select}
                    value={step4.studentGender}
                    onChange={(e) => updateStep4({ studentGender: e.target.value as 'males' | 'females' | 'both' })}
                >
                    <option value="both">{labels.onboarding.options.genderBoth}</option>
                    <option value="males">{labels.onboarding.options.genderMales}</option>
                    <option value="females">{labels.onboarding.options.genderFemales}</option>
                </select>
            </div>

            {/* Pricing Section */}
            <div className={styles.formGroup}>
                <label className={styles.label}>{labels.onboarding.labels.price}</label>
                <p className={styles.stepDescription}>
                    {labels.onboarding.hints.price}
                </p>

                <div className={styles.cardGrid}>
                    <div className={styles.formGroup}>
                        <input
                            type="number"
                            className={styles.input}
                            value={step4.priceAmount || ''}
                            onChange={(e) => updateStep4({ priceAmount: parseFloat(e.target.value) || null })}
                            min={0}
                            placeholder={labels.onboarding.placeholders.price}
                        />
                        {errors.price && <span className={styles.error}>{errors.price}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            className={styles.select}
                            value={step4.priceCurrency}
                            onChange={(e) => updateStep4({ priceCurrency: e.target.value as 'EGP' | 'USD' })}
                        >
                            <option value="EGP">{labels.onboarding.options.currencyEGP}</option>
                            <option value="USD">{labels.onboarding.options.currencyUSD}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bio Section - NEW */}
            <div className={styles.formGroup}>
                <label htmlFor="bioTextAr" className={styles.label}>نبذة تعريفية (عربي)</label>
                <p className={styles.hint}>
                    اكتب نبذة مختصرة عن نفسك ومنهجك التعليمي (اختياري)
                </p>
                <textarea
                    id="bioTextAr"
                    className={styles.textarea}
                    value={step4.bioTextAr}
                    onChange={(e) => updateStep4({ bioTextAr: e.target.value })}
                    placeholder="مثال: معلم قرآن كريم ولغة عربية بخبرة 10 سنوات، أركز على التحفيظ بالتجويد والتلاوة الصحيحة..."
                    rows={4}
                    dir="rtl"
                />
            </div>
            
            <div className={styles.formGroup}>
                <label htmlFor="bioTextEn" className={styles.label}>Bio (English)</label>
                <p className={styles.hint}>
                    Write a brief introduction about yourself and your teaching approach (optional)
                </p>
                <textarea
                    id="bioTextEn"
                    className={styles.textarea}
                    value={step4.bioTextEn}
                    onChange={(e) => updateStep4({ bioTextEn: e.target.value })}
                    placeholder="Example: Quran and Arabic teacher with 10 years of experience, focusing on memorization with tajweed and proper recitation..."
                    rows={4}
                    dir="ltr"
                />
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>
                    {locale === 'ar' ? '→' : '←'} {labels.directory.pagination.previous}
                </button>
                <Button variant="primary" onClick={handleNext}>
                    {labels.nav.next || 'التالي'} {locale === 'ar' ? '←' : '→'}
                </Button>
            </div>
        </div>
    );
}
