'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { useWizardStore } from '../stores/wizard-store';
import styles from '../wizard.module.css';

export default function Step5Page() {
    const { labels, locale } = useI18n();
    const router = useRouter();
    const { step5, updateStep5, setStep } = useWizardStore();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Comprehensive YouTube regex
        // Supports: watch?v=, embed/, v/, shorts/, and youtu.be/
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)[\w-]{11}([&?].*)?$/;

        if (!step5.videoUrl.trim()) {
            newErrors.videoUrl = labels.onboarding.errors.videoUrl;
        } else if (!youtubeRegex.test(step5.videoUrl)) {
            newErrors.videoUrl = labels.onboarding.errors.videoUrlYouTube;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        setStep(4);
        router.push('/onboarding/step-4');
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep(6);
            router.push('/onboarding/step-6');
        }
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>{labels.teacher.teachingSample}</h2>
            <p className={styles.stepDescription}>
                {labels.onboarding.hints.video}
            </p>

            {/* Video Requirements Box */}
            <div className={styles.infoBox}>
                <h4 className={styles.infoTitle}>{labels.onboarding.step4.info.title}</h4>
                <ul className={styles.infoList}>
                    {labels.onboarding.step4.info.points.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>

                <h4 className={`${styles.infoTitle} ${styles.infoTitleSpaced}`}>{labels.onboarding.step4.info.acceptedTitle}</h4>
                <ul className={styles.infoList}>
                    {labels.onboarding.step4.info.acceptedPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>

                <h4 className={`${styles.infoTitle} ${styles.infoTitleSpaced}`}>{labels.onboarding.step4.info.rejectedTitle}</h4>
                <ul className={styles.infoList}>
                    {labels.onboarding.step4.info.rejectedPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </div>

            {/* Why This Matters */}
            <div className={styles.whyBox}>
                <p>
                    {labels.onboarding.step4.info.why}
                </p>
            </div>

            {/* Video URL Input */}
            <div className={styles.formGroup}>
                <label htmlFor="video" className={styles.label}>{labels.onboarding.labels.videoUrl}</label>
                <input
                    type="url"
                    id="video"
                    className={styles.input}
                    value={step5.videoUrl}
                    onChange={(e) => updateStep5({ videoUrl: e.target.value })}
                    placeholder={labels.onboarding.placeholders.videoUrl}
                />
                {errors.videoUrl && <span className={styles.error}>{errors.videoUrl}</span>}

                <p className={styles.hint}>
                    {labels.onboarding.hints.video}
                </p>
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>
                    {locale === 'ar' ? '→' : '←'} {labels.directory.pagination.previous}
                </button>
                <Button variant="primary" onClick={handleNext}>
                    {labels.nav.next || 'التالي'} {locale === 'ar' ? '←' : '→'}
                </Button>
            </div>
        </div>
    );
}
