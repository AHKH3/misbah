'use client';

import { useI18n } from '@/lib/i18n';
import styles from './page.module.css';

export default function AboutPage() {
    const { labels } = useI18n();
    const { about } = labels;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>{about.pageTitle}</h1>
                </header>

                {/* Section 1: What is Misbah */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{about.whatIs.title}</h2>
                    <p className={styles.sectionText}>{about.whatIs.description}</p>
                    <p className={styles.sectionSubText}>{about.whatIs.subDescription}</p>
                </section>

                {/* Section 2: Why it was created */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{about.why.title}</h2>
                    <p className={styles.sectionText}>{about.why.description}</p>
                    <p className={styles.sectionSubText}>{about.why.subDescription}</p>
                </section>

                {/* Section 3: How it works */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{about.how.title}</h2>
                    <ol className={styles.stepsList}>
                        {about.how.steps.map((step: string, i: number) => (
                            <li key={i} className={styles.stepItem}>{step}</li>
                        ))}
                    </ol>
                </section>

                {/* Section 4: Nature (highlighted box) */}
                <section className={styles.natureBox}>
                    <h2 className={styles.sectionTitle}>{about.nature.title}</h2>
                    <p className={styles.natureIntro}>{about.nature.intro}</p>
                    <ul className={styles.natureList}>
                        {about.nature.points.map((point: string, i: number) => (
                            <li key={i} className={styles.natureItem}>{point}</li>
                        ))}
                    </ul>
                    <p className={styles.natureConclusion}>{about.nature.conclusion}</p>
                </section>

                {/* Section 5: Review */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{about.review.title}</h2>
                    <p className={styles.sectionText}>{about.review.description}</p>
                </section>

                {/* Section 6: Limits */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{about.limits.title}</h2>
                    <p className={styles.sectionText}>{about.limits.description}</p>
                </section>

                {/* Section 7: Contact */}
                <section className={styles.contactSection}>
                    <h2 className={styles.sectionTitle}>{about.contact.title}</h2>
                    <p className={styles.sectionText}>{about.contact.description}</p>
                    <a href={`mailto:${about.contact.email}`} className={styles.emailLink}>
                        {about.contact.email}
                    </a>
                </section>
            </div>
        </main>
    );
}
