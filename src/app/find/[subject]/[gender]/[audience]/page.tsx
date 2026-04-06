import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFilteredProfiles } from '@/lib/data/teachers';
import type { SubjectDB } from '@/lib/types/profile';
import TeacherGrid from '../../../components/TeacherGrid';

interface Props {
  params: Promise<{ subject: string; gender: string; audience: string }>;
}

const VALID_SUBJECTS: SubjectDB[] = ['quran', 'arabic', 'islamic_studies'];
const VALID_GENDERS = ['male', 'female'] as const;
const VALID_AUDIENCES = ['kids', 'adults'] as const;

const SUBJECT_LABELS: Record<SubjectDB, { ar: string; en: string }> = {
  quran: { ar: 'القرآن الكريم', en: 'Quran' },
  arabic: { ar: 'اللغة العربية', en: 'Arabic' },
  islamic_studies: { ar: 'الدراسات الإسلامية', en: 'Islamic Studies' },
};

const GENDER_LABELS: Record<'male' | 'female', { ar: string; en: string }> = {
  male: { ar: 'معلم', en: 'Male Teacher' },
  female: { ar: 'معلمة', en: 'Female Teacher' },
};

const AUDIENCE_LABELS: Record<'kids' | 'adults', { ar: string; en: string }> = {
  kids: { ar: 'للأطفال', en: 'for Kids' },
  adults: { ar: 'للكبار', en: 'for Adults' },
};

/**
 * Generate metadata for /find/[subject]/[gender]/[audience]
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, gender, audience } = await params;

  if (
    !VALID_SUBJECTS.includes(subject as SubjectDB) ||
    !VALID_GENDERS.includes(gender as 'male' | 'female') ||
    !VALID_AUDIENCES.includes(audience as 'kids' | 'adults')
  ) {
    return {
      title: 'صفحة غير موجودة | مصباح',
      description: 'الصفحة المطلوبة غير موجودة',
    };
  }

  const subjectKey = subject as SubjectDB;
  const genderKey = gender as 'male' | 'female';
  const audienceKey = audience as 'kids' | 'adults';
  const subjectLabel = SUBJECT_LABELS[subjectKey];
  const genderLabel = GENDER_LABELS[genderKey];
  const audienceLabel = AUDIENCE_LABELS[audienceKey];

  const titleAr = `${genderLabel.ar} ${subjectLabel.ar} ${audienceLabel.ar} أونلاين | مصباح`;
  const titleEn = `${subjectLabel.en} ${genderLabel.en} ${audienceLabel.en} Online | Misbah`;
  const descriptionAr = `${genderLabel.ar} متخصص في تدريس ${subjectLabel.ar} ${audienceLabel.ar}. مراجعة يدوية، معايير واضحة.`;
  const descriptionEn = `${genderLabel.en} specialized in teaching ${subjectLabel.en} ${audienceLabel.en}. Manual review, clear standards.`;

  return {
    title: titleAr,
    description: descriptionAr,
    alternates: {
      languages: {
        ar: `/find/${subject}/${gender}/${audience}`,
        en: `/find/${subject}/${gender}/${audience}`,
      },
    },
    openGraph: {
      title: titleEn,
      description: descriptionEn,
      type: 'website',
      locale: 'ar_SA',
      alternateLocale: 'en_US',
      url: `https://misbah.site/find/${subject}/${gender}/${audience}`,
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
 * /find/[subject]/[gender]/[audience] page - Filter by subject, gender, and audience
 */
export default async function FindBySubjectGenderAudiencePage({
  params,
}: Props) {
  const { subject, gender, audience } = await params;

  if (
    !VALID_SUBJECTS.includes(subject as SubjectDB) ||
    !VALID_GENDERS.includes(gender as 'male' | 'female') ||
    !VALID_AUDIENCES.includes(audience as 'kids' | 'adults')
  ) {
    notFound();
  }

  const subjectKey = subject as SubjectDB;
  const genderKey = gender as 'male' | 'female';
  const audienceKey = audience as 'kids' | 'adults';

  const profiles = await getFilteredProfiles({
    subject: subjectKey,
    gender: genderKey,
    audience: audienceKey,
  });

  const subjectLabel = SUBJECT_LABELS[subjectKey];
  const genderLabel = GENDER_LABELS[genderKey];
  const audienceLabel = AUDIENCE_LABELS[audienceKey];

  // JSON-LD: ItemList schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${subjectLabel.en} ${genderLabel.en}s ${audienceLabel.en}`,
    description: `${genderLabel.en}s teaching ${subjectLabel.en} ${audienceLabel.en}`,
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
        filter={{
          subject: subjectKey,
          gender: genderKey,
          audience: audienceKey,
        }}
      />
    </>
  );
}

/**
 * Generate static params for all combinations
 */
export async function generateStaticParams() {
  const params = [];
  for (const subject of VALID_SUBJECTS) {
    for (const gender of VALID_GENDERS) {
      for (const audience of VALID_AUDIENCES) {
        params.push({ subject, gender, audience });
      }
    }
  }
  return params;
}
