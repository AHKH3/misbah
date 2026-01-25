'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Timeline, createTimelineItem } from '@/components/ui';
import type { TimelineItem } from '@/components/ui';
import {
    useWizardStore,
    EDUCATION_TYPE_LABELS,
    DEGREE_LABELS,
    ORG_TYPE_LABELS,
    MADHAB_LABELS,
    type EducationType,
    type AcademicDegree,
    type OrganizationType,
    type Madhab,
    type EducationEntry,
    type ExperienceEntry,
} from '../stores/wizard-store';
import styles from '../wizard.module.css';

// Generate year options
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => currentYear - i);
const MONTHS = [
    { value: 1, label: 'يناير' },
    { value: 2, label: 'فبراير' },
    { value: 3, label: 'مارس' },
    { value: 4, label: 'أبريل' },
    { value: 5, label: 'مايو' },
    { value: 6, label: 'يونيو' },
    { value: 7, label: 'يوليو' },
    { value: 8, label: 'أغسطس' },
    { value: 9, label: 'سبتمبر' },
    { value: 10, label: 'أكتوبر' },
    { value: 11, label: 'نوفمبر' },
    { value: 12, label: 'ديسمبر' },
];

type FormMode = 'view' | 'add-education' | 'edit-education' | 'add-experience' | 'edit-experience';

