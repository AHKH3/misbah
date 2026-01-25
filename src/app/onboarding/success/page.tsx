'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import styles from '../wizard.module.css';

export default function SuccessPage() {
    const { labels } = useI18n();

    return (
        <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>تم إرسال طلبك بنجاح!</h1>
            <p className={styles.successText}>
                شكرًا لتقديمك. سيتم مراجعة بياناتك خلال 24 ساعة.
                <br /><br />
                عند القبول، ستصلك رسالة على بريدك الإلكتروني برابط لإنشاء حسابك وإتمام عملية النشر.
            </p>
            <div style={{ marginTop: '32px' }}>
                <Link href="/">
                    <Button variant="ghost">العودة للصفحة الرئيسية</Button>
                </Link>
            </div>
        </div>
    );
}
