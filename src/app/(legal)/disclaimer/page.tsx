'use client';

import Link from 'next/link';
import styles from '../legal.module.css';

export default function DisclaimerPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>إخلاء المسؤولية</h1>
                    <p className={styles.lastUpdated}>آخر تحديث: يناير 2026</p>
                </header>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>إخلاء مسؤولية شامل</h2>
                    <p className={styles.highlightText}>
                        مصباح يعرض معلومات التواصل فقط. أي تواصل أو اتفاق بين الطالب والمعلم
                        يتم خارج الموقع على مسؤوليتهم الشخصية. مصباح غير مسؤول قانونياً أو تعليمياً.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>نطاق إخلاء المسؤولية</h2>
                    <ul className={styles.sectionList}>
                        <li><strong>التواصل:</strong> يتم خارج الموقع، لا نراقبه ولا نتدخل فيه</li>
                        <li><strong>المعلومات:</strong> مقدمة من المعلمين، لم نتحقق منها مستقلاً</li>
                        <li><strong>التعليم:</strong> لا نضمن جودته أو نتائجه</li>
                        <li><strong>المال:</strong> لا نتدخل في أي اتفاقات مالية بين الطرفين</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>المراجعة</h2>
                    <p className={styles.sectionText}>
                        نراجع الطلبات للتأكد من الجدية فقط. المراجعة ليست تقييماً علمياً ولا تمنح اعتماداً.
                    </p>
                </section>

                <section className={styles.highlightBox}>
                    <h2 className={styles.highlightTitle}>باستخدامك للموقع</h2>
                    <p className={styles.highlightText}>
                        باستخدامك لمصباح، توافق على تحمل المسؤولية الكاملة عن أي تواصل أو اتفاق
                        يتم بينك وبين أي معلم.
                    </p>
                </section>

                <section className={styles.contactSection}>
                    <p className={styles.sectionText}>
                        للاستفسارات: <a href="mailto:contact@misbah.site" className={styles.emailLink}>contact@misbah.site</a>
                    </p>
                    <p className={styles.sectionText} style={{ marginTop: '16px', fontSize: '0.875rem' }}>
                        راجع أيضاً: <Link href="/terms" style={{ textDecoration: 'underline' }}>شروط الاستخدام</Link> | <Link href="/privacy" style={{ textDecoration: 'underline' }}>سياسة الخصوصية</Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