export default function Step2Page() {
    const router = useRouter();
    const {
        step2,
        updateStep2,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        setStep,
        getTotalExperienceYears,
    } = useWizardStore();

    const [mode, setMode] = useState<FormMode>('view');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Education form state
    const [eduForm, setEduForm] = useState<Partial<EducationEntry>>({
        type: 'academic',
        degree: 'bachelor',
        institution: '',
        specialization: '',
        startYear: currentYear,
        endYear: null,
        notes: '',
    });

    // Experience form state
    const [expForm, setExpForm] = useState<Partial<ExperienceEntry>>({
        organization: '',
        organizationType: 'academy',
        role: '',
        startYear: currentYear,
        startMonth: 1,
        endYear: null,
        endMonth: null,
        description: '',
    });

    const [isOngoing, setIsOngoing] = useState(false);

    // Convert entries to timeline items
    const timelineItems: TimelineItem[] = [
        ...step2.education.map((edu) =>
            createTimelineItem(
                edu,
                'education',
                `${DEGREE_LABELS[edu.degree]} — ${EDUCATION_TYPE_LABELS[edu.type]}`,
                edu.institution,
                edu.specialization
            )
        ),
        ...step2.experiences.map((exp) =>
            createTimelineItem(
                { id: exp.id, startYear: exp.startYear, endYear: exp.endYear },
                'experience',
                exp.role,
                exp.organization,
                exp.description
            )
        ),
    ];

    const totalYears = getTotalExperienceYears();

    // Handlers
    const handleAddEducation = () => {
        setMode('add-education');
        setEduForm({
            type: 'academic',
            degree: 'bachelor',
            institution: '',
            specialization: '',
            startYear: currentYear,
            endYear: null,
            notes: '',
        });
        setIsOngoing(false);
    };

    const handleAddExperience = () => {
        setMode('add-experience');
        setExpForm({
            organization: '',
            organizationType: 'academy',
            role: '',
            startYear: currentYear,
            startMonth: 1,
            endYear: null,
            endMonth: null,
            description: '',
        });
        setIsOngoing(true);
    };

    const handleEditItem = (id: string) => {
        const edu = step2.education.find((e) => e.id === id);
        if (edu) {
            setMode('edit-education');
            setEditingId(id);
            setEduForm(edu);
            setIsOngoing(edu.endYear === null);
            return;
        }
        const exp = step2.experiences.find((e) => e.id === id);
        if (exp) {
            setMode('edit-experience');
            setEditingId(id);
            setExpForm(exp);
            setIsOngoing(exp.endYear === null);
        }
    };

    const handleRemoveItem = (id: string) => {
        if (step2.education.find((e) => e.id === id)) {
            removeEducation(id);
        } else {
            removeExperience(id);
        }
    };

    const handleSaveEducation = () => {
        const newErrors: Record<string, string> = {};
        if (!eduForm.institution?.trim()) newErrors.institution = 'أدخل الجهة';
        if (!eduForm.specialization?.trim()) newErrors.specialization = 'أدخل التخصص';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const entry: EducationEntry = {
            id: editingId || crypto.randomUUID(),
            type: eduForm.type as EducationType,
            degree: eduForm.degree as AcademicDegree,
            institution: eduForm.institution!,
            specialization: eduForm.specialization!,
            startYear: eduForm.startYear!,
            endYear: isOngoing ? null : (eduForm.endYear ?? null),
            notes: eduForm.notes,
        };

        if (mode === 'edit-education' && editingId) {
            updateEducation(editingId, entry);
        } else {
            addEducation(entry);
        }
        setMode('view');
        setEditingId(null);
        setErrors({});
    };

    const handleSaveExperience = () => {
        const newErrors: Record<string, string> = {};
        if (!expForm.organization?.trim()) newErrors.organization = 'أدخل الجهة';
        if (!expForm.role?.trim()) newErrors.role = 'أدخل الدور';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const entry: ExperienceEntry = {
            id: editingId || crypto.randomUUID(),
            organization: expForm.organization!,
            organizationType: expForm.organizationType as OrganizationType,
            role: expForm.role!,
            startYear: expForm.startYear!,
            startMonth: expForm.startMonth!,
            endYear: isOngoing ? null : (expForm.endYear ?? null),
            endMonth: isOngoing ? null : (expForm.endMonth ?? null),
            description: expForm.description,
        };

        if (mode === 'edit-experience' && editingId) {
            updateExperience(editingId, entry);
        } else {
            addExperience(entry);
        }
        setMode('view');
        setEditingId(null);
        setErrors({});
    };

    const handleCancel = () => {
        setMode('view');
        setEditingId(null);
        setErrors({});
    };

    const validateAndProceed = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (step2.education.length === 0) {
            newErrors.timeline = 'أضف عنصر تعليم واحد على الأقل';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateAndProceed()) {
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
            <h2 className={styles.stepTitle}>الخلفية والخبرة</h2>
            <p className={styles.stepDescription}>
                أضف تعليمك وخبراتك التدريسية. ستظهر كمسار زمني في بروفايلك.
            </p>

            {/* Timeline Display */}
            {mode === 'view' && (
                <>
                    <div className={styles.sectionHeader}>
                        <span className={styles.label}>المسار الزمني</span>
                        {totalYears > 0 && (
                            <span className={styles.badge}>
                                إجمالي الخبرة: {totalYears} سنة
                            </span>
                        )}
                    </div>

                    <Timeline
                        items={timelineItems}
                        emptyMessage="لم تضف أي عنصر بعد"
                        editable
                        onEdit={handleEditItem}
                        onRemove={handleRemoveItem}
                    />

                    {errors.timeline && <span className={styles.error}>{errors.timeline}</span>}

                    <div className={styles.timelineActions}>
                        <button
                            type="button"
                            onClick={handleAddEducation}
                            className={styles.addBtn}
                        >
                            + إضافة تعليم / شهادة
                        </button>
                        <button
                            type="button"
                            onClick={handleAddExperience}
                            className={styles.addBtn}
                        >
                            + إضافة خبرة تدريسية
                        </button>
                    </div>

                    {/* Madhab (Optional) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="madhab" className={styles.label}>
                            المذهب الفقهي (اختياري)
                        </label>
                        <select
                            id="madhab"
                            className={styles.select}
                            value={step2.madhab}
                            onChange={(e) => updateStep2({ madhab: e.target.value as Madhab })}
                        >
                            <option value="">لم أحدد</option>
                            {Object.entries(MADHAB_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <span className={styles.hint}>
                            تُعرض للطلاب لمراعاة الاختلاف الفقهي
                        </span>
                    </div>
                </>
            )}

            {/* Education Form */}
            {(mode === 'add-education' || mode === 'edit-education') && (
                <div className={styles.experienceCard}>
                    <div className={styles.cardHeader}>
                        <span>{mode === 'edit-education' ? 'تعديل التعليم' : 'إضافة تعليم / شهادة'}</span>
                    </div>
                    <div className={styles.cardGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>النوع</label>
                            <select
                                className={styles.select}
                                value={eduForm.type}
                                onChange={(e) => setEduForm({ ...eduForm, type: e.target.value as EducationType })}
                            >
                                {Object.entries(EDUCATION_TYPE_LABELS).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>المرحلة / الدرجة</label>
                            <select
                                className={styles.select}
                                value={eduForm.degree}
                                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value as AcademicDegree })}
                            >
                                {Object.entries(DEGREE_LABELS).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.smallLabel}>الجهة / المؤسسة</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={eduForm.institution}
                                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                                placeholder="مثال: جامعة الأزهر"
                            />
                            {errors.institution && <span className={styles.error}>{errors.institution}</span>}
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.smallLabel}>التخصص</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={eduForm.specialization}
                                onChange={(e) => setEduForm({ ...eduForm, specialization: e.target.value })}
                                placeholder="مثال: علوم القرآن"
                            />
                            {errors.specialization && <span className={styles.error}>{errors.specialization}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>من سنة</label>
                            <select
                                className={styles.select}
                                value={eduForm.startYear}
                                onChange={(e) => setEduForm({ ...eduForm, startYear: parseInt(e.target.value) })}
                            >
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>
                                إلى سنة
                                <span className={styles.checkboxInline}>
                                    <input
                                        type="checkbox"
                                        checked={isOngoing}
                                        onChange={(e) => setIsOngoing(e.target.checked)}
                                    />
                                    حتى الآن
                                </span>
                            </label>
                            <select
                                className={styles.select}
                                value={eduForm.endYear ?? ''}
                                onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value ? parseInt(e.target.value) : null })}
                                disabled={isOngoing}
                            >
                                <option value="">—</option>
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.smallLabel}>ملاحظات (اختياري)</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={eduForm.notes}
                                onChange={(e) => setEduForm({ ...eduForm, notes: e.target.value })}
                                placeholder="مثال: حافظ للقرآن كاملاً"
                            />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={handleCancel} className={styles.backBtn}>
                            إلغاء
                        </button>
                        <Button onClick={handleSaveEducation}>
                            حفظ
                        </Button>
                    </div>
                </div>
            )}

            {/* Experience Form */}
            {(mode === 'add-experience' || mode === 'edit-experience') && (
                <div className={styles.experienceCard}>
                    <div className={styles.cardHeader}>
                        <span>{mode === 'edit-experience' ? 'تعديل الخبرة' : 'إضافة خبرة تدريسية'}</span>
                    </div>
                    <div className={styles.cardGrid}>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.smallLabel}>الجهة / المؤسسة</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={expForm.organization}
                                onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                                placeholder="مثال: أكاديمية النور"
                            />
                            {errors.organization && <span className={styles.error}>{errors.organization}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>نوع الجهة</label>
                            <select
                                className={styles.select}
                                value={expForm.organizationType}
                                onChange={(e) => setExpForm({ ...expForm, organizationType: e.target.value as OrganizationType })}
                            >
                                {Object.entries(ORG_TYPE_LABELS).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>الدور</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={expForm.role}
                                onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                                placeholder="مثال: معلم تجويد"
                            />
                            {errors.role && <span className={styles.error}>{errors.role}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>من</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <select
                                    className={styles.select}
                                    value={expForm.startMonth}
                                    onChange={(e) => setExpForm({ ...expForm, startMonth: parseInt(e.target.value) })}
                                >
                                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                                <select
                                    className={styles.select}
                                    value={expForm.startYear}
                                    onChange={(e) => setExpForm({ ...expForm, startYear: parseInt(e.target.value) })}
                                >
                                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.smallLabel}>
                                إلى
                                <span className={styles.checkboxInline}>
                                    <input
                                        type="checkbox"
                                        checked={isOngoing}
                                        onChange={(e) => setIsOngoing(e.target.checked)}
                                    />
                                    حتى الآن
                                </span>
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <select
                                    className={styles.select}
                                    value={expForm.endMonth ?? ''}
                                    onChange={(e) => setExpForm({ ...expForm, endMonth: e.target.value ? parseInt(e.target.value) : null })}
                                    disabled={isOngoing}
                                >
                                    <option value="">—</option>
                                    {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                                <select
                                    className={styles.select}
                                    value={expForm.endYear ?? ''}
                                    onChange={(e) => setExpForm({ ...expForm, endYear: e.target.value ? parseInt(e.target.value) : null })}
                                    disabled={isOngoing}
                                >
                                    <option value="">—</option>
                                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.smallLabel}>وصف مختصر (اختياري)</label>
                            <textarea
                                className={styles.textarea}
                                value={expForm.description}
                                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                                placeholder="مثال: تعليم المبتدئين والمتوسطين"
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={handleCancel} className={styles.backBtn}>
                            إلغاء
                        </button>
                        <Button onClick={handleSaveExperience}>
                            حفظ
                        </Button>
                    </div>
                </div>
            )}

            {/* Navigation */}
            {mode === 'view' && (
                <div className={styles.navigation}>
                    <button type="button" onClick={handleBack} className={styles.backBtn}>
                        ← السابق
                    </button>
                    <Button onClick={handleNext}>
                        التالي →
                    </Button>
                </div>
            )}
        </div>
    );
}
