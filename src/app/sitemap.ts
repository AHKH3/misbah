
import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const { data: profiles } = await supabase
        .from('profiles')
        .select('slug, updated_at')
        .eq('status', 'published');

    const teacherUrls = (profiles || []).map(p => ({
        url: `https://misbah.site/teachers/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        { url: 'https://misbah.site', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: 'https://misbah.site/directory', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        // About is missing? Or is it covered by landing? 
        { url: 'https://misbah.site/for-teachers', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: 'https://misbah.site/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        ...teacherUrls,
    ];
}
