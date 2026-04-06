'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Button, RadioPills } from '@/components/ui';
import {
    useWizardStore,
    TITLE_LABELS,
    TITLE_LABELS_FEMALE,
    GENDER_LABELS,
    type TeacherTitle,
    type Gender,
} from '../stores/wizard-store';
import styles from '../wizard.module.css';

// Comprehensive countries list
const COUNTRIES = [
    'مصر', 'السعودية', 'الإمارات', 'الكويت', 'قطر', 'البحرين', 'عُمان',
    'الأردن', 'فلسطين', 'لبنان', 'سوريا', 'العراق', 'اليمن', 'ليبيا',
    'تونس', 'الجزائر', 'المغرب', 'السودان', 'موريتانيا', 'الصومال',
    'جيبوتي', 'جزر القمر', 'تركيا', 'ماليزيا', 'إندونيسيا', 'باكستان',
    'بنغلاديش', 'الهند', 'المملكة المتحدة', 'الولايات المتحدة', 'كندا',
    'فرنسا', 'ألمانيا', 'إيطاليا', 'إسبانيا', 'هولندا', 'بلجيكا', 'السويد',
    'النرويج', 'الدنمارك', 'سنغافورة', 'تايلاند', 'اليابان', 'كوريا الجنوبية',
    'الفلبين', 'أستراليا', 'نيوزيلندا', 'جنوب أفريقيا', 'أخرى',
];

export default function Step1Page() {
    const { labels, locale } = useI18n();
    const router = useRouter();
    const { step1, updateStep1, setStep } = useWizardStore();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Gender-based title labels
    const currentTitleLabels = step1.gender === 'female' ? TITLE_LABELS_FEMALE : TITLE_LABELS;

    const titleOptions = Object.entries(currentTitleLabels).map(([value, label]) => ({
        value: value as TeacherTitle,
        label,
    }));

    const genderOptions = Object.entries(GENDER_LABELS).map(([value, label]) => ({
        value: value as Gender,
        label,
    }));

    const handleGenderChange = (value: Gender) => {
        updateStep1({ gender: value });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!step1.fullName.trim() || step1.fullName.length < 3) {
            newErrors.fullName = labels.onboarding.errors.fullName;
        }
        if (!step1.fullNameEn.trim() || step1.fullNameEn.length < 3) {
            newErrors.fullNameEn = labels.onboarding.errors.fullNameEn;
        }
        if (!step1.title) {
            newErrors.title = labels.onboarding.errors.title;
        }
        if (!step1.gender) {
            newErrors.gender = labels.onboarding.errors.gender;
        }
        if (!step1.country) {
            newErrors.country = labels.onboarding.errors.country;
        }
        if (!step1.birthDate) {
            newErrors.birthDate = labels.onboarding.errors.birthDate;
        } else {
            const birth = new Date(step1.birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.birthDate = labels.onboarding.errors.birthDateAge;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep(2);
            router.push('/onboarding/step-2');
        }
    };

    const maxBirthDate = new Date();
    maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);
    const maxBirthDateStr = maxBirthDate.toISOString().split('T')[0];

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>{labels.onboarding.profile.title}</h2>
            <p className={styles.stepDescription}>
                {labels.onboarding.profile.subtitle}
            </p>

            {/* Row 1: الاسم (عربي + إنجليزي) */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="fullName" className={styles.label}>
                        {labels.onboarding.labels.fullName}
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        className={styles.input}
                        value={step1.fullName}
                        onChange={(e) => updateStep1({ fullName: e.target.value })}
                        placeholder={labels.onboarding.placeholders.fullName}
                        dir="rtl"
                    />
                    {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="fullNameEn" className={styles.label}>
                        {labels.onboarding.labels.fullNameEn}
                    </label>
                    <input
                        type="text"
                        id="fullNameEn"
                        className={styles.input}
                        value={step1.fullNameEn}
                        onChange={(e) => updateStep1({ fullNameEn: e.target.value })}
                        placeholder={labels.onboarding.placeholders.fullNameEn}
                        dir="ltr"
                    />
                    {errors.fullNameEn && <span className={styles.error}>{errors.fullNameEn}</span>}
                </div>
            </div>

            {/* Row 2: النوع + المسمّى */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <RadioPills
                        name="gender"
                        label={labels.onboarding.labels.gender}
                        required
                        options={genderOptions}
                        value={step1.gender}
                        onChange={handleGenderChange}
                        error={errors.gender}
                    />
                </div>
                <div className={styles.formGroup}>
                    <RadioPills
                        name="title"
                        label={labels.onboarding.labels.title}
                        required
                        options={titleOptions}
                        value={step1.title}
                        onChange={(value) => updateStep1({ title: value })}
                        error={errors.title}
                    />
                </div>
            </div>

            {/* Row 3: الدولة + تاريخ الميلاد */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="country" className={styles.label}>
                        {labels.onboarding.labels.country}
                    </label>
                    <select
                        id="country"
                        className={styles.select}
                        value={step1.country}
                        onChange={(e) => updateStep1({ country: e.target.value })}
                    >
                        <option value="">{labels.onboarding.placeholders.country}</option>
                        {COUNTRIES.map((country) => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    {errors.country && <span className={styles.error}>{errors.country}</span>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="birthDate" className={styles.label}>
                        {labels.onboarding.labels.birthDate}
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        className={styles.input}
                        value={step1.birthDate}
                        onChange={(e) => updateStep1({ birthDate: e.target.value })}
                        max={maxBirthDateStr}
                    />
                    {errors.birthDate && <span className={styles.error}>{errors.birthDate}</span>}
                </div>
            </div>

            {/* Navigation */}
            <div className={styles.navButtons}>
                <Button onClick={handleNext}>
                    {labels.nav.next || 'التالي'} {locale === 'ar' ? '←' : '→'}
                </Button>
            </div>
        </div>
    );
}
