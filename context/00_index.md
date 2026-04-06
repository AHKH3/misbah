# Misbah — فهرس الوثائق (Documentation Index)

> **الهدف:** هذا الملف هو نقطة البداية الوحيدة. كل شيء مرتبط من هنا.

---

## الوثائق الأساسية (Core)

| # | الوثيقة | الوصف | الحالة |
|---|---------|-------|--------|
| 1 | [01_product_spec.md](./01_product_spec.md) | تعريف المنتج، القيود، الجمهور | ✅ محدّث (2026-02) |
| 2 | [02_technical_spec.md](./02_technical_spec.md) | Tech Stack، Database v3.0، APIs | ✅ محدّث (2026-02) |
| 3 | [04_seo_strategy.md](./04_seo_strategy.md) | URLs، Slug، Metadata، Sitemap | ✅ محدّث (2026-02) |
| 4 | [05_onboarding_flow.md](./05_onboarding_flow.md) | 6 خطوات + حظر + تكرار | ✅ محدّث (2026-02) |
| 5 | [06_directory_spec.md](./06_directory_spec.md) | محرك الدليل (22 صفحة SSR) | ✅ محدّث (2026-02) |
| 6 | [ui-ux.md](./ui-ux.md) | نظام التصميم الكامل (ألوان، خطوط، مكونات، أيقونات) | ✅ محدّث (2026-02) |
| 7 | [08_launch_checklist.md](./08_launch_checklist.md) | خطوات الإطلاق بالترتيب | ✅ Draft |

## الوثائق المؤجلة (Deferred)

| # | الوثيقة | الوصف | السبب |
|---|---------|-------|-------|
| 3 | [03_infrastructure_ops.md](./03_infrastructure_ops.md) | Sentry، Resend، Telegram Bot | بعد الـ MVP |

---

## القرارات المعتمدة

| القرار | الحالة | ملاحظات |
|--------|--------|---------|
| لغة الروابط: **English** | ✅ | `/find/quran` بدل `/ابحث/قرآن` |
| نظام التوثيق: **Modular** | ✅ | كل وثيقة مستقلة |
| الجنس في الـ URL: **نعم** | ✅ | `/find/quran/female` |
| الفيديو: **إلزامي للمراجعة** | ✅ | ليس للعرض العام |
| المذهب: **محذوف** | ✅ | تجنباً للجدل |
| السعر: **في البروفايل فقط** | ✅ | اختياري |
| Testing: **Playwright** | ✅ | E2E-first |
| Slug Format: **readable** | ✅ | `/teachers/ahmed-ali-egypt-quran` |
| Contact Display: **مباشر** | ✅ | لا reveal button، تتبع مجهول |
| Ban System: **30d/90d/permanent** | ✅ | حسب شدة المخالفة |
| Duplicate Detection: **weighted** | ✅ | نسبة تطابق 0-100% |

---

## التحديثات الأخيرة (Feb 2026)

### إضافات جديدة
1. **نظام الـ Slug:** `/teachers/[slug]` بدل `/teachers/[id]`
2. **نظام كشف التكرار:** duplicate_alerts مع نسبة تطابق
3. **نظام الحظر المرن:** 30d/90d/permanent
4. **تتبع التواصل المجهول:** contact_clicks بدون user data
5. **22 صفحة /find/:** دليل ديناميكي مع فلاتر متعددة
6. **إحصائيات الأدمن:** analytics page مع توزيع الضغطات

### تغييرات كبرى
- **البايو:** أصبح إلزامي (عربي + إنجليزي) في الخطوة 4
- **الإيميل:** مفصول إلى misbah_email (اتصال مع مصباح) + contact email (اختياري للطلاب)
- **الخطوات:** 6 خطوات بدل 7 (دمج التخصص + اللغات في خطوة 2)
- **التواصل:** معروض مباشرة مع تتبع per-type (📞💬✉️🌐)

### جداول قاعدة بيانات جديدة
- `contact_clicks` - تتبع ضغطات التواصل
- `duplicate_alerts` - تنبيهات التكرار
- `admin_audit_log` - سجل تدقيق الأدمن

### ما زال قيد التطوير
- [ ] Resend (Email templates)
- [ ] Telegram Bot (Admin notifications)
- [ ] نظام الدفع (Payment workflow)
