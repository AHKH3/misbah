import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth/is-admin';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { confirmPayment, rejectPayment } from '../actions';
import styles from '../admin.module.css';

export default async function AdminPaymentsPage() {
    const supabase = await createClient();
    const isAdminUser = await isAdmin(supabase);

    if (!isAdminUser) {
        redirect('/');
    }

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, country, payment_proof_url, payment_status, created_at')
        .eq('payment_status', 'proof_submitted')
        .order('created_at', { ascending: false });

    if (error) {
        return <div>Error loading payments</div>;
    }

    // Pre-fetch signed URLs
    const profilesWithUrls = await Promise.all(profiles.map(async (p) => {
        const { data: signedUrl } = await supabase.storage
            .from('payment_proofs')
            .createSignedUrl(p.payment_proof_url || '', 3600);
        return { ...p, signedUrl: signedUrl?.signedUrl };
    }));

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 className={styles.title}>تأكيد الدفعات</h1>
                        <Link href="/admin" style={{ color: 'var(--color-primary)' }}>← عودة للوحة التحكم</Link>
                    </div>
                </header>

                {profilesWithUrls.length === 0 ? (
                    <div className={styles.emptyState}>لا توجد دفعات معلقة</div>
                ) : (
                    <div className={styles.queue}>
                        {profilesWithUrls.map((profile) => {
                            return (
                                <div key={profile.id} className={styles.queueItem}>
                                    <div className={styles.queueInfo}>
                                        <h2 className={styles.queueName}>{profile.full_name}</h2>
                                        <p className={styles.queueMeta}>{profile.country}</p>
                                        <div style={{ marginTop: '1rem' }}>
                                            {profile.payment_proof_url && (
                                                <a
                                                    href={profile.signedUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                                                >
                                                    عرض إثبات الدفع
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <form action={async () => {
                                        'use server';
                                        await confirmPayment(profile.id);
                                    }}>
                                        <div className={styles.queueActions}>
                                            <Button variant="primary" type="submit">تأكيد الدفع</Button>
                                        </div>
                                    </form>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
