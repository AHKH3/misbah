'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, RadioPills } from '@/components/ui';
import {
    useWizardStore,
    TITLE_LABELS,
    TITLE_LABELS_FEMALE,
    GENDER_LABELS,
    SUBJECT_LABELS,
    QURAN_TYPE_LABELS,
    ARABIC_AREA_LABELS,
    ARABIC_CURRICULUM_LABELS,
    READING_CURRICULUM_LABELS,
    ISLAMIC_SECTION_LABELS,
    type TeacherTitle,
    type Gender,
    type Subject,
    type QuranTeachingType,
    type ArabicArea,
    type ArabicCurriculum,
    type ReadingCurriculum,
    type IslamicSection,
} from '../stores/wizard-store';
import styles from '../wizard.module.css';

// Arab countries list
const COUNTRIES = [
    'مصر', 'السعودية', 'الإمارات', 'الكويت', 'قطر', 'البحرين', 'عُمان',
    'الأردن', 'فلسطين', 'لبنان', 'سوريا', 'العراق', 'اليمن', 'ليبيا',
    'تونس', 'الجزائر', 'المغرب', 'السودان', 'موريتانيا', 'الصومال',
    'جيبوتي', 'جزر القمر', 'تركيا', 'ماليزيا', 'إندونيسيا', 'باكستان',
    'بنغلاديش', 'الهند', 'المملكة المتحدة', 'الولايات المتحدة', 'كندا',
    'فرنسا', 'ألمانيا', 'أخرى',
];

