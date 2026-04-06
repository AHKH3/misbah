'use client';

import { use, useEffect, useState } from 'react';
import { verifyInvitationToken, createAccountFromInvitation } from '../actions';
import { Button } from '@/components/ui';
import styles from './invite.module.css';

interface PageProps {
    params: Promise<{ token: string }>;
}

export default function InvitePage({ params }: PageProps) {
    const { token } = use(params);
    const [status, setStatus] = useState<'loading' | 'valid' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        verifyInvitationToken(token).then((res) => {
            if (res.error) {
                setStatus('error');
                setErrorMsg(res.error);
            } else {
                setStatus('valid');
                // Assuming full_name is a string or object, handle properly.
                // In DB it is jsonb usually for bilingual? Or string?
                // Checking existing code: profile.full_name seems to be treated as string in some places or object.
                // Let's assume it might be an object and take 'ar' or 'en'.
                const name = typeof res.profile?.full_name === 'object'
                    ? (res.profile.full_name.ar || res.profile.full_name.en)
                    : res.profile?.full_name;
                setProfileName(name);
            }
        });
    }, [token]);

    if (status === 'loading') {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>جاري التحقق من الدعوة...</div>
                </div>
            </main>
        );
    }

    if (status === 'error') {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.errorCard}>
                        <h1>رابط غير صالح</h1>
                        <p>{errorMsg}</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <header className={styles.header}>
                        <h1>مرحباً بك، {profileName}</h1>
                        <p>تم قبول طلب انضمامك لمصباح. يرجى إنشاء كلمة مرور لحسابك.</p>
                    </header>

                    <form action={async (formData) => {
                        const res = await createAccountFromInvitation(token, formData);
                        if (res?.error) {
                            alert(res.error);
                        }
                    }} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                minLength={8}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                required
                                minLength={8}
                                className={styles.input}
                            />
                        </div>

                        <Button type="submit" variant="primary">
                            إنشاء الحساب
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}
