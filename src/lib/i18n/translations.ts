// Pre-generated Translations for All 20 Languages
// These are static translations that load instantly

// Landing page structure type
interface HomeSection {
    hero: {
        title: string;
        subtitle: string;
        valueStatement: string;
        ctaStudents: string;
        ctaTeachers: string;
    };
    forStudents: {
        label: string;
        title: string;
        points: string[];
        note: string;
        cta: string;
    };
    forTeachers: {
        label: string;
        title: string;
        points: string[];
        note: string;
        cta: string;
    };
    notSection: {
        title: string;
        points: string[];
    };
    howItWorks: {
        title: string;
        steps: { number: string; title: string; description: string }[];
        note: string;
    };
    pricing: {
        label: string;
        title: string;
        description: string;
    };
    finalCta: {
        studentsLabel: string;
        studentsButton: string;
        teachersLabel: string;
        teachersButton: string;
    };
    disclaimer: string;
    footer: string;
}

// About page structure type (عن مصباح)
interface AboutSection {
    pageTitle: string;
    whatIs: { title: string; description: string; subDescription: string };
    why: { title: string; description: string; subDescription: string };
    how: { title: string; steps: string[] };
    nature: { title: string; intro: string; points: string[]; conclusion: string };
    review: { title: string; description: string };
    limits: { title: string; description: string };
    contact: { title: string; description: string; email: string };
}

// FAQ page structure type
interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSection {
    pageTitle: string;
    items: FAQItem[];
}

// Arabic landing page (primary, hand-crafted)
const arHome: HomeSection = {
    hero: {
        title: 'مصباح',
        subtitle: 'دليل معلمي القرآن والعربية والدراسات الإسلامية',
        valueStatement: 'كل معلم هنا تم التأكد من جديته. اختر بنفسك.',
        ctaStudents: 'تصفّح المعلمين',
        ctaTeachers: 'انضم كمعلم',
    },
    forStudents: {
        label: 'للطلاب وأولياء الأمور',
        title: 'ابحث عن معلمك بوضوح',
        points: [
            'ملفات شخصية — كل معلم له صفحة خاصة به',
            'مراجعة يدوية — كل ملف يُراجع قبل النشر',
            'معلومات منظمة — سهلة القراءة والمقارنة',
            'تواصل مباشر — بدون وسيط ولا نظام حجوزات',
        ],
        note: 'مصباح لا يتدخل في العملية التعليمية. القرار لك.',
        cta: 'ابحث عن معلمك',
    },
    forTeachers: {
        label: 'للمعلمين',
        title: 'حضور مهني خاص بك',
        points: [
            'ملف شخصي عام — يظهر في محركات البحث',
            'بدون عمولات — اشتراك سنوي فقط',
            'بدون حجوزات — لا نتدخل في جدولك',
            'أي معلم مرحب به — سواء تعمل مستقلاً أو في مؤسسة',
        ],
        note: 'مصباح لا يرسل لك طلاب. الطلاب يجدونك.',
        cta: 'اعرف المزيد عن الانضمام',
    },
    notSection: {
        title: 'ما ليس مصباح',
        points: [
            'ليس منصة حجوزات — لا جدولة ولا مواعيد',
            'ليس سوقًا إلكترونيًا — لا معاملات مالية بيننا',
            'ليس أكاديمية — لا مناهج ولا إدارة',
            'ليس وسيطًا ماليًا — لا نتعامل مع أموال الطلاب',
            'ليس جهة اعتماد رسمية أو تعليمية',
        ],
    },
    howItWorks: {
        title: 'كيف يعمل مصباح',
        steps: [
            { number: '١', title: 'تقديم الطلب', description: 'المعلم يملأ استمارة التقديم' },
            { number: '٢', title: 'مراجعة يدوية', description: 'نراجع كل طلب بشكل فردي' },
            { number: '٣', title: 'نشر الملف', description: 'الملف يظهر للعموم' },
        ],
        note: 'دور مصباح ينتهي عند عرض المعلومات. التواصل يتم بين الطالب والمعلم مباشرة.',
    },
    pricing: {
        label: 'للمعلمين فقط',
        title: 'الاشتراك',
        description: 'اشتراك سنوي. الدفع يتم بعد قبول الطلب فقط.',
    },
    finalCta: {
        studentsLabel: 'للطلاب',
        studentsButton: 'تصفّح المعلمين',
        teachersLabel: 'للمعلمين',
        teachersButton: 'تقدّم للانضمام',
    },
    disclaimer: 'مصباح دليل عام. المعلومات المعروضة مقدمة من المعلمين ولم يتم التحقق منها بشكل مستقل. الطلاب مسؤولون عن التحقق من مناسبة المعلم. مصباح لا يتحمل أي مسؤولية تعليمية أو قانونية ناتجة عن التواصل بين الطالب والمعلم.',
    footer: 'مصباح — دليل معلمي القرآن والعربية',
};

