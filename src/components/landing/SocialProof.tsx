'use client';

import { useI18n } from '@/lib/i18n';
import { ShieldCheck, Percent, MessageCircle } from 'lucide-react';
import styles from './SocialProof.module.css';

export function SocialProof() {
    const { labels } = useI18n();
    const { socialProof } = labels.home;

    const items = [
        { icon: <ShieldCheck size={24} />, color: 'var(--icon-green)', title: socialProof.review, desc: socialProof.reviewDesc },
        { icon: <Percent size={24} />, color: 'var(--icon-amber)', title: socialProof.commission, desc: socialProof.commissionDesc },
        { icon: <MessageCircle size={24} />, color: 'var(--icon-blue)', title: socialProof.direct, desc: socialProof.directDesc },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {items.map((item, i) => (
                    <div key={i} className={styles.card}>
                        <span className={styles.icon} style={{ color: item.color }}>{item.icon}</span>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDesc}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
