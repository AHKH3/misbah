'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useI18n } from '@/lib/i18n';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui';
import styles from './login-modal.module.css';

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
    const { labels } = useI18n();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(labels.auth?.errorInvalid || 'Invalid email or password');
            setLoading(false);
            return;
        }

        onClose();
        router.push('/admin');
        router.refresh();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className={styles.title}>{labels.auth?.title || 'Sign In'}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="login-email">
                        {labels.auth?.email || 'Email'}
                    </label>
                    <input
                        id="login-email"
                        className={styles.input}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        dir="ltr"
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="login-password">
                        {labels.auth?.password || 'Password'}
                    </label>
                    <input
                        id="login-password"
                        className={styles.input}
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        dir="ltr"
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <Button type="submit" fullWidth disabled={loading}>
                    {loading
                        ? (labels.auth?.signingIn || 'Signing in...')
                        : (labels.auth?.signIn || 'Sign In')}
                </Button>
            </form>
        </Modal>
    );
}
