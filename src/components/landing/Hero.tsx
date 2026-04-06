'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from './Hero.module.css';

interface HeroProps {
    foundersRemaining: number;
}

export function Hero({ foundersRemaining }: HeroProps) {
    const { labels } = useI18n();
    const { hero } = labels.home;

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <span className={styles.badge}>{hero.badge}</span>
                <h1 className={styles.name}>{hero.name}</h1>
                <p className={styles.tagline}>{hero.title}</p>
                <p className={styles.subtitle}>{hero.subtitle}</p>

                {foundersRemaining > 0 ? (
                    <div className={styles.foundersBar}>
                        <span className={styles.foundersDot} />
                        <span>
                            {hero.foundersCounter.replace('{count}', String(foundersRemaining))}
                            {' — '}
                            {hero.foundersNote}
                        </span>
                    </div>
                ) : (
                    <div className={styles.foundersBar}>
                        <span>{hero.foundersFull}</span>
                    </div>
                )}

                <div className={styles.actions}>
                    <Link href="/find">
                        <Button variant="primary">{hero.ctaStudents}</Button>
                    </Link>
                    <Link href="/onboarding">
                        <Button variant="ghost">{hero.ctaTeachers}</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
