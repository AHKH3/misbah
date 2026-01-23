'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Logo - Link to Home */}
                <Link href="/" className={styles.logoLink}>
                    <Image
                        src="/logo-footer.png"
                        alt="مصباح"
                        width={64}
                        height={64}
                        className={styles.logo}
                    />
                </Link>

                {/* Main Footer Text */}
                <p className={styles.brand}>مصباح — دليل معلمي القرآن والعربية</p>

                {/* Disclaimer */}
                <p className={styles.disclaimer}>
                    مصباح دليل عام يعرض معلومات التواصل مع المعلمين فقط. المعلومات مقدمة من المعلمين ولم يتم التحقق منها.
                    التواصل يتم خارج الموقع ومصباح غير مسؤول عنه.
                </p>

                {/* Legal Links */}
                <nav className={styles.legalNav}>
                    <Link href="/privacy" className={styles.legalLink}>
                        سياسة الخصوصية
                    </Link>
                    <span className={styles.separator}>•</span>
                    <Link href="/terms" className={styles.legalLink}>
                        شروط الاستخدام
                    </Link>
                    <span className={styles.separator}>•</span>
                    <Link href="/disclaimer" className={styles.legalLink}>
                        إخلاء المسؤولية
                    </Link>
                </nav>

                {/* Copyright */}
                <p className={styles.copyright}>
                    © {new Date().getFullYear()} مصباح. جميع الحقوق محفوظة.
                </p>
            </div>
        </footer>
    );
}
