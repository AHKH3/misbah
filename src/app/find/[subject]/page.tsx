import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFilteredProfiles } from '@/lib/data/teachers';
import type { SubjectDB } from '@/lib/types/profile';
import TeacherGrid from '../components/TeacherGrid';

interface Props {
  params: Promise<{ subject: string }>;
}

const VALID_SUBJECTS: SubjectDB[] = ['quran', 'arabic', 'islamic_studies'];

const SUBJECT_LABELS: Record<SubjectDB, { ar: string; en: string }> = {
  quran: { ar: 'القرآن الكريم', en: 'Quran' },
  arabic: { ar: 'اللغة العربية', en: 'Arabic' },
  islamic_studies: { ar: 'الدراسات الإسلامية', en: 'Islamic Studies' },
};

/**
 * Generate metadata for /find/[subject]
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;

  if (!VALID_SUBJECTS.includes(subject as SubjectDB)) {
    return {
      title: 'صفحة غير موجودة | مصباح',
      description: 'الصفحة المطلوبة غير موجودة',
    };
  }

  const subjectKey = subject as SubjectDB;
  const subjectLabel = SUBJECT_LABELS[subjectKey];

  const titleAr = `معلم ${subjectLabel.ar} أونلاين | مصباح`;
  const titleEn = `Online ${subjectLabel.en} Teacher | Misbah`;
  const descriptionAr = `ابحث عن معلم ${subjectLabel.ar} مراجع يدوياً. معايير جودة واضحة، تواصل مباشر بدون وسيط.`;
  const descriptionEn = `Find manually reviewed ${subjectLabel.en} teachers. Clear quality standards, direct contact without middleman.`;

  return {
    title: titleAr,
    description: descriptionAr,
    alternates: {
      languages: {
        ar: `/find/${subject}`,
        en: `/find/${subject}`,
      },
    },
    openGraph: {
      title: titleEn,
      description: descriptionEn,
      type: 'website',
      locale: 'ar_SA',
      alternateLocale: 'en_US',
      url: `https://misbah.site/find/${subject}`,
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
 * /find/[subject] page - Filter by subject
 */
export default async function FindBySubjectPage({ params }: Props) {
  const { subject } = await params;

  if (!VALID_SUBJECTS.includes(subject as SubjectDB)) {
    notFound();
  }

  const subjectKey = subject as SubjectDB;
  const profiles = await getFilteredProfiles({ subject: subjectKey });
  const subjectLabel = SUBJECT_LABELS[subjectKey];

  // JSON-LD: ItemList schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${subjectLabel.en} Teachers Directory`,
    description: `Professional ${subjectLabel.en} teachers for online teaching`,
    numberOfItems: profiles.length,
    itemListElement: profiles.map((profile, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: profile.full_name.en || profile.full_name.ar,
        jobTitle: `${subjectLabel.en} Teacher`,
        url: `https://misbah.site/teachers/${profile.id}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TeacherGrid
        profiles={profiles}
        filter={{ subject: subjectKey }}
      />
    </>
  );
}

/**
 * Generate static params for known subjects
 */
export async function generateStaticParams() {
  return VALID_SUBJECTS.map((subject) => ({
    subject,
  }));
}
