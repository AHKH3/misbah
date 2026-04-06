'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Button, Icons } from '@/components/ui';
import styles from '../wizard.module.css';

export default function SuccessPage() {
    const { labels, locale } = useI18n();
    const isAr = locale === 'ar';

    return (
        <div className={styles.successContainer}>
            <div className={styles.successIcon}>
                <Icons.Check size={48} strokeWidth={2} />
            </div>
            <h1 className={styles.successTitle}>{labels.onboarding.success.title}</h1>
            <p className={styles.successText}>
                {labels.onboarding.success.subtitle}
            </p>

            <div className={styles.nextStepsBox}>
                <h3 className={styles.nextStepsTitle}>{labels.onboarding.success.nextStepsTitle}</h3>
                <div className={styles.nextStep}>
                    <span className={styles.stepNum}>1</span>
                    <div>
                        <strong>{labels.onboarding.success.step1Title}</strong>
                        <p>{labels.onboarding.success.step1Desc}</p>
                    </div>
                </div>
                <div className={styles.nextStep}>
                    <span className={styles.stepNum}>2</span>
                    <div>
                        <strong>{labels.onboarding.success.step2Title}</strong>
                        <p>{labels.onboarding.success.step2Desc}</p>
                    </div>
                </div>
                <div className={styles.nextStep}>
                    <span className={styles.stepNum}>3</span>
                    <div>
                        <strong>{labels.onboarding.success.step3Title}</strong>
                        <p>{labels.onboarding.success.step3Desc}</p>
                    </div>
                </div>
            </div>

            <div className={styles.noticeBox}>
                <strong>{labels.onboarding.success.noticeTitle}</strong>
                <p>{labels.onboarding.success.noticeText}</p>
            </div>

            <div className={styles.successAction}>
                <Link href="/">
                    <Button variant="ghost">{labels.onboarding.success.backButton}</Button>
                </Link>
            </div>
        </div>
    );
}
