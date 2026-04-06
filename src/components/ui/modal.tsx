'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './modal.module.css';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();

            // Focus trap
            if (e.key === 'Tab' && cardRef.current) {
                const focusable = cardRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (!open) return;
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        // Focus first focusable element
        const timer = setTimeout(() => {
            const first = cardRef.current?.querySelector<HTMLElement>(
                'input, button:not([class*="closeButton"])'
            );
            first?.focus();
        }, 50);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            clearTimeout(timer);
        };
    }, [open, handleKeyDown]);

    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                ref={cardRef}
                className={styles.card}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}
