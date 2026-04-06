'use client';

import { useI18n } from '@/lib/i18n';
import styles from './contact.module.css';

export default function ContactPage() {
    const { labels } = useI18n();
    const t = labels.contactPage;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>{t.title}</h1>
                <p className={styles.subtitle}>{t.subtitle}</p>

                <div className={styles.emailBox}>
                    <p className={styles.emailLabel}>{t.emailLabel}</p>
                    <a href={`mailto:${t.email}`} className={styles.emailLink}>
                        {t.email}
                    </a>
                </div>

                <p className={styles.note}>{t.note}</p>
            </div>
        </main>
    );
}
