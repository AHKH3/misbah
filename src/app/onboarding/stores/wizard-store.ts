import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================
// ENUMS & TYPES
// ============================================

// Professional title (المسمّى الوظيفي)
export type TeacherTitle = 'sheikh' | 'ustaz' | 'muallim';

// Gender
export type Gender = 'male' | 'female';

// Subjects (التخصصات)
export type Subject = 'quran' | 'arabic' | 'islamic_studies';

// Quran teaching types (أنواع تدريس القرآن)
export type QuranTeachingType = 'tahfiz' | 'tilawa' | 'ijaza' | 'review';

// Arabic teaching areas (مجالات اللغة العربية)
export type ArabicArea = 'arabic_second_lang' | 'reading' | 'grammar' | 'conversation' | 'other';

// Arabic curricula (مناهج العربية كلغة ثانية)
export type ArabicCurriculum = 'arabiya_bayna_yadayk' | 'madinah' | 'custom';

// Reading curricula (مناهج القرائية)
export type ReadingCurriculum = 'noor_albayan' | 'qaida_noorania';

// Islamic studies sections (أقسام الدراسات الإسلامية)
export type IslamicSection = 'fiqh' | 'aqeedah' | 'tafsir' | 'hadith' | 'seerah';

// Education type
export type EducationType = 'religious' | 'academic' | 'ijaza' | 'course' | 'other';

// Academic degree
export type AcademicDegree = 'secondary' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'other';

// Organization type for experience
export type OrganizationType = 'academy' | 'center' | 'mosque' | 'private' | 'online' | 'other';

// Fiqh madhab
export type Madhab = 'hanafi' | 'maliki' | 'shafii' | 'hanbali' | 'salafi' | 'other' | '';

// ============================================
// ENTRY TYPES
// ============================================

// Education entry (timeline item)
export interface EducationEntry {
    id: string;
    type: EducationType;
    degree: AcademicDegree;
    institution: string;
    specialization: string;
    startYear: number;
    endYear: number | null; // null = ongoing
    notes?: string;
}

// Experience entry (timeline item)
export interface ExperienceEntry {
    id: string;
    organization: string;
    organizationType: OrganizationType;
    role: string;
    startYear: number;
    startMonth: number; // 1-12
    endYear: number | null; // null = ongoing
    endMonth: number | null;
    description?: string;
}

// ============================================
// STEP DATA INTERFACES
// ============================================

// Subject specializations (تخصيص التخصص)
export interface SubjectSpecializations {
    // Quran
    quranTypes: QuranTeachingType[];
    // Arabic
    arabicAreas: ArabicArea[];
    arabicCurricula: ArabicCurriculum[];
    readingCurricula: ReadingCurriculum[];
    arabicOther: string; // For 'other' option
    // Islamic Studies
    islamicSections: IslamicSection[];
}

// Step 1: Personal Information (البيانات الأساسية)
interface Step1Data {
    fullName: string;
    fullNameEn: string;
    title: TeacherTitle | '';
    gender: Gender | '';
    country: string;
    birthDate: string;
    subjects: Subject[];
    specializations: SubjectSpecializations;
}

// Step 2: Education & Experience (الخلفية والخبرة)
interface Step2Data {
    education: EducationEntry[];    // التعليم (Timeline)
    experiences: ExperienceEntry[]; // الخبرة (Timeline)
    madhab: Madhab;                 // المذهب الفقهي (اختياري)
}

// Step 3: Target Audience & Pricing
interface Step3Data {
    studentAgeMin: number | null;
    studentAgeMax: number | null;
    studentGender: 'males' | 'females' | 'both';
    priceAmount: number | null;
    priceCurrency: 'EGP' | 'USD';
    audience: string[];
}

// Step 4: Contact & Sample
interface Step4Data {
    whatsapp: string;
    email: string;
    telegram: string;
    videoUrl: string;
    teachingFormat: 'online' | 'in_person' | 'hybrid' | '';
}

// Step 5: Legal Acknowledgement
interface Step5Data {
    legalAcknowledgement: boolean;
}

// ============================================
// STORE INTERFACE
// ============================================

export interface WizardState {
    // Current step (1-5)
    currentStep: number;

    // Draft profile ID (from database)
    draftProfileId: string | null;

