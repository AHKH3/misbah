'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from './status-page.module.css';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { labels } = useI18n();
    const t = labels.errorPage;

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className={styles.page}>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.description}>{t.description}</p>
            <div className={styles.actions}>
                <Button variant="ghost" onClick={() => reset()}>
                    {t.retry}
                </Button>
            </div>
        </main>
    );
}
