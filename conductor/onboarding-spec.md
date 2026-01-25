# Onboarding System Specification — Misbah (مصباح)

Status: **Authoritative / Final**  
Enforcement: **Strict Compliance Required**

---

## 1. الفلسفة العامة

الأونبوردينج في Misbah **ليس فورم تسجيل** وليس مرحلة ثانوية — بل هو **جوهر المنتج نفسه**.

```
Misbah = Profiles
Profiles = نتيجة الأونبوردينج
```

**القواعد الأساسية:**
- أي خطأ هنا = منتج ضعيف
- أي تبسيط زيادة = بروفايلات هشة
- أي تعقيد غير مبرر = تسرب معلمين كويسين

---

## 2. مبدأ "التقديم = Profile Builder"

كل خطوة في الأونبوردينج تكتب مباشرة في كيان واحد: `TeacherProfile`

**لا يوجد:**
- Application منفصلة
- Form مؤقت
- Mapping لاحق

---

## 3. حالات البروفايل (Profile States)

| الحالة | الوصف |
|--------|-------|
| `draft` | المعلم يملأ البيانات |
| `under_review` | أرسل الطلب |
| `needs_changes` | تعديل مطلوب من الأدمن |
| `approved` | قُبل – لم يُنشر (ينتظر الدفع) |
| `published` | منشور في الدليل |
| `suspended` | معلق (شكاوى/انتهاك/انتهاء اشتراك) |

---

## 4. الخطوات الخمس

### 4.1 لماذا 5 خطوات؟

- أقل = ضغط معرفي
- أكثر = إرهاق
- كل خطوة لها **سؤال ذهني واحد فقط**

---

### 🟢 الخطوة 1: البيانات الأساسية والخبرة

**الهدف:** تعريف "من هو هذا المعلم؟" بشكل مهني يشبه CV.

**الحقول:**
| الحقل | النوع | إلزامي |
|-------|-------|--------|
| الاسم الكامل | text | ✅ |
| العمر | number | ✅ |
| البلد / مكان الإقامة | text | ✅ |
| التخصصات | multi-select | ✅ |

**الخبرة العملية (structured list):**

> ⚠️ **ليست textarea!** بل قائمة خبرات قابلة للتكرار.

لكل خبرة:
- الجهة (أكاديمية / تعليم خاص / أونلاين)
- الدور
- تاريخ البداية
- تاريخ النهاية أو "حتى الآن"
- وصف مختصر

**قاعدة مهمة:**
- سنوات الخبرة **تُحسب تلقائيًا** — لا تُدخل يدويًا
- هذا يمنع الكذب ويسمح بفلترة دقيقة

---

### 🟢 الخطوة 2: التخصص التفصيلي والمؤهلات

**الهدف:** ما الذي يدرّسه المعلم فعليًا؟ وبأي مرجعية؟

**نوع التدريس (checkboxes):**
- [ ] تحفيظ
- [ ] تصحيح تلاوة
- [ ] إجازات قرآنية
- [ ] منهج أكاديمي
- [ ] منهج خاص بالمعلم

**المؤهلات (structured list):**

لكل مؤهل:
- اسم الشهادة / الإجازة
- الجهة المانحة
- السنة

تشمل: الإجازات القرآنية، الشهادات التعليمية، التعليم الجامعي

> **ملاحظة:** رفع ملفات الشهادات = اختياري. الغرض مهني لا قانوني.

---

### 🟢 الخطوة 3: الفئة المستهدفة والسعر

**الهدف:** مساعدة الطالب يقرر هل المعلم مناسب له.

**الفئة:**
| الحقل | النوع |
|-------|-------|
| سن الطالب (من) | number |
| سن الطالب (إلى) | number |
| نوع الطلاب | select: ذكور / إناث |

**السعر:**
| الحقل | النوع |
|-------|-------|
| القيمة | number |
| العملة | select: USD / EGP |

> **مهم:** السعر مرجعي. Misbah لا يتدخل في الدفع.

---

### 🟢 الخطوة 4: التواصل والعينة

**الهدف:** إثبات الجدية + وسيلة وصول مباشرة.

**وسائل التواصل (واحد على الأقل إلزامي):**
- [ ] واتساب
- [ ] بريد إلكتروني
- [ ] تليجرام

**العينة (إلزامي):**
- فيديو تعليمي
- أو تلاوة
- أو تسجيل صوتي
- رابط YouTube

> **لماذا؟** يمنع الحسابات الوهمية، يعطي صورة حقيقية، لا يحمل عبء قانوني.

---

### 🟢 الخطوة 5: المعاينة والإرسال

**الهدف:** تأكيد واعٍ قبل الدخول في المراجعة.

**محتوى الصفحة:**
1. عرض البروفايل كاملًا كما سيظهر للطلاب
2. إقرار قانوني (checkbox إلزامي):
   - صحة البيانات
   - عدم انتحال شخصية
   - مسؤولية المعلم

**بعد الإرسال:**
- الحالة ← `under_review`

---

## 5. المصادقة (Authentication)

### 5.1 المبدأ الأساسي

> **"لا Account بدون قيمة — لا Password بدون قبول"**

