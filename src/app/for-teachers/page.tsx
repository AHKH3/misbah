'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from './for-teachers.module.css';

export default function ForTeachersPage() {
    const { labels } = useI18n();
    const t = labels.forTeachersPage;

    return (
        <main>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{t.hero.title}</h1>
                    <p className={styles.heroSubtitle}>{t.hero.subtitle}</p>
                    <div className={styles.heroAction}>
                        <Link href="/onboarding"><Button>{t.hero.cta}</Button></Link>
                    </div>
                </div>
            </section>

            {/* Why Misbah */}
            <section className={styles.sectionAlt}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{t.why.title}</h2>
                    <div className={styles.cardGrid}>
                        {t.why.cards.map((card, i) => (
                            <div key={i} className={styles.card}>
                                <h3 className={styles.cardTitle}>{card.title}</h3>
                                <p className={styles.cardDescription}>{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{t.howItWorks.title}</h2>
                    <div className={styles.stepsList}>
                        {t.howItWorks.steps.map((step, i) => (
                            <div key={i} className={styles.step}>
                                <span className={styles.stepNumber}>{step.number}</span>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDescription}>{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className={styles.sectionAlt}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{t.pricing.title}</h2>
                    <div className={styles.pricingBox}>
                        <p className={styles.priceTag}>{t.pricing.betaPrice}</p>
                        <p className={styles.priceNote}>{t.pricing.betaNote}</p>
                        <p className={styles.priceIncludes}>{t.pricing.includes}</p>
                        <p className={styles.noCommission}>{t.pricing.noCommission}</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{t.faq.title}</h2>
                    <div className={styles.faqList}>
                        {t.faq.items.map((item, i) => (
                            <div key={i} className={styles.faqItem}>
                                <h3 className={styles.faqQuestion}>{item.question}</h3>
                                <p className={styles.faqAnswer}>{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className={styles.finalCta}>
                <div className={styles.finalCtaContent}>
                    <h2 className={styles.finalCtaTitle}>{t.finalCta.title}</h2>
                    <p className={styles.finalCtaSubtitle}>{t.finalCta.subtitle}</p>
                    <div className={styles.finalCtaAction}>
                        <Link href="/onboarding"><Button>{t.finalCta.cta}</Button></Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
