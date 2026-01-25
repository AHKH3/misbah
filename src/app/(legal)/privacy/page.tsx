'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import styles from '../legal.module.css';

export default function PrivacyPage() {
    const { labels } = useI18n();
    const { privacy } = labels.legal;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>{privacy.title}</h1>
                    <p className={styles.lastUpdated}>{privacy.lastUpdated}</p>
                </header>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>{privacy.summaryTitle}</h2>
                    <p className={styles.highlightText}>
                        {privacy.summaryText}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{privacy.dataCollectionTitle}</h2>
                    <ul className={styles.sectionList}>
                        <li><strong>{privacy.dataCollectionTeachers}</strong></li>
                        <li><strong>{privacy.dataCollectionVisitors}</strong></li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{privacy.usageTitle}</h2>
                    <p className={styles.sectionText}>
                        {privacy.usageText}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{privacy.rightsTitle}</h2>
                    <p className={styles.sectionText}>
                        {privacy.rightsText}
                    </p>
                </section>

                <section className={styles.contactSection}>
                    <p className={styles.sectionText}>
                        {privacy.contactText} <a href="mailto:contact@misbah.site" className={styles.emailLink}>contact@misbah.site</a>
                    </p>
                    <p className={styles.sectionText} style={{ marginTop: '16px', fontSize: '0.875rem' }}>
                        <Link href="/terms" style={{ textDecoration: 'underline' }}>{labels.footer.terms}</Link> | <Link href="/disclaimer" style={{ textDecoration: 'underline' }}>{labels.footer.disclaimer}</Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