### 5.2 متى يتم إنشاء الحساب؟

**بعد القبول فقط!**

```
المعلم يقدّم بدون حساب
        ↓
    تتم المراجعة
        ↓
    عند القبول:
        ↓
    يُرسل Email برابط invitation
        ↓
    Token مؤقت (72 ساعة)
        ↓
    ينشئ Password + Email verification
```

**لو تم الرفض:**
- لا حساب
- لا Auth
- لا التزامات

### 5.3 لماذا هذا مهم؟

- يقلل Accounts الميتة
- يقلل المسؤولية القانونية
- يعزز إحساس القيمة
- يبقي النظام نظيف

---

## 6. الدفع (Payment)

### 6.1 موقع الدفع في الفلو

```
الدفع يتم: بعد القبول ✅ وقبل النشر ✅
وليس: قبل التقديم ❌ ولا أثناء التقديم ❌
```

### 6.2 فلسفة الدفع

- اشتراك سنوي
- مساهمة في استدامة الدليل
- لا علاقة له بعدد الطلاب
- لا عمولة

### 6.3 فلو الدفع

1. بعد إنشاء الحساب
2. صفحة توضح: السعر، المدة، ماذا بعد الدفع
3. بعد الدفع: الحالة ← `published`

---

## 7. لوحة تحكم الأدمن (Admin Panel)

### 7.1 عرض الطلبات

قائمة بكل Profiles مع:
- الحالة
- تاريخ التقديم
- اكتمال البيانات
- وجود عينة

### 7.2 مراجعة بروفايل

الأدمن يستطيع:
- مشاهدة كل البيانات
- تشغيل الفيديو / الصوت
- **قبول** ← يُرسل invitation
- **رفض** ← مع سبب
- **طلب تعديل** ← مع رسالة مخصصة

### 7.3 إدارة الحالات

- تغيير state يدويًا
- إعادة فتح Profile
- تعليق نشر (`suspended`)

### 7.4 التعامل مع الاشتباه

لو المعلم يدّعي شهرة أو شخصية عامة:
- طلب تحقق إضافي
- تسجيل ملاحظة داخلية
- تعليق البروفايل

### 7.5 إدارة الدفع

- رؤية حالة الدفع
- تاريخ الاشتراك
- انتهاء المدة
- تعليق النشر عند الانتهاء

### 7.6 سجل النشاط (Audit Log)

**مطلوب قانونيًا وتشغيليًا:**
- من عدّل ماذا؟
- متى؟
- لماذا؟
- IP Address
- User Agent

---

## 8. Database Schema

### 8.1 Profile Status Enum

```sql
CREATE TYPE profile_status AS ENUM (
  'draft',
  'under_review',
  'needs_changes',
  'approved',
  'published',
  'suspended'
);
```

### 8.2 Profiles Table Fields

```sql
-- Core Identity
full_name text NOT NULL
age integer NOT NULL
country text NOT NULL
subjects text[] NOT NULL

-- Experience (structured)
experiences jsonb DEFAULT '[]'
-- Format: [{ organization, role, start_date, end_date, description }]

-- Specialization
teaching_types text[] -- تحفيظ، تصحيح، إجازات...
qualifications jsonb DEFAULT '[]'
-- Format: [{ name, issuer, year }]

-- Target Audience
audience text[] NOT NULL
student_age_min integer
student_age_max integer

-- Pricing
price_amount decimal
price_currency text DEFAULT 'EGP'

-- Contact & Sample
contact_method jsonb NOT NULL
video_url text NOT NULL
teaching_format teaching_format NOT NULL

-- Legal
legal_acknowledgement boolean DEFAULT false

-- Auth (nullable until approved)
user_id uuid REFERENCES auth.users(id)
invitation_token uuid
invitation_sent_at timestamptz
invitation_expires_at timestamptz -- 72 hours from sent_at

-- Status
status profile_status DEFAULT 'draft'
```

### 8.3 Audit Log Table

```sql
CREATE TABLE admin_audit_log (
  id uuid PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id),
  profile_id uuid REFERENCES profiles(id),
  action text NOT NULL, -- 'approve', 'reject', 'request_changes', 'suspend'
  notes text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);
```

---

## 9. Invitation Token Rules

| القاعدة | القيمة |
|---------|--------|
| One-time use | ✅ |
| Expiration | 72 ساعة |
| Format | UUID v4 |

**التحقق عند الاستخدام:**
```sql
WHERE invitation_token = $token
  AND invitation_expires_at > now()
  AND user_id IS NULL  -- not already used
```

---

## 10. Wizard State Persistence

**Technology:** Zustand with localStorage

**Rules:**
- ✅ Persist: Steps 1-4 data
- ❌ Don't Persist: Step 5 legal acknowledgement
- ❌ Don't Persist: Sensitive media links
- Clear on successful submission

---

## 11. الخلاصة

> **Misbah = Curated Directory, NOT Open Platform**

الخطة كلها (Auth late, Admin heavy, Audit log) تعني:
- مسؤولية واضحة
- لا شيء متروك للصدفة
- حماية قانونية وسمعة

---

End of Onboarding System Specification