export default function Step1Page() {
    const router = useRouter();
    const { step1, updateStep1, setStep } = useWizardStore();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Default specializations for backwards compatibility with old persisted state
    const specs = step1.specializations ?? {
        quranTypes: [],
        arabicAreas: [],
        arabicCurricula: [],
        readingCurricula: [],
        arabicOther: '',
        islamicSections: [],
    };

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

    // Subject toggle
    const handleSubjectToggle = (subject: Subject) => {
        const current = step1.subjects;
        const updated = current.includes(subject)
            ? current.filter((s) => s !== subject)
            : [...current, subject];

        // Clear specializations when subject is removed
        if (!updated.includes('quran')) {
            updateStep1({ specializations: { ...specs, quranTypes: [] } });
        }
        if (!updated.includes('arabic')) {
            updateStep1({
                specializations: {
                    ...specs,
                    arabicAreas: [],
                    arabicCurricula: [],
                    readingCurricula: [],
                    arabicOther: '',
                }
            });
        }
        if (!updated.includes('islamic_studies')) {
            updateStep1({ specializations: { ...specs, islamicSections: [] } });
        }

        updateStep1({ subjects: updated });
    };

    // Toggle helpers for specializations
    const toggleQuranType = (type: QuranTeachingType) => {
        const current = specs.quranTypes;
        const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
        updateStep1({ specializations: { ...specs, quranTypes: updated } });
    };

    const toggleArabicArea = (area: ArabicArea) => {
        const current = specs.arabicAreas;
        const updated = current.includes(area) ? current.filter(a => a !== area) : [...current, area];

        // Clear sub-curricula when area is removed
        if (!updated.includes('arabic_second_lang')) {
            updateStep1({ specializations: { ...specs, arabicAreas: updated, arabicCurricula: [] } });
        } else if (!updated.includes('reading')) {
            updateStep1({ specializations: { ...specs, arabicAreas: updated, readingCurricula: [] } });
        } else {
            updateStep1({ specializations: { ...specs, arabicAreas: updated } });
        }
    };

    const toggleArabicCurriculum = (cur: ArabicCurriculum) => {
        const current = specs.arabicCurricula;
        const updated = current.includes(cur) ? current.filter(c => c !== cur) : [...current, cur];
        updateStep1({ specializations: { ...specs, arabicCurricula: updated } });
    };

    const toggleReadingCurriculum = (cur: ReadingCurriculum) => {
        const current = specs.readingCurricula;
        const updated = current.includes(cur) ? current.filter(c => c !== cur) : [...current, cur];
        updateStep1({ specializations: { ...specs, readingCurricula: updated } });
    };

    const toggleIslamicSection = (section: IslamicSection) => {
        const current = specs.islamicSections;
        const updated = current.includes(section) ? current.filter(s => s !== section) : [...current, section];
        updateStep1({ specializations: { ...specs, islamicSections: updated } });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!step1.fullName.trim() || step1.fullName.length < 3) {
            newErrors.fullName = 'أدخل الاسم بالعربية (3 أحرف على الأقل)';
        }
        if (!step1.fullNameEn.trim() || step1.fullNameEn.length < 3) {
            newErrors.fullNameEn = 'أدخل الاسم بالإنجليزية (3 أحرف على الأقل)';
        }
        if (!step1.title) {
            newErrors.title = 'اختر المسمّى الوظيفي';
        }
        if (!step1.gender) {
            newErrors.gender = 'اختر النوع';
        }
        if (!step1.country) {
            newErrors.country = 'اختر الدولة';
        }
        if (!step1.birthDate) {
            newErrors.birthDate = 'أدخل تاريخ الميلاد';
        } else {
            const birth = new Date(step1.birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.birthDate = 'يجب أن يكون العمر 18 سنة على الأقل';
            }
        }
        if (step1.subjects.length === 0) {
            newErrors.subjects = 'اختر تخصصًا واحدًا على الأقل';
        }
        // Validate specializations
        if (step1.subjects.includes('quran') && specs.quranTypes.length === 0) {
            newErrors.quranTypes = 'اختر نوع تدريس واحد على الأقل';
        }
        if (step1.subjects.includes('arabic') && specs.arabicAreas.length === 0) {
            newErrors.arabicAreas = 'اختر مجال واحد على الأقل';
        }
        if (step1.subjects.includes('islamic_studies') && specs.islamicSections.length === 0) {
            newErrors.islamicSections = 'اختر قسم واحد على الأقل';
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
            <h2 className={styles.stepTitle}>البيانات الأساسية</h2>
            <p className={styles.stepDescription}>
                من أنت؟ هذه المعلومات ستظهر في بروفايلك العام.
            </p>

            {/* Row 1: الاسم (عربي + إنجليزي) */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="fullName" className={styles.label}>
                        الاسم بالعربية *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        className={styles.input}
                        value={step1.fullName}
                        onChange={(e) => updateStep1({ fullName: e.target.value })}
                        placeholder="مثال: أحمد محمد"
                        dir="rtl"
                    />
                    {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="fullNameEn" className={styles.label}>
                        الاسم بالإنجليزية *
                    </label>
                    <input
                        type="text"
                        id="fullNameEn"
                        className={styles.input}
                        value={step1.fullNameEn}
                        onChange={(e) => updateStep1({ fullNameEn: e.target.value })}
                        placeholder="e.g. Ahmed Mohamed"
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
                        label="النوع"
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
                        label="المسمّى الوظيفي"
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
                        الدولة *
                    </label>
                    <select
                        id="country"
                        className={styles.select}
                        value={step1.country}
                        onChange={(e) => updateStep1({ country: e.target.value })}
                    >
                        <option value="">اختر الدولة</option>
                        {COUNTRIES.map((country) => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    {errors.country && <span className={styles.error}>{errors.country}</span>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="birthDate" className={styles.label}>
                        تاريخ الميلاد *
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

            {/* التخصصات */}
            <div className={styles.formGroup}>
                <span className={styles.label}>التخصصات *</span>
                <div className={styles.subjectGrid}>
                    {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
                        <label
                            key={value}
                            className={`${styles.subjectCard} ${step1.subjects.includes(value as Subject) ? styles.selected : ''
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={step1.subjects.includes(value as Subject)}
                                onChange={() => handleSubjectToggle(value as Subject)}
                                className={styles.hiddenCheckbox}
                            />
                            <span className={styles.subjectLabel}>{label}</span>
                        </label>
                    ))}
                </div>
                {errors.subjects && <span className={styles.error}>{errors.subjects}</span>}
            </div>

            {/* Dynamic: Quran Options */}
            {step1.subjects.includes('quran') && (
                <div className={styles.specializationSection}>
                    <span className={styles.label}>أنواع التدريس — القرآن الكريم *</span>
                    <div className={styles.checkboxGrid}>
                        {Object.entries(QURAN_TYPE_LABELS).map(([value, label]) => (
                            <label key={value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={specs.quranTypes.includes(value as QuranTeachingType)}
                                    onChange={() => toggleQuranType(value as QuranTeachingType)}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                    {errors.quranTypes && <span className={styles.error}>{errors.quranTypes}</span>}
                </div>
            )}

            {/* Dynamic: Arabic Options */}
            {step1.subjects.includes('arabic') && (
                <div className={styles.specializationSection}>
                    <span className={styles.label}>مجالات اللغة العربية *</span>
                    <div className={styles.checkboxGrid}>
                        {Object.entries(ARABIC_AREA_LABELS).map(([value, label]) => (
                            <label key={value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={specs.arabicAreas.includes(value as ArabicArea)}
                                    onChange={() => toggleArabicArea(value as ArabicArea)}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                    {errors.arabicAreas && <span className={styles.error}>{errors.arabicAreas}</span>}

                    {/* Arabic as Second Language Curricula */}
                    {specs.arabicAreas.includes('arabic_second_lang') && (
                        <div className={styles.subSpecialization}>
                            <span className={styles.smallLabel}>مناهج العربية كلغة ثانية</span>
                            <div className={styles.checkboxGrid}>
                                {Object.entries(ARABIC_CURRICULUM_LABELS).map(([value, label]) => (
                                    <label key={value} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={specs.arabicCurricula.includes(value as ArabicCurriculum)}
                                            onChange={() => toggleArabicCurriculum(value as ArabicCurriculum)}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reading Curricula */}
                    {specs.arabicAreas.includes('reading') && (
                        <div className={styles.subSpecialization}>
                            <span className={styles.smallLabel}>مناهج القرائية</span>
                            <div className={styles.checkboxGrid}>
                                {Object.entries(READING_CURRICULUM_LABELS).map(([value, label]) => (
                                    <label key={value} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={specs.readingCurricula.includes(value as ReadingCurriculum)}
                                            onChange={() => toggleReadingCurriculum(value as ReadingCurriculum)}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Arabic - text input */}
                    {specs.arabicAreas.includes('other') && (
                        <div className={styles.subSpecialization}>
                            <label className={styles.smallLabel}>وصف المجال الآخر</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={specs.arabicOther}
                                onChange={(e) => updateStep1({
                                    specializations: { ...specs, arabicOther: e.target.value }
                                })}
                                placeholder="مثال: البلاغة"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Dynamic: Islamic Studies Options */}
            {step1.subjects.includes('islamic_studies') && (
                <div className={styles.specializationSection}>
                    <span className={styles.label}>أقسام الدراسات الإسلامية *</span>
                    <div className={styles.checkboxGrid}>
                        {Object.entries(ISLAMIC_SECTION_LABELS).map(([value, label]) => (
                            <label key={value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={specs.islamicSections.includes(value as IslamicSection)}
                                    onChange={() => toggleIslamicSection(value as IslamicSection)}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                    {errors.islamicSections && <span className={styles.error}>{errors.islamicSections}</span>}
                </div>
            )}

            {/* Navigation */}
            <div className={styles.navButtons}>
                <Button onClick={handleNext}>
                    التالي ←
                </Button>
            </div>
        </div>
    );
}
