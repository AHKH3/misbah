'use client';

import { useI18n } from '@/lib/i18n';
import { Check, X } from 'lucide-react';
import styles from './Principles.module.css';

export function Principles() {
    const { labels } = useI18n();
    const { principles } = labels.home;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>{principles.title}</h2>

                <div className={styles.table}>
                    <div className={styles.column}>
                        {principles.is.map((item, i) => (
                            <div key={i} className={styles.row}>
                                <span className={styles.iconYes}>
                                    <Check size={18} />
                                </span>
                                <span className={styles.text}>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.column}>
                        {principles.isNot.map((item, i) => (
                            <div key={i} className={styles.row}>
                                <span className={styles.iconNo}>
                                    <X size={18} />
                                </span>
                                <span className={styles.textMuted}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
