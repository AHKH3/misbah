'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { Crown, Banknote, ShieldCheck, Globe } from 'lucide-react';
import styles from './ForTeachers.module.css';

const icons = [Crown, Banknote, ShieldCheck, Globe];
const iconColors = ['var(--icon-amber)', 'var(--icon-green)', 'var(--icon-blue)', 'var(--icon-teal)'];

export function ForTeachers() {
    const { labels } = useI18n();
    const { forTeachers } = labels.home;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <span className={styles.label}>{forTeachers.label}</span>
                <h2 className={styles.title}>{forTeachers.title}</h2>

                <div className={styles.grid}>
                    {forTeachers.cards.map((card, i) => {
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
                    <Link href="/onboarding">
                        <Button variant="primaryInverted">{forTeachers.cta}</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
