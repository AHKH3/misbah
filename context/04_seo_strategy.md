# 04 — SEO Strategy

## 1. فلسفة الـ SEO

> **نوفر قابلية للفوز، لا ضمان ظهور.**

(راجع `/context/seo-philosophy.md` للتفاصيل الكاملة)

---

## 2. هيكلية الروابط (URL Architecture)

### صفحات المعلمين (Slug-based)
```
/teachers/[slug]
مثال: /teachers/ahmed-ali-egypt-quran
```

**تكوين الـ Slug:** `{first-name}-{last-name}-{country}-{primary-subject}`
- يُولَّد تلقائياً من الاسم الإنجليزي
- فريد (يُضاف رقم لو تكرر)
- مقروء وصديق للـ SEO

### صفحات الدليل (/find/)
| المسار | الكلمة المفتاحية المستهدفة |
|--------|----------------------------|
| `/find` | find quran teachers online |
| `/find/quran` | quran teachers online |
| `/find/tajweed` | tajweed teachers online |
| `/find/arabic` | arabic teachers online |
| `/find/islamic-studies` | islamic studies teachers online |
| `/find/quran/female` | female quran teachers |
| `/find/quran/male` | male quran teachers |
| `/find/quran/female/kids` | female quran teacher for kids |
| `/find/quran/female/adults` | female quran teacher for adults |
| `/teachers/[slug]` | {name} quran teacher |

**إجمالي:** 22 صفحة static (1 + 4 + 8 + 8)

---

## 3. Metadata Templates

### صفحة الدليل الرئيسية
```
Title: Find Quran, Arabic & Islamic Studies Teachers Online | Misbah
Description: Professional directory of independent Quran, Arabic, and Islamic studies teachers. Find qualified online tutors worldwide.
```

### صفحة مادة
```
Title: {Subject} Teachers Online | Misbah
Description: Find qualified {subject} teachers online. Browse certified instructors and book lessons.
Example: "Quran Teachers Online | Misbah"
```

### صفحة مادة + جنس
```
Title: {Gender} {Subject} Teachers Online | Misbah
Description: Find qualified {gender} {subject} teachers online. Browse certified instructors.
Example: "Female Quran Teachers Online | Misbah"
```

### صفحة مادة + جنس + جمهور
```
Title: {Gender} {Subject} Teachers for {Audience} Online | Misbah
Description: Find qualified {gender} {subject} teachers for {audience}. Online lessons with certified instructors.
Example: "Female Quran Teachers for Kids Online | Misbah"
```

### صفحة المعلم
```
Title: {Name} — {Subject} Teacher from {Country} | Misbah
Description: {Name}: {Subject} teacher from {Country}. {Bio snippet (first 120 chars)}
Example: "Ahmed Ali — Quran Teacher from Egypt | Misbah"
```

---

## 4. JSON-LD Schema

### صفحة الدليل (ItemList)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://misbah.site/teachers/ahmed-ali-egypt-quran",
      "name": "Ahmed Ali — Quran Teacher"
    }
  ]
}
```

### صفحة المعلم (Person/ProfilePage)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ahmed Ali",
  "jobTitle": "Quran Teacher",
  "knowsAbout": ["Quran", "Tajweed", "Arabic"],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "EG"
  },
  "knowsLanguage": ["Arabic", "English"],
  "url": "https://misbah.site/teachers/ahmed-ali-egypt-quran"
}
```

---

## 5. Sitemap

**الموقع:** `/src/app/sitemap.ts`

يولّد sitemap.xml ديناميكياً يشمل:
1. الصفحات الثابتة (home, about, etc.)
2. كل صفحات /find/ (22 صفحة)
3. كل صفحات المعلمين المنشورة (status = 'published')

**التحديث:** يتم إعادة بناء الـ sitemap مع كل build

---

## 6. الممنوعات

| ممنوع | السبب |
|-------|-------|
| عناوين متكررة | Keyword Cannibalization |
| "أفضل معلم" / "Top Teacher" | مخالف للفلسفة (لا ترتيب) |
| Thin Content | عقوبة جوجل |
| Duplicate descriptions | تقليل القيمة |
| Keywords في slug | يبدو spammy |

---

## 7. معايير الجودة

**كل صفحة يجب أن تحتوي على:**
- [ ] Title فريد (< 60 حرف)
- [ ] Description فريد (< 160 حرف)
- [ ] JSON-LD Schema
- [ ] Canonical URL
- [ ] Open Graph tags
- [ ] Alt text للصور
- [ ] Semantic HTML (h1, h2, etc.)

---

## 8. استراتيجية المحتوى

**صفحات المعلمين:**
- البايو (عربي + إنجليزي) = محتوى فريد
- التعليم والخبرة = سياق إضافي
- الفيديو = engagement signal

**صفحات الدليل:**
- عدد النتائج = freshness signal
- الفلاتر النشطة = relevance
- Breadcrumbs = structure
