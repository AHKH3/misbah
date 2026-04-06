# STATUS.md — حالة المشروع الشاملة

> آخر تحديث: ٩ فبراير ٢٠٢٦
> الهدف: توثيق كل شيء عشان أي نموذج لغة يقدر يكمل من هنا بدون ما يقرأ الكود كله

---

## الهيكل العام للموقع

```
صفحات المستخدم:
/                    → صفحة الهبوط (Landing)
/find                → دليل المعلمين الرئيسي (22 صفحة ديناميكية)
/find/[subject]
/find/[subject]/[gender]
/find/[subject]/[gender]/[audience]
/teachers/[slug]     → صفحة المعلم الشخصية
/for-teachers        → صفحة "للمعلمين" (CTA للتسجيل)
/about               → عن مصباح
/faq                 → الأسئلة الشائعة
/contact             → تواصل معنا
/onboarding/*        → 6 خطوات تسجيل المعلم
/directory           → الدليل القديم (مُحتمل يُلغى لصالح /find)
/invite/[token]      → رابط الدعوة بعد القبول

صفحات قانونية:
/privacy             → سياسة الخصوصية
/terms               → شروط الاستخدام
/disclaimer          → إخلاء المسؤولية

لوحة الإدارة:
/admin               → لوحة التحكم الرئيسية
/admin/review        → مراجعة الطلبات
/admin/profile/[id]  → تفاصيل الملف الشخصي
/admin/payments      → مراجعة المدفوعات
/admin/duplicates    → تنبيهات التكرار
/admin/analytics     → إحصائيات النقرات
/admin/reports       → البلاغات
/admin/audit         → سجل الأنشطة

صفحات النظام:
/error.tsx           → صفحة الخطأ
/not-found.tsx       → صفحة 404
/sitemap.ts          → خريطة الموقع
```

---

## ✅ ما تم إنجازه (جلسة ٩ فبراير)

### المصادقة
- [x] `src/lib/auth/is-admin.ts` → فحص الأدمن عبر `process.env.ADMIN_EMAIL` بدل جدول
- [x] `src/middleware.ts` → حماية routes الأدمن + تحديث الجلسة
- [x] `src/components/ui/modal.tsx` + CSS → مكون Modal عام (focus trap + ESC)
- [x] `src/components/ui/toast.tsx` + CSS → إشعارات مؤقتة (ToastProvider)
- [x] `src/components/auth/login-modal.tsx` + CSS → نموذج الدخول
- [x] `src/components/layout/header.tsx` → زر تسجيل الدخول/الخروج + حالة المستخدم
- [x] `src/app/layout.tsx` → ToastProvider مُضاف
- [x] `.env.local` → ADMIN_EMAIL=admin@misbah.site

### تنظيف الترجمة
- [x] حذف 18 ملف لغة زائد (bn, de, es, fa, fr, ha, hi, id, it, ms, nl, pl, pt, ru, so, sw, tr, ur)
- [x] `src/lib/i18n/config.ts` → فقط `['ar', 'en']`
- [x] `src/lib/i18n/loader.ts` → تبسيط + إضافة نوع `auth` و`find`
- [x] `ar.json` + `en.json` → إضافة مفاتيح `auth`

### إصلاحات بناء
- [x] تثبيت `@react-email/components` و `resend`
- [x] إصلاح `resend.ts` → تهيئة كسولة (lazy) لتجنب انهيار البناء
- [x] إصلاح `duplicates/actions.ts` → نوع الإرجاع `Promise<void>`
- [x] إصلاح مقارنات اللغات (`'ur'` و `'fa'`) في TeacherGrid و client-view
- [x] إصلاح `teachers.ts` → تحويل النوع
- [x] إصلاح `step-6/page.tsx` → إضافة الحقول الناقصة في profileData

### إصلاحات CSS جزئية (جلسة ١)
- [x] `button.module.css` → استبدال `#fff` و `#0a0a0a` بمتغيرات
- [x] `HowItWorks.module.css` → `4px → var(--space-micro)` و `10px → var(--space-base)`

