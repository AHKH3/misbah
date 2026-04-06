import type { Metadata } from 'next';
import { getFilteredProfiles } from '@/lib/data/teachers';
import TeacherGrid from './components/TeacherGrid';

/**
 * Generate metadata for /find page (all teachers)
 */
export async function generateMetadata(): Promise<Metadata> {
  const titleAr = 'ابحث عن معلم قرآن وعربية أونلاين | مصباح';
  const titleEn = 'Find Quran & Arabic Teacher Online | Misbah';
  const descriptionAr =
    'دليل شامل لمعلمي القرآن والعربية والدراسات الإسلامية المستقلين. مراجعة يدوية لكل معلم، معايير واضحة، تواصل مباشر.';
  const descriptionEn =
    'Professional directory for independent Quran, Arabic, and Islamic Studies teachers. Manual review for every teacher, clear standards, direct contact.';

  return {
    title: titleAr,
    description: descriptionAr,
    alternates: {
      languages: {
        ar: '/find',
        en: '/find',
      },
    },
    openGraph: {
      title: titleEn,
      description: descriptionEn,
      type: 'website',
      locale: 'ar_SA',
      alternateLocale: 'en_US',
      url: 'https://misbah.site/find',
      siteName: 'Misbah | مصباح',
    },
    twitter: {
      card: 'summary',
      title: titleEn,
      description: descriptionEn,
    },
  };
}

/**
 * /find page - All teachers
 */
export default async function FindPage() {
  const profiles = await getFilteredProfiles();

  // JSON-LD: ItemList schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Quran and Arabic Teachers Directory',
    description:
      'Professional directory of independent Quran, Arabic, and Islamic Studies teachers',
    numberOfItems: profiles.length,
    itemListElement: profiles.map((profile, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: profile.full_name.en || profile.full_name.ar,
        jobTitle: `${profile.subjects.join(', ')} Teacher`,
        url: `https://misbah.site/teachers/${profile.slug || profile.id}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TeacherGrid profiles={profiles} />
    </>
  );
}
