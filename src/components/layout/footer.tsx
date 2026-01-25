'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import styles from './footer.module.css';

export function Footer() {
    const { labels } = useI18n();
    const { footer } = labels;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Logo - Link to Home */}
                <Link href="/" className={styles.logoLink}>
                    <Image
                        src="/logo-footer.png"
                        alt="Misbah"
                        width={64}
                        height={64}
                        className={styles.logo}
                    />
                </Link>

                {/* Main Footer Text */}
                <p className={styles.brand}>{footer.tagline}</p>

                {/* Disclaimer - Using home.disclaimer as it contains the long text or just rely on footer keys if they were designed to hold this? 
                    Wait, looking at json files, 'footer' object DOES NOT have the disclaimer long text. 
                    'home.disclaimer' has it.
                    Let's check 'ar.json'.
                    home.disclaimer: "مصباح دليل عام..."
                    footer object only has tagline, about, faq, privacy, terms, copyright.
                    
                    The original footer component had a LONG disclaimer.
                    "مصباح دليل عام يعرض معلومات التواصل..."
                    
                    I should use labels.home.disclaimer for this or labels.about.limits.description?
                    Let's check loader.ts types again.
                    home.disclaimer is a string.
                    
                    I will use labels.home.disclaimer.
                 */}
                <p className={styles.disclaimer}>
                    {labels.home.disclaimer}
                </p>

                {/* Legal Links */}
                <nav className={styles.legalNav}>
                    <Link href="/privacy" className={styles.legalLink}>
                        {footer.privacy}
                    </Link>
                    <span className={styles.separator}>•</span>
                    <Link href="/terms" className={styles.legalLink}>
                        {footer.terms}
                    </Link>
                    <span className={styles.separator}>•</span>
                    <Link href="/disclaimer" className={styles.legalLink}>
                        {footer.disclaimer}
                    </Link>
                </nav>

                {/* Copyright */}
                <p className={styles.copyright}>
                    {footer.copyright.replace('2025', new Date().getFullYear().toString())}
                </p>
            </div>
        </footer >
    );
}
