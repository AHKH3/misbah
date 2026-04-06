// i18n Loader - Dynamic import for translations
// Force Reload
import type { Locale } from './config';

// Type definition for translation structure
export type TranslationType = {
    nav: {
        home: string;
        directory: string;
        about: string;
        faq: string;
        register: string;
        login: string;
        next?: string;
    };
    footer: {
        tagline: string;
        siteTitle: string;
        legalTitle: string;
        contactTitle: string;
        contactEmail: string;
        home: string;
        find: string;
        about: string;
        faq: string;
        forTeachers: string;
        privacy: string;
        terms: string;
        disclaimer: string;
        copyright: string;
    };
    home: {
        hero: {
            badge: string;
            name: string;
            title: string;
            subtitle: string;
            foundersCounter: string;
            foundersNote: string;
            foundersFull: string;
            ctaStudents: string;
            ctaTeachers: string;
        };
        socialProof: {
            review: string;
            reviewDesc: string;
            commission: string;
            commissionDesc: string;
            direct: string;
            directDesc: string;
        };
        forStudents: {
            label: string;
            title: string;
            cards: { title: string; description: string }[];
            cta: string;
        };
        forTeachers: {
            label: string;
            title: string;
            cards: { title: string; description: string }[];
            cta: string;
        };
        howItWorks: {
            title: string;
            steps: { number: string; title: string; description: string }[];
            note: string;
        };
        principles: {
            title: string;
            is: string[];
            isNot: string[];
        };
        finalCta: {
            title: string;
            ctaStudents: string;
            ctaTeachers: string;
        };
        disclaimer: string;
    };
    about: {
        hero: { title: string; subtitle: string };
        story: { title: string; paragraphs: string[] };
        philosophy: { title: string; cards: { title: string; description: string }[] };
        standards: { title: string; intro: string; points: string[] };
        boundaries: { title: string; points: string[] };
        contact: { title: string; description: string; email: string };
    };
    faq: {
        pageTitle: string;
        items: { question: string; answer: string }[];
    };
    find: {
        meta: Record<string, { title: string; description: string }>;
        title: string;
        subtitle: string;
        filters: {
            subject: string;
            gender: string;
            audience: string;
            language: string;
            price: string;
            all: string;
            male: string;
            female: string;
            kids: string;
            adults: string;
            clearFilters: string;
        };
        results: {
            showing: string;
            noResults: string;
        };
    };
    directory: {
        title: string;
        browseDesc: string;
        filters: { subject: string; format: string; all: string };
        noResults: string;
        pagination: { previous: string; next: string };
        teachers: string;
    };
    teacher: {
        online: string;
        inPerson: string;
        hybrid: string;
        accepting: string;
        limited: string;
        notAccepting: string;
        backToDirectory: string;
        audience: string;
        teachingMethod: string;
        experience: string;
        educationAndExperience: string;
        education: string;
        teachingExperience: string;
        madhab: string;
        pricing: string;
        targetAge: string;
        allAges: string;
        teachingSample: string;
        contactMethods: string;
        revealContact: string;
        whatsapp: string;
        email: string;
        telegram: string;
        website: string;
        visitWebsite: string;
        subjects: {
            quran: string;
            tajweed: string;
            arabic: string;
            islamicStudies: string;
        };
        audiences: {
            kids: string;
            adults: string;
            femalesOnly: string;
            malesOnly: string;
            everyone: string;
        };
        madhabs: {
            hanafi: string;
            maliki: string;
            shafii: string;
            hanbali: string;
            salafi: string;
            other: string;
        };
    };
    common: {
        loading: string;
        error: string;
        retry: string;
        close: string;
        submit: string;
        cancel: string;
        save: string;
        delete: string;
        edit: string;
        view: string;
        search: string;
        filter: string;
        sort: string;
        more: string;
        less: string;
        present: string;
        years: string;
        year: string;
    };
    onboarding: {
        errors: {
            fullName: string;
            fullNameEn: string;
            title: string;
            gender: string;
            country: string;
            birthDate: string;
            birthDateAge: string;
            subjects: string;
            quranTypes: string;
            arabicAreas: string;
            islamicSections: string;
            institution: string;
            specialization: string;
            organization: string;
            role: string;
            timeline: string;
            ageRange: string;
            price: string;
            videoUrl: string;
            videoUrlYouTube: string;
            contact: string;
            email: string;
            format: string;
            legal: string;
        };
        profile: {
            title: string;
            subtitle: string;
            fullName: string;
            country: string;
            subjectsLabel: string;
            audienceLabel: string;
            teachingFormatLabel: string;
            teachingFormatPlaceholder: string;
            experienceLabel: string;
            experiencePlaceholder: string;
            videoUrlLabel: string;
            contactTitle: string;
            contactHint: string;
            submit: string;
            submitting: string;
        };
        payment: {
            title: string;
            subtitle: string;
            pricingTitle: string;
            price: string;
            discount: string;
            renewal: string;
            transferStart: string;
            methodName: string;
            uploadLabel: string;
            uploadHint: string;
            submit: string;
            submitting: string;
        };
        step2: {
            title: string;
        };
        step3: {
            title: string;
        };
        step4: {
            info: {
                title: string;
                points: string[];
                acceptedTitle: string;
                acceptedPoints: string[];
                rejectedTitle: string;
                rejectedPoints: string[];
                why: string;
            };
        };
        step5: {
            legal: {
                title: string;
                text: string;
                checkbox: string;
                personalTeaching: string;
                noRedirection: string;
                violationConsequences: string;
            };
        };
        success: {
            title: string;
            subtitle: string;
            nextStepsTitle: string;
            step1Title: string;
            step1Desc: string;
            step2Title: string;
            step2Desc: string;
            step3Title: string;
            step3Desc: string;
            noticeTitle: string;
            noticeText: string;
            backButton: string;
        };
        options: {
            genderBoth: string;
            genderMales: string;
            genderFemales: string;
            currencyEGP: string;
            currencyUSD: string;
        };
        labels: {
            fullName: string;
            fullNameEn: string;
            gender: string;
            title: string;
            country: string;
            birthDate: string;
            subjects: string;
            quranTypes: string;
            arabicAreas: string;
            arabicCurricula: string;
            readingCurricula: string;
            arabicOther: string;
            islamicSections: string;
            timeline: string;
            addEducation: string;
            addExperience: string;
            madhab: string;
            ageMin: string;
            ageMax: string;
            studentGender: string;
            price: string;
            videoUrl: string;
            whatsapp: string;
            telegram: string;
            email: string;
            teachingFormat: string;
            languages: string;
            addLanguage: string;
            languageName: string;
            proficiency: string;
        };
        placeholders: {
            fullName: string;
            fullNameEn: string;
            country: string;
            institution: string;
            organization: string;
            specialization: string;
            role: string;
            notes: string;
            description: string;
            ageMin: string;
            ageMax: string;
            price: string;
            videoUrl: string;
            whatsapp: string;
            telegram: string;
            email: string;
            teachingFormat: string;
        };
        hints: {
            madhab: string;
            price: string;
            video: string;
            contact: string;
            email: string;
        };
        preview: {
            title: string;
            fullName: string;
            country: string;
            subjects: string;
            experience: string;
            madhab: string;
            video: string;
            videoAttached: string;
            videoMissing: string;
            price: string;
            format: string;
            ageRange: string;
            education: string;
            experiences: string;
        };
    };
    forTeachersPage: {
        hero: { title: string; subtitle: string; cta: string };
        why: {
            title: string;
            cards: { title: string; description: string }[];
        };
        howItWorks: {
            title: string;
            steps: { number: string; title: string; description: string }[];
        };
        pricing: {
            title: string;
            betaPrice: string;
            betaNote: string;
            includes: string;
            noCommission: string;
        };
        faq: {
            title: string;
            items: { question: string; answer: string }[];
        };
        finalCta: { title: string; subtitle: string; cta: string };
    };
    contactPage: {
        title: string;
        subtitle: string;
        emailLabel: string;
        email: string;
        note: string;
    };
    errorPage: {
        title: string;
        description: string;
        retry: string;
    };
    notFoundPage: {
        title: string;
        code: string;
        description: string;
        backHome: string;
    };
    auth?: {
        title: string;
        email: string;
        password: string;
        signIn: string;
        signingIn: string;
        signOut: string;
        dashboard: string;
        errorInvalid: string;
    };
    legal: {
        privacy: {
            title: string;
            lastUpdated: string;
            summaryTitle: string;
            summaryText: string;
            dataCollectionTitle: string;
            dataCollectionTeachers: string;
            dataCollectionVisitors: string;
            usageTitle: string;
            usageText: string;
            rightsTitle: string;
            rightsText: string;
            contactText: string;
        };
        terms: {
            title: string;
            lastUpdated: string;
            summaryTitle: string;
            summaryText: string;
            natureTitle: string;
            natureText: string;
            responsibilityTitle: string;
            responsibilitySimple1: string;
            responsibilitySimple2: string;
            responsibilitySimple3: string;
            subscriptionTitle: string;
            subscriptionText: string;
            modificationTitle: string;
            modificationText: string;
        };
        disclaimer: {
            title: string;
            lastUpdated: string;
            highlightTitle: string;
            highlightText: string;
            scopeTitle: string;
            scopeComm: string;
            scopeInfo: string;
            scopeEdu: string;
            scopeMoney: string;
            reviewTitle: string;
            reviewText: string;
            agreementTitle: string;
            agreementText: string;
            contactText: string;
        };
    };
};

// Cache for loaded translations
const translationCache: Partial<Record<Locale, TranslationType>> = {};

// Static imports for Arabic and English (most used)
import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';

// Pre-cache AR and EN
translationCache['ar'] = arTranslations as unknown as TranslationType;
translationCache['en'] = enTranslations as unknown as TranslationType;

/**
 * Get translation for a specific locale
 */
export function getTranslation(locale: Locale): TranslationType {
    return translationCache[locale] ?? translationCache['en']!;
}

/**
 * Load translation (both ar/en are pre-cached, so this is synchronous in practice)
 */
export async function loadTranslation(locale: Locale): Promise<TranslationType> {
    return translationCache[locale] ?? translationCache['en']!;
}

/**
 * Check if a locale's translations are loaded
 */
export function isTranslationLoaded(locale: Locale): boolean {
    return !!translationCache[locale];
}
