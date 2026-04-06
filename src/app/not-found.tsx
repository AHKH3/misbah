'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from './status-page.module.css';

export default function NotFound() {
    const { labels } = useI18n();
    const t = labels.notFoundPage;

    return (
        <main className={styles.page}>
            <p className={styles.code}>{t.code}</p>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.description}>{t.description}</p>
            <div className={styles.actions}>
                <Link href="/">
                    <Button>{t.backHome}</Button>
                </Link>
            </div>
        </main>
    );
}
