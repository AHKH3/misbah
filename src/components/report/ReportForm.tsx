'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui';
import { submitReport } from '@/app/teachers/[slug]/actions';
import styles from './ReportForm.module.css';

interface ReportFormProps {
    profileId: string;
    teacherName: string;
}

export function ReportForm({ profileId, teacherName }: ReportFormProps) {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            await submitReport({
                profileId,
                reportType: formData.get('type') as string,
                description: formData.get('description') as string,
                reporterContact: (formData.get('contact') as string) || null,
            });

            setSubmitted(true);
        } catch (err) {
            setError('فشل إرسال التبليغ. يُرجى المحاولة مرة أخرى.');
            console.error('Report submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className={styles.successMessage}>
                <h3>✅ تم استلام التبليغ</h3>
                <p>
                    شكراً لك. تم استلام التبليغ وسيتم مراجعته خلال 48 ساعة.
                    إذا قدمت بريدك الإلكتروني، سنتواصل معك في حالة الحاجة لمزيد من المعلومات.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.reportForm}>
            <h3 className={styles.formTitle}>الإبلاغ عن مخالفة - {teacherName}</h3>

            <div className={styles.formGroup}>
                <label className={styles.label}>نوع المخالفة *</label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="type"
                            value="teacher_redirection"
                            required
                            className={styles.radioInput}
                        />
                        <span>المعلم حولني لمعلم آخر أو أكاديمية</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="type"
                            value="price_mismatch"
                            required
                            className={styles.radioInput}
                        />
                        <span>الأسعار المطلوبة تختلف عن المتفق عليها</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="type"
                            value="inappropriate_behavior"
                            required
                            className={styles.radioInput}
                        />
                        <span>سلوك غير لائق</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="type"
                            value="other"
                            required
                            className={styles.radioInput}
                        />
                        <span>أخرى</span>
                    </label>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                    تفاصيل المخالفة *
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    minLength={20}
                    maxLength={1000}
                    placeholder="يرجى وصف ما حدث بالتفصيل... (20 حرف على الأقل)"
                    className={styles.textarea}
                    rows={5}
                />
                <p className={styles.helperText}>
                    كلما كانت التفاصيل أدق، كلما ساعدنا ذلك على اتخاذ الإجراء المناسب.
                </p>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="contact" className={styles.label}>
                    بريدك الإلكتروني (اختياري)
                </label>
                <input
                    type="email"
                    id="contact"
                    name="contact"
                    placeholder="example@email.com"
                    className={styles.input}
                />
                <p className={styles.helperText}>
                    للتواصل معك في حالة الحاجة لمزيد من المعلومات. لن نشارك بريدك مع أي طرف ثالث.
                </p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التبليغ'}
            </Button>
        </form>
    );
}
