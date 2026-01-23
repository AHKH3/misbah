'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Avatar, Badge, BadgeList } from '@/components/ui';
import { getPlaceholderProfile } from '@/lib/placeholder-data';
import { useCachedTranslation } from '@/lib/hooks/useAutoTranslate';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const profile = getPlaceholderProfile(id);
  const { labels, locale } = useI18n();

  if (!profile) {
    notFound();
  }

  // Determine source language (Arabic for RTL languages, English for LTR)
  const isRTL = locale === 'ar' || locale === 'ur' || locale === 'fa';
  const sourceLang = isRTL ? 'ar' : 'en';

  // Get content in source language
  const nameSource = isRTL ? profile.full_name.ar : profile.full_name.en;
  const countrySource = isRTL ? profile.country.ar : profile.country.en;
  const experienceSource = isRTL ? profile.experience_text.ar : profile.experience_text.en;

  // Prepare texts for cached translation
  const textsToTranslate = useMemo(
    () => [
      { key: 'name', text: nameSource, sourceLang: sourceLang as 'ar' | 'en' },
      { key: 'country', text: countrySource, sourceLang: sourceLang as 'ar' | 'en' },
      { key: 'experience', text: experienceSource, sourceLang: sourceLang as 'ar' | 'en' },
    ],
    [nameSource, countrySource, experienceSource, sourceLang]
  );

  // Get cached translations (from DB or API)
  const { translations, isLoading } = useCachedTranslation(textsToTranslate, locale);

  // Use translated content or fallback to source
  const name = translations.name || nameSource;
  const country = translations.country || countrySource;
  const experience = translations.experience || experienceSource;

  const videoId = profile.video_url ? getYouTubeId(profile.video_url) : null;
  const contact = profile.contact_method;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/directory" className={styles.backLink}>
          {labels.backToDirectory}
        </Link>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <Avatar alt={name} size="large" />
            <div className={styles.profileHeaderInfo}>
              <h1 className={styles.name}>
                {name}
                {isLoading && <span className={styles.loading}>...</span>}
              </h1>
              <p className={styles.country}>{country}</p>
              <div className={styles.availability}>
                {getStatusLabel(profile.availability_status, labels)}
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className={styles.quickInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{labels.subject}</span>
              <BadgeList>
                {profile.subjects.map((subject) => (
                  <Badge key={subject}>{getSubjectLabel(subject, labels)}</Badge>
                ))}
              </BadgeList>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{labels.audience}</span>
              <BadgeList>
                {profile.audience.map((aud) => (
                  <Badge key={aud}>{getAudienceLabel(aud, labels)}</Badge>
                ))}
              </BadgeList>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{labels.teachingMethod}</span>
              <span className={styles.infoValue}>
                {getFormatLabel(profile.teaching_format, labels)}
              </span>
            </div>
          </div>
        </div>

        {/* Experience */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{labels.experience}</h2>
          <p className={styles.sectionContent}>
            {experience}
            {isLoading && <span className={styles.loading}> ...</span>}
          </p>
        </section>

        {/* Video */}
        {videoId && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{labels.teachingSample}</h2>
            <div className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={labels.teachingSample}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Contact Methods */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{labels.contactMethods}</h2>
          <div className={styles.contactGrid}>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.contactLabel}>{labels.whatsapp}</span>
                <span className={styles.contactValue}>{contact.whatsapp}</span>
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className={styles.contactItem}>
                <span className={styles.contactLabel}>{labels.email}</span>
                <span className={styles.contactValue}>{contact.email}</span>
              </a>
            )}
            {contact.telegram && (
              <a
                href={`https://t.me/${contact.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.contactLabel}>{labels.telegram}</span>
                <span className={styles.contactValue}>{contact.telegram}</span>
              </a>
            )}
            {contact.website && (
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.contactLabel}>{labels.website}</span>
                <span className={styles.contactValue}>{labels.visitWebsite}</span>
              </a>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>{labels.home.disclaimer}</p>
        </div>
      </div>
    </main>
  );
}

// Helper functions
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getSubjectLabel(s: string, labels: typeof import('@/lib/i18n/translations').translations.en) {
  const map: Record<string, string> = {
    Quran: labels.quran,
    Tajweed: labels.tajweed,
    Arabic: labels.arabic,
    'Islamic Studies': labels.islamicStudies,
  };
  return map[s] || s;
}

function getAudienceLabel(a: string, labels: typeof import('@/lib/i18n/translations').translations.en) {
  const map: Record<string, string> = {
    Kids: labels.kids,
    Adults: labels.adults,
    'Females Only': labels.femalesOnly,
    'Males Only': labels.malesOnly,
    Everyone: labels.everyone,
  };
  return map[a] || a;
}

function getFormatLabel(f: string, labels: typeof import('@/lib/i18n/translations').translations.en) {
  const map: Record<string, string> = {
    online: labels.online,
    in_person: labels.inPerson,
    hybrid: labels.hybrid,
  };
  return map[f] || f;
}

function getStatusLabel(status: string, labels: typeof import('@/lib/i18n/translations').translations.en) {
  const map: Record<string, string> = {
    accepting: labels.accepting,
    limited: labels.limited,
    not_accepting: labels.notAccepting,
  };
  return map[status] || status;
}
