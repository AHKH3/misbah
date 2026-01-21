'use client';

import { useState, useEffect, useMemo } from 'react';
import { translateBatchWithCache } from '@/lib/translate-actions';

/**
 * Hook for translating dynamic content with database caching
 * First request triggers API + DB save, subsequent requests load from DB
 */
export function useCachedTranslation(
    texts: { key: string; text: string; sourceLang: 'ar' | 'en' }[],
    targetLang: string
): { translations: Record<string, string>; isLoading: boolean } {
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Memoize the texts array key to avoid infinite loops
    const textsKey = useMemo(
        () => texts.map((t) => `${t.key}:${t.text.slice(0, 20)}`).join('|'),
        [texts]
    );

    useEffect(() => {
        // If target is same as source for all, use originals
        const allSameLanguage = texts.every(
            (t) => t.sourceLang === targetLang ||
                (targetLang === 'ar' && t.sourceLang === 'ar') ||
                (targetLang === 'en' && t.sourceLang === 'en')
        );

        if (allSameLanguage) {
            const result: Record<string, string> = {};
            texts.forEach((t) => {
                result[t.key] = t.text;
            });
            setTranslations(result);
            return;
        }

        // Fetch translations (from DB cache or API)
        const fetchTranslations = async () => {
            setIsLoading(true);
            try {
                const result = await translateBatchWithCache(texts, targetLang);
                setTranslations(result);
            } catch (error) {
                console.error('Translation error:', error);
                // Fallback to original texts
                const fallback: Record<string, string> = {};
                texts.forEach((t) => {
                    fallback[t.key] = t.text;
                });
                setTranslations(fallback);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTranslations();
    }, [textsKey, targetLang]);

    return { translations, isLoading };
}
