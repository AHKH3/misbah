'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from './FinalCTA.module.css';

export function FinalCTA() {
    const { labels } = useI18n();
    const { finalCta } = labels.home;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>{finalCta.title}</h2>
                <div className={styles.actions}>
                    <Link href="/find">
                        <Button variant="primaryInverted">{finalCta.ctaStudents}</Button>
                    </Link>
                    <Link href="/onboarding">
                        <Button variant="ghostInverted">{finalCta.ctaTeachers}</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
