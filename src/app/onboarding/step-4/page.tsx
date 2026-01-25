'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useWizardStore } from '../stores/wizard-store';
import styles from '../wizard.module.css';

export default function Step4Page() {
    const router = useRouter();
    const { step4, updateStep4, setStep } = useWizardStore();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Video URL required
        if (!step4.videoUrl.trim()) {
            newErrors.videoUrl = 'رابط الفيديو مطلوب';
        } else if (!step4.videoUrl.includes('youtube.com') && !step4.videoUrl.includes('youtu.be')) {
            newErrors.videoUrl = 'يجب أن يكون رابط YouTube';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        setStep(3);
        router.push('/onboarding/step-3');
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep(5);
            router.push('/onboarding/step-5');
        }
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>العينة التعليمية</h2>
            <p className={styles.stepDescription}>
                هذه الخطوة الأهم — الفيديو هو إثبات جديتك كمعلم.
            </p>

            {/* Video Requirements Box */}
            <div className={styles.infoBox}>
                <h4 className={styles.infoTitle}>📹 ما المطلوب؟</h4>
                <ul className={styles.infoList}>
                    <li><strong>مدة 10 دقائق على الأقل</strong> — شرح حقيقي، مش مقدمة</li>
                    <li>تلاوة، شرح آية، درس تجويد، أو أي محتوى تعليمي</li>
                    <li>يُظهر أسلوبك الفعلي في التدريس</li>
                </ul>

                <h4 className={styles.infoTitle} style={{ marginTop: '16px' }}>✅ مقبول:</h4>
                <ul className={styles.infoList}>
                    <li>تسجيل شاشة (بدون ظهور وجهك)</li>
                    <li>فيديو قديم من حصة سابقة</li>
                    <li>شرح عرض تقديمي</li>
                    <li>تلاوة مع شرح</li>
                    <li>بدون طلاب / بدون مونتاج</li>
                </ul>

                <h4 className={styles.infoTitle} style={{ marginTop: '16px' }}>❌ غير مقبول:</h4>
                <ul className={styles.infoList}>
                    <li>صورة ثابتة بصوت</li>
                    <li>أقل من 10 دقائق</li>
                    <li>مقطع مقتبس من شخص آخر</li>
                </ul>
            </div>

            {/* Why This Matters */}
            <div className={styles.whyBox}>
                <p>
                    <strong>لماذا الفيديو إلزامي؟</strong>
                    <br />
                    مصباح دليل للمعلمين الجادين فقط. الفيديو يُثبت أنك معلم حقيقي،
                    ويساعد الزائر على تقييم أسلوبك قبل التواصل معك.
                </p>
            </div>

            {/* Video URL Input */}
            <div className={styles.formGroup}>
                <label htmlFor="video" className={styles.label}>رابط الفيديو (YouTube) *</label>
                <input
                    type="url"
                    id="video"
                    className={styles.input}
                    value={step4.videoUrl}
                    onChange={(e) => updateStep4({ videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                />
                {errors.videoUrl && <span className={styles.error}>{errors.videoUrl}</span>}

                <p className={styles.hint}>
                    💡 ليس لديك فيديو؟ سجّل شاشتك وأنت تشرح لمدة 10 دقائق، ثم ارفعه على YouTube.
                </p>
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button type="button" className={styles.backBtn} onClick={handleBack}>
                    → السابق
                </button>
                <Button variant="primary" onClick={handleNext}>
                    التالي ←
                </Button>
            </div>
        </div>
    );
}
