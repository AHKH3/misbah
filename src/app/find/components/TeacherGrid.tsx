'use client';

import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Avatar, Badge, BadgeList } from '@/components/ui';
import { getLocalizedText, toDisplaySubject } from '@/lib/types/profile';
import type { PublicProfile, SubjectDB } from '@/lib/types/profile';
import styles from '../find.module.css';

interface TeacherGridProps {
  profiles: PublicProfile[];
  filter?: {
    subject?: SubjectDB;
    gender?: 'male' | 'female';
    audience?: 'kids' | 'adults';
  };
}

export default function TeacherGrid({ profiles, filter }: TeacherGridProps) {
  const { labels, locale } = useI18n();
  const { find, teacher } = labels;

  // Determine language for display
  const isRTL = locale === 'ar';
  const lang = isRTL ? 'ar' : 'en';

  // Helper to get subject label
  const getSubjectLabel = useCallback((subject: string) => {
    const map: Record<string, keyof typeof teacher.subjects> = {
      Quran: 'quran',
      Tajweed: 'tajweed',
      Arabic: 'arabic',
      'Islamic Studies': 'islamicStudies',
    };
    const key = map[subject];
    return key ? teacher.subjects[key] : subject;
  }, [teacher]);

  // Build breadcrumbs based on filter
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: find.title, href: '/find' }];
    if (filter?.subject) {
      const subjectDisplay = toDisplaySubject(filter.subject);
      const subjectLabel = getSubjectLabel(subjectDisplay);
      crumbs.push({
        label: subjectLabel,
        href: `/find/${filter.subject}`,
      });
    }
    if (filter?.gender) {
      crumbs.push({
        label: find.filters[filter.gender],
        href: `/find/${filter.subject}/${filter.gender}`,
      });
    }
    if (filter?.audience) {
      crumbs.push({
        label: find.filters[filter.audience],
        href: `/find/${filter.subject}/${filter.gender}/${filter.audience}`,
      });
    }
    return crumbs;
  }, [filter, find, getSubjectLabel]);

  // Helper to get status label
  function getStatusLabel(status: string) {
    const map: Record<string, keyof typeof teacher> = {
      accepting: 'accepting',
      limited: 'limited',
      not_accepting: 'notAccepting',
    };
    const label = teacher[map[status]];
    return typeof label === 'string' ? label : status;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <nav className={styles.breadcrumbs} aria-label="breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href}>
                {index > 0 && (
                  <span className={styles.breadcrumbSeparator}> / </span>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span>{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>{find.title}</h1>
          <p className={styles.subtitle}>{find.subtitle}</p>
        </header>

        {/* Results Info */}
        <div className={styles.resultsInfo}>
          <div className={styles.resultCount}>
            {find.results.showing.replace('{count}', profiles.length.toString())}
          </div>
        </div>

        {/* Teacher Grid */}
        {profiles.length === 0 ? (
          <div className={styles.emptyState}>{find.results.noResults}</div>
        ) : (
          <div className={styles.teacherGrid}>
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/teachers/${profile.slug || profile.id}`}
                className={styles.teacherCard}
              >
                <Avatar
                  alt={getLocalizedText(profile.full_name, lang)}
                  size="medium"
                />
                <div className={styles.teacherInfo}>
                  <h2 className={styles.teacherName}>
                    {getLocalizedText(profile.full_name, lang)}
                  </h2>
                  <p className={styles.teacherCountry}>
                    {getLocalizedText(profile.country, lang)}
                  </p>
                  <div
                    className={`${styles.teacherStatus} ${
                      profile.availability_status === 'accepting'
                        ? styles.accepting
                        : ''
                    }`}
                  >
                    {getStatusLabel(profile.availability_status)}
                  </div>
                  <BadgeList className={styles.teacherBadges}>
                    {profile.subjects.slice(0, 2).map((subject) => (
                      <Badge key={subject}>
                        {getSubjectLabel(toDisplaySubject(subject))}
                      </Badge>
                    ))}
                  </BadgeList>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
