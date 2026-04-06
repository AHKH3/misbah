'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Avatar, Badge, BadgeList } from '@/components/ui';
import { useCachedTranslation } from '@/lib/hooks/useAutoTranslate';
import { PROFICIENCY_LABELS } from '@/app/onboarding/stores/wizard-store';
import type { TranslationType } from '@/lib/i18n/loader';
import type { PublicProfile } from '@/lib/types/profile';
import { ReportForm } from '@/components/report/ReportForm';
import { Icons } from '@/components/ui';
import styles from './page.module.css';

interface ClientProfileViewProps {
    profile: PublicProfile;
}

// Track contact click (anonymous)
async function trackContactClick(profileId: string, contactType: 'whatsapp' | 'telegram' | 'email' | 'website') {
    try {
        await fetch('/api/track-contact-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileId, contactType }),
        });
    } catch (error) {
        console.error('Failed to track click:', error);
        // Fail silently - don't block user interaction
    }
}

export default function ClientProfileView({ profile }: ClientProfileViewProps) {
    const { labels, locale } = useI18n();

    // Determine source language (Arabic for RTL languages, English for LTR)
    const isRTL = locale === 'ar';
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

    // Get cached translations
    const { translations, isLoading } = useCachedTranslation(textsToTranslate, locale);

    // Use translated content or fallback to source
    const name = translations.name || nameSource;
    const country = translations.country || countrySource;
    const experience = translations.experience || experienceSource;

    const t = labels.teacher;

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
                        {profile.languages && profile.languages.length > 0 && (
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{labels.onboarding.labels.languages}</span>
                                <BadgeList>
                                    {profile.languages.map((lang) => (
                                        <Badge key={lang.id}>
                                            {lang.language} ({PROFICIENCY_LABELS[lang.proficiency]})
                                        </Badge>
                                    ))}
                                </BadgeList>
                            </div>
                        )}
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>{t.teachingMethod}</span>
                            <span className={styles.infoValue}>
                                {getFormatLabel(profile.teaching_format, t)}
                            </span>
                        </div>
                        {profile.pricing && profile.pricing.amount && (
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t.pricing}</span>
                                <span className={styles.infoValue}>
                                    {profile.pricing.amount} {profile.pricing.currency}
                                </span>
                            </div>
                        )}
                        {profile.target_students && (
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>{t.targetAge}</span>
                                <span className={styles.infoValue}>
                                    {profile.target_students.ageMin && profile.target_students.ageMax
                                        ? `${profile.target_students.ageMin} - ${profile.target_students.ageMax} ${labels.common.years}`
                                        : profile.target_students.ageMin
                                        ? `${profile.target_students.ageMin}+ ${labels.common.years}`
                                        : t.allAges}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Education & Experience Timeline */}
                {(profile.education.length > 0 || profile.experiences.length > 0) && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t.educationAndExperience}</h2>

                        {/* Education */}
                        {profile.education.length > 0 && (
                            <div className={styles.timelineBlock}>
                                <h3 className={styles.timelineHeading}>{t.education}</h3>
                                <div className={styles.timeline}>
                                    {profile.education.map((edu) => (
                                        <div key={edu.id} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineHeader}>
                                                    <span className={styles.timelineTitle}>
                                                        {edu.specialization}
                                                    </span>
                                                    <span className={styles.timelineDate}>
                                                        {edu.startYear} - {edu.endYear || labels.common.present}
                                                    </span>
                                                </div>
                                                <div className={styles.timelineInstitution}>
                                                    {edu.institution}
                                                </div>
                                                {edu.notes && (
                                                    <div className={styles.timelineNotes}>
                                                        {edu.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experience */}
                        {profile.experiences.length > 0 && (
                            <div className={styles.timelineBlock}>
                                <h3 className={styles.timelineHeading}>{t.teachingExperience}</h3>
                                <div className={styles.timeline}>
                                    {profile.experiences.map((exp) => (
                                        <div key={exp.id} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineHeader}>
                                                    <span className={styles.timelineTitle}>
                                                        {exp.role}
                                                    </span>
                                                    <span className={styles.timelineDate}>
                                                        {exp.startYear} - {exp.endYear || labels.common.present}
                                                    </span>
                                                </div>
                                                <div className={styles.timelineInstitution}>
                                                    {exp.organization}
                                                </div>
                                                {exp.description && (
                                                    <div className={styles.timelineNotes}>
                                                        {exp.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Experience Summary (fallback) */}
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

                {/* Student Warning Notice */}
                <div className={styles.studentNotice}>
                    <h3 className={styles.noticeTitle}>⚠️ تنبيه مهم للطلاب</h3>
                    <p className={styles.noticeText}>
                        المعلم المعروض في هذه الصفحة هو من سيقوم بتدريسك شخصياً.
                        إذا طلب منك التواصل مع معلم آخر أو أحالك لأكاديمية،{' '}
                        <strong>يُرجى الإبلاغ فوراً</strong> عبر نموذج الإبلاغ أسفل الصفحة.
                    </p>
                    <p className={styles.noticeFooter}>
                        مصباح للمعلمين المستقلين فقط.
                    </p>
                </div>

                {/* Contact Methods - Direct Display with Tracking */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t.contactMethods}</h2>

                    <div className={styles.contactGrid}>
                        {contact.whatsapp && (
                            <a
                                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contactItem}
                                onClick={() => trackContactClick(profile.id, 'whatsapp')}
                            >
                                <span className={styles.contactIcon} style={{ color: 'var(--icon-green)' }}><Icons.WhatsApp size={20} /></span>
                                <div className={styles.contactDetails}>
                                    <span className={styles.contactLabel}>{t.whatsapp}</span>
                                    <span className={styles.contactValue}>{contact.whatsapp}</span>
                                </div>
                            </a>
                        )}
                        {contact.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className={styles.contactItem}
                                onClick={() => trackContactClick(profile.id, 'email')}
                            >
                                <span className={styles.contactIcon} style={{ color: 'var(--icon-blue)' }}><Icons.Email size={20} /></span>
                                <div className={styles.contactDetails}>
                                    <span className={styles.contactLabel}>{t.email}</span>
                                    <span className={styles.contactValue}>{contact.email}</span>
                                </div>
                            </a>
                        )}
                        {contact.telegram && (
                            <a
                                href={`https://t.me/${contact.telegram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contactItem}
                                onClick={() => trackContactClick(profile.id, 'telegram')}
                            >
                                <span className={styles.contactIcon} style={{ color: 'var(--icon-blue)' }}><Icons.Telegram size={20} /></span>
                                <div className={styles.contactDetails}>
                                    <span className={styles.contactLabel}>{t.telegram}</span>
                                    <span className={styles.contactValue}>{contact.telegram}</span>
                                </div>
                            </a>
                        )}
                        {contact.website && (
                            <a
                                href={contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contactItem}
                                onClick={() => trackContactClick(profile.id, 'website')}
                            >
                                <span className={styles.contactIcon} style={{ color: 'var(--icon-teal)' }}><Icons.Website size={20} /></span>
                                <div className={styles.contactDetails}>
                                    <span className={styles.contactLabel}>{t.website}</span>
                                    <span className={styles.contactValue}>{t.visitWebsite}</span>
                                </div>
                            </a>
                        )}
                    </div>
                </section>

                {/* Report Section */}
                <section id="report" className={styles.section}>
                    <ReportForm profileId={profile.id} teacherName={nameSource} />
                </section>

                {/* Disclaimer */}
                <div className={styles.disclaimer}>
                    <p className={styles.disclaimerText}>{labels.home.disclaimer}</p>
                </div>
            </div>
        </main>
    );
}

// Helpers
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
