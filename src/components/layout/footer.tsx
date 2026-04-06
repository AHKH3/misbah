'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import styles from './footer.module.css';

export function Footer() {
    const { locale, labels } = useI18n();
    const { footer } = labels;

    const siteName = locale === 'ar' ? 'مصباح' : 'Misbah';

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Brand */}
                <div className={styles.brand}>
                    <Link href="/" className={styles.logoLink}>
                        <Image src="/logo.png" alt="Misbah" width={56} height={56} />
                        <span className={styles.logoText}>{siteName}</span>
                    </Link>
                    <p className={styles.tagline}>{footer.tagline}</p>
                </div>

                {/* Columns */}
                <div className={styles.columns}>
                    {/* Site Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{footer.siteTitle}</h4>
                        <nav className={styles.columnLinks}>
                            <Link href="/">{footer.home}</Link>
                            <Link href="/find">{footer.find}</Link>
                            <Link href="/about">{footer.about}</Link>
                            <Link href="/faq">{footer.faq}</Link>
                            <Link href="/for-teachers">{footer.forTeachers}</Link>
                        </nav>
                    </div>

                    {/* Legal Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{footer.legalTitle}</h4>
                        <nav className={styles.columnLinks}>
                            <Link href="/privacy">{footer.privacy}</Link>
                            <Link href="/terms">{footer.terms}</Link>
                            <Link href="/disclaimer">{footer.disclaimer}</Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>{footer.contactTitle}</h4>
                        <nav className={styles.columnLinks}>
                            <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
                        </nav>
                    </div>
                </div>

                {/* Copyright */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>{footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
