'use client';

import { useState } from 'react';
import styles from './accordion.module.css';

interface AccordionItem {
    question: string;
    answer: string;
}

interface AccordionProps {
    items: readonly AccordionItem[];
    defaultOpen?: number;
}

export function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.accordion}>
            {items.map((item, index) => (
                <div key={index} className={styles.item}>
                    <button
                        type="button"
                        className={`${styles.trigger} ${openIndex === index ? styles.triggerOpen : ''}`}
                        onClick={() => toggleItem(index)}
                        aria-expanded={openIndex === index}
                    >
                        <span className={styles.question}>{item.question}</span>
                        <span className={styles.icon}>{openIndex === index ? '−' : '+'}</span>
                    </button>
                    <div
                        className={`${styles.content} ${openIndex === index ? styles.contentOpen : ''}`}
                        role="region"
                        aria-hidden={openIndex !== index}
                    >
                        <p className={styles.answer}>{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