### إصلاحات CSS شاملة (جلسة ٢ — ٩ فبراير)
- [x] `globals.css` → `--max-width: 960px` → `680px`
- [x] `Hero.module.css` → `max-width: 800px` → `680px` + `border-bottom` → `border-block-end`
- [x] `ValueProp.module.css` → `padding-block: 96px` → `var(--space-2xl)` + `border-top/bottom` → `border-block-*` + `padding-top` → `padding-block-start`
- [x] `WhyMisbah.module.css` → `padding-block: 96px` → `var(--space-2xl)` + `#f4f4f5` → `var(--color-ground)`
- [x] `FinalCTA.module.css` → `padding-block: 96px` → `var(--space-2xl)` + `border-top` → `border-block-start`
- [x] `scroll-to-top.module.css` → `#ffffff` → `var(--color-card)` + `#27272a` → `var(--color-ink-body)`
- [x] `avatar.module.css` → `#fff` → `var(--color-card)` (3 أماكن)
- [x] `wizard.module.css` → استبدال 30+ متغير fallback hex بمتغيرات النظام الصحيحة (`--color-ink-strong` etc.) + ألوان حمراء → monochrome + `margin-bottom/top` → `margin-block-*` + `padding-top` → `padding-block-start` + `margin: 0 auto` → `margin-inline: auto`
- [x] `find.module.css` → استبدال كل المتغيرات المخصصة (`--color-bg/text/surface/border`) بمتغيرات النظام + إصلاح spacing (`10px 12px` → `8px 16px`) + `border-radius: 6px/4px` → `var(--radius-badge)` + `max-width: 1200px` → `var(--max-width)` + `box-shadow` → `var(--shadow-lift)`

### إعادة بناء الصفحات (جلسة ٢)
- [x] `/for-teachers` → إعادة بناء كاملة: CSS Module + 6 أقسام (Hero, Why, How, Pricing, FAQ, CTA) + ثنائي اللغة
- [x] `/contact` → إعادة بناء بـ CSS Module + ثنائي اللغة
- [x] `/error.tsx` → تحويل من inline styles لـ CSS Module + ثنائي اللغة
- [x] `/not-found.tsx` → تحويل من inline styles لـ CSS Module + ثنائي اللغة

### ترجمات مُضافة (جلسة ٢)
- [x] `forTeachersPage` → 6 أقسام كاملة (hero, why, howItWorks, pricing, faq, finalCta) — AR + EN
- [x] `contactPage` → title, subtitle, emailLabel, email, note — AR + EN
- [x] `errorPage` → title, description, retry — AR + EN
- [x] `notFoundPage` → title, code, description, backHome — AR + EN
- [x] `loader.ts` → إضافة الأنواع الجديدة في TranslationType

---

## ✅ المخالفات المُصلحة

### ١. صفحات بدون CSS Modules → ✅ تم إعادة بنائها
- `for-teachers/page.tsx` → CSS Module + 6 أقسام + ثنائي اللغة
- `contact/page.tsx` → CSS Module + ثنائي اللغة
- `error.tsx` → CSS Module + ثنائي اللغة
- `not-found.tsx` → CSS Module + ثنائي اللغة

### ٢. ألوان مكتوبة يدوياً → ✅ تم إصلاحها
- WhyMisbah, scroll-to-top, avatar → متغيرات النظام
- wizard.module.css (30+ سطر) → متغيرات النظام
- find.module.css → متغيرات النظام

### ٣. مخالفات نظام 8px → ✅ تم إصلاحها
- ValueProp, WhyMisbah, FinalCTA → `var(--space-2xl)`
- Hero → `680px`
- find.module.css → كل spacing بمتغيرات النظام

### ٤. مشاكل RTL → ✅ تم إصلاحها
- كل `border-top/bottom` → `border-block-*`
- for-teachers أُعيد بناؤها بالكامل

### ٥. max-width → ✅ تم إصلاحها
- `globals.css` → `680px`
- Hero → `680px`
- find → `var(--max-width)`

---

## 🟢 صفحات تم إعادة بنائها

### صفحة الهبوط (`/`) — ✅ CSS مُصلح
- Hero: max-width 680px ✅ + border-block-end ✅
- ValueProp: padding var(--space-2xl) ✅ + border-block-* ✅
- WhyMisbah: padding var(--space-2xl) ✅ + var(--color-ground) ✅
- FinalCTA: padding var(--space-2xl) ✅ + border-block-start ✅

### صفحة "للمعلمين" (`/for-teachers`) — ✅ إعادة بناء كاملة
- 6 أقسام: Hero, Why, HowItWorks, Pricing, FAQ, FinalCTA
- CSS Module: `for-teachers.module.css`
- ثنائي اللغة: `labels.forTeachersPage`

### صفحة "تواصل معنا" (`/contact`) — ✅ إعادة بناء
- CSS Module: `contact.module.css`
- ثنائي اللغة: `labels.contactPage`

