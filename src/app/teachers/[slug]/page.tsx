import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedProfileBySlug } from '@/lib/data/teachers';
import ClientProfileView from './client-view';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for teacher profile page
 * SEO-optimized with unique title and description per teacher
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublishedProfileBySlug(slug);

  if (!profile) {
    return {
      title: 'معلم غير موجود | مصباح',
      description: 'الملف التعريفي للمعلم غير متاح',
    };
  }

  // Subject labels for title
  const subjectMap: Record<string, { ar: string; en: string }> = {
    'quran': { ar: 'القرآن الكريم', en: 'Quran' },
    'arabic': { ar: 'اللغة العربية', en: 'Arabic' },
    'islamic_studies': { ar: 'الدراسات الإسلامية', en: 'Islamic Studies' },
  };

  const primarySubject = profile.subjects[0];
  const subjectLabel = subjectMap[primarySubject] || { ar: 'تعليم إسلامي', en: 'Islamic Education' };

  // Unique title for each teacher
  const titleAr = `${profile.full_name.ar} — معلم ${subjectLabel.ar} أونلاين | مصباح`;
  const titleEn = `${profile.full_name.en} — ${subjectLabel.en} Teacher Online | Misbah`;

  // Description from bio (first 160 chars)
  const descriptionAr = profile.bio_text_ar
    ? `${profile.full_name.ar}: معلم ${subjectLabel.ar} من ${profile.country.ar}. ${profile.bio_text_ar.substring(0, 100)}...`
    : `معلم ${subjectLabel.ar} مستقل متخصص في التدريس أونلاين على منصة مصباح`;

  const descriptionEn = profile.bio_text_en
    ? `${profile.full_name.en}: ${subjectLabel.en} teacher from ${profile.country.en}. ${profile.bio_text_en.substring(0, 100)}...`
    : `Independent ${subjectLabel.en} teacher specialized in online teaching on Misbah platform`;

  return {
    title: titleAr,
    description: descriptionAr,
    alternates: {
      languages: {
        'ar': `/teachers/${slug}`,
        'en': `/teachers/${slug}`,
      },
    },
    openGraph: {
      title: titleEn,
      description: descriptionEn,
      type: 'profile',
      locale: 'ar_SA',
      alternateLocale: 'en_US',
      url: `https://misbah.site/teachers/${slug}`,
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
 * Teacher Profile Page
 * Includes JSON-LD structured data for SEO
 */
export default async function TeacherProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getPublishedProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  // Subject labels for JSON-LD
  const subjectLabels = profile.subjects.map(subject => {
    const map: Record<string, string> = {
      'quran': 'Quran',
      'arabic': 'Arabic Language',
      'islamic_studies': 'Islamic Studies',
    };
    return map[subject] || subject;
  });

  // JSON-LD: Person Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name.en || profile.full_name.ar,
    alternateName: profile.full_name.ar,
    jobTitle: `${subjectLabels[0]} Teacher`,
    description: profile.bio_text_en || profile.bio_text_ar,
    knowsAbout: subjectLabels,
    knowsLanguage: profile.languages.map(l => l.language),
    url: `https://misbah.site/teachers/${slug}`,
    // Add pricing if available
    ...(profile.pricing && {
      offers: {
        '@type': 'Offer',
        price: profile.pricing.amount,
        priceCurrency: profile.pricing.currency,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientProfileView profile={profile} />
    </>
  );
}
