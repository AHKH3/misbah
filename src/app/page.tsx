'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from './page.module.css';

export default function HomePage() {
  const { labels, locale } = useI18n();

  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{labels.home}</h1>

          {/* Main CTA */}
          <p className={styles.tagline}>{labels.tagline}</p>

          <p className={styles.subtitle}>{labels.subtitle}</p>

          {/* Call to Action */}
          <div className={styles.actions}>
            <Link href="/directory">
              <Button variant="primary" fullWidth>
                {labels.startSearch}
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="ghost" fullWidth>
                {labels.registerAsTeacher}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className={styles.trust}>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>500+</span>
              <span className={styles.trustLabel}>{labels.registeredTeachers}</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>20+</span>
              <span className={styles.trustLabel}>{labels.countries}</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>4</span>
              <span className={styles.trustLabel}>{labels.subjects}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>{labels.howItWorks}</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <div className={styles.featureNumber}>1</div>
              <h3 className={styles.featureTitle}>{labels.browseTeachers}</h3>
              <p className={styles.featureText}>{labels.browseDesc}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureNumber}>2</div>
              <h3 className={styles.featureTitle}>{labels.chooseRight}</h3>
              <p className={styles.featureText}>{labels.chooseDesc}</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureNumber}>3</div>
              <h3 className={styles.featureTitle}>{labels.contactDirect}</h3>
              <p className={styles.featureText}>{labels.contactDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className={styles.subjects}>
        <div className={styles.subjectsContainer}>
          <h2 className={styles.subjectsTitle}>{labels.availableSubjects}</h2>
          <div className={styles.subjectGrid}>
            <Link href="/directory?subject=Quran" className={styles.subjectCard}>
              <span className={styles.subjectName}>{labels.quran}</span>
            </Link>
            <Link href="/directory?subject=Tajweed" className={styles.subjectCard}>
              <span className={styles.subjectName}>{labels.tajweed}</span>
            </Link>
            <Link href="/directory?subject=Arabic" className={styles.subjectCard}>
              <span className={styles.subjectName}>{labels.arabic}</span>
            </Link>
            <Link href="/directory?subject=Islamic+Studies" className={styles.subjectCard}>
              <span className={styles.subjectName}>{labels.islamicStudies}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <p className={styles.disclaimerText}>{labels.disclaimer}</p>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>{labels.footer}</footer>
    </main>
  );
}
