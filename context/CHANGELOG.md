# Changelog - سجل التحديثات

## [v3.0] - February 2026 - التحديث الشامل

### 🎯 التغييرات الرئيسية

#### 1. نظام الـ URLs (Slug-based)
**قبل:**
```
/teachers/[uuid]
مثال: /teachers/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**بعد:**
```
/teachers/[slug]
مثال: /teachers/ahmed-ali-egypt-quran
```

**الفائدة:** SEO-friendly، مقروء، يحسن الظهور في محركات البحث

---

#### 2. نظام التواصل المباشر مع التتبع

**قبل:**
- معلومات التواصل مخفية
- زر "أظهر بيانات التواصل" → نافذة منبثقة
- تتبع واحد: "هل تم الضغط على الزر؟"

**بعد:**
- معلومات التواصل معروضة مباشرة مع أيقونات:
  - 📞 واتساب
  - 💬 تليجرام
  - ✉️ إيميل
  - 🌐 موقع
- تتبع مفصل per-type (كل نوع يُتتبع منفصلاً)
- إحصائيات مفصلة في صفحة الأدمن

**الفائدة:**
- تجربة أفضل للمستخدم
- بيانات analytics أدق
- فهم أفضل لأي طرق التواصل الأكثر استخداماً

---

#### 3. نظام /find/ الموسّع (22 صفحة)

**قبل:**
```
/directory (صفحة واحدة)
```

**بعد:**
```
/find                            (1 صفحة رئيسية)
/find/[subject]                  (4 صفحات: quran, tajweed, arabic, islamic-studies)
/find/[subject]/[gender]         (8 صفحات: male/female لكل مادة)
/find/[subject]/[gender]/[audience]  (8 صفحات: kids/adults لكل تركيبة)

