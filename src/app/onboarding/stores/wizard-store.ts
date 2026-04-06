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

// Language proficiency levels
export type LanguageProficiency = 'beginner' | 'intermediate' | 'advanced' | 'native';

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

// Language entry
export interface LanguageEntry {
    id: string;
    language: string;
    proficiency: LanguageProficiency;
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

// Step 1: Personal Information Only (البيانات الشخصية فقط)
interface Step1Data {
    fullName: string;
    fullNameEn: string;
    title: TeacherTitle | '';
    gender: Gender | '';
    country: string;
    birthDate: string;
}

// Step 2: Specialization & Languages (التخصص واللغات)
interface Step2Data {
    subjects: Subject[];
    specializations: SubjectSpecializations;
    languages: LanguageEntry[];
}

// Step 3: Education & Experience (الخلفية والخبرة)
interface Step3Data {
    education: EducationEntry[];    // التعليم (Timeline)
    experiences: ExperienceEntry[]; // الخبرة (Timeline)
}

// Step 4: Target Audience, Pricing & Bio (الجمهور والسعر والبايو)
interface Step4Data {
    studentAgeMin: number | null;
    studentAgeMax: number | null;
    studentGender: 'males' | 'females' | 'both';
    priceAmount: number | null;
    priceCurrency: 'EGP' | 'USD';
    bioTextAr: string;
    bioTextEn: string;
}

// Step 5: Educational Sample (الفيديو التعليمي)
interface Step5Data {
    videoUrl: string;
}

// Step 6: Contact & Legal (التواصل والقانوني)
interface Step6Data {
    whatsapp: string;
    misbahEmail: string; // Email for Misbah communication (not student contact)
    telegram: string;
    teachingFormat: 'online';
    personalTeaching: boolean;
    noRedirection: boolean;
    violationConsequences: boolean;
    legalAcknowledgement: boolean;
}

// ============================================
// STORE INTERFACE
// ============================================

export interface WizardState {
    // Current step (1-6)
    currentStep: number;

    // Draft profile ID (from database)
    draftProfileId: string | null;

    // Step data
    step1: Step1Data;
    step2: Step2Data;
    step3: Step3Data;
    step4: Step4Data;
    step5: Step5Data;
    step6: Step6Data;

    // Actions
    setStep: (step: number) => void;
    setDraftProfileId: (id: string) => void;
    updateStep1: (data: Partial<Step1Data>) => void;
    updateStep2: (data: Partial<Step2Data>) => void;
    updateStep3: (data: Partial<Step3Data>) => void;
    updateStep4: (data: Partial<Step4Data>) => void;
    updateStep5: (data: Partial<Step5Data>) => void;
    updateStep6: (data: Partial<Step6Data>) => void;

    // Education helpers
    addEducation: (entry: EducationEntry) => void;
    updateEducation: (id: string, data: Partial<EducationEntry>) => void;
    removeEducation: (id: string) => void;

    // Experience helpers
    addExperience: (experience: ExperienceEntry) => void;
    updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
    removeExperience: (id: string) => void;

