'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import styles from '../legal.module.css';

export default function TermsPage() {
    const { labels } = useI18n();
    const { terms } = labels.legal;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>{terms.title}</h1>
                    <p className={styles.lastUpdated}>{terms.lastUpdated}</p>
                </header>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>{terms.summaryTitle}</h2>
                    <p className={styles.highlightText}>
                        {terms.summaryText}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{terms.natureTitle}</h2>
                    <p className={styles.sectionText}>
                        {terms.natureText}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{terms.responsibilityTitle}</h2>
                    <ul className={styles.sectionList}>
                        <li>{terms.responsibilitySimple1}</li>
                        <li>{terms.responsibilitySimple2}</li>
                        <li>{terms.responsibilitySimple3}</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{terms.subscriptionTitle}</h2>
                    <p className={styles.sectionText}>
                        {terms.subscriptionText}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{terms.modificationTitle}</h2>
                    <p className={styles.sectionText}>
                        {terms.modificationText}
                    </p>
                </section>

                <section className={styles.contactSection}>
                    <p className={styles.sectionText}>
                        <a href="mailto:contact@misbah.site" className={styles.emailLink}>contact@misbah.site</a>
                    </p>
                    <p className={styles.sectionText} style={{ marginTop: '16px', fontSize: '0.875rem' }}>
                        <Link href="/disclaimer" style={{ textDecoration: 'underline' }}>{labels.footer.disclaimer}</Link> | <Link href="/privacy" style={{ textDecoration: 'underline' }}>{labels.footer.privacy}</Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
