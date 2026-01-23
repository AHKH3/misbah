'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from './page.module.css';

export default function HomePage() {
  const { labels } = useI18n();
  const { home } = labels;

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target); // Animate once
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
      {/* Section 1: Hero — Legendary */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Geometric Background (Quiet Depth) */}
          <div className={styles.heroGeometry}>
            <div className={styles.geoCircle1}></div>
            <div className={styles.geoCircle2}></div>
            <div className={styles.geoCircle3}></div>
          </div>

          {/* Title */}
          <h1 className={styles.heroTitle}>{home.hero.title}</h1>

          {/* Subtitle */}
          <p className={styles.heroSubtitle}>{home.hero.subtitle}</p>

          {/* Value Statement */}
          <p className={styles.heroValue}>{home.hero.valueStatement}</p>

          {/* CTAs */}
          <div className={styles.heroCtas}>
            <Link href="/directory">
              <Button variant="primary">{home.hero.ctaStudents}</Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="ghost">{home.hero.ctaTeachers}</Button>
            </Link>
          </div>

          {/* Trust Signal */}
          <div className={styles.trustSignal}>
            <span className={styles.trustCheck}>✓</span>
            <span className={styles.trustText}>{labels.home.howItWorks.steps[1].title}</span>
          </div>
        </div>
      </section>

      {/* Section 2: For Students — Cards Grid */}
      <section className={styles.studentsSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>{home.forStudents.label}</span>
          <h2 className={styles.sectionTitle}>{home.forStudents.title}</h2>

          <div className={`${styles.cardGrid} ${styles.reveal}`}>
            {home.forStudents.points.map((point: string, i: number) => (
              <div key={i} className={styles.card}>
                <p className={styles.cardText}>{point}</p>
              </div>
            ))}
          </div>

          <div className={`${styles.noteBox} ${styles.reveal}`}>
            <p className={styles.noteText}>{home.forStudents.note}</p>
          </div>

          <div className={`${styles.sectionCta} ${styles.reveal}`}>
            <Link href="/directory">
              <Button variant="primary">{home.forStudents.cta}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: For Teachers — Horizontal Chips */}
      <section className={styles.teachersSection}>
        <div className={styles.container}>
          <span className={styles.sectionLabel}>{home.forTeachers.label}</span>
          <h2 className={styles.sectionTitle}>{home.forTeachers.title}</h2>

          <div className={`${styles.chipsContainer} ${styles.reveal}`}>
            {home.forTeachers.points.map((point: string, i: number) => (
              <span key={i} className={styles.chip}>{point}</span>
            ))}
          </div>

          <div className={`${styles.noteBox} ${styles.reveal}`}>
            <p className={styles.noteText}>{home.forTeachers.note}</p>
          </div>

          <div className={`${styles.sectionCta} ${styles.reveal}`}>
            <Link href="/onboarding">
              <Button variant="ghost">{home.forTeachers.cta}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: What Misbah Is Not — Inline Badges */}
      <section className={styles.notSection}>
        <div className={styles.container}>
          <h2 className={styles.notTitle}>{home.notSection.title}</h2>
          <div className={`${styles.notList} ${styles.reveal}`}>
            {home.notSection.points.map((point: string, i: number) => (
              <span key={i} className={styles.notBadge}>{point}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: How It Works — Horizontal Steps */}
      <section className={styles.howSection}>
        <div className={styles.container}>
          <h2 className={styles.howTitle}>{home.howItWorks.title}</h2>
          <div className={`${styles.horizontalSteps} ${styles.reveal}`}>
            {home.howItWorks.steps.map((step: { number: string; title: string; description: string }, i: number) => (
              <div key={i} className={styles.hStep}>
                <span className={styles.hStepNumber}>{step.number}</span>
                <span className={styles.hStepTitle}>{step.title}</span>
              </div>
            ))}
          </div>
          <div className={`${styles.howNote} ${styles.reveal}`}>
            <p>{home.howItWorks.note}</p>
          </div>
        </div>
      </section>

      {/* Section 6: Pricing — Centered Box */}
      <section className={styles.pricingSection}>
        <div className={styles.container}>
          <div className={`${styles.pricingCard} ${styles.reveal}`}>
            <span className={styles.pricingLabel}>{home.pricing.label}</span>
            <h2 className={styles.pricingTitle}>{home.pricing.title}</h2>
            <p className={styles.pricingDescription}>{home.pricing.description}</p>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={`${styles.ctaGrid} ${styles.reveal}`}>
            <div className={styles.ctaBlock}>
              <span className={styles.ctaLabel}>{home.finalCta.studentsLabel}</span>
              <Link href="/directory">
                <Button variant="primary" fullWidth>{home.finalCta.studentsButton}</Button>
              </Link>
            </div>
            <div className={styles.ctaBlock}>
              <span className={styles.ctaLabel}>{home.finalCta.teachersLabel}</span>
              <Link href="/onboarding">
                <Button variant="ghost" fullWidth>{home.finalCta.teachersButton}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <p className={styles.disclaimerText}>{home.disclaimer}</p>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>{home.footer}</footer>
    </main>
  );
}
