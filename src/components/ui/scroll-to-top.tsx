'use client';

import { useState, useEffect } from 'react';
import styles from './scroll-to-top.module.css';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            className={`${styles.button} ${isVisible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label="الرجوع للأعلى"
        >
            <span className={styles.icon}>▲</span>
        </button>
    );
}
