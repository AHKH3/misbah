'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import styles from '../legal.module.css';

export default function DisclaimerPage() {
    const { labels } = useI18n();
    const { disclaimer } = labels.legal;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>{disclaimer.title}</h1>
                    <p className={styles.lastUpdated}>{disclaimer.lastUpdated}</p>
                </header>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>{disclaimer.highlightTitle}</h2>
                    <p className={styles.highlightText}>
                        {disclaimer.highlightText}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{disclaimer.scopeTitle}</h2>
                    <ul className={styles.sectionList}>
                        <li><strong>{disclaimer.scopeComm}</strong></li>
                        <li><strong>{disclaimer.scopeInfo}</strong></li>
                        <li><strong>{disclaimer.scopeEdu}</strong></li>
                        <li><strong>{disclaimer.scopeMoney}</strong></li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{disclaimer.reviewTitle}</h2>
                    <p className={styles.sectionText}>
                        {disclaimer.reviewText}
                    </p>
                </section>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>{disclaimer.agreementTitle}</h2>
                    <p className={styles.highlightText}>
                        {disclaimer.agreementText}
                    </p>
                </section>

                <section className={styles.contactSection}>
                    <p className={styles.sectionText}>
                        {disclaimer.contactText} <a href="mailto:contact@misbah.site" className={styles.emailLink}>contact@misbah.site</a>
                    </p>
                    <p className={styles.sectionText} style={{ marginTop: '16px', fontSize: '0.875rem' }}>
                        <Link href="/terms" style={{ textDecoration: 'underline' }}>{labels.footer.terms}</Link> | <Link href="/privacy" style={{ textDecoration: 'underline' }}>{labels.footer.privacy}</Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
