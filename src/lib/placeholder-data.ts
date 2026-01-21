// Placeholder Data for Design Preview — Bilingual

import type { PublicProfile } from '@/lib/types/profile';

export const PLACEHOLDER_PROFILES: PublicProfile[] = [
    {
        id: 'placeholder-1',
        full_name: {
            ar: 'الشيخ أحمد محمد العلي',
            en: 'Sheikh Ahmad Muhammad Al-Ali',
        },
        country: {
            ar: 'مصر',
            en: 'Egypt',
        },
        subjects: ['Quran', 'Tajweed'],
        audience: ['Adults', 'Kids'],
        experience_text: {
            ar: 'معلم قرآن كريم وتجويد لأكثر من 15 عامًا. حاصل على إجازة في القراءات العشر. علمت أكثر من 500 طالب من مختلف أنحاء العالم. أستخدم منهجية تفاعلية تناسب جميع المستويات.',
            en: 'Quran and Tajweed teacher for over 15 years. Certified in the ten Quranic readings. Taught more than 500 students from around the world. I use an interactive methodology suitable for all levels.',
        },
        teaching_format: 'online',
        availability_status: 'accepting',
        contact_method: {
            whatsapp: '+201234567890',
            email: 'sheikh.ahmad@example.com',
        },
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
        id: 'placeholder-2',
        full_name: {
            ar: 'الأستاذة فاطمة الزهراء',
            en: 'Ustazah Fatima Al-Zahra',
        },
        country: {
            ar: 'المغرب',
            en: 'Morocco',
        },
        subjects: ['Arabic', 'Islamic Studies'],
        audience: ['Females Only', 'Kids'],
        experience_text: {
            ar: 'متخصصة في تعليم اللغة العربية للناطقين بغيرها. خبرة 10 سنوات في التدريس عبر الإنترنت. أسلوب تعليمي ممتع ومبسط يناسب الأطفال والمبتدئين.',
            en: 'Specialized in teaching Arabic to non-native speakers. 10 years of online teaching experience. Fun and simplified teaching style suitable for children and beginners.',
        },
        teaching_format: 'online',
        availability_status: 'limited',
        contact_method: {
            whatsapp: '+212612345678',
            telegram: '@ustazafatima',
        },
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
        id: 'placeholder-3',
        full_name: {
            ar: 'الأستاذ عبدالله السعيد',
            en: 'Ustaz Abdullah Al-Saeed',
        },
        country: {
            ar: 'السعودية',
            en: 'Saudi Arabia',
        },
        subjects: ['Quran', 'Arabic', 'Islamic Studies'],
        audience: ['Everyone'],
        experience_text: {
            ar: 'مدرس متفرغ للقرآن والعلوم الشرعية. حافظ للقرآن الكريم مع إجازة بالسند المتصل. أقدم دروسًا فردية وجماعية للرجال والنساء والأطفال.',
            en: 'Full-time teacher of Quran and Islamic sciences. Hafiz of the Holy Quran with connected chain certification. I offer individual and group lessons for men, women, and children.',
        },
        teaching_format: 'hybrid',
        availability_status: 'accepting',
        contact_method: {
            whatsapp: '+966512345678',
            email: 'abdullah.edu@example.com',
            website: 'https://abdullah-teacher.com',
        },
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
        id: 'placeholder-4',
        full_name: {
            ar: 'الحافظ يوسف الأزهري',
            en: 'Hafiz Youssef Al-Azhari',
        },
        country: {
            ar: 'مصر',
            en: 'Egypt',
        },
        subjects: ['Quran', 'Tajweed'],
        audience: ['Adults', 'Males Only'],
        experience_text: {
            ar: 'خريج الأزهر الشريف — كلية أصول الدين. متخصص في علوم القرآن والتجويد. أقدم برنامجًا متكاملاً لحفظ القرآن الكريم في سنتين.',
            en: 'Graduate of Al-Azhar Al-Sharif — Faculty of Theology. Specialized in Quranic sciences and Tajweed. I offer a comprehensive program to memorize the Holy Quran in two years.',
        },
        teaching_format: 'online',
        availability_status: 'not_accepting',
        contact_method: {
            email: 'youssef.azhari@example.com',
        },
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
        id: 'placeholder-5',
        full_name: {
            ar: 'الشيخ محمود حسن',
            en: 'Sheikh Mahmoud Hassan',
        },
        country: {
            ar: 'الأردن',
            en: 'Jordan',
        },
        subjects: ['Quran', 'Tajweed', 'Arabic'],
        audience: ['Adults', 'Kids'],
        experience_text: {
            ar: 'معلم قرآن وتجويد بخبرة 20 عامًا. حاصل على عدة إجازات في القراءات. أدرس جميع المستويات من المبتدئين حتى المتقدمين.',
            en: '20 years of experience in Quran and Tajweed teaching. Certified in multiple Quranic readings. I teach all levels from beginners to advanced.',
        },
        teaching_format: 'online',
        availability_status: 'accepting',
        contact_method: {
            whatsapp: '+962791234567',
            email: 'mahmoud.hassan@example.com',
        },
    },
    {
        id: 'placeholder-6',
        full_name: {
            ar: 'الأستاذة نورة الخالدي',
            en: 'Ustazah Noura Al-Khalidi',
        },
        country: {
            ar: 'الكويت',
            en: 'Kuwait',
        },
        subjects: ['Arabic', 'Islamic Studies'],
        audience: ['Females Only', 'Kids'],
        experience_text: {
            ar: 'معلمة لغة عربية وتربية إسلامية. خبرة 12 سنة في المدارس الدولية. متخصصة في المناهج الحديثة للأطفال.',
            en: 'Arabic language and Islamic education teacher. 12 years of experience in international schools. Specialized in modern curricula for children.',
        },
        teaching_format: 'hybrid',
        availability_status: 'accepting',
        contact_method: {
            whatsapp: '+96599123456',
        },
    },
];

export function getPlaceholderProfile(id: string): PublicProfile | null {
    return PLACEHOLDER_PROFILES.find((p) => p.id === id) || null;
}