    // Step data
    step1: Step1Data;
    step2: Step2Data;
    step3: Step3Data;
    step4: Step4Data;
    step5: Step5Data;

    // Actions
    setStep: (step: number) => void;
    setDraftProfileId: (id: string) => void;
    updateStep1: (data: Partial<Step1Data>) => void;
    updateStep2: (data: Partial<Step2Data>) => void;
    updateStep3: (data: Partial<Step3Data>) => void;
    updateStep4: (data: Partial<Step4Data>) => void;
    updateStep5: (data: Partial<Step5Data>) => void;

    // Education helpers
    addEducation: (entry: EducationEntry) => void;
    updateEducation: (id: string, data: Partial<EducationEntry>) => void;
    removeEducation: (id: string) => void;

    // Experience helpers
    addExperience: (experience: ExperienceEntry) => void;
    updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
    removeExperience: (id: string) => void;

    // Computed: calculate total experience years
    getTotalExperienceYears: () => number;

    // Computed: calculate age from birthDate
    getAge: () => number | null;

    // Reset
    reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialStep1: Step1Data = {
    fullName: '',
    fullNameEn: '',
    title: '',
    gender: '',
    country: '',
    birthDate: '',
    subjects: [],
    specializations: {
        quranTypes: [],
        arabicAreas: [],
        arabicCurricula: [],
        readingCurricula: [],
        arabicOther: '',
        islamicSections: [],
    },
};

const initialStep2: Step2Data = {
    education: [],
    experiences: [],
    madhab: '',
};

const initialStep3: Step3Data = {
    studentAgeMin: null,
    studentAgeMax: null,
    studentGender: 'both',
    priceAmount: null,
    priceCurrency: 'EGP',
    audience: [],
};

const initialStep4: Step4Data = {
    whatsapp: '',
    email: '',
    telegram: '',
    videoUrl: '',
    teachingFormat: '',
};

const initialStep5: Step5Data = {
    legalAcknowledgement: false,
};

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useWizardStore = create<WizardState>()(
    persist(
        (set, get) => ({
            currentStep: 1,
            draftProfileId: null,
            step1: initialStep1,
            step2: initialStep2,
            step3: initialStep3,
            step4: initialStep4,
            step5: initialStep5,

            setStep: (step) => set({ currentStep: step }),
            setDraftProfileId: (id) => set({ draftProfileId: id }),

            updateStep1: (data) => set((state) => ({
                step1: { ...state.step1, ...data }
            })),

            updateStep2: (data) => set((state) => ({
                step2: { ...state.step2, ...data }
            })),

            updateStep3: (data) => set((state) => ({
                step3: { ...state.step3, ...data }
            })),

            updateStep4: (data) => set((state) => ({
                step4: { ...state.step4, ...data }
            })),

            updateStep5: (data) => set((state) => ({
                step5: { ...state.step5, ...data }
            })),

            // Education helpers
            addEducation: (entry) => set((state) => ({
                step2: {
                    ...state.step2,
                    education: [...state.step2.education, entry]
                }
            })),

            updateEducation: (id, data) => set((state) => ({
                step2: {
                    ...state.step2,
                    education: state.step2.education.map((edu) =>
                        edu.id === id ? { ...edu, ...data } : edu
                    )
                }
            })),

            removeEducation: (id) => set((state) => ({
                step2: {
                    ...state.step2,
                    education: state.step2.education.filter((edu) => edu.id !== id)
                }
            })),

            // Experience helpers
            addExperience: (experience) => set((state) => ({
                step2: {
                    ...state.step2,
                    experiences: [...state.step2.experiences, experience]
                }
            })),

            updateExperience: (id, data) => set((state) => ({
                step2: {
                    ...state.step2,
                    experiences: state.step2.experiences.map((exp) =>
                        exp.id === id ? { ...exp, ...data } : exp
                    )
                }
            })),

            removeExperience: (id) => set((state) => ({
                step2: {
                    ...state.step2,
                    experiences: state.step2.experiences.filter((exp) => exp.id !== id)
                }
            })),

            reset: () => set({
                currentStep: 1,
                draftProfileId: null,
                step1: initialStep1,
                step2: initialStep2,
                step3: initialStep3,
                step4: initialStep4,
                step5: initialStep5,
            }),

            // Calculate total experience years
            getTotalExperienceYears: () => {
                const { experiences } = get().step2;
                let totalMonths = 0;

                experiences.forEach((exp) => {
                    const startDate = new Date(exp.startYear, exp.startMonth - 1);
                    const endDate = exp.endYear && exp.endMonth
                        ? new Date(exp.endYear, exp.endMonth - 1)
                        : new Date();
                    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                        (endDate.getMonth() - startDate.getMonth());
                    totalMonths += Math.max(0, months);
                });

                return Math.round(totalMonths / 12 * 10) / 10;
            },

            // Calculate age from birthDate
            getAge: () => {
                const { birthDate } = get().step1;
                if (!birthDate) return null;

                const birth = new Date(birthDate);
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }

                return age;
            },
        }),
        {
            name: 'misbah-onboarding-wizard',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                currentStep: state.currentStep,
                draftProfileId: state.draftProfileId,
                step1: state.step1,
                step2: state.step2,
                step3: state.step3,
                step4: {
                    ...state.step4,
                    videoUrl: '', // Don't persist
                },
            }),
        }
    )
);

