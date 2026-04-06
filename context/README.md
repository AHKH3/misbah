# دليل وثائق مصباح

## 📖 البداية السريعة

إذا كنت جديداً على المشروع، اقرأ هذه الملفات بالترتيب:

1. **[00_index.md](./00_index.md)** - نقطة البداية، فهرس كامل
2. **[01_product_spec.md](./01_product_spec.md)** - فهم المنتج والفلسفة
3. **[05_onboarding_flow.md](./05_onboarding_flow.md)** - كيف يسجل المعلم؟
4. **[06_directory_spec.md](./06_directory_spec.md)** - كيف يبحث الطالب؟
5. **[02_technical_spec.md](./02_technical_spec.md)** - التقنيات والبنية

---

## 🗂️ الملفات الرئيسية

### الأساسيات
- **00_index.md** - الفهرس الرئيسي + القرارات المعتمدة
- **CHANGELOG.md** - سجل التحديثات الكبرى
- **README.md** - هذا الملف

### المنتج
- **01_product_spec.md** - المشكلة، الجمهور، القيمة، المنافسون، التسعير
- **product.md** - فلسفة المنتج
- **product-guidelines.md** - الحدود والممنوعات
- **identity.md** - الهوية والرسالة
- **tone-and-voice.md** - أسلوب الكتابة

### التقنيات
- **02_technical_spec.md** - Tech Stack، Database v3.0، APIs
- **workflow.md** - Git، Commits، Testing

### SEO والدليل
- **04_seo_strategy.md** - URLs، Slug، Metadata، Sitemap
- **06_directory_spec.md** - /find/ routes (22 صفحة)، الفلاتر
- **seo-philosophy.md** - الفلسفة: "قابلية للفوز، لا ضمان ظهور"

### التسجيل والمراجعة
- **05_onboarding_flow.md** - 6 خطوات + حظر + تكرار

### التصميم
- **ui-ux.md** - نظام التصميم الكامل (monochrome + icon colors، 8px spacing، components)

### الإطلاق
- **08_launch_checklist.md** - خطوات الإطلاق بالترتيب

---

## 🎯 السيناريوهات الشائعة

### "أريد إضافة ميزة جديدة"
1. اقرأ **product.md** و **product-guidelines.md** للتأكد أنها ضمن النطاق
2. راجع **02_technical_spec.md** للبنية الحالية
3. تحقق من **workflow.md** لطريقة التنفيذ

### "أريد تعديل صفحة معلم"
1. راجع **04_seo_strategy.md** (الـ SEO حرج!)
2. راجع **ui-ux.md** (التصميم له قواعد صارمة)
3. تحقق من **02_technical_spec.md** للحقول المتاحة

### "أريد إضافة فلتر جديد في /find/"
1. راجع **06_directory_spec.md** للبنية الحالية
2. راجع **04_seo_strategy.md** للتأثير على URLs
3. تحقق من **02_technical_spec.md** للحقول في DB

### "أريد تعديل الويزارد"
1. راجع **05_onboarding_flow.md** للخطوات الحالية
2. تحقق من **product-guidelines.md** للقيود

---

## 🔄 آخر التحديثات (Feb 2026)

### ✅ ما تم تنفيذه حديثاً
- [x] نظام Slug للـ URLs الصديقة للـ SEO
- [x] 22 صفحة /find/ مع فلاتر ديناميكية
- [x] عرض التواصل المباشر مع تتبع per-type
- [x] صفحة analytics للأدمن
- [x] صفحة duplicates مع نظام كشف التكرار
- [x] نظام حظر مرن (30d/90d/permanent)
- [x] البايو إلزامي (عربي + إنجليزي) للـ SEO

### ⏳ قيد التطوير
- [ ] Resend integration (Email templates)
- [ ] Telegram Bot (Admin notifications)
- [ ] نظام الدفع الكامل

للتفاصيل الكاملة، راجع **[CHANGELOG.md](./CHANGELOG.md)**

---

## 📐 القواعد الذهبية

### 1. SEO أولاً
> "نوفر قابلية للفوز، لا ضمان ظهور"

- كل صفحة معلم لها metadata فريدة
- تجنب keyword cannibalization
- الـ slug مقروء: `/teachers/ahmed-ali-egypt-quran`
- البايو **إلزامي** (عربي + إنجليزي)

### 2. Monochrome Base + Soft Icon Colors
> "Quiet depth, content over chrome"

- القاعدة monochrome (أسود/أبيض/رمادي) للنصوص والأزرار والخلفيات
- أيقونات بألوان هادية مطفية (كل أيقونة بلونها) — راجع **ui-ux.md** القسم 3.5
- 8px spacing system فقط
- CSS Modules فقط (لا Tailwind)
- راجع **ui-ux.md** للتفاصيل

### 3. Directory, Not Marketplace
> "لا حجز، لا دفع، لا ترتيب"

- معلومات التواصل معروضة مباشرة
- لا نظام حجز
- لا تدخل في الدفع (المعلم ↔ الطالب)
- لا "أفضل معلم" أو ranking

### 4. Manual Review is Core
> "المراجعة البشرية ليست عائق - هي المنتج"

- كل معلم يُراجع يدوياً (≤ 24 ساعة)
- الهدف: جودة، ليس سرعة
- نظام كشف التكرار يساعد، لا يستبدل

### 5. Independent Teachers Only
> "95% من السوق أكاديميات - نحن نخدم الـ 5% المستقلين"

- لا مؤسسات
- لا أكاديميات
- لا وسطاء
- معلمين أفراد فقط

---

## 🆘 أسئلة شائعة

### "لماذا لا نضيف نظام تقييمات؟"
راجع **product-guidelines.md** - قرار واعٍ لتجنب gaming the system

### "لماذا لا نضيف نظام حجز؟"
راجع **product.md** - مصباح دليل، ليس marketplace

### "لماذا slug بدل ID في URLs؟"
راجع **04_seo_strategy.md** - SEO-first approach

### "لماذا البايو إلزامي؟"
راجع **05_onboarding_flow.md** - ضروري للـ meta description والـ SEO

### "لماذا 6 خطوات وليس أقل؟"
راجع **05_onboarding_flow.md** - التوازن بين البيانات الكافية وتجربة سلسة

---

## 📞 مساعدة

إذا كان لديك سؤال غير موجود هنا:
1. ابحث في **00_index.md** عن الملف المناسب
2. راجع **CHANGELOG.md** لآخر التحديثات
3. اقرأ **product-guidelines.md** للقيود الصارمة

---

**آخر تحديث:** February 2026
**الإصدار:** v3.0
