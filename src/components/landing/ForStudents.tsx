'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { Search, FileText, DollarSign, MessageCircle } from 'lucide-react';
import styles from './ForStudents.module.css';

const icons = [Search, FileText, DollarSign, MessageCircle];
const iconColors = ['var(--icon-blue)', 'var(--icon-teal)', 'var(--icon-amber)', 'var(--icon-green)'];

export function ForStudents() {
    const { labels } = useI18n();
    const { forStudents } = labels.home;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <span className={styles.label}>{forStudents.label}</span>
                <h2 className={styles.title}>{forStudents.title}</h2>

                <div className={styles.grid}>
                    {forStudents.cards.map((card, i) => {
                        const Icon = icons[i];
                        return (
                            <div key={i} className={styles.card}>
                                <span className={styles.cardIcon} style={{ color: iconColors[i] }}>
                                    <Icon size={24} />
                                </span>
                                <h3 className={styles.cardTitle}>{card.title}</h3>
                                <p className={styles.cardDesc}>{card.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.cta}>
                    <Link href="/find">
                        <Button variant="primary">{forStudents.cta}</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
