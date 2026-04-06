'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Eye, Shield, Heart, Users, X } from 'lucide-react';
import styles from './page.module.css';

const philosophyIcons = [Eye, Shield, Heart, Users];
const philosophyColors = ['var(--icon-blue)', 'var(--icon-green)', 'var(--icon-rose)', 'var(--icon-purple)'];

export default function AboutPage() {
    const { labels } = useI18n();
    const { about } = labels;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = document.querySelectorAll(`.${styles.reveal}`);
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <main className={styles.page}>
            {/* Hero — ground bg */}
            <section className={`${styles.sectionGround} ${styles.reveal}`}>
                <div className={styles.heroContainer}>
                    <h1 className={styles.heroTitle}>{about.hero.title}</h1>
                    <p className={styles.heroSubtitle}>{about.hero.subtitle}</p>
                </div>
            </section>

            {/* Story — card bg */}
            <section className={`${styles.sectionCard} ${styles.reveal}`}>
                <div className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>{about.story.title}</h2>
                    {about.story.paragraphs.map((p, i) => (
                        <p key={i} className={styles.paragraph}>{p}</p>
                    ))}
                </div>
            </section>

            {/* Philosophy — ground bg */}
            <section className={`${styles.sectionGround} ${styles.reveal}`}>
                <div className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>{about.philosophy.title}</h2>
                    <div className={styles.philosophyGrid}>
                        {about.philosophy.cards.map((card, i) => {
                            const Icon = philosophyIcons[i];
                            return (
                                <div key={i} className={styles.philosophyCard}>
                                    <span className={styles.philosophyIcon} style={{ color: philosophyColors[i] }}>
                                        <Icon size={24} />
                                    </span>
                                    <h3 className={styles.cardTitle}>{card.title}</h3>
                                    <p className={styles.cardDesc}>{card.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Standards — card bg */}
            <section className={`${styles.sectionCard} ${styles.reveal}`}>
                <div className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>{about.standards.title}</h2>
                    <p className={styles.paragraph}>{about.standards.intro}</p>
                    <ul className={styles.bulletList}>
                        {about.standards.points.map((point, i) => (
                            <li key={i} className={styles.bulletItem}>{point}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Boundaries — ground bg */}
            <section className={`${styles.sectionGround} ${styles.reveal}`}>
                <div className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>{about.boundaries.title}</h2>
                    <ul className={styles.boundaryList}>
                        {about.boundaries.points.map((point, i) => (
                            <li key={i} className={styles.boundaryItem}>
                                <span className={styles.boundaryIcon}>
                                    <X size={16} />
                                </span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Contact — dark bg */}
            <section className={`${styles.sectionDark} ${styles.reveal}`}>
                <div className={styles.heroContainer}>
                    <h2 className={styles.contactTitle}>{about.contact.title}</h2>
                    <p className={styles.contactDesc}>{about.contact.description}</p>
                    <a href={`mailto:${about.contact.email}`} className={styles.emailLink}>
                        {about.contact.email}
                    </a>
                </div>
            </section>
        </main>
    );
}
