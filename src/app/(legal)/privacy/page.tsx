'use client';

import Link from 'next/link';
import styles from '../legal.module.css';

export default function PrivacyPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>سياسة الخصوصية</h1>
                    <p className={styles.lastUpdated}>آخر تحديث: يناير 2026</p>
                </header>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>ملخص</h2>
                    <p className={styles.highlightText}>
                        نجمع الحد الأدنى من البيانات اللازمة لتشغيل الدليل، ولا نشاركها لأغراض تسويقية.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>البيانات المجمعة</h2>
                    <ul className={styles.sectionList}>
                        <li><strong>للمعلمين:</strong> الاسم، البلد، التخصصات، الخبرة، وسائل التواصل، رابط الفيديو</li>
                        <li><strong>للزوار:</strong> بيانات التصفح العامة (كوكيز)</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>الاستخدام</h2>
                    <p className={styles.sectionText}>
                        نستخدم البيانات لعرض البروفايلات وتحسين التجربة. لا نبيع البيانات لأطراف ثالثة.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>حقوقك</h2>
                    <p className={styles.sectionText}>
                        يمكنك طلب تعديل أو حذف بياناتك بالتواصل معنا.
                    </p>
                </section>

                <section className={styles.contactSection}>
                    <p className={styles.sectionText}>
                        للاستفسارات: <a href="mailto:contact@misbah.site" className={styles.emailLink}>contact@misbah.site</a>
                    </p>
                    <p className={styles.sectionText} style={{ marginTop: '16px', fontSize: '0.875rem' }}>
                        راجع أيضاً: <Link href="/terms" style={{ textDecoration: 'underline' }}>شروط الاستخدام</Link> | <Link href="/disclaimer" style={{ textDecoration: 'underline' }}>إخلاء المسؤولية</Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