### صفحة الخطأ و 404 — ✅ إعادة بناء
- CSS Module مشترك: `status-page.module.css`
- ثنائي اللغة: `labels.errorPage` + `labels.notFoundPage`

---

## 🟢 صفحات بحالة جيدة

| الصفحة | الحالة | ملاحظات |
|--------|--------|---------|
| `/about` | ✅ جيدة | CSS Modules، متغيرات صحيحة |
| `/faq` | ✅ جيدة | يستخدم Accordion component |
| `/privacy` | ✅ جيدة | CSS Module مشترك للقانونية |
| `/terms` | ✅ جيدة | ↑ |
| `/disclaimer` | ✅ جيدة | ↑ |
| `/for-teachers` | ✅ جيدة | CSS Module + 6 أقسام + ثنائي اللغة |
| `/contact` | ✅ جيدة | CSS Module + ثنائي اللغة |
| `/error` | ✅ جيدة | CSS Module + ثنائي اللغة |
| `/not-found` | ✅ جيدة | CSS Module + ثنائي اللغة |
| `/onboarding/*` | ✅ جيدة | wizard.module.css مُصلح — متغيرات النظام |
| `/admin/*` | ⚠️ وسط | يعمل لكن أسلوب الألوان في STATUS_COLORS hardcoded |
| `/find/*` | ✅ جيدة | find.module.css مُصلح — متغيرات النظام |
| `/teachers/[slug]` | ⚠️ وسط | يعمل لكن يحتاج مراجعة CSS |

---

## ✅ المتغير العام `--max-width` — تم إصلاحه

```css
--max-width: 680px; /* ← تم التغيير من 960px */
```

---

## 📋 قائمة المهام المتبقية (مرتبة بالأولوية)

### ~~أولوية ١: إصلاحات CSS~~ ✅ مكتملة
### ~~أولوية ٢: إعادة بناء الصفحات~~ ✅ مكتملة
### ~~أولوية ٣: ترجمات الصفحات الجديدة~~ ✅ مكتملة

### أولوية ٣.٥: مراجعة تطابق الترجمة
- [ ] مراجعة تطابق AR و EN في كل المفاتيح الموجودة (متكافئة حالياً لكن تحتاج مراجعة بشرية للنصوص)

### أولوية ٤: ميزات مؤجلة

- [ ] نظام البريد (Resend) — القوالب موجودة لكن RESEND_API_KEY غير مضبوط
- [ ] بوت تيليجرام — لإشعارات الأدمن
- [ ] تأكيد الدفع — workflow كامل مع رفع صور
- [ ] نموذج تواصل (contact form) — بدل الإيميل فقط

### أولوية ٥: SEO

- [ ] مراجعة metadata فريدة لكل صفحة
- [ ] JSON-LD على صفحات المعلمين
- [ ] فحص sitemap.ts يشمل كل الصفحات
- [ ] Open Graph tags

### أولوية ٦: اختبارات

- [ ] E2E للأونبوردينج 6 خطوات
- [ ] E2E لـ admin workflow
- [ ] E2E للدليل والفلترة
- [ ] إصلاح lint warnings الموجودة (20 warning)

---

## 📐 قواعد التصميم

> المرجع الكامل: **[ui-ux.md](./ui-ux.md)** — يشمل الألوان، المسافات، الأيقونات، المكونات، RTL، والحركة.

---

## 🏗️ هيكل الملفات المهمة

