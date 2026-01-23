'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n, localeNames, locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import styles from './header.module.css';

export function Header() {
    const { locale, setLocale, labels } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocaleChange = (newLocale: Locale) => {
        setLocale(newLocale);
        setIsOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="Misbah" width={64} height={64} priority />
                </Link>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>
                        {labels.navHome}
                    </Link>
                    <Link href="/directory" className={styles.navLink}>
                        {labels.directory}
                    </Link>
                    <Link href="/about" className={styles.navLink}>
                        {labels.navAbout}
                    </Link>
                    <Link href="/faq" className={styles.navLink}>
                        {labels.navFaq}
                    </Link>
                    <Link href="/onboarding" className={styles.navLink}>
                        {labels.register}
                    </Link>
                </nav>

                {/* Language Selector */}
                <div className={styles.langSelector} ref={dropdownRef}>
                    <button
                        type="button"
                        className={styles.langButton}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                    >
                        {localeNames[locale]}
                        <span className={`${styles.langArrow} ${isOpen ? styles.langArrowOpen : ''}`}>
                            ▼
                        </span>
                    </button>

                    {isOpen && (
                        <div className={styles.langDropdown} role="listbox">
                            {locales.map((loc) => (
                                <button
                                    key={loc}
                                    type="button"
                                    className={`${styles.langOption} ${loc === locale ? styles.langOptionActive : ''}`}
                                    onClick={() => handleLocaleChange(loc)}
                                    role="option"
                                    aria-selected={loc === locale}
                                >
                                    {localeNames[loc]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
