'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import {
    useWizardStore,
    SUBJECT_LABELS,
    QURAN_TYPE_LABELS,
    ARABIC_AREA_LABELS,
    ARABIC_CURRICULUM_LABELS,
    READING_CURRICULUM_LABELS,
    ISLAMIC_SECTION_LABELS,
    PROFICIENCY_LABELS,
    LANGUAGES,
    type Subject,
    type QuranTeachingType,
    type ArabicArea,
    type ArabicCurriculum,
    type ReadingCurriculum,
    type IslamicSection,
    type LanguageProficiency,
    type LanguageEntry,
} from '../stores/wizard-store';
import styles from '../wizard.module.css';

export default function Step2Page() {
    const { labels, locale } = useI18n();
    const router = useRouter();
    const { step2, updateStep2, setStep, addLanguage, updateLanguage, removeLanguage } = useWizardStore();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Language form state
    const [languageFormMode, setLanguageFormMode] = useState<'view' | 'add' | 'edit'>('view');
    const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null);
    const [languageFormData, setLanguageFormData] = useState({ language: '', proficiency: '' as LanguageProficiency | '' });

    // Default specializations for backwards compatibility with old persisted state
    const specs = step2.specializations ?? {
        quranTypes: [],
        arabicAreas: [],
        arabicCurricula: [],
        readingCurricula: [],
        arabicOther: '',
        islamicSections: [],
    };

    // Default subjects for backwards compatibility with old persisted state
    const currentSubjects = step2.subjects ?? [];

    // Subject toggle
    const handleSubjectToggle = (subject: Subject) => {
        const current = currentSubjects;
        const updated = current.includes(subject)
            ? current.filter((s) => s !== subject)
            : [...current, subject];

        // Clear specializations when subject is removed
        if (!updated.includes('quran')) {
            updateStep2({ specializations: { ...specs, quranTypes: [] } });
        }
        if (!updated.includes('arabic')) {
            updateStep2({
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
            updateStep2({ specializations: { ...specs, islamicSections: [] } });
        }

        updateStep2({ subjects: updated });
    };

    // Toggle helpers for specializations
    const toggleQuranType = (type: QuranTeachingType) => {
        const current = specs.quranTypes;
        const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
        updateStep2({ specializations: { ...specs, quranTypes: updated } });
    };

    const toggleArabicArea = (area: ArabicArea) => {
        const current = specs.arabicAreas;
        const updated = current.includes(area) ? current.filter(a => a !== area) : [...current, area];

        // Clear sub-curricula when area is removed
        if (!updated.includes('arabic_second_lang')) {
            updateStep2({ specializations: { ...specs, arabicAreas: updated, arabicCurricula: [] } });
        } else if (!updated.includes('reading')) {
            updateStep2({ specializations: { ...specs, arabicAreas: updated, readingCurricula: [] } });
        } else {
            updateStep2({ specializations: { ...specs, arabicAreas: updated } });
        }
    };

    const toggleArabicCurriculum = (cur: ArabicCurriculum) => {
        const current = specs.arabicCurricula;
        const updated = current.includes(cur) ? current.filter(c => c !== cur) : [...current, cur];
        updateStep2({ specializations: { ...specs, arabicCurricula: updated } });
    };

    const toggleReadingCurriculum = (cur: ReadingCurriculum) => {
        const current = specs.readingCurricula;
        const updated = current.includes(cur) ? current.filter(c => c !== cur) : [...current, cur];
        updateStep2({ specializations: { ...specs, readingCurricula: updated } });
    };

    const toggleIslamicSection = (section: IslamicSection) => {
        const current = specs.islamicSections;
        const updated = current.includes(section) ? current.filter(s => s !== section) : [...current, section];
        updateStep2({ specializations: { ...specs, islamicSections: updated } });
    };

    // Language handlers
    const handleAddLanguageClick = () => {
        setLanguageFormMode('add');
        setLanguageFormData({ language: '', proficiency: '' });
    };

    const handleEditLanguageClick = (lang: LanguageEntry) => {
        setLanguageFormMode('edit');
        setEditingLanguageId(lang.id);
        setLanguageFormData({ language: lang.language, proficiency: lang.proficiency });
    };

    const handleSaveLanguage = () => {
        if (!languageFormData.language || !languageFormData.proficiency) return;

        if (languageFormMode === 'add') {
            addLanguage({
                id: crypto.randomUUID(),
                language: languageFormData.language,
                proficiency: languageFormData.proficiency as LanguageProficiency,
            });
        } else if (languageFormMode === 'edit' && editingLanguageId) {
            updateLanguage(editingLanguageId, {
                language: languageFormData.language,
                proficiency: languageFormData.proficiency as LanguageProficiency,
            });
        }

        setLanguageFormMode('view');
        setLanguageFormData({ language: '', proficiency: '' });
        setEditingLanguageId(null);
    };

    const handleCancelLanguage = () => {
        setLanguageFormMode('view');
        setLanguageFormData({ language: '', proficiency: '' });
        setEditingLanguageId(null);
    };

    const handleDeleteLanguage = (id: string) => {
        removeLanguage(id);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (currentSubjects.length === 0) {
            newErrors.subjects = labels.onboarding.errors.subjects;
        }
        // Validate specializations
        if (currentSubjects.includes('quran') && specs.quranTypes.length === 0) {
            newErrors.quranTypes = labels.onboarding.errors.quranTypes;
        }
        if (currentSubjects.includes('arabic') && specs.arabicAreas.length === 0) {
            newErrors.arabicAreas = labels.onboarding.errors.arabicAreas;
        }
        if (currentSubjects.includes('islamic_studies') && specs.islamicSections.length === 0) {
            newErrors.islamicSections = labels.onboarding.errors.islamicSections;
        }
        // Validate languages (at least one required)
        if (!step2.languages || step2.languages.length === 0) {
            newErrors.languages = 'أضف لغة واحدة على الأقل';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep(3);
            router.push('/onboarding/step-3');
        }
    };

    const handleBack = () => {
        setStep(1);
        router.push('/onboarding/step-1');
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>{labels.onboarding.labels.subjects}</h2>
            <p className={styles.stepDescription}>
                حدد المواد التي تُدرّسها واللغات التي تتحدث بها
            </p>

            {/* التخصصات */}
            <div className={styles.formGroup}>
                <span className={styles.label}>{labels.onboarding.labels.subjects}</span>
                <div className={styles.subjectGrid}>
                    {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
                        <label
                            key={value}
                            className={`${styles.subjectCard} ${currentSubjects.includes(value as Subject) ? styles.selected : ''
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={currentSubjects.includes(value as Subject)}
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
            {currentSubjects.includes('quran') && (
                <div className={styles.specializationSection}>
                    <span className={styles.label}>{labels.onboarding.labels.quranTypes}</span>
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
            {currentSubjects.includes('arabic') && (
                <div className={styles.specializationSection}>
                    <span className={styles.label}>{labels.onboarding.labels.arabicAreas}</span>
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
                            <span className={styles.smallLabel}>{labels.onboarding.labels.arabicCurricula}</span>
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
                            <span className={styles.smallLabel}>{labels.onboarding.labels.readingCurricula}</span>
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
                            <label className={styles.smallLabel}>{labels.onboarding.labels.arabicOther}</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={specs.arabicOther}
                                onChange={(e) => updateStep2({
                                    specializations: { ...specs, arabicOther: e.target.value }
                                })}
                                placeholder="حدد المجال"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Dynamic: Islamic Studies Options */}
            {currentSubjects.includes('islamic_studies') && (
                <div className={styles.specializationSection}>
                    <span className={styles.label}>{labels.onboarding.labels.islamicSections}</span>
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

            {/* Languages Section */}
            <div className={styles.formGroup}>
                <label className={styles.label}>{labels.onboarding.labels.languages}</label>

                {/* View Mode: Show list of languages */}
                {languageFormMode === 'view' && (
                    <>
                        {step2.languages && step2.languages.length > 0 && (
                            <div className={styles.languageList}>
                                {step2.languages.map((lang) => (
                                    <div key={lang.id} className={styles.languageItem}>
                                        <div className={styles.languageInfo}>
                                            <span className={styles.languageName}>{lang.language}</span>
                                            <span className={styles.languageProficiency}>
                                                {PROFICIENCY_LABELS[lang.proficiency]}
                                            </span>
                                        </div>
                                        <div className={styles.languageActions}>
                                            <button
                                                type="button"
                                                onClick={() => handleEditLanguageClick(lang)}
                                                className={styles.editButton}
                                            >
                                                تعديل
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteLanguage(lang.id)}
                                                className={styles.deleteButton}
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleAddLanguageClick}
                            className={styles.addButton}
                        >
                            + {labels.onboarding.labels.addLanguage}
                        </button>
                    </>
                )}

                {/* Add/Edit Mode: Show form */}
                {(languageFormMode === 'add' || languageFormMode === 'edit') && (
                    <div className={styles.languageForm}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{labels.onboarding.labels.languageName}</label>
                                <select
                                    className={styles.select}
                                    value={languageFormData.language}
                                    onChange={(e) => setLanguageFormData({ ...languageFormData, language: e.target.value })}
                                >
                                    <option value="">اختر اللغة</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{labels.onboarding.labels.proficiency}</label>
                                <select
                                    className={styles.select}
                                    value={languageFormData.proficiency}
                                    onChange={(e) => setLanguageFormData({ ...languageFormData, proficiency: e.target.value as LanguageProficiency })}
                                >
                                    <option value="">اختر المستوى</option>
                                    {Object.entries(PROFICIENCY_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={handleSaveLanguage}
                                className={styles.saveButton}
                                disabled={!languageFormData.language || !languageFormData.proficiency}
                            >
                                حفظ
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelLanguage}
                                className={styles.cancelButton}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )}

                {errors.languages && <span className={styles.error}>{errors.languages}</span>}
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button type="button" onClick={handleBack} className={styles.backBtn}>
                    {locale === 'ar' ? '→' : '←'} {labels.directory.pagination.previous}
                </button>
                <Button onClick={handleNext}>
                    {labels.nav.next || 'التالي'} {locale === 'ar' ? '←' : '→'}
                </Button>
            </div>
        </div>
    );
}
