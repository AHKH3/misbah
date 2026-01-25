const fs = require('fs');
const path = require('path');

const localesDir = '/home/abdo3342/Development/misbah/src/lib/i18n/locales';

const faqTranslations = {
    fr: [
        { question: "Qu'est-ce que Misbah?", answer: "Misbah est un annuaire en ligne qui répertorie les enseignants du Coran, de la langue arabe et des études islamiques, avec les coordonnées de chaque enseignant." },
        { question: "Misbah est-il une plateforme éducative?", answer: "Non. Misbah n'est pas une plateforme éducative. Nous affichons uniquement les informations des enseignants. Les cours et la communication se font directement entre l'étudiant et l'enseignant en dehors du site." },
        { question: "Misbah est-il responsable de la qualité de l'enseignement?", answer: "Non. Misbah ne garantit pas la qualité de l'enseignement et n'assume aucune responsabilité quant à la relation entre l'étudiant et l'enseignant." },
        { question: "Misbah gère-t-il les paiements?", answer: "Non. Tout arrangement financier entre l'étudiant et l'enseignant est complètement indépendant de Misbah." },
        { question: "Comment puis-je m'inscrire en tant qu'enseignant?", answer: "Vous pouvez postuler via la page d'inscription. Nous examinerons votre candidature et vous contacterons." },
        { question: "Y a-t-il des frais pour les étudiants?", answer: "Non. La navigation et l'accès aux informations des enseignants sont entièrement gratuits pour les étudiants." },
        { question: "Y a-t-il des frais pour les enseignants?", answer: "Oui, il y a un abonnement annuel symbolique pour les enseignants après l'acceptation de leur candidature." }
    ],
    es: [
        { question: "¿Qué es Misbah?", answer: "Misbah es un directorio en línea que muestra profesores del Sagrado Corán, lengua árabe y estudios islámicos, con información de contacto de cada profesor." },
        { question: "¿Es Misbah una plataforma educativa?", answer: "No. Misbah no es una plataforma educativa. Solo mostramos información de profesores. Las clases y la comunicación ocurren directamente entre el estudiante y el profesor fuera del sitio." },
        { question: "¿Es Misbah responsable de la calidad de enseñanza?", answer: "No. Misbah no garantiza la calidad de enseñanza y no asume ninguna responsabilidad por la relación entre estudiante y profesor." },
        { question: "¿Misbah maneja los pagos?", answer: "No. Cualquier acuerdo financiero entre estudiante y profesor es completamente independiente de Misbah." },
        { question: "¿Cómo puedo unirme como profesor?", answer: "Puedes aplicar a través de la página de registro. Revisaremos tu solicitud y te contactaremos." },
        { question: "¿Hay tarifas para estudiantes?", answer: "No. Navegar y acceder a la información de los profesores es completamente gratis para los estudiantes." },
        { question: "¿Hay tarifas para profesores?", answer: "Sí, hay una suscripción anual simbólica para profesores después de la aceptación de su solicitud." }
    ],
    de: [
        { question: "Was ist Misbah?", answer: "Misbah ist ein Online-Verzeichnis, das Lehrer des Heiligen Korans, der arabischen Sprache und islamischer Studien mit Kontaktinformationen für jeden Lehrer anzeigt." },
        { question: "Ist Misbah eine Bildungsplattform?", answer: "Nein. Misbah ist keine Bildungsplattform. Wir zeigen nur Lehrerinformationen. Unterricht und Kommunikation finden direkt zwischen Schüler und Lehrer außerhalb der Seite statt." },
        { question: "Ist Misbah für die Unterrichtsqualität verantwortlich?", answer: "Nein. Misbah garantiert keine Unterrichtsqualität und trägt keine Verantwortung für die Beziehung zwischen Schüler und Lehrer." },
        { question: "Verwaltet Misbah Zahlungen?", answer: "Nein. Jede finanzielle Vereinbarung zwischen Schüler und Lehrer ist völlig unabhängig von Misbah." },
        { question: "Wie kann ich als Lehrer beitreten?", answer: "Sie können sich über die Registrierungsseite bewerben. Wir werden Ihre Bewerbung prüfen und Sie kontaktieren." },
        { question: "Gibt es Gebühren für Schüler?", answer: "Nein. Das Durchsuchen und der Zugriff auf Lehrerinformationen ist für Schüler völlig kostenlos." },
        { question: "Gibt es Gebühren für Lehrer?", answer: "Ja, es gibt ein symbolisches Jahresabonnement für Lehrer nach Annahme ihrer Bewerbung." }
    ],
    it: [
        { question: "Cos'è Misbah?", answer: "Misbah è una directory online che mostra insegnanti del Sacro Corano, lingua araba e studi islamici, con informazioni di contatto per ogni insegnante." },
        { question: "Misbah è una piattaforma educativa?", answer: "No. Misbah non è una piattaforma educativa. Mostriamo solo informazioni sugli insegnanti. Le lezioni e la comunicazione avvengono direttamente tra studente e insegnante fuori dal sito." },
        { question: "Misbah è responsabile della qualità dell'insegnamento?", answer: "No. Misbah non garantisce la qualità dell'insegnamento e non si assume alcuna responsabilità per il rapporto tra studente e insegnante." },
        { question: "Misbah gestisce i pagamenti?", answer: "No. Qualsiasi accordo finanziario tra studente e insegnante è completamente indipendente da Misbah." },
        { question: "Come posso iscrivermi come insegnante?", answer: "Puoi candidarti attraverso la pagina di registrazione. Esamineremo la tua candidatura e ti contatteremo." },
        { question: "Ci sono tariffe per gli studenti?", answer: "No. La navigazione e l'accesso alle informazioni sugli insegnanti sono completamente gratuiti per gli studenti." },
        { question: "Ci sono tariffe per gli insegnanti?", answer: "Sì, c'è un abbonamento annuale simbolico per gli insegnanti dopo l'accettazione della loro candidatura." }
    ],
    pt: [
        { question: "O que é o Misbah?", answer: "Misbah é um diretório online que exibe professores do Sagrado Alcorão, língua árabe e estudos islâmicos, com informações de contato para cada professor." },
        { question: "Misbah é uma plataforma educacional?", answer: "Não. Misbah não é uma plataforma educacional. Exibimos apenas informações de professores. Aulas e comunicação acontecem diretamente entre aluno e professor fora do site." },
        { question: "Misbah é responsável pela qualidade do ensino?", answer: "Não. Misbah não garante a qualidade do ensino e não assume nenhuma responsabilidade pelo relacionamento entre aluno e professor." },
        { question: "Misbah gerencia pagamentos?", answer: "Não. Qualquer acordo financeiro entre aluno e professor é completamente independente do Misbah." },
        { question: "Como posso me juntar como professor?", answer: "Você pode se candidatar através da página de registro. Analisaremos sua candidatura e entraremos em contato." },
        { question: "Existem taxas para alunos?", answer: "Não. Navegar e acessar informações de professores é completamente gratuito para alunos." },
        { question: "Existem taxas para professores?", answer: "Sim, há uma assinatura anual simbólica para professores após a aceitação de sua candidatura." }
    ],
    tr: [
        { question: "Misbah nedir?", answer: "Misbah, Kur'an-ı Kerim, Arapça ve İslami çalışmalar öğretmenlerini gösteren, her öğretmen için iletişim bilgilerini içeren online bir rehberdir." },
        { question: "Misbah bir eğitim platformu mu?", answer: "Hayır. Misbah eğitim platformu değildir. Sadece öğretmen bilgilerini gösteririz. Dersler ve iletişim öğrenci ile öğretmen arasında site dışında gerçekleşir." },
        { question: "Misbah öğretim kalitesinden sorumlu mu?", answer: "Hayır. Misbah öğretim kalitesini garanti etmez ve öğrenci ile öğretmen arasındaki ilişkiden sorumluluk taşımaz." },
        { question: "Misbah ödemeleri yönetiyor mu?", answer: "Hayır. Öğrenci ve öğretmen arasındaki herhangi bir mali düzenleme Misbah'tan tamamen bağımsızdır." },
        { question: "Öğretmen olarak nasıl katılabilirim?", answer: "Kayıt sayfasından başvurabilirsiniz. Başvurunuzu inceleyip sizinle iletişime geçeceğiz." },
        { question: "Öğrenciler için ücret var mı?", answer: "Hayır. Öğretmen bilgilerine göz atmak ve erişmek öğrenciler için tamamen ücretsizdir." },
        { question: "Öğretmenler için ücret var mı?", answer: "Evet, başvuruları kabul edildikten sonra öğretmenler için sembolik bir yıllık abonelik vardır." }
    ],
    ru: [
        { question: "Что такое Misbah?", answer: "Misbah - это онлайн-справочник учителей Священного Корана, арабского языка и исламских наук с контактной информацией каждого учителя." },
        { question: "Является ли Misbah образовательной платформой?", answer: "Нет. Misbah не является образовательной платформой. Мы только отображаем информацию об учителях. Уроки и общение происходят напрямую между студентом и учителем вне сайта." },
        { question: "Misbah несет ответственность за качество обучения?", answer: "Нет. Misbah не гарантирует качество обучения и не несет ответственности за отношения между студентом и учителем." },
        { question: "Misbah обрабатывает платежи?", answer: "Нет. Любые финансовые договоренности между студентом и учителем полностью независимы от Misbah." },
        { question: "Как я могу присоединиться в качестве учителя?", answer: "Вы можете подать заявку через страницу регистрации. Мы рассмотрим вашу заявку и свяжемся с вами." },
        { question: "Есть ли плата для студентов?", answer: "Нет. Просмотр и доступ к информации об учителях полностью бесплатны для студентов." },
        { question: "Есть ли плата для учителей?", answer: "Да, существует символическая годовая подписка для учителей после принятия их заявки." }
    ],
    nl: [
        { question: "Wat is Misbah?", answer: "Misbah is een online gids die leraren van de Heilige Koran, Arabische taal en islamitische studies toont, met contactgegevens voor elke leraar." },
        { question: "Is Misbah een educatief platform?", answer: "Nee. Misbah is geen educatief platform. We tonen alleen informatie over leraren. Lessen en communicatie vinden direct plaats tussen student en leraar buiten de site." },
        { question: "Is Misbah verantwoordelijk voor de onderwijskwaliteit?", answer: "Nee. Misbah garandeert geen onderwijskwaliteit en draagt geen verantwoordelijkheid voor de relatie tussen student en leraar." },
        { question: "Verwerkt Misbah betalingen?", answer: "Nee. Elke financiële regeling tussen student en leraar is volledig onafhankelijk van Misbah." },
        { question: "Hoe kan ik meedoen als leraar?", answer: "Je kunt je aanmelden via de registratiepagina. We zullen je aanmelding beoordelen en contact met je opnemen." },
        { question: "Zijn er kosten voor studenten?", answer: "Nee. Browsen en toegang tot informatie over leraren is volledig gratis voor studenten." },
        { question: "Zijn er kosten voor leraren?", answer: "Ja, er is een symbolisch jaarabonnement voor leraren na acceptatie van hun aanmelding." }
    ],
    pl: [
        { question: "Czym jest Misbah?", answer: "Misbah to katalog online wyświetlający nauczycieli Świętego Koranu, języka arabskiego i studiów islamskich, z danymi kontaktowymi każdego nauczyciela." },
        { question: "Czy Misbah jest platformą edukacyjną?", answer: "Nie. Misbah nie jest platformą edukacyjną. Wyświetlamy tylko informacje o nauczycielach. Lekcje i komunikacja odbywają się bezpośrednio między uczniem a nauczycielem poza stroną." },
        { question: "Czy Misbah odpowiada za jakość nauczania?", answer: "Nie. Misbah nie gwarantuje jakości nauczania i nie ponosi odpowiedzialności za relację między uczniem a nauczycielem." },
        { question: "Czy Misbah obsługuje płatności?", answer: "Nie. Wszelkie ustalenia finansowe między uczniem a nauczycielem są całkowicie niezależne od Misbah." },
        { question: "Jak mogę dołączyć jako nauczyciel?", answer: "Możesz aplikować poprzez stronę rejestracji. Przeanalizujemy twoją aplikację i skontaktujemy się z tobą." },
        { question: "Czy są opłaty dla uczniów?", answer: "Nie. Przeglądanie i dostęp do informacji o nauczycielach jest całkowicie bezpłatny dla uczniów." },
        { question: "Czy są opłaty dla nauczycieli?", answer: "Tak, istnieje symboliczna roczna subskrypcja dla nauczycieli po zaakceptowaniu ich aplikacji." }
    ],
    id: [
        { question: "Apa itu Misbah?", answer: "Misbah adalah direktori online yang menampilkan guru Al-Quran, bahasa Arab, dan studi Islam, dengan informasi kontak untuk setiap guru." },
        { question: "Apakah Misbah platform pendidikan?", answer: "Tidak. Misbah bukan platform pendidikan. Kami hanya menampilkan informasi guru. Pelajaran dan komunikasi terjadi langsung antara siswa dan guru di luar situs." },
        { question: "Apakah Misbah bertanggung jawab atas kualitas pengajaran?", answer: "Tidak. Misbah tidak menjamin kualitas pengajaran dan tidak bertanggung jawab atas hubungan antara siswa dan guru." },
        { question: "Apakah Misbah menangani pembayaran?", answer: "Tidak. Pengaturan keuangan antara siswa dan guru sepenuhnya independen dari Misbah." },
        { question: "Bagaimana cara bergabung sebagai guru?", answer: "Anda dapat mendaftar melalui halaman registrasi. Kami akan meninjau aplikasi Anda dan menghubungi Anda." },
        { question: "Apakah ada biaya untuk siswa?", answer: "Tidak. Menelusuri dan mengakses informasi guru sepenuhnya gratis untuk siswa." },
        { question: "Apakah ada biaya untuk guru?", answer: "Ya, ada langganan tahunan simbolis untuk guru setelah aplikasi mereka diterima." }
    ],
    ms: [
        { question: "Apakah Misbah?", answer: "Misbah ialah direktori dalam talian yang memaparkan guru Al-Quran, bahasa Arab, dan kajian Islam, dengan maklumat hubungan untuk setiap guru." },
        { question: "Adakah Misbah platform pendidikan?", answer: "Tidak. Misbah bukan platform pendidikan. Kami hanya memaparkan maklumat guru. Pelajaran dan komunikasi berlaku terus antara pelajar dan guru di luar laman." },
        { question: "Adakah Misbah bertanggungjawab terhadap kualiti pengajaran?", answer: "Tidak. Misbah tidak menjamin kualiti pengajaran dan tidak bertanggungjawab terhadap hubungan antara pelajar dan guru." },
        { question: "Adakah Misbah mengendalikan pembayaran?", answer: "Tidak. Sebarang peraturan kewangan antara pelajar dan guru adalah bebas sepenuhnya daripada Misbah." },
        { question: "Bagaimana saya boleh menyertai sebagai guru?", answer: "Anda boleh memohon melalui halaman pendaftaran. Kami akan mengkaji permohonan anda dan menghubungi anda." },
        { question: "Adakah yuran untuk pelajar?", answer: "Tidak. Melayari dan mengakses maklumat guru adalah percuma sepenuhnya untuk pelajar." },
        { question: "Apakah yuran untuk guru?", answer: "Ya, terdapat langganan tahunan simbolik untuk guru selepas permohonan mereka diterima." }
    ],
    ur: [
        { question: "مصباح کیا ہے؟", answer: "مصباح ایک آن لائن ڈائرکٹری ہے جو قرآن پاک، عربی زبان اور اسلامی علوم کے اساتذہ کو دکھاتی ہے، ہر استاد کے لیے رابطے کی معلومات کے ساتھ۔" },
        { question: "کیا مصباح تعلیمی پلیٹ فارم ہے؟", answer: "نہیں۔ مصباح تعلیمی پلیٹ فارم نہیں ہے۔ ہم صرف اساتذہ کی معلومات دکھاتے ہیں۔ اسباق اور رابطہ طالب علم اور استاد کے درمیان سائٹ سے باہر براہ راست ہوتا ہے۔" },
        { question: "کیا مصباح تدریس کے معیار کی ذمہ دار ہے؟", answer: "نہیں۔ مصباح تدریس کے معیار کی ضمانت نہیں دیتا اور طالب علم اور استاد کے درمیان تعلق کی کوئی ذمہ داری نہیں لیتا۔" },
        { question: "کیا مصباح ادائیگیوں کو ہینڈل کرتا ہے؟", answer: "نہیں۔ طالب علم اور استاد کے درمیان کوئی بھی مالی انتظام مصباح سے مکمل طور پر آزاد ہے۔" },
        { question: "میں استاد کے طور پر کیسے شامل ہو سکتا ہوں؟", answer: "آپ رجسٹریشن صفحہ کے ذریعے درخواست دے سکتے ہیں۔ ہم آپ کی درخواست کا جائزہ لیں گے اور آپ سے رابطہ کریں گے۔" },
        { question: "کیا طلباء کے لیے فیس ہے؟", answer: "نہیں۔ اساتذہ کی معلومات کو دیکھنا اور رسائی حاصل کرنا طلباء کے لیے مکمل طور پر مفت ہے۔" },
        { question: "کیا اساتذہ کے لیے فیس ہے؟", answer: "ہاں، ان کی درخواست کی منظوری کے بعد اساتذہ کے لیے سالانہ علامتی سبسکرپشن ہے۔" }
    ],
    fa: [
        { question: "مصباح چیست؟", answer: "مصباح یک دایرکتوری آنلاین است که معلمان قرآن کریم، زبان عربی و مطالعات اسلامی را با اطلاعات تماس هر معلم نمایش می‌دهد." },
        { question: "آیا مصباح یک پلتفرم آموزشی است؟", answer: "خیر. مصباح پلتفرم آموزشی نیست. ما فقط اطلاعات معلمان را نمایش می‌دهیم. درس‌ها و ارتباطات مستقیماً بین دانش‌آموز و معلم خارج از سایت اتفاق می‌افتد." },
        { question: "آیا مصباح مسئول کیفیت تدریس است؟", answer: "خیر. مصباح کیفیت تدریس را تضمین نمی‌کند و هیچ مسئولیتی در قبال رابطه بین دانش‌آموز و معلم ندارد." },
        { question: "آیا مصباح پرداخت‌ها را مدیریت می‌کند؟", answer: "خیر. هرگونه توافق مالی بین دانش‌آموز و معلم کاملاً مستقل از مصباح است." },
        { question: "چگونه می‌توانم به عنوان معلم بپیوندم؟", answer: "می‌توانید از طریق صفحه ثبت‌نام درخواست دهید. ما درخواست شما را بررسی می‌کنیم و با شما تماس می‌گیریم." },
        { question: "آیا برای دانش‌آموزان هزینه‌ای وجود دارد؟", answer: "خیر. مرور و دسترسی به اطلاعات معلمان برای دانش‌آموزان کاملاً رایگان است." },
        { question: "آیا برای معلمان هزینه‌ای وجود دارد؟", answer: "بله، پس از پذیرش درخواست، اشتراک سالانه نمادین برای معلمان وجود دارد." }
    ],
    bn: [
        { question: "মিসবাহ কী?", answer: "মিসবাহ একটি অনলাইন ডিরেক্টরি যা পবিত্র কুরআন, আরবি ভাষা এবং ইসলামিক অধ্যয়নের শিক্ষকদের প্রতিটি শিক্ষকের যোগাযোগের তথ্য সহ প্রদর্শন করে।" },
        { question: "মিসবাহ কি একটি শিক্ষামূলক প্ল্যাটফর্ম?", answer: "না। মিসবাহ শিক্ষামূলক প্ল্যাটফর্ম নয়। আমরা শুধুমাত্র শিক্ষকের তথ্য প্রদর্শন করি। পাঠ এবং যোগাযোগ সাইটের বাইরে শিক্ষার্থী এবং শিক্ষকের মধ্যে সরাসরি ঘটে।" },
        { question: "মিসবাহ কি শিক্ষার মানের জন্য দায়ী?", answer: "না। মিসবাহ শিক্ষার মান নিশ্চিত করে না এবং শিক্ষার্থী ও শিক্ষকের সম্পর্কের জন্য কোনো দায় বহন করে না।" },
        { question: "মিসবাহ কি পেমেন্ট পরিচালনা করে?", answer: "না। শিক্ষার্থী এবং শিক্ষকের মধ্যে যেকোনো আর্থিক ব্যবস্থা মিসবাহ থেকে সম্পূর্ণ স্বাধীন।" },
        { question: "আমি কিভাবে শিক্ষক হিসেবে যোগ দিতে পারি?", answer: "আপনি নিবন্ধন পৃষ্ঠার মাধ্যমে আবেদন করতে পারেন। আমরা আপনার আবেদন পর্যালোচনা করব এবং আপনার সাথে যোগাযোগ করব।" },
        { question: "শিক্ষার্থীদের জন্য কি ফি আছে?", answer: "না। শিক্ষকের তথ্য ব্রাউজ এবং অ্যাক্সেস করা শিক্ষার্থীদের জন্য সম্পূর্ণ বিনামূল্যে।" },
        { question: "শিক্ষকদের জন্য কি ফি আছে?", answer: "হ্যাঁ, তাদের আবেদন গৃহীত হওয়ার পরে শিক্ষকদের জন্য একটি প্রতীকী বার্ষিক সাবস্ক্রিপশন রয়েছে।" }
    ],
    hi: [
        { question: "मिस्बाह क्या है?", answer: "मिस्बाह एक ऑनलाइन निर्देशिका है जो पवित्र कुरान, अरबी भाषा और इस्लामिक अध्ययन के शिक्षकों को प्रत्येक शिक्षक की संपर्क जानकारी के साथ प्रदर्शित करती है।" },
        { question: "क्या मिस्बाह एक शैक्षिक मंच है?", answer: "नहीं। मिस्बाह शैक्षिक मंच नहीं है। हम केवल शिक्षक जानकारी प्रदर्शित करते हैं। पाठ और संचार छात्र और शिक्षक के बीच सीधे साइट के बाहर होता है।" },
        { question: "क्या मिस्बाह शिक्षण गुणवत्ता के लिए जिम्मेदार है?", answer: "नहीं। मिस्बाह शिक्षण गुणवत्ता की गारंटी नहीं देता और छात्र और शिक्षक के बीच संबंध के लिए कोई जिम्मेदारी नहीं लेता।" },
        { question: "क्या मिस्बाह भुगतान संभालता है?", answer: "नहीं। छात्र और शिक्षक के बीच कोई भी वित्तीय व्यवस्था मिस्बाह से पूरी तरह स्वतंत्र है।" },
        { question: "मैं शिक्षक के रूप में कैसे शामिल हो सकता हूं?", answer: "आप पंजीकरण पृष्ठ के माध्यम से आवेदन कर सकते हैं। हम आपके आवेदन की समीक्षा करेंगे और आपसे संपर्क करेंगे।" },
        { question: "क्या छात्रों के लिए शुल्क है?", answer: "नहीं। शिक्षक जानकारी ब्राउज़ करना और एक्सेस करना छात्रों के लिए पूरी तरह से मुफ्त है।" },
        { question: "क्या शिक्षकों के लिए शुल्क है?", answer: "हां, उनके आवेदन की स्वीकृति के बाद शिक्षकों के लिए एक प्रतीकात्मक वार्षिक सदस्यता है।" }
    ],
    sw: [
        { question: "Misbah ni nini?", answer: "Misbah ni saraka la mtandaoni linalonyesha walimu wa Quran Takatifu, lugha ya Kiarabu, na masomo ya Kiislamu, pamoja na taarifa za mawasiliano kwa kila mwalimu." },
        { question: "Je, Misbah ni jukwaa la elimu?", answer: "Hapana. Misbah si jukwaa la elimu. Tunaonyesha tu maelezo ya walimu. Masomo na mawasiliano yanafanyika moja kwa moja kati ya mwanafunzi na mwalimu nje ya tovuti." },
        { question: "Je, Misbah inawajibika kwa ubora wa ufundishaji?", answer: "Hapana. Misbah haidhamini ubora wa ufundishaji na haichukui jukumu lolote kwa uhusiano kati ya mwanafunzi na mwalimu." },
        { question: "Je, Misbah inashughulikia malipo?", answer: "Hapana. Mkataba wowote wa kifedha kati ya mwanafunzi na mwalimu ni huru kabisa kutoka Misbah." },
        { question: "Ninawezaje kujiunga kama mwalimu?", answer: "Unaweza kuomba kupitia ukurasa wa usajili. Tutapitia ombi lako na kuwasiliana nawe." },
        { question: "Je, kuna ada kwa wanafunzi?", answer: "Hapana. Kuvinjari na kupata maelezo ya walimu ni bure kabisa kwa wanafunzi." },
        { question: "Je, kuna ada kwa walimu?", answer: "Ndiyo, kuna usajili wa kila mwaka wa ishara kwa walimu baada ya ombi lao kukubaliwa." }
    ],
    ha: [
        { question: "Menene Misbah?", answer: "Misbah jagora ne akan layi wanda ke nuna malaman Alkur'ani Mai Tsarki, harshen Larabci, da karatun Musulunci, tare da bayanin tuntuɓi na kowane malami." },
        { question: "Shin Misbah dandamali ne na ilimi?", answer: "A'a. Misbah ba dandamali na ilimi ba ne. Muna nuna bayanin malamai kawai. Darussa da sadarwa suna faruwa kai tsaye tsakanin ɗalibi da malami a wajen shafin." },
        { question: "Shin Misbah yana da alhakin ingancin koyarwa?", answer: "A'a. Misbah ba ya tabbatar da ingancin koyarwa kuma ba ya ɗaukar nauyi na dangantaka tsakanin ɗalibi da malami." },
        { question: "Shin Misbah yana sarrafa kuɗi?", answer: "A'a. Duk wani shirye-shiryen kuɗi tsakanin ɗalibi da malami yana zaman kansa gaba ɗaya daga Misbah." },
        { question: "Ta yaya zan iya shiga a matsayin malami?", answer: "Kuna iya nema ta hanyar shafin rajista. Za mu duba neman ku kuma mu tuntube ku." },
        { question: "Akwai kuɗi ga ɗalibai?", answer: "A'a. Duba da samun bayanin malamai yana da kyauta gaba ɗaya ga ɗalibai." },
        { question: "Akwai kuɗi ga malamai?", answer: "Eh, akwai biyan kuɗi na shekara-shekara na alama ga malamai bayan an karɓi neman su." }
    ],
    so: [
        { question: "Waa maxay Misbah?", answer: "Misbah waa buug-gacmeed online ah oo soo bandhiga macallimiinta Quraanka Shareefka, luqadda Carabiga, iyo daraasadaha Islaamka, oo leh macluumaad xiriir ah macallin kasta." },
        { question: "Ma Misbah waa goob waxbarasho?", answer: "Maya. Misbah maaha goob waxbarasho. Waxaan kaliya soo bandhignaa macluumaadka macallimiinta. Casharrada iyo isgaadhsiintu waxay si toos ah ugu dhacaan ardayga iyo macallinka meel ka baxsan goobta." },
        { question: "Ma Misbah ayaa mas'uul ka ah tayada waxbarashada?", answer: "Maya. Misbah ma dhammaysato tayada waxbarashada mana qaadato mas'uuliyad xiriirka u dhexeeya ardayga iyo macallinka." },
        { question: "Ma Misbah ayaa maamuulaya lacagaha?", answer: "Maya. Wax kasta oo heshiis lacageed ah oo u dhexeeya ardayga iyo macallinka si buuxda ayey uga madax-bannaan yihiin Misbah." },
        { question: "Sidee baan ugu biiri karaa sida macallin?", answer: "Waxaad codsan kartaa iyada oo maraya bogga diiwaangelinta. Waxaan dib u eegi doonnaa codsigaaga oo kula soo xiriiri doonnaa." },
        { question: "Ma jiraan lacagaha ay bixiyaan ardayda?", answer: "Maya. Daawashada iyo helitaanka macluumaadka macallimiinta ayaa bilaash ah si buuxda ardayda." },
        { question: "Ma jiraan lacagaha ay bixiyaan macallimiinta?", answer: "Haa, waxaa jira rukunka sanadlaha ah oo calaamad ah macallimiinta kadib marka codsigoodii la aqbalo." }
    ]
};

function updateFAQ() {
    Object.keys(faqTranslations).forEach(locale => {
        const filePath = path.join(localesDir, `${locale}.json`);
        if (fs.existsSync(filePath)) {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            content.faq.items = faqTranslations[locale];
            fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
            console.log(`Updated FAQ for ${locale}`);
        }
    });
}

updateFAQ();
