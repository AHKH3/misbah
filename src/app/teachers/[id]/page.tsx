'use client';

import { use, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Avatar, Badge, BadgeList } from '@/components/ui';
import { getPlaceholderProfile } from '@/lib/placeholder-data';
import { getPublishedProfile } from '@/lib/data/teachers';
import { useCachedTranslation } from '@/lib/hooks/useAutoTranslate';
import type { TranslationType } from '@/lib/i18n/loader';
import type { PublicProfile } from '@/lib/types/profile';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { labels, locale } = useI18n();

  // State for profile data
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch profile from database
  useEffect(() => {
    async function fetchProfile() {
      setIsLoadingProfile(true);
      try {
        const dbProfile = await getPublishedProfile(id);
        // Use DB profile if available, fallback to placeholder
        setProfile(dbProfile || getPlaceholderProfile(id));
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(getPlaceholderProfile(id));
      }
      setIsLoadingProfile(false);
    }
    fetchProfile();
  }, [id]);

  // Determine source language (Arabic for RTL languages, English for LTR)
  const isRTL = locale === 'ar' || locale === 'ur' || locale === 'fa';
  const sourceLang = isRTL ? 'ar' : 'en';

  // Get content in source language (with safe defaults when profile is null)
  const nameSource = profile ? (isRTL ? profile.full_name.ar : profile.full_name.en) : '';
  const countrySource = profile ? (isRTL ? profile.country.ar : profile.country.en) : '';
  const experienceSource = profile ? (isRTL ? profile.experience_text.ar : profile.experience_text.en) : '';

  // Prepare texts for cached translation - MUST be called unconditionally
  const textsToTranslate = useMemo(
    () => [
      { key: 'name', text: nameSource, sourceLang: sourceLang as 'ar' | 'en' },
      { key: 'country', text: countrySource, sourceLang: sourceLang as 'ar' | 'en' },
      { key: 'experience', text: experienceSource, sourceLang: sourceLang as 'ar' | 'en' },
    ],
    [nameSource, countrySource, experienceSource, sourceLang]
  );

  // Get cached translations (from DB or API) - MUST be called unconditionally
  const { translations, isLoading } = useCachedTranslation(textsToTranslate, locale);

  // Use translated content or fallback to source
  const name = translations.name || nameSource;
  const country = translations.country || countrySource;
  const experience = translations.experience || experienceSource;

  const t = labels.teacher; // Shortcut

  // Show not found if no profile after loading
  if (!isLoadingProfile && !profile) {
    notFound();
  }

  // Loading state - render AFTER all hooks
  if (isLoadingProfile || !profile) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}>جاري التحميل...</div>
        </div>
      </main>
    );
  }

  const videoId = profile.video_url ? getYouTubeId(profile.video_url) : null;
  const contact = profile.contact_method;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/directory" className={styles.backLink}>
          {t.backToDirectory}
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
                {getStatusLabel(profile.availability_status, t)}
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className={styles.quickInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{labels.directory.filters.subject}</span>
              <BadgeList>
                {profile.subjects.map((subject) => (
                  <Badge key={subject}>{getSubjectLabel(subject, t)}</Badge>
                ))}
              </BadgeList>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{t.audience}</span>
              <BadgeList>
                {profile.audience.map((aud) => (
                  <Badge key={aud}>{getAudienceLabel(aud, t)}</Badge>
                ))}
              </BadgeList>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>{t.teachingMethod}</span>
              <span className={styles.infoValue}>
                {getFormatLabel(profile.teaching_format, t)}
              </span>
            </div>
          </div>
        </div>

        {/* Experience */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.experience}</h2>
          <p className={styles.sectionContent}>
            {experience}
            {isLoading && <span className={styles.loading}> ...</span>}
          </p>
        </section>

        {/* Video */}
        {videoId && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.teachingSample}</h2>
            <div className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={t.teachingSample}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Contact Methods */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.contactMethods}</h2>
          <div className={styles.contactGrid}>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.contactLabel}>{t.whatsapp}</span>
                <span className={styles.contactValue}>{contact.whatsapp}</span>
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className={styles.contactItem}>
                <span className={styles.contactLabel}>{t.email}</span>
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
                <span className={styles.contactLabel}>{t.telegram}</span>
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
                <span className={styles.contactLabel}>{t.website}</span>
                <span className={styles.contactValue}>{t.visitWebsite}</span>
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

function getSubjectLabel(s: string, t: TranslationType['teacher']) {
  const map: Record<string, string> = {
    Quran: t.subjects.quran,
    Tajweed: t.subjects.tajweed,
    Arabic: t.subjects.arabic,
    'Islamic Studies': t.subjects.islamicStudies,
  };
  return map[s] || s;
}

function getAudienceLabel(a: string, t: TranslationType['teacher']) {
  const map: Record<string, string> = {
    Kids: t.audiences.kids,
    Adults: t.audiences.adults,
    'Females Only': t.audiences.femalesOnly,
    'Males Only': t.audiences.malesOnly,
    Everyone: t.audiences.everyone,
  };
  return map[a] || a;
}

function getFormatLabel(f: string, t: TranslationType['teacher']) {
  const map: Record<string, string> = {
    online: t.online,
    in_person: t.inPerson,
    hybrid: t.hybrid,
  };
  return map[f] || f;
}

function getStatusLabel(status: string, t: TranslationType['teacher']) {
  const map: Record<string, string> = {
    accepting: t.accepting,
    limited: t.limited,
    not_accepting: t.notAccepting,
  };
  return map[status] || status;
}
