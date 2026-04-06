'use client';

import { useI18n } from '@/lib/i18n';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
    const { labels } = useI18n();
    const { howItWorks } = labels.home;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>{howItWorks.title}</h2>

                <div className={styles.steps}>
                    {howItWorks.steps.map((step, i) => (
                        <div key={i} className={styles.step}>
                            <span className={styles.stepNumber}>{step.number}</span>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className={styles.note}>{howItWorks.note}</p>
            </div>
        </section>
    );
}
