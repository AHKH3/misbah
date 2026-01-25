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
    };
    footer: {
        tagline: string;
        about: string;
        faq: string;
        privacy: string;
        terms: string;
        copyright: string;
        disclaimer: string;
    };
    home: {
        hero: {
            title: string;
            subtitle: string;
            valueStatement: string;
            ctaStudents: string;
            ctaTeachers: string;
            trustBadges: string[];
        };
        forStudents: {
            label: string;
            title: string;
            points: string[];
            note: string;
            cta: string;
        };
        forTeachers: {
            label: string;
            title: string;
            points: string[];
            note: string;
            cta: string;
        };
        notSection: {
            title: string;
            points: string[];
        };
        howItWorks: {
            title: string;
            steps: { number: string; title: string; description: string }[];
            note: string;
        };
        pricing: {
            label: string;
            title: string;
            description: string;
        };
        finalCta: {
            studentsLabel: string;
            studentsButton: string;
            teachersLabel: string;
            teachersButton: string;
        };
        disclaimer: string;
    };
    about: {
        pageTitle: string;
        whatIs: { title: string; description: string; subDescription: string };
        why: { title: string; description: string; subDescription: string };
        how: { title: string; steps: string[] };
        nature: { title: string; intro: string; points: string[]; conclusion: string };
        review: { title: string; description: string };
        limits: { title: string; description: string };
        contact: { title: string; description: string; email: string };
    };
    faq: {
        pageTitle: string;
        items: { question: string; answer: string }[];
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
        teachingSample: string;
        contactMethods: string;
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
    };
    onboarding: {
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
translationCache['ar'] = arTranslations as TranslationType;
translationCache['en'] = enTranslations as TranslationType;

/**
 * Get translation for a specific locale
 * Returns cached version if available, otherwise loads dynamically
 */
export function getTranslation(locale: Locale): TranslationType {
    // Return from cache if available
    if (translationCache[locale]) {
        return translationCache[locale]!;
    }

    // For non-AR/EN locales, fallback to English until their file is created
    // This will be replaced with dynamic imports once all locale files exist
    return translationCache['en']!;
}

/**
 * Load translation dynamically (for future use with code splitting)
 */
export async function loadTranslation(locale: Locale): Promise<TranslationType> {
    // Return from cache if available
    if (translationCache[locale]) {
        return translationCache[locale]!;
    }

    try {
        // Dynamic import based on locale
        const translations = await import(`./locales/${locale}.json`);
        translationCache[locale] = translations.default as TranslationType;
        return translationCache[locale]!;
    } catch {
        // Fallback to English if locale file doesn't exist
        console.warn(`Translation file for ${locale} not found, falling back to English`);
        return translationCache['en']!;
    }
}

/**
 * Check if a locale's translations are loaded
 */
export function isTranslationLoaded(locale: Locale): boolean {
    return !!translationCache[locale];
}
