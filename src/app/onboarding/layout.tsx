'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useWizardStore } from './stores/wizard-store';
import styles from './layout.module.css';

interface OnboardingLayoutProps {
    children: React.ReactNode;
}

const STEPS = [1, 2, 3, 4, 5];

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
    const { labels, locale } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const { currentStep } = useWizardStore();

    // Determine active step from URL
    const getActiveStep = () => {
        if (pathname.includes('step-1')) return 1;
        if (pathname.includes('step-2')) return 2;
        if (pathname.includes('step-3')) return 3;
        if (pathname.includes('step-4')) return 4;
        if (pathname.includes('step-5')) return 5;
        if (pathname.includes('success')) return 6;
        return 1;
    };

    const activeStep = getActiveStep();
    const isSuccess = pathname.includes('success');

    // Step labels with proper fallbacks
    const stepLabels = {
        step1: 'البيانات الأساسية',
        step2: 'الخبرة والمؤهلات',
        step3: 'الفئة والسعر',
        step4: 'العينة التعليمية',
        step5: 'التواصل والإرسال',
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        انضم إلى دليل مصباح
                    </h1>
                    <p className={styles.subtitle}>
                        أنشئ بروفايلك المهني خلال 5 خطوات بسيطة
                    </p>
                </header>

                {/* Progress Bar */}
                {!isSuccess && (
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                            {STEPS.map((step) => (
                                <div
                                    key={step}
                                    className={`${styles.step} ${step === activeStep ? styles.stepActive : ''
                                        } ${step < activeStep ? styles.stepCompleted : ''}`}
                                >
                                    <div className={styles.stepNumber}>
                                        {step < activeStep ? '✓' : step}
                                    </div>
                                    <span className={styles.stepLabel}>
                                        {stepLabels[`step${step}` as keyof typeof stepLabels]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Progress Line */}
                        <div className={styles.progressLine}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </main>
    );
}