```
src/
├── app/
│   ├── layout.tsx              ← Layout الرئيسي (I18nProvider + ToastProvider + Header + Footer)
│   ├── globals.css             ← متغيرات CSS + Reset + Typography
│   ├── page.tsx                ← الصفحة الرئيسية (5 أقسام landing)
│   ├── about/page.tsx          ← ✅ جيدة
│   ├── contact/page.tsx        ← ✅ CSS Module + i18n
│   ├── for-teachers/page.tsx   ← ✅ CSS Module + 6 أقسام + i18n
│   ├── error.tsx               ← ✅ CSS Module + i18n
│   ├── not-found.tsx           ← ✅ CSS Module + i18n
│   ├── find/                   ← ⚠️ CSS يحتاج إصلاح
│   ├── teachers/[slug]/        ← ⚠️ يحتاج مراجعة
│   ├── onboarding/             ← ⚠️ wizard CSS يحتاج إصلاح
│   └── admin/                  ← ⚠️ ألوان status hardcoded
├── components/
│   ├── layout/
│   │   ├── header.tsx          ← ✅ مع login/logout
│   │   └── footer.tsx          ← ✅ جيد
│   ├── landing/
│   │   ├── Hero.tsx + .css     ← ✅ max-width 680px + border-block-end
│   │   ├── ValueProp.tsx + .css ← ✅ padding var(--space-2xl) + border-block-*
│   │   ├── WhyMisbah.tsx + .css ← ✅ padding var(--space-2xl) + var(--color-ground)
│   │   ├── HowItWorks.tsx + .css ← ✅ تم الإصلاح
│   │   └── FinalCTA.tsx + .css  ← ✅ padding var(--space-2xl) + border-block-start
│   ├── ui/
│   │   ├── button.tsx + .css   ← ✅ تم الإصلاح
│   │   ├── modal.tsx + .css    ← ✅ جديد
│   │   ├── toast.tsx + .css    ← ✅ جديد
│   │   ├── card.tsx + .css     ← ✅ جيد
│   │   ├── badge.tsx + .css    ← ✅ جيد
│   │   ├── avatar.tsx + .css   ← ✅ var(--color-card)
│   │   ├── accordion.tsx + .css ← ✅ جيد
│   │   ├── scroll-to-top.css   ← ✅ متغيرات النظام
│   │   └── radio-pills.tsx + .css ← ✅ جيد
│   └── auth/
│       └── login-modal.tsx + .css ← ✅ جديد
├── lib/
│   ├── i18n/
│   │   ├── config.ts           ← ✅ ar + en فقط
│   │   ├── loader.ts           ← ✅ مبسط
│   │   ├── provider.tsx        ← ✅ يعمل
│   │   └── locales/
│   │       ├── ar.json         ← ✅ + auth keys
│   │       └── en.json         ← ✅ + auth keys
│   ├── auth/is-admin.ts        ← ✅ env-based
│   ├── email/
│   │   ├── resend.ts           ← ✅ lazy init (لكن RESEND_API_KEY غير مضبوط)
│   │   └── templates/          ← موجودة (approved, rejected, founder, payment)
│   └── data/teachers.ts        ← ✅ تم إصلاح النوع
└── utils/supabase/
    ├── client.ts               ← ✅ Browser client
    ├── server.ts               ← ✅ Server client
    └── middleware.ts            ← ✅ Session refresh
```

---

## 🎯 النغمة والصوت (ملخص للنصوص)

### مسموح
- "معلمون جادون" / "Serious teachers"
- "دليل احترافي" / "Professional directory"
- "مراجعة يدوية" / "Manually reviewed"
- "معايير واضحة" / "Clear standards"
- "تواصل مباشر" / "Direct contact"

### ممنوع
- "نادي مغلق" / "Exclusive" — يوحي بالنخبوية
- "معلمون مميزون" / "Premium teachers" — يوحي بالتفوق
- "أفضل" / "Best" / "Top" — ممنوع في SEO
- "مضمون" / "Guaranteed" — لا نضمن شيئاً
- "معتمد من مصباح" / "Certified by Misbah" — غير دقيق

### القاعدة الذهبية
> "مصباح يوفر أهلية الظهور، وليس ضمان الظهور"
> "Misbah provides eligibility to win, not guarantee of visibility"

---

## 🗃️ حالة قاعدة البيانات

### الجداول الموجودة
- `profiles` — ملفات المعلمين (6 حالات: draft → under_review → needs_changes → approved → published → suspended)
- `contact_clicks` — تتبع نقرات التواصل
- `duplicate_alerts` — تنبيهات التكرار
- `admin_audit_log` — سجل أنشطة الأدمن

### الـ Migrations
```
20260124170000_onboarding_rebuild.sql
20260125143000_add_missing_fields.sql
20260125143500_admin_rbac.sql
20260125150000_payment_fields.sql
20260125160000_audit_log.sql
20260204000000_online_only.sql
20260204000001_remove_madhab.sql
20260204000002_add_languages_field.sql
20260204000003_reporting_system.sql
20260204000004_contact_tracking.sql
20260205000001_add_full_name_en_column.sql
20260208203456_add_plan_requirements.sql
```

---

## ⚡ أوامر مهمة

```bash
npm run dev          # تشغيل محلي
npm run build        # ✅ ينجح (آخر بناء ناجح: ٩ فبراير ٢٠٢٦)
npm run lint         # 8 أخطاء + 20 تحذير (كلها قديمة)
```
