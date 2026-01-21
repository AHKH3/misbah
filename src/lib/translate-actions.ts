'use server';

import { createClient } from '@/lib/supabase/server';

interface TranslationResult {
    text: string;
    cached: boolean;
}

/**
 * Translate text with database caching
 * First request: Translate via API → Save to DB → Return
 * Subsequent requests: Load from DB instantly
 */
export async function translateWithCache(
    sourceText: string,
    sourceLang: 'ar' | 'en',
    targetLang: string
): Promise<TranslationResult> {
    // Skip if same language or target is source language
    if (sourceLang === targetLang) {
        return { text: sourceText, cached: true };
    }

    // Skip translation for Arabic/English content when target is ar/en
    if ((targetLang === 'ar' && sourceLang === 'ar') ||
        (targetLang === 'en' && sourceLang === 'en')) {
        return { text: sourceText, cached: true };
    }

    const supabase = await createClient();

    // 1. Check database cache first
    const { data: cached } = await supabase
        .from('translations')
        .select('translated_text')
        .eq('source_text', sourceText)
        .eq('source_lang', sourceLang)
        .eq('target_lang', targetLang)
        .single();

    if (cached?.translated_text) {
        return { text: cached.translated_text, cached: true };
    }

    // 2. Not cached - translate via API
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
        const response = await fetch(url);
        const data = await response.json();

        const translatedText = data[0]
            ?.map((item: [string]) => item[0])
            .join('') || sourceText;

        // 3. Save to database for future requests
        await supabase.from('translations').insert({
            source_text: sourceText,
            source_lang: sourceLang,
            target_lang: targetLang,
            translated_text: translatedText,
        });

        return { text: translatedText, cached: false };
    } catch (error) {
        console.error('Translation error:', error);
        return { text: sourceText, cached: false };
    }
}

/**
 * Batch translate multiple texts with caching
 */
export async function translateBatchWithCache(
    texts: { key: string; text: string; sourceLang: 'ar' | 'en' }[],
    targetLang: string
): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    // Process all translations in parallel
    const promises = texts.map(async (item) => {
        const result = await translateWithCache(item.text, item.sourceLang, targetLang);
        results[item.key] = result.text;
    });

    await Promise.all(promises);
    return results;
}

/**
 * Get cached translation or return original
 * This is a read-only version that doesn't trigger API calls
 */
export async function getCachedTranslation(
    sourceText: string,
    sourceLang: 'ar' | 'en',
    targetLang: string
): Promise<string | null> {
    if (sourceLang === targetLang) {
        return sourceText;
    }

    const supabase = await createClient();

    const { data } = await supabase
        .from('translations')
        .select('translated_text')
        .eq('source_text', sourceText)
        .eq('source_lang', sourceLang)
        .eq('target_lang', targetLang)
        .single();

    return data?.translated_text || null;
}