// ============================================
// LABEL MAPS (for UI)
// ============================================

export const TITLE_LABELS: Record<TeacherTitle, string> = {
    sheikh: 'الشيخ',
    ustaz: 'الأستاذ',
    muallim: 'المعلم',
};

export const TITLE_LABELS_FEMALE: Record<TeacherTitle, string> = {
    sheikh: 'الشيخة',
    ustaz: 'الأستاذة',
    muallim: 'المعلمة',
};

export const GENDER_LABELS: Record<Gender, string> = {
    male: 'ذكر',
    female: 'أنثى',
};

export const SUBJECT_LABELS: Record<Subject, string> = {
    quran: 'القرآن الكريم',
    arabic: 'اللغة العربية',
    islamic_studies: 'الدراسات الإسلامية',
};

export const EDUCATION_TYPE_LABELS: Record<EducationType, string> = {
    religious: 'تعليم شرعي',
    academic: 'تعليم جامعي',
    ijaza: 'إجازة',
    course: 'دورة',
    other: 'أخرى',
};

export const DEGREE_LABELS: Record<AcademicDegree, string> = {
    secondary: 'ثانوية',
    diploma: 'دبلوم',
    bachelor: 'بكالوريوس',
    master: 'ماجستير',
    phd: 'دكتوراه',
    other: 'أخرى',
};

export const ORG_TYPE_LABELS: Record<OrganizationType, string> = {
    academy: 'أكاديمية',
    center: 'مركز',
    mosque: 'حلقة مسجد',
    private: 'تعليم خاص',
    online: 'منصة أونلاين',
    other: 'أخرى',
};

export const MADHAB_LABELS: Record<Exclude<Madhab, ''>, string> = {
    hanafi: 'حنفي',
    maliki: 'مالكي',
    shafii: 'شافعي',
    hanbali: 'حنبلي',
    salafi: 'سلفي / أثري',
    other: 'غير ذلك',
};

// Subject Specialization Labels
export const QURAN_TYPE_LABELS: Record<QuranTeachingType, string> = {
    tahfiz: 'تحفيظ',
    tilawa: 'تصحيح تلاوة',
    ijaza: 'إجازات قرآنية',
    review: 'مراجعة وتثبيت',
};

export const ARABIC_AREA_LABELS: Record<ArabicArea, string> = {
    arabic_second_lang: 'العربية كلغة ثانية',
    reading: 'القرائية',
    grammar: 'النحو',
    conversation: 'المحادثة',
    other: 'أخرى',
};

export const ARABIC_CURRICULUM_LABELS: Record<ArabicCurriculum, string> = {
    arabiya_bayna_yadayk: 'العربية بين يديك',
    madinah: 'منهج المدينة',
    custom: 'منهج خاص',
};

export const READING_CURRICULUM_LABELS: Record<ReadingCurriculum, string> = {
    noor_albayan: 'نور البيان',
    qaida_noorania: 'القاعدة النورانية',
};

export const ISLAMIC_SECTION_LABELS: Record<IslamicSection, string> = {
    fiqh: 'الفقه',
    aqeedah: 'العقيدة',
    tafsir: 'التفسير',
    hadith: 'الحديث',
    seerah: 'السيرة',
};

