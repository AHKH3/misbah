'use client';

import { useI18n } from '@/lib/i18n';
import { Accordion } from '@/components/ui/accordion';
import styles from './page.module.css';

export default function FAQPage() {
    const { labels } = useI18n();
    const { faq } = labels;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>{faq.pageTitle}</h1>
                </header>

                {/* FAQ Items */}
                <Accordion items={faq.items} defaultOpen={0} />
            </div>
        </main>
    );
}
