'use client';

import Link from 'next/link';
import styles from '../legal.module.css';

export default function TermsPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>شروط الاستخدام</h1>
                    <p className={styles.lastUpdated}>آخر تحديث: يناير 2026</p>
                </header>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>ملخص</h2>
                    <p className={styles.highlightText}>
                        مصباح دليل يعرض معلومات التواصل مع معلمين مستقلين. لا يوجد تعليم أو تواصل داخل الموقع.
                        أي تواصل يتم خارجياً على مسؤولية الطرفين.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>طبيعة الخدمة</h2>
                    <p className={styles.sectionText}>
                        مصباح <strong>ليس</strong>: منصة تعليمية، منصة حجوزات، وسيط مالي، جهة اعتماد، أو منصة تواصل.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>مسؤولية المستخدم</h2>
                    <ul className={styles.sectionList}>
                        <li>الطالب مسؤول عن التحقق من مناسبة المعلم</li>
                        <li>المعلم مسؤول عن دقة معلوماته</li>
                        <li>أي اتفاق بين الطرفين على مسؤوليتهم</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>الاشتراك</h2>
                    <p className={styles.sectionText}>
                        للمعلمين اشتراك سنوي رمزي (يوضح أثناء التقديم). التصفح مجاني للطلاب.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>التعديل والحذف</h2>
                    <p className={styles.sectionText}>
                        يحق للمعلم طلب حذف بروفايله. يحق لنا إزالة أي بروفايل مخالف.
                    </p>
                </section>

                <section className={styles.contactSection}>
                    <p className={styles.sectionText}>
                        للاستفسارات: <a href="mailto:contact@misbah.site" className={styles.emailLink}>contact@misbah.site</a>
                    </p>
                    <p className={styles.sectionText} style={{ marginTop: '16px', fontSize: '0.875rem' }}>
                        راجع أيضاً: <Link href="/disclaimer" style={{ textDecoration: 'underline' }}>إخلاء المسؤولية</Link> | <Link href="/privacy" style={{ textDecoration: 'underline' }}>سياسة الخصوصية</Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
