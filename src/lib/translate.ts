// Auto-Translation Service
// Uses server-side translation API (Google Translate or similar)

import type { Locale } from '@/lib/i18n/config';

// Cache translations to avoid repeated API calls
const translationCache = new Map<string, string>();

function getCacheKey(text: string, from: Locale, to: Locale): string {
    return `${from}:${to}:${text}`;
}

// Server-side translation function
export async function translateText(
    text: string,
    fromLocale: Locale,
    toLocale: Locale
): Promise<string> {
    // Same language, no translation needed
    if (fromLocale === toLocale) return text;

    // Check cache
    const cacheKey = getCacheKey(text, fromLocale, toLocale);
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
    }

    try {
        // Use Google Translate API (free tier via unofficial endpoint)
        // Note: For production, use official Google Cloud Translation API
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLocale}&tl=${toLocale}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        const data = await response.json();

        // Extract translated text from response
        const translatedText = data[0]
            ?.map((item: [string]) => item[0])
            .join('') || text;

        // Cache result
        translationCache.set(cacheKey, translatedText);

        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Fallback to original
    }
}

// Batch translate multiple texts
export async function translateBatch(
    texts: string[],
    fromLocale: Locale,
    toLocale: Locale
): Promise<string[]> {
    return Promise.all(
        texts.map((text) => translateText(text, fromLocale, toLocale))
    );
}

// Translate an object's string values
export async function translateObject<T extends Record<string, unknown>>(
    obj: T,
    fromLocale: Locale,
    toLocale: Locale,
    keys: (keyof T)[]
): Promise<T> {
    const result = { ...obj };

    for (const key of keys) {
        const value = obj[key];
        if (typeof value === 'string') {
            (result as Record<string, unknown>)[key as string] = await translateText(
                value,
                fromLocale,
                toLocale
            );
        }
    }

    return result;
}
