// Internationalization Configuration — Multi-language Support

export const locales = [
    'ar',
    'en',
    'fr',
    'de',
    'es',
    'pt',
    'it',
    'tr',
    'ru',
    'ur',
    'id',
    'ms',
    'bn',
    'hi',
    'sw',
    'ha',
    'so',
    'fa',
    'nl',
    'pl',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
    ar: 'العربية',
    en: 'English',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    pt: 'Português',
    it: 'Italiano',
    tr: 'Türkçe',
    ru: 'Русский',
    ur: 'اردو',
    id: 'Bahasa Indonesia',
    ms: 'Bahasa Melayu',
    bn: 'বাংলা',
    hi: 'हिन्दी',
    sw: 'Kiswahili',
    ha: 'Hausa',
    so: 'Soomaali',
    fa: 'فارسی',
    nl: 'Nederlands',
    pl: 'Polski',
};

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
    ar: 'rtl',
    en: 'ltr',
    fr: 'ltr',
    de: 'ltr',
    es: 'ltr',
    pt: 'ltr',
    it: 'ltr',
    tr: 'ltr',
    ru: 'ltr',
    ur: 'rtl',
    id: 'ltr',
    ms: 'ltr',
    bn: 'ltr',
    hi: 'ltr',
    sw: 'ltr',
    ha: 'ltr',
    so: 'ltr',
    fa: 'rtl',
    nl: 'ltr',
    pl: 'ltr',
};

// RTL languages
export const rtlLocales: Locale[] = ['ar', 'ur', 'fa'];

export function isRTL(locale: Locale): boolean {
    return rtlLocales.includes(locale);
}