    // Language helpers
    addLanguage: (language: LanguageEntry) => void;
    updateLanguage: (id: string, data: Partial<LanguageEntry>) => void;
    removeLanguage: (id: string) => void;

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
};

const initialStep2: Step2Data = {
    subjects: [],
    specializations: {
        quranTypes: [],
        arabicAreas: [],
        arabicCurricula: [],
        readingCurricula: [],
        arabicOther: '',
        islamicSections: [],
    },
    languages: [],
};

const initialStep3: Step3Data = {
    education: [],
    experiences: [],
};

const initialStep4: Step4Data = {
    studentAgeMin: null,
    studentAgeMax: null,
    studentGender: 'both',
    priceAmount: null,
    priceCurrency: 'EGP',
    bioTextAr: '',
    bioTextEn: '',
};

const initialStep5: Step5Data = {
    videoUrl: '',
};

const initialStep6: Step6Data = {
    whatsapp: '',
    misbahEmail: '',
    telegram: '',
    teachingFormat: 'online',
    personalTeaching: false,
    noRedirection: false,
    violationConsequences: false,
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
            step6: initialStep6,

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

            updateStep6: (data) => set((state) => ({
                step6: { ...state.step6, ...data }
            })),

            // Education helpers
            addEducation: (entry) => set((state) => ({
                step3: {
                    ...state.step3,
                    education: [...state.step3.education, entry]
                }
            })),

            updateEducation: (id, data) => set((state) => ({
                step3: {
                    ...state.step3,
                    education: state.step3.education.map((edu) =>
                        edu.id === id ? { ...edu, ...data } : edu
                    )
                }
            })),

            removeEducation: (id) => set((state) => ({
                step3: {
                    ...state.step3,
                    education: state.step3.education.filter((edu) => edu.id !== id)
                }
            })),

            // Experience helpers
            addExperience: (experience) => set((state) => ({
                step3: {
                    ...state.step3,
                    experiences: [...state.step3.experiences, experience]
                }
            })),

            updateExperience: (id, data) => set((state) => ({
                step3: {
                    ...state.step3,
                    experiences: state.step3.experiences.map((exp) =>
                        exp.id === id ? { ...exp, ...data } : exp
                    )
                }
            })),

            removeExperience: (id) => set((state) => ({
                step3: {
                    ...state.step3,
                    experiences: state.step3.experiences.filter((exp) => exp.id !== id)
                }
            })),

            // Language helpers (now in step2)
            addLanguage: (language) => set((state) => ({
                step2: {
                    ...state.step2,
                    languages: [...(state.step2.languages || []), language]
                }
            })),

            updateLanguage: (id, data) => set((state) => ({
                step2: {
                    ...state.step2,
                    languages: (state.step2.languages || []).map((lang) =>
                        lang.id === id ? { ...lang, ...data } : lang
                    )
                }
            })),

            removeLanguage: (id) => set((state) => ({
                step2: {
                    ...state.step2,
                    languages: (state.step2.languages || []).filter((lang) => lang.id !== id)
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
                step6: initialStep6,
            }),

            // Calculate total experience years
            getTotalExperienceYears: () => {
                const { experiences } = get().step3;
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
                step4: state.step4,
                step5: {
                    videoUrl: '', // Don't persist video URL
                },
                // step6 not persisted (contact methods + legal acknowledgement)
            }),
            // Merge function to ensure step3.education and step3.experiences are always arrays
            merge: (persistedState: unknown, currentState: WizardState) => {
                const persisted = persistedState as Partial<WizardState>;
                const state = { ...currentState, ...persisted };
                
                // Ensure step3 has education and experiences arrays
                if (!state.step3) {
                    state.step3 = initialStep3;
                } else {
                    state.step3 = {
                        ...initialStep3,
                        ...state.step3,
                        education: Array.isArray(state.step3.education) ? state.step3.education : [],
                        experiences: Array.isArray(state.step3.experiences) ? state.step3.experiences : [],
                    };
                }
                
                // Ensure step2 has languages array
                if (!state.step2) {
                    state.step2 = initialStep2;
                } else {
                    state.step2 = {
                        ...initialStep2,
                        ...state.step2,
                        languages: Array.isArray(state.step2.languages) ? state.step2.languages : [],
                    };
                }
                
                return state;
            },
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

// Language proficiency labels
export const PROFICIENCY_LABELS: Record<LanguageProficiency, string> = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    native: 'لغة أم',
};

// Common languages (can be extended)
export const LANGUAGES = [
    'العربية',
    'English',
    'Français',
    'Deutsch',
    'Español',
    'Türkçe',
    'اردو',
    'فارسی',
    'Bahasa Indonesia',
    'Bahasa Melayu',
    'বাংলা',
    'हिन्दी',
    'Русский',
    'Nederlands',
    'Italiano',
    'Polski',
    'Português',
    'Kiswahili',
    'Soomaali',
    'Hausa',
];

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