= 22 صفحة static SEO-optimized
```

**الفلاتر الإضافية:**
- اللغة (20 لغة × 4 مستويات)
- السعر (min/max + currency)

**الفائدة:**
- SEO قوي جداً (كل صفحة تستهدف كلمات مفتاحية محددة)
- تجربة بحث أفضل
- Discoverability أعلى

---

#### 4. نظام كشف التكرار (Duplicate Detection)

**الخوارزمية:**
| الحقل | الوزن |
|-------|-------|
| الاسم (عربي أو إنجليزي) | 30% |
| رقم الواتساب | 25% |
| رابط اليوتيوب | 20% |
| البلد + المواد | 15% |
| رقم التليجرام | 10% |

**النتائج:**
- ≥ 85%: تنبيه أحمر (احتمال كبير نفس الشخص)
- ≥ 60%: تنبيه عادي للمراجعة

**الفائدة:**
- منع التسجيلات المكررة
- كشف المحتالين
- حماية جودة الدليل

---

#### 5. نظام الحظر المرن

**قبل:**
- رفض = حظر دائم

**بعد:**
- **30 يوم:** افتراضي (أخطاء بسيطة)
- **90 يوم:** متكرر (مخالفات متعددة)
- **دائم:** للمحتالين

**الفائدة:**
- مرونة في التعامل مع المخالفات
- إعطاء فرصة ثانية للأخطاء غير المقصودة
- ردع قوي للمحتالين

---

#### 6. الويزارد (6 خطوات بدل 7)

**التغييرات:**
1. **الخطوة 1:** بيانات شخصية (اسم، جنس، ميلاد، بلد)
2. **الخطوة 2:** تخصص + لغات (دمج)
3. **الخطوة 3:** تعليم + خبرة
4. **الخطوة 4:** جمهور + سعر + **بايو (عربي + إنجليزي) - إلزامي جديد**
5. **الخطوة 5:** فيديو تعليمي
6. **الخطوة 6:** تواصل + إيميل مصباح + قانوني

**البايو:**
- أصبح **إلزامي** (عربي + إنجليزي)
- مهم جداً للـ SEO
- يظهر في الـ meta description

**الإيميل:**
- مفصول إلى:
  - `misbah_email`: للتواصل مع مصباح (إلزامي)
  - `contact.email`: للتواصل مع الطلاب (اختياري)

---

### 📊 قاعدة البيانات (v3.0)

#### جدول `profiles` (تحديثات)
```sql
-- إضافات جديدة
slug TEXT UNIQUE NOT NULL
misbah_email TEXT NOT NULL UNIQUE
bio_text_ar TEXT NOT NULL  -- كان اختياري
bio_text_en TEXT NOT NULL  -- كان اختياري
is_founding BOOLEAN DEFAULT false
ban_until TIMESTAMPTZ
ban_reason TEXT
```

#### جدول جديد: `contact_clicks`
```sql
CREATE TABLE contact_clicks (
  id UUID PRIMARY KEY,
  profile_id UUID NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('whatsapp', 'telegram', 'email', 'website')),
  clicked_at TIMESTAMPTZ DEFAULT now()
);
```

#### جدول جديد: `duplicate_alerts`
```sql
CREATE TABLE duplicate_alerts (
  id UUID PRIMARY KEY,
  new_profile_id UUID NOT NULL,
  existing_profile_id UUID NOT NULL,
  match_score DECIMAL NOT NULL CHECK (match_score >= 0 AND match_score <= 1),
  matched_fields JSONB NOT NULL,
  reviewed BOOLEAN DEFAULT false,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 🎨 صفحات الأدمن الجديدة

1. **/admin/duplicates** - صفحة تنبيهات التكرار
   - عرض side-by-side للبروفايلات المتطابقة
   - نسبة التطابق مع color-coding (أحمر/أصفر/أخضر)
   - عرض الحقول المتطابقة
   - إمكانية وضع علامة "تمت المراجعة"

2. **/admin/analytics** - صفحة الإحصائيات
   - إجمالي الضغطات لكل معلم
   - توزيع الضغطات حسب النوع (📞💬✉️🌐)
   - رسوم بيانية بسيطة
   - ترتيب المعلمين حسب الشعبية
   - الضغطات اليومية (آخر 30 يوم)

---

### 🔄 التكامل المؤجل (Planned)

#### Resend (Email)
**الحالة:** NOT YET IMPLEMENTED

**القوالب المخططة:**
1. `approved.tsx` - "تم قبولك! ادفع من هنا"
2. `payment-confirmed.tsx` - "أنشئ كلمة مرورك"
3. `approved-founder.tsx` - "تم قبولك! أنشئ كلمة مرورك" (بدون دفع)
4. `rejected.tsx` - "للأسف..."

#### Telegram Bot
**الحالة:** NOT YET IMPLEMENTED

**الإشعارات المخططة:**
- معلم جديد سجّل
- معلم رفع صورة دفع
- تنبيه تكرار (≥ 60%)

---

### 📝 التوثيق المحدّث

**الملفات المحدثة:**
- [x] `00_index.md` - إضافة القرارات الجديدة
- [x] `01_product_spec.md` - ملء الأسئلة الفارغة
- [x] `02_technical_spec.md` - تحديث DB schema v3.0
- [x] `04_seo_strategy.md` - إضافة slug format و /find/ routes
- [x] `05_onboarding_flow.md` - تحديث لـ 6 خطوات + حظر + تكرار
- [x] `06_directory_spec.md` - توسيع شامل لـ 22 صفحة

---

### ✅ ما تم تنفيذه

- [x] نظام Slug
- [x] /find/ routes (22 صفحة)
- [x] تتبع التواصل المباشر (per-type)
- [x] صفحة analytics
- [x] صفحة duplicates
- [x] نظام الحظر المرن (30d/90d/permanent)
- [x] كشف التكرار (weighted algorithm)
- [x] البايو إلزامي (عربي + إنجليزي)
- [x] توثيق context/ files

### ⏳ ما زال قيد التطوير

- [ ] Resend integration (Email templates)
- [ ] Telegram Bot (Admin notifications)
- [ ] نظام الدفع (Payment workflow)
- [ ] E2E tests للميزات الجديدة

---

## [v2.0] - January 2026 - الإطلاق الأولي

(التفاصيل في git history)

---

## [v1.0] - December 2025 - النموذج الأولي

(التفاصيل في git history)
