import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFilteredProfiles } from '@/lib/data/teachers';
import type { SubjectDB } from '@/lib/types/profile';
import TeacherGrid from '../../components/TeacherGrid';

interface Props {
  params: Promise<{ subject: string; gender: string }>;
}

const VALID_SUBJECTS: SubjectDB[] = ['quran', 'arabic', 'islamic_studies'];
const VALID_GENDERS = ['male', 'female'] as const;

const SUBJECT_LABELS: Record<SubjectDB, { ar: string; en: string }> = {
  quran: { ar: 'القرآن الكريم', en: 'Quran' },
  arabic: { ar: 'اللغة العربية', en: 'Arabic' },
  islamic_studies: { ar: 'الدراسات الإسلامية', en: 'Islamic Studies' },
};

const GENDER_LABELS: Record<'male' | 'female', { ar: string; en: string }> = {
  male: { ar: 'معلم', en: 'Male Teacher' },
  female: { ar: 'معلمة', en: 'Female Teacher' },
};

/**
 * Generate metadata for /find/[subject]/[gender]
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, gender } = await params;

  if (
    !VALID_SUBJECTS.includes(subject as SubjectDB) ||
    !VALID_GENDERS.includes(gender as 'male' | 'female')
  ) {
    return {
      title: 'صفحة غير موجودة | مصباح',
      description: 'الصفحة المطلوبة غير موجودة',
    };
  }

  const subjectKey = subject as SubjectDB;
  const genderKey = gender as 'male' | 'female';
  const subjectLabel = SUBJECT_LABELS[subjectKey];
  const genderLabel = GENDER_LABELS[genderKey];

  const titleAr = `${genderLabel.ar} ${subjectLabel.ar} أونلاين | مصباح`;
  const titleEn = `${subjectLabel.en} ${genderLabel.en} Online | Misbah`;
  const descriptionAr = `${genderLabel.ar} متخصص في ${subjectLabel.ar}. مراجعة يدوية، معايير واضحة، تواصل مباشر.`;
  const descriptionEn = `${genderLabel.en} specialized in ${subjectLabel.en}. Manual review, clear standards, direct contact.`;

  return {
    title: titleAr,
    description: descriptionAr,
    alternates: {
      languages: {
        ar: `/find/${subject}/${gender}`,
        en: `/find/${subject}/${gender}`,
      },
    },
    openGraph: {
      title: titleEn,
      description: descriptionEn,
      type: 'website',
      locale: 'ar_SA',
      alternateLocale: 'en_US',
      url: `https://misbah.site/find/${subject}/${gender}`,
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
 * /find/[subject]/[gender] page - Filter by subject and gender
 */
export default async function FindBySubjectGenderPage({ params }: Props) {
  const { subject, gender } = await params;

  if (
    !VALID_SUBJECTS.includes(subject as SubjectDB) ||
    !VALID_GENDERS.includes(gender as 'male' | 'female')
  ) {
    notFound();
  }

  const subjectKey = subject as SubjectDB;
  const genderKey = gender as 'male' | 'female';
  const profiles = await getFilteredProfiles({
    subject: subjectKey,
    gender: genderKey,
  });

  const subjectLabel = SUBJECT_LABELS[subjectKey];
  const genderLabel = GENDER_LABELS[genderKey];

  // JSON-LD: ItemList schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${subjectLabel.en} ${genderLabel.en}s Directory`,
    description: `${genderLabel.en}s specialized in ${subjectLabel.en} teaching`,
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
        filter={{ subject: subjectKey, gender: genderKey }}
      />
    </>
  );
}

/**
 * Generate static params for all subject/gender combinations
 */
export async function generateStaticParams() {
  const params = [];
  for (const subject of VALID_SUBJECTS) {
    for (const gender of VALID_GENDERS) {
      params.push({ subject, gender });
    }
  }
  return params;
}
