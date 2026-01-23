'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import type { Locale } from './config';
import { locales, defaultLocale, localeDirections } from './config';
import { getTranslation } from './translations';
import type { TranslationType } from './translations';

interface I18nContextValue {
    locale: Locale;
    labels: TranslationType;
    setLocale: (locale: Locale) => void;
    dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getDeviceLocale(): Locale {
    if (typeof window === 'undefined') return defaultLocale;

    const browserLang = navigator.language.split('-')[0];
    if (locales.includes(browserLang as Locale)) {
        return browserLang as Locale;
    }
    return defaultLocale;
}

function getStoredLocale(): Locale | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem('misbah-locale');
    if (stored && locales.includes(stored as Locale)) {
        return stored as Locale;
    }
    return null;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = getStoredLocale();
        const initial = stored || getDeviceLocale();
        setLocaleState(initial);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.lang = locale;
            document.documentElement.dir = localeDirections[locale];
        }
    }, [locale, mounted]);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('misbah-locale', newLocale);
    }, []);

    // Get pre-generated translations instantly
    const labels = getTranslation(locale);

    const value: I18nContextValue = {
        locale,
        labels,
        setLocale,
        dir: localeDirections[locale],
    };

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}

// Legacy export for backward compatibility
export function useTranslations() {
    const { labels } = useI18n();
    return labels;
}