// English landing page (primary, hand-crafted)
const enHome: HomeSection = {
    hero: {
        title: 'Misbah',
        subtitle: 'Directory for Quran, Arabic & Islamic Studies Teachers',
        valueStatement: 'Every teacher here has been verified for seriousness. You decide.',
        ctaStudents: 'Browse Teachers',
        ctaTeachers: 'Apply as a Teacher',
    },
    forStudents: {
        label: 'For Students & Parents',
        title: 'Find Your Teacher with Clarity',
        points: [
            'Personal profiles — each teacher has their own page',
            'Manual review — every profile is reviewed before publishing',
            'Organized information — easy to read and compare',
            'Direct contact — no middleman, no booking system',
        ],
        note: 'Misbah does not interfere with the teaching process. You decide.',
        cta: 'Find Your Teacher',
    },
    forTeachers: {
        label: 'For Teachers',
        title: 'Your Own Professional Presence',
        points: [
            'Public profile — visible on search engines',
            'No commissions — annual subscription only',
            'No bookings — we do not interfere with your schedule',
            'All teachers welcome — whether independent or employed',
        ],
        note: 'Misbah does not send students to you. Students find you.',
        cta: 'Learn About Joining',
    },
    notSection: {
        title: 'What Misbah Is Not',
        points: [
            'Not a booking platform — no scheduling, no appointments',
            'Not a marketplace — no financial transactions between us',
            'Not an academy — no curriculum, no management',
            'Not a payment intermediary — we do not handle student fees',
            'Not an official accreditation or educational body',
        ],
    },
    howItWorks: {
        title: 'How Misbah Works',
        steps: [
            { number: '1', title: 'Apply', description: 'Teacher submits application' },
            { number: '2', title: 'Review', description: 'We review each application individually' },
            { number: '3', title: 'Publish', description: 'Profile goes public' },
        ],
        note: "Misbah's role ends at displaying information. Contact happens directly between student and teacher.",
    },
    pricing: {
        label: 'For Teachers Only',
        title: 'Subscription',
        description: 'Annual subscription. Payment is made only after application is accepted.',
    },
    finalCta: {
        studentsLabel: 'For Students',
        studentsButton: 'Browse Teachers',
        teachersLabel: 'For Teachers',
        teachersButton: 'Apply to Join',
    },
    disclaimer: 'Misbah is a public directory. Information displayed is provided by teachers and has not been independently verified. Students are responsible for verifying suitability. Misbah bears no educational or legal responsibility for any contact between student and teacher.',
    footer: 'Misbah — Directory for Quran & Arabic Teachers',
};

