'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Avatar, Badge, BadgeList } from '@/components/ui';
import { PLACEHOLDER_PROFILES } from '@/lib/placeholder-data';
import { getLocalizedText } from '@/lib/types/profile';
import type { Subject, TeachingFormat } from '@/lib/types/profile';
import styles from './page.module.css';

const SUBJECTS: Subject[] = ['Quran', 'Tajweed', 'Arabic', 'Islamic Studies'];
const FORMATS: TeachingFormat[] = ['online', 'in_person', 'hybrid'];

const ITEMS_PER_PAGE = 9;

export default function DirectoryPage() {
    const { labels, locale } = useI18n();

    // Filters
    const [subjectFilter, setSubjectFilter] = useState<Subject | ''>('');
    const [formatFilter, setFormatFilter] = useState<TeachingFormat | ''>('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Filter profiles
    let filteredProfiles = PLACEHOLDER_PROFILES;

    if (subjectFilter) {
        filteredProfiles = filteredProfiles.filter((p) =>
            p.subjects.includes(subjectFilter)
        );
    }

    if (formatFilter) {
        filteredProfiles = filteredProfiles.filter(
            (p) => p.teaching_format === formatFilter
        );
    }

    // Pagination
    const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProfiles = filteredProfiles.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    // Get subject/format labels from static translations
    const getSubjectLabel = (s: Subject) => {
        const map: Record<Subject, keyof typeof labels> = {
            Quran: 'quran',
            Tajweed: 'tajweed',
            Arabic: 'arabic',
            'Islamic Studies': 'islamicStudies',
        };
        const label = labels[map[s]];
        return typeof label === 'string' ? label : s;
    };

    const getFormatLabel = (f: TeachingFormat) => {
        const map: Record<TeachingFormat, keyof typeof labels> = {
            online: 'online',
            in_person: 'inPerson',
            hybrid: 'hybrid',
        };
        const label = labels[map[f]];
        return typeof label === 'string' ? label : f;
    };

    const getStatusLabel = (status: string) => {
        const map: Record<string, keyof typeof labels> = {
            accepting: 'accepting',
            limited: 'limited',
            not_accepting: 'notAccepting',
        };
        const label = labels[map[status]];
        return typeof label === 'string' ? label : status;
    };

    // Get localized name - use Arabic for RTL locales, English otherwise
    const isRTL = locale === 'ar' || locale === 'ur' || locale === 'fa';
    const lang = isRTL ? 'ar' : 'en';

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>{labels.directory}</h1>
                    <p className={styles.subtitle}>{labels.browseDesc}</p>
                </header>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="subject" className={styles.filterLabel}>
                            {labels.subject}
                        </label>
                        <select
                            id="subject"
                            value={subjectFilter}
                            onChange={(e) => {
                                setSubjectFilter(e.target.value as Subject | '');
                                handleFilterChange();
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="">{labels.all}</option>
                            {SUBJECTS.map((subject) => (
                                <option key={subject} value={subject}>
                                    {getSubjectLabel(subject)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="format" className={styles.filterLabel}>
                            {labels.format}
                        </label>
                        <select
                            id="format"
                            value={formatFilter}
                            onChange={(e) => {
                                setFormatFilter(e.target.value as TeachingFormat | '');
                                handleFilterChange();
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="">{labels.all}</option>
                            {FORMATS.map((format) => (
                                <option key={format} value={format}>
                                    {getFormatLabel(format)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.resultCount}>
                        {filteredProfiles.length} {labels.teachers}
                    </div>
                </div>

                {/* Teacher Grid */}
                {paginatedProfiles.length === 0 ? (
                    <div className={styles.emptyState}>{labels.noResults}</div>
                ) : (
                    <div className={styles.teacherGrid}>
                        {paginatedProfiles.map((profile) => (
                            <Link
                                key={profile.id}
                                href={`/teachers/${profile.id}`}
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
                                    <div className={styles.teacherStatus}>
                                        {getStatusLabel(profile.availability_status)}
                                    </div>
                                    <BadgeList className={styles.teacherBadges}>
                                        {profile.subjects.slice(0, 2).map((subject) => (
                                            <Badge key={subject}>{getSubjectLabel(subject)}</Badge>
                                        ))}
                                    </BadgeList>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={styles.pageButton}
                        >
                            {labels.previous}
                        </button>
                        <span className={styles.pageInfo}>
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={styles.pageButton}
                        >
                            {labels.next}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