// Full translations with home object for each language
export const translations = {
    ar: {
        home: arHome,
        directory: 'دليل المعلمين',
        register: 'تقدّم كمعلم',
        subject: 'التخصص',
        format: 'الطريقة',
        all: 'الكل',
        teachers: 'معلم',
        noResults: 'لا توجد نتائج',
        previous: 'السابق',
        next: 'التالي',
        online: 'أونلاين',
        inPerson: 'حضوري',
        hybrid: 'أونلاين وحضوري',
        accepting: 'يقبل طلاب',
        limited: 'محدود',
        notAccepting: 'مغلق',
        backToDirectory: '← العودة للدليل',
        audience: 'الفئة المستهدفة',
        teachingMethod: 'طريقة التدريس',
        experience: 'الخبرة والمؤهلات',
        teachingSample: 'نموذج تعليمي',
        contactMethods: 'طرق التواصل',
        whatsapp: 'واتساب',
        email: 'البريد الإلكتروني',
        telegram: 'تليجرام',
        website: 'الموقع',
        visitWebsite: 'زيارة الموقع',
        kids: 'الأطفال',
        adults: 'الكبار',
        femalesOnly: 'الإناث فقط',
        malesOnly: 'الذكور فقط',
        everyone: 'الجميع',
        quran: 'القرآن الكريم',
        tajweed: 'التجويد',
        arabic: 'اللغة العربية',
        islamicStudies: 'الدراسات الإسلامية',
        // Navigation
        navHome: 'الرئيسية',
        navAbout: 'عن مصباح',
        navFaq: 'الأسئلة الشائعة',
        // About Page (عن مصباح)
        about: {
            pageTitle: 'عن مصباح',
            whatIs: {
                title: 'ما هو مصباح',
                description: 'مصباح دليل مهني عام يضم بروفايلات معلمين مستقلين في القرآن الكريم، اللغة العربية، والدراسات الإسلامية.',
                subDescription: 'يهدف مصباح إلى تسهيل الوصول إلى معلمين يعملون بشكل مستقل، وتمكين الطالب من التعرف عليهم والتواصل معهم مباشرة.',
            },
            why: {
                title: 'لماذا أُنشئ مصباح',
                description: 'أُنشئ مصباح لتوفير مساحة واضحة ومحايدة تجمع بين الطالب والمعلم، تعتمد على التعريف المباشر بالمعلم دون وساطة تعليمية أو نماذج تشغيل معقّدة.',
                subDescription: 'التركيز الأساسي هو التعريف والتواصل، وترك قرار الاستمرار أو عدمه للطرفين.',
            },
            how: {
                title: 'كيف يعمل مصباح',
                steps: [
                    'ينشئ المعلم بروفايلًا تعريفيًا ببياناته وخبرته.',
                    'تتم مراجعة الطلب مراجعة بشرية للتأكد من الجدية وصحة البيانات الأساسية.',
                    'بعد النشر، يصبح البروفايل متاحًا للعموم وقابلًا للظهور في محركات البحث.',
                ],
            },
            nature: {
                title: 'ما طبيعة مصباح',
                intro: 'مصباح:',
                points: [
                    'ليس أكاديمية تعليمية',
                    'ليس منصة حجوزات أو دفع',
                    'ليس جهة اعتماد أو تقييم علمي',
                ],
                conclusion: 'هو دليل تعريفي يهدف إلى التنظيم والتيسير فقط.',
            },
            review: {
                title: 'المراجعة',
                description: 'تتم مراجعة طلبات المعلمين بواسطة معلمين ذوي خبرة فعلية في المجال، وذلك للتحقق من الجدية والالتزام بمعايير العرض، دون تقييم للمستوى العلمي أو إصدار توصيات تعليمية.',
            },
            limits: {
                title: 'حدود الدور',
                description: 'مصباح لا يتدخل في المحتوى التعليمي، ولا في أسلوب التدريس، ولا في تفاصيل الاتفاق بين الطرفين. دوره يقتصر على إتاحة التعريف ومعلومات التواصل مع المعلم.',
            },
            contact: {
                title: 'تواصل',
                description: 'للاستفسارات أو الملاحظات المتعلقة بالموقع:',
                email: 'contact@misbah.site',
            },
        },
        // FAQ Page
        faq: {
            pageTitle: 'الأسئلة الشائعة',
            items: [
                { question: 'هل مصباح منصة تعليمية؟', answer: 'لا. مصباح دليل مهني يعرّف بالمعلمين المستقلين ويسهّل التواصل معهم فقط.' },
                { question: 'هل يتم التدريس داخل مصباح؟', answer: 'لا. التواصل يتم مباشرة بين الطالب والمعلم خارج نطاق الموقع.' },
                { question: 'هل يراجع مصباح المحتوى العلمي للمعلمين؟', answer: 'لا. المراجعة تقتصر على التأكد من الجدية وصحة البيانات الأساسية، دون تقييم علمي أو أكاديمي.' },
                { question: 'هل يعتمد مصباح المعلمين أو يمنح شهادات؟', answer: 'لا. مصباح ليس جهة اعتماد ولا يمنح أي شهادات أو توصيات تعليمية.' },
                { question: 'هل مصباح مسؤول عن نتائج التعلم؟', answer: 'لا. مصباح لا يتدخل في العملية التعليمية، ولا في أسلوب التدريس أو نتائجه.' },
                { question: 'هل يوجد مقابل مادي لاستخدام مصباح؟', answer: 'يتم توضيح أي متطلبات متعلقة بالاشتراك أو الظهور للمعلم أثناء التقديم، ولا يتدخل مصباح في أي اتفاقات مالية بين الطالب والمعلم.' },
                { question: 'ماذا لو لم يتم قبول طلبي كمعلم؟', answer: 'عدم القبول يعني أن الطلب لم يستوفِ معايير العرض أو الجدية المطلوبة حاليًا، ويمكن إعادة التقديم بعد استكمال البيانات.' },
                { question: 'هل يمكن تعديل أو حذف البروفايل؟', answer: 'نعم، يمكن للمعلم طلب تعديل أو حذف بياناته في أي وقت عبر التواصل مع فريق مصباح.' },
                { question: 'كيف يمكن التواصل مع مصباح؟', answer: 'عبر البريد الإلكتروني الرسمي: contact@misbah.site' },
            ],
        },
    },
    en: {
        home: enHome,
        directory: 'Teacher Directory',
        register: 'Apply as Teacher',
        subject: 'Subject',
        format: 'Format',
        all: 'All',
        teachers: 'teachers',
        noResults: 'No results found',
        previous: 'Previous',
        next: 'Next',
        online: 'Online',
        inPerson: 'In-Person',
        hybrid: 'Hybrid',
        accepting: 'Accepting',
        limited: 'Limited',
        notAccepting: 'Closed',
        backToDirectory: '← Back to Directory',
        audience: 'Audience',
        teachingMethod: 'Teaching Method',
        experience: 'Experience & Qualifications',
        teachingSample: 'Teaching Sample',
        contactMethods: 'Contact Methods',
        whatsapp: 'WhatsApp',
        email: 'Email',
        telegram: 'Telegram',
        website: 'Website',
        visitWebsite: 'Visit Website',
        kids: 'Kids',
        adults: 'Adults',
        femalesOnly: 'Females Only',
        malesOnly: 'Males Only',
        everyone: 'Everyone',
        quran: 'Quran',
        tajweed: 'Tajweed',
        arabic: 'Arabic',
        islamicStudies: 'Islamic Studies',
        // Navigation
        navHome: 'Home',
        navAbout: 'About Misbah',
        navFaq: 'FAQ',
        // About Page
        about: {
            pageTitle: 'About Misbah',
            whatIs: {
                title: 'What is Misbah',
                description: 'Misbah is a professional public directory featuring profiles of independent teachers in Quran, Arabic language, and Islamic studies.',
                subDescription: 'Misbah aims to facilitate access to independent teachers, enabling students to learn about them and contact them directly.',
            },
            why: {
                title: 'Why Misbah Was Created',
                description: 'Misbah was created to provide a clear and neutral space that connects students and teachers, based on direct introduction without educational intermediation or complex operating models.',
                subDescription: 'The primary focus is introduction and communication, leaving the decision to continue or not to both parties.',
            },
            how: {
                title: 'How Misbah Works',
                steps: [
                    'The teacher creates an introductory profile with their information and experience.',
                    'The application is reviewed manually to verify seriousness and accuracy of basic information.',
                    'After publication, the profile becomes publicly available and eligible to appear in search engines.',
                ],
            },
            nature: {
                title: 'What is Misbah\'s Nature',
                intro: 'Misbah is:',
                points: [
                    'Not an educational academy',
                    'Not a booking or payment platform',
                    'Not a certification or academic evaluation authority',
                ],
                conclusion: 'It is an introductory directory aimed at organization and facilitation only.',
            },
            review: {
                title: 'Review Process',
                description: 'Teacher applications are reviewed by teachers with real experience in the field, to verify seriousness and compliance with presentation standards, without evaluating academic level or issuing educational recommendations.',
            },
            limits: {
                title: 'Role Limits',
                description: 'Misbah does not interfere with educational content, teaching style, or details of agreements between parties. Its role is limited to providing introduction and contact information for the teacher.',
            },
            contact: {
                title: 'Contact',
                description: 'For inquiries or feedback about the site:',
                email: 'contact@misbah.site',
            },
        },
        // FAQ Page
        faq: {
            pageTitle: 'Frequently Asked Questions',
            items: [
                { question: 'Is Misbah an educational platform?', answer: 'No. Misbah is a professional directory that introduces independent teachers and facilitates communication with them only.' },
                { question: 'Does teaching happen inside Misbah?', answer: 'No. Communication happens directly between student and teacher outside the website.' },
                { question: 'Does Misbah review the academic content of teachers?', answer: 'No. Review is limited to verifying seriousness and accuracy of basic information, without academic or scientific evaluation.' },
                { question: 'Does Misbah certify teachers or grant certificates?', answer: 'No. Misbah is not a certification authority and does not grant any certificates or educational recommendations.' },
                { question: 'Is Misbah responsible for learning outcomes?', answer: 'No. Misbah does not interfere with the educational process, teaching style, or its outcomes.' },
                { question: 'Is there a fee for using Misbah?', answer: 'Any requirements related to subscription or visibility for teachers are clarified during application. Misbah does not interfere with any financial agreements between student and teacher.' },
                { question: 'What if my application as a teacher is not accepted?', answer: 'Non-acceptance means the application did not meet the required presentation or seriousness standards currently. You can reapply after completing the information.' },
                { question: 'Can I edit or delete my profile?', answer: 'Yes, teachers can request to edit or delete their information at any time by contacting the Misbah team.' },
                { question: 'How can I contact Misbah?', answer: 'Via the official email: contact@misbah.site' },
            ],
        },
    },
    // Other languages inherit English home section
    fr: { home: enHome, directory: 'Annuaire des enseignants', register: "S'inscrire comme enseignant", subject: 'Matière', format: 'Format', all: 'Tous', teachers: 'enseignants', noResults: 'Aucun résultat trouvé', previous: 'Précédent', next: 'Suivant', online: 'En ligne', inPerson: 'En personne', hybrid: 'Hybride', accepting: 'Accepte', limited: 'Limité', notAccepting: 'Fermé', backToDirectory: "← Retour à l'annuaire", audience: 'Public', teachingMethod: "Méthode d'enseignement", experience: 'Expérience et qualifications', teachingSample: "Exemple d'enseignement", contactMethods: 'Méthodes de contact', whatsapp: 'WhatsApp', email: 'E-mail', telegram: 'Telegram', website: 'Site web', visitWebsite: 'Visiter le site', kids: 'Enfants', adults: 'Adultes', femalesOnly: 'Femmes uniquement', malesOnly: 'Hommes uniquement', everyone: 'Tout le monde', quran: 'Coran', tajweed: 'Tajweed', arabic: 'Arabe', islamicStudies: 'Études islamiques' },
    de: { home: enHome, directory: 'Lehrerverzeichnis', register: 'Als Lehrer registrieren', subject: 'Fach', format: 'Format', all: 'Alle', teachers: 'Lehrer', noResults: 'Keine Ergebnisse gefunden', previous: 'Zurück', next: 'Weiter', online: 'Online', inPerson: 'Vor Ort', hybrid: 'Hybrid', accepting: 'Annehmend', limited: 'Begrenzt', notAccepting: 'Geschlossen', backToDirectory: '← Zurück zum Verzeichnis', audience: 'Zielgruppe', teachingMethod: 'Unterrichtsmethode', experience: 'Erfahrung und Qualifikationen', teachingSample: 'Unterrichtsprobe', contactMethods: 'Kontaktmethoden', whatsapp: 'WhatsApp', email: 'E-Mail', telegram: 'Telegram', website: 'Webseite', visitWebsite: 'Webseite besuchen', kids: 'Kinder', adults: 'Erwachsene', femalesOnly: 'Nur Frauen', malesOnly: 'Nur Männer', everyone: 'Alle', quran: 'Koran', tajweed: 'Tadschiwid', arabic: 'Arabisch', islamicStudies: 'Islamstudien' },
    es: { home: enHome, directory: 'Directorio de profesores', register: 'Registrarse como profesor', subject: 'Materia', format: 'Formato', all: 'Todos', teachers: 'profesores', noResults: 'No se encontraron resultados', previous: 'Anterior', next: 'Siguiente', online: 'En línea', inPerson: 'Presencial', hybrid: 'Híbrido', accepting: 'Aceptando', limited: 'Limitado', notAccepting: 'Cerrado', backToDirectory: '← Volver al directorio', audience: 'Audiencia', teachingMethod: 'Método de enseñanza', experience: 'Experiencia y calificaciones', teachingSample: 'Muestra de enseñanza', contactMethods: 'Métodos de contacto', whatsapp: 'WhatsApp', email: 'Correo electrónico', telegram: 'Telegram', website: 'Sitio web', visitWebsite: 'Visitar sitio web', kids: 'Niños', adults: 'Adultos', femalesOnly: 'Solo mujeres', malesOnly: 'Solo hombres', everyone: 'Todos', quran: 'Corán', tajweed: 'Tajweed', arabic: 'Árabe', islamicStudies: 'Estudios islámicos' },
    tr: { home: enHome, directory: 'Öğretmen Rehberi', register: 'Öğretmen olarak kaydol', subject: 'Konu', format: 'Format', all: 'Tümü', teachers: 'öğretmen', noResults: 'Sonuç bulunamadı', previous: 'Önceki', next: 'Sonraki', online: 'Çevrimiçi', inPerson: 'Yüz yüze', hybrid: 'Hibrit', accepting: 'Kabul ediyor', limited: 'Sınırlı', notAccepting: 'Kapalı', backToDirectory: '← Rehbere dön', audience: 'Hedef kitle', teachingMethod: 'Öğretim yöntemi', experience: 'Deneyim ve yeterlilikler', teachingSample: 'Öğretim örneği', contactMethods: 'İletişim yöntemleri', whatsapp: 'WhatsApp', email: 'E-posta', telegram: 'Telegram', website: 'Web sitesi', visitWebsite: 'Web sitesini ziyaret et', kids: 'Çocuklar', adults: 'Yetişkinler', femalesOnly: 'Sadece kadınlar', malesOnly: 'Sadece erkekler', everyone: 'Herkes', quran: 'Kuran', tajweed: 'Tecvid', arabic: 'Arapça', islamicStudies: 'İslami çalışmalar' },
    ru: { home: enHome, directory: 'Каталог учителей', register: 'Зарегистрироваться как учитель', subject: 'Предмет', format: 'Формат', all: 'Все', teachers: 'учителей', noResults: 'Результаты не найдены', previous: 'Назад', next: 'Далее', online: 'Онлайн', inPerson: 'Очно', hybrid: 'Гибрид', accepting: 'Принимает', limited: 'Ограничено', notAccepting: 'Закрыто', backToDirectory: '← Назад к каталогу', audience: 'Аудитория', teachingMethod: 'Метод преподавания', experience: 'Опыт и квалификация', teachingSample: 'Пример урока', contactMethods: 'Способы связи', whatsapp: 'WhatsApp', email: 'Эл. почта', telegram: 'Telegram', website: 'Сайт', visitWebsite: 'Посетить сайт', kids: 'Дети', adults: 'Взрослые', femalesOnly: 'Только женщины', malesOnly: 'Только мужчины', everyone: 'Все', quran: 'Коран', tajweed: 'Таджвид', arabic: 'Арабский язык', islamicStudies: 'Исламоведение' },
    pt: { home: enHome, directory: 'Diretório de Professores', register: 'Registrar como Professor', subject: 'Disciplina', format: 'Formato', all: 'Todos', teachers: 'professores', noResults: 'Nenhum resultado encontrado', previous: 'Anterior', next: 'Próximo', online: 'Online', inPerson: 'Presencial', hybrid: 'Híbrido', accepting: 'Aceitando', limited: 'Limitado', notAccepting: 'Fechado', backToDirectory: '← Voltar ao Diretório', audience: 'Público', teachingMethod: 'Método de Ensino', experience: 'Experiência e Qualificações', teachingSample: 'Amostra de Ensino', contactMethods: 'Métodos de Contato', whatsapp: 'WhatsApp', email: 'E-mail', telegram: 'Telegram', website: 'Site', visitWebsite: 'Visitar Site', kids: 'Crianças', adults: 'Adultos', femalesOnly: 'Apenas Mulheres', malesOnly: 'Apenas Homens', everyone: 'Todos', quran: 'Corão', tajweed: 'Tajweed', arabic: 'Árabe', islamicStudies: 'Estudos Islâmicos' },
    it: { home: enHome, directory: 'Elenco Insegnanti', register: 'Registrati come Insegnante', subject: 'Materia', format: 'Formato', all: 'Tutti', teachers: 'insegnanti', noResults: 'Nessun risultato trovato', previous: 'Precedente', next: 'Successivo', online: 'Online', inPerson: 'Di persona', hybrid: 'Ibrido', accepting: 'Accetta', limited: 'Limitato', notAccepting: 'Chiuso', backToDirectory: "← Torna all'Elenco", audience: 'Pubblico', teachingMethod: 'Metodo di Insegnamento', experience: 'Esperienza e Qualifiche', teachingSample: 'Esempio di Insegnamento', contactMethods: 'Metodi di Contatto', whatsapp: 'WhatsApp', email: 'E-mail', telegram: 'Telegram', website: 'Sito Web', visitWebsite: 'Visita Sito', kids: 'Bambini', adults: 'Adulti', femalesOnly: 'Solo Donne', malesOnly: 'Solo Uomini', everyone: 'Tutti', quran: 'Corano', tajweed: 'Tajweed', arabic: 'Arabo', islamicStudies: 'Studi Islamici' },
    ur: { home: enHome, directory: 'اساتذہ کی فہرست', register: 'بطور استاد رجسٹر کریں', subject: 'مضمون', format: 'طریقہ', all: 'سب', teachers: 'اساتذہ', noResults: 'کوئی نتیجہ نہیں ملا', previous: 'پچھلا', next: 'اگلا', online: 'آن لائن', inPerson: 'ذاتی طور پر', hybrid: 'ہائبرڈ', accepting: 'قبول کر رہے', limited: 'محدود', notAccepting: 'بند', backToDirectory: '← فہرست پر واپس', audience: 'ہدف', teachingMethod: 'تدریسی طریقہ', experience: 'تجربہ اور اہلیت', teachingSample: 'تدریسی نمونہ', contactMethods: 'رابطے کے طریقے', whatsapp: 'واٹس ایپ', email: 'ای میل', telegram: 'ٹیلیگرام', website: 'ویب سائٹ', visitWebsite: 'ویب سائٹ دیکھیں', kids: 'بچے', adults: 'بالغ', femalesOnly: 'صرف خواتین', malesOnly: 'صرف مرد', everyone: 'سب', quran: 'قرآن مجید', tajweed: 'تجوید', arabic: 'عربی زبان', islamicStudies: 'اسلامی علوم' },
    id: { home: enHome, directory: 'Direktori Guru', register: 'Daftar sebagai Guru', subject: 'Mata Pelajaran', format: 'Format', all: 'Semua', teachers: 'guru', noResults: 'Tidak ada hasil', previous: 'Sebelumnya', next: 'Berikutnya', online: 'Online', inPerson: 'Tatap Muka', hybrid: 'Hibrid', accepting: 'Menerima', limited: 'Terbatas', notAccepting: 'Ditutup', backToDirectory: '← Kembali ke Direktori', audience: 'Audiens', teachingMethod: 'Metode Pengajaran', experience: 'Pengalaman dan Kualifikasi', teachingSample: 'Contoh Pengajaran', contactMethods: 'Metode Kontak', whatsapp: 'WhatsApp', email: 'Email', telegram: 'Telegram', website: 'Situs Web', visitWebsite: 'Kunjungi Situs', kids: 'Anak-anak', adults: 'Dewasa', femalesOnly: 'Wanita Saja', malesOnly: 'Pria Saja', everyone: 'Semua', quran: 'Al-Quran', tajweed: 'Tajwid', arabic: 'Bahasa Arab', islamicStudies: 'Studi Islam' },
    ms: { home: enHome, directory: 'Direktori Guru', register: 'Daftar sebagai Guru', subject: 'Subjek', format: 'Format', all: 'Semua', teachers: 'guru', noResults: 'Tiada hasil dijumpai', previous: 'Sebelum', next: 'Seterusnya', online: 'Dalam talian', inPerson: 'Bersemuka', hybrid: 'Hibrid', accepting: 'Menerima', limited: 'Terhad', notAccepting: 'Ditutup', backToDirectory: '← Kembali ke Direktori', audience: 'Sasaran', teachingMethod: 'Kaedah Pengajaran', experience: 'Pengalaman dan Kelayakan', teachingSample: 'Contoh Pengajaran', contactMethods: 'Kaedah Hubungan', whatsapp: 'WhatsApp', email: 'E-mel', telegram: 'Telegram', website: 'Laman Web', visitWebsite: 'Lawati Laman', kids: 'Kanak-kanak', adults: 'Dewasa', femalesOnly: 'Wanita Sahaja', malesOnly: 'Lelaki Sahaja', everyone: 'Semua', quran: 'Al-Quran', tajweed: 'Tajwid', arabic: 'Bahasa Arab', islamicStudies: 'Pengajian Islam' },
    bn: { home: enHome, directory: 'শিক্ষক তালিকা', register: 'শিক্ষক হিসেবে নিবন্ধন', subject: 'বিষয়', format: 'ফরম্যাট', all: 'সব', teachers: 'শিক্ষক', noResults: 'কোন ফলাফল পাওয়া যায়নি', previous: 'আগের', next: 'পরের', online: 'অনলাইন', inPerson: 'সশরীরে', hybrid: 'হাইব্রিড', accepting: 'গ্রহণ করছে', limited: 'সীমিত', notAccepting: 'বন্ধ', backToDirectory: '← তালিকায় ফিরে যান', audience: 'দর্শক', teachingMethod: 'শিক্ষণ পদ্ধতি', experience: 'অভিজ্ঞতা ও যোগ্যতা', teachingSample: 'শিক্ষণ নমুনা', contactMethods: 'যোগাযোগ পদ্ধতি', whatsapp: 'হোয়াটসঅ্যাপ', email: 'ইমেইল', telegram: 'টেলিগ্রাম', website: 'ওয়েবসাইট', visitWebsite: 'ওয়েবসাইট দেখুন', kids: 'শিশু', adults: 'প্রাপ্তবয়স্ক', femalesOnly: 'শুধু মহিলা', malesOnly: 'শুধু পুরুষ', everyone: 'সবাই', quran: 'কুরআন', tajweed: 'তাজবীদ', arabic: 'আরবি', islamicStudies: 'ইসলামিক স্টাডিজ' },
    hi: { home: enHome, directory: 'शिक्षक निर्देशिका', register: 'शिक्षक के रूप में पंजीकरण', subject: 'विषय', format: 'प्रारूप', all: 'सभी', teachers: 'शिक्षक', noResults: 'कोई परिणाम नहीं मिला', previous: 'पिछला', next: 'अगला', online: 'ऑनलाइन', inPerson: 'व्यक्तिगत', hybrid: 'हाइब्रिड', accepting: 'स्वीकार कर रहे', limited: 'सीमित', notAccepting: 'बंद', backToDirectory: '← निर्देशिका पर वापस', audience: 'दर्शक', teachingMethod: 'शिक्षण विधि', experience: 'अनुभव और योग्यता', teachingSample: 'शिक्षण नमूना', contactMethods: 'संपर्क विधियां', whatsapp: 'व्हाट्सएप', email: 'ईमेल', telegram: 'टेलीग्राम', website: 'वेबसाइट', visitWebsite: 'वेबसाइट देखें', kids: 'बच्चे', adults: 'वयस्क', femalesOnly: 'केवल महिलाएं', malesOnly: 'केवल पुरुष', everyone: 'सभी', quran: 'कुरान', tajweed: 'तजवीद', arabic: 'अरबी', islamicStudies: 'इस्लामी अध्ययन' },
    sw: { home: enHome, directory: 'Orodha ya Walimu', register: 'Jiandikishe kama Mwalimu', subject: 'Somo', format: 'Muundo', all: 'Yote', teachers: 'walimu', noResults: 'Hakuna matokeo yaliyopatikana', previous: 'Iliyotangulia', next: 'Ifuatayo', online: 'Mtandaoni', inPerson: 'Ana kwa Ana', hybrid: 'Mseto', accepting: 'Anakubali', limited: 'Mdogo', notAccepting: 'Imefungwa', backToDirectory: '← Rudi Orodhani', audience: 'Hadhira', teachingMethod: 'Njia ya Kufundisha', experience: 'Uzoefu na Sifa', teachingSample: 'Sampuli ya Kufundisha', contactMethods: 'Njia za Mawasiliano', whatsapp: 'WhatsApp', email: 'Barua pepe', telegram: 'Telegram', website: 'Tovuti', visitWebsite: 'Tembelea Tovuti', kids: 'Watoto', adults: 'Watu wazima', femalesOnly: 'Wanawake Pekee', malesOnly: 'Wanaume Pekee', everyone: 'Kila mtu', quran: 'Qurani', tajweed: 'Tajweed', arabic: 'Kiarabu', islamicStudies: 'Masomo ya Kiislamu' },
    ha: { home: enHome, directory: 'Directory na Malamai', register: 'Yi rajista a matsayin Malami', subject: 'Batun', format: 'Tsari', all: 'Duka', teachers: 'malamai', noResults: 'Babu sakamakon da aka samu', previous: 'Na baya', next: 'Na gaba', online: 'A kan layi', inPerson: 'Kai da kai', hybrid: 'Hadewa', accepting: 'Yana karba', limited: 'Iyaka', notAccepting: 'An rufe', backToDirectory: '← Koma Directory', audience: 'Masu sauraro', teachingMethod: 'Hanyar Koyarwa', experience: 'Kwarewa da Cancantar', teachingSample: 'Samfurin Koyarwa', contactMethods: 'Hanyoyin Tuntuba', whatsapp: 'WhatsApp', email: 'Imel', telegram: 'Telegram', website: 'Yanar gizo', visitWebsite: 'Ziyarci Yanar gizo', kids: 'Yara', adults: 'Manya', femalesOnly: 'Mata kawai', malesOnly: 'Maza kawai', everyone: 'Kowa', quran: 'Al-Qurani', tajweed: 'Tajweed', arabic: 'Larabci', islamicStudies: 'Nazarin Musulunci' },
    so: { home: enHome, directory: 'Hagaha Macallimiinta', register: 'Isdiiwaangeli Macallin', subject: 'Mawduuca', format: 'Qaab', all: 'Dhammaan', teachers: 'macallimiin', noResults: 'Wax natiijo ah lama helin', previous: 'Ka horeysay', next: 'Xiga', online: 'Khadka tooska ah', inPerson: 'Shakhsi ahaan', hybrid: 'Isku dhafan', accepting: 'Aqbalaya', limited: 'Xaddidan', notAccepting: 'Xidhan', backToDirectory: '← U noqo Hagaha', audience: 'Dhagaystaha', teachingMethod: 'Habka Waxbaridda', experience: 'Khibrad iyo Aqoon', teachingSample: 'Tusaale Waxbarid', contactMethods: 'Hababka La Xariirka', whatsapp: 'WhatsApp', email: 'Iimeel', telegram: 'Telegram', website: 'Shabakada', visitWebsite: 'Booqo Shabakada', kids: 'Carruurta', adults: 'Dadka waaweyn', femalesOnly: 'Haweenka Kaliya', malesOnly: 'Ragga Kaliya', everyone: 'Qofkasta', quran: 'Quraanka', tajweed: 'Tajweed', arabic: 'Carabi', islamicStudies: 'Daraasadaha Islaamka' },
    fa: { home: enHome, directory: 'فهرست معلمان', register: 'ثبت‌نام به عنوان معلم', subject: 'موضوع', format: 'فرمت', all: 'همه', teachers: 'معلم', noResults: 'نتیجه‌ای یافت نشد', previous: 'قبلی', next: 'بعدی', online: 'آنلاین', inPerson: 'حضوری', hybrid: 'ترکیبی', accepting: 'پذیرش', limited: 'محدود', notAccepting: 'بسته', backToDirectory: '← بازگشت به فهرست', audience: 'مخاطب', teachingMethod: 'روش تدریس', experience: 'تجربه و صلاحیت‌ها', teachingSample: 'نمونه تدریس', contactMethods: 'روش‌های تماس', whatsapp: 'واتساپ', email: 'ایمیل', telegram: 'تلگرام', website: 'وب‌سایت', visitWebsite: 'بازدید از سایت', kids: 'کودکان', adults: 'بزرگسالان', femalesOnly: 'فقط خانم‌ها', malesOnly: 'فقط آقایان', everyone: 'همه', quran: 'قرآن کریم', tajweed: 'تجوید', arabic: 'زبان عربی', islamicStudies: 'مطالعات اسلامی' },
    nl: { home: enHome, directory: 'Lerarenlijst', register: 'Registreer als Leraar', subject: 'Vak', format: 'Formaat', all: 'Alle', teachers: 'leraren', noResults: 'Geen resultaten gevonden', previous: 'Vorige', next: 'Volgende', online: 'Online', inPerson: 'Persoonlijk', hybrid: 'Hybride', accepting: 'Accepteert', limited: 'Beperkt', notAccepting: 'Gesloten', backToDirectory: '← Terug naar Directory', audience: 'Doelgroep', teachingMethod: 'Lesmethode', experience: 'Ervaring en Kwalificaties', teachingSample: 'Lesvoorbeeld', contactMethods: 'Contactmethoden', whatsapp: 'WhatsApp', email: 'E-mail', telegram: 'Telegram', website: 'Website', visitWebsite: 'Bezoek Website', kids: 'Kinderen', adults: 'Volwassenen', femalesOnly: 'Alleen Vrouwen', malesOnly: 'Alleen Mannen', everyone: 'Iedereen', quran: 'Koran', tajweed: 'Tajweed', arabic: 'Arabisch', islamicStudies: 'Islamitische Studies' },
    pl: { home: enHome, directory: 'Katalog Nauczycieli', register: 'Zarejestruj się jako Nauczyciel', subject: 'Przedmiot', format: 'Format', all: 'Wszystkie', teachers: 'nauczycieli', noResults: 'Nie znaleziono wyników', previous: 'Poprzedni', next: 'Następny', online: 'Online', inPerson: 'Osobiście', hybrid: 'Hybrydowy', accepting: 'Przyjmuje', limited: 'Ograniczone', notAccepting: 'Zamknięte', backToDirectory: '← Powrót do Katalogu', audience: 'Odbiorcy', teachingMethod: 'Metoda Nauczania', experience: 'Doświadczenie i Kwalifikacje', teachingSample: 'Przykład Nauczania', contactMethods: 'Metody Kontaktu', whatsapp: 'WhatsApp', email: 'E-mail', telegram: 'Telegram', website: 'Strona WWW', visitWebsite: 'Odwiedź Stronę', kids: 'Dzieci', adults: 'Dorośli', femalesOnly: 'Tylko Kobiety', malesOnly: 'Tylko Mężczyźni', everyone: 'Wszyscy', quran: 'Koran', tajweed: 'Tajweed', arabic: 'Arabski', islamicStudies: 'Studia Islamskie' },
} as const;

// Export types
export type TranslationKeys = keyof typeof translations.en;
export type TranslationType = typeof translations.en;

export function getTranslation(locale: string): TranslationType {
    const trans = translations[locale as keyof typeof translations];
    if (trans) {
        return trans as unknown as TranslationType;
    }
    return translations.en as unknown as TranslationType;
}
