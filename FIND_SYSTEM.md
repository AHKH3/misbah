# نظام /find - Dynamic Teacher Directory

تم بناء نظام فلترة ديناميكي كامل للمعلمين على `/find` routes حسب الخطة المطلوبة.

---

## ✅ ما تم إنجازه

### 1. Routes الديناميكية

تم إنشاء 4 مستويات من الفلترة:

```
/find/                                       # كل المعلمين
/find/[subject]/                            # فلتر بالمادة
/find/[subject]/[gender]/                   # فلتر بالمادة + الجنس
/find/[subject]/[gender]/[audience]/        # فلتر بالمادة + الجنس + الفئة
```

**القيم المسموحة:**
- `[subject]`: `quran`, `arabic`, `islamic_studies`
- `[gender]`: `male`, `female`
- `[audience]`: `kids`, `adults`

**إجمالي الصفحات الثابتة:** 1 + 3 + 6 + 12 = **22 صفحة**

---

### 2. SEO Metadata فريد لكل route

كل صفحة لها:
- ✅ Title فريد بالعربية والإنجليزية
- ✅ Description فريد ومحسّن للـ SEO
- ✅ OpenGraph tags (og:title, og:description, og:type, og:url)
- ✅ Twitter Card tags
- ✅ Alternates للغات (ar/en)
- ✅ JSON-LD ItemList schema

**مثال:**
```typescript
// /find/quran/female/kids
title: "معلمة القرآن الكريم للأطفال أونلاين | مصباح"
description: "معلمة متخصصة في تدريس القرآن الكريم للأطفال. مراجعة يدوية، معايير واضحة."
```

---

### 3. دوال الفلترة في `/src/lib/data/teachers.ts`

تم إضافة:

```typescript
interface TeacherFilters {
  subject?: SubjectDB;
  gender?: 'male' | 'female';
  audience?: 'kids' | 'adults';
  language?: string;
  languageLevel?: 'beginner' | 'intermediate' | 'advanced' | 'native';
  priceMin?: number;
  priceMax?: number;
  currency?: 'EGP' | 'USD';
}

async function getFilteredProfiles(filters: TeacherFilters): Promise<PublicProfile[]>
```

**الفلترة:**
- **Server-side (في query)**: subject, audience (age range), price
- **Client-side (بعد query)**: language, language level

---

### 4. Layout مشترك

```
/find/layout.tsx       # Layout مشترك لكل /find routes
/find/find.module.css  # CSS Module حسب نظام التصميم
```

**التصميم:**
- ✅ 8px spacing system
- ✅ Monochrome color palette
- ✅ RTL support كامل
- ✅ Responsive design

---

### 5. مكون TeacherGrid مشترك

```typescript
// /find/components/TeacherGrid.tsx
<TeacherGrid
  profiles={profiles}
  filter={{ subject, gender, audience }}
/>
```

**Features:**
- ✅ Breadcrumbs تلقائية حسب الفلتر
- ✅ عرض المعلمين في Grid
- ✅ Status badges
- ✅ Subject badges
- ✅ RTL/LTR switching

---

### 6. Translations (i18n)

تم إضافة في `/src/lib/i18n/locales/`:

```json
{
  "find": {
    "meta": {
      "allTeachers": { "title": "...", "description": "..." },
      "quran": { "title": "...", "description": "..." },
      "arabic": { "title": "...", "description": "..." },
      "islamicStudies": { "title": "...", "description": "..." },
      "male": { "title": "...", "description": "..." },
      "female": { "title": "...", "description": "..." },
      "kids": { "title": "...", "description": "..." },
      "adults": { "title": "...", "description": "..." }
    },
    "filters": { ... },
    "results": { ... }
  }
}
```

---

### 7. Redirect من /directory إلى /find

```typescript
// /src/app/directory/page.tsx
export default function DirectoryPage() {
  redirect('/find');
}
```

للحفاظ على backward compatibility.

---

## 📁 الملفات المنشأة/المعدلة

### ملفات جديدة:
1. `/src/app/find/page.tsx`
2. `/src/app/find/layout.tsx`
3. `/src/app/find/find.module.css`
4. `/src/app/find/components/TeacherGrid.tsx`
5. `/src/app/find/[subject]/page.tsx`
6. `/src/app/find/[subject]/[gender]/page.tsx`
7. `/src/app/find/[subject]/[gender]/[audience]/page.tsx`
8. `/src/app/find/README.md`

### ملفات معدلة:
1. `/src/lib/data/teachers.ts` - أضيفت `getFilteredProfiles()`
2. `/src/lib/i18n/locales/ar.json` - أضيفت translations
3. `/src/lib/i18n/locales/en.json` - أضيفت translations
4. `/src/app/directory/page.tsx` - تحويل إلى redirect
5. `/src/components/report/ReportForm.tsx` - إصلاح import path

---

## 🔍 أمثلة URLs

```
https://misbah.site/find
https://misbah.site/find/quran
https://misbah.site/find/quran/male
https://misbah.site/find/quran/male/kids
https://misbah.site/find/arabic/female/adults
https://misbah.site/find/islamic_studies/male/adults
```

---

## 🚀 كيفية التشغيل

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Lint
npm run lint
```

---

## 📊 Static Generation

يتم توليد جميع الصفحات عند Build time:

```typescript
// في كل page.tsx
export async function generateStaticParams() {
  // توليد جميع التوليفات الممكنة
}
```

**النتيجة:**
- 12 صفحة ديناميكية (subject × gender × audience)
- تحميل فوري بدون server-side rendering

---

## ⚠️ ملاحظات مهمة

### Gender Filter معطل حالياً
السبب: `gender` field غير موجود في `profiles` table حالياً.

**للتفعيل:**
1. أضف `gender` column للـ `profiles` table
2. عدّل `getFilteredProfiles()` في `teachers.ts`:
```typescript
if (filters.gender) {
  query = query.eq('gender', filters.gender);
}
```

### Query Parameters (المستقبل)
يمكن إضافة filters إضافية عبر query params:
```
/find?lang=english&lang_level=native
/find/quran?price_min=50&price_max=200&currency=EGP
```

حالياً، هذه معطلة ويمكن تفعيلها في `TeacherGrid.tsx`.

---

## 🎨 التصميم

### CSS Variables المستخدمة:
```css
--color-bg
--color-surface
--color-text
--color-text-secondary
--color-border
```

### Spacing System:
```
4px, 8px, 16px, 24px, 32px, 48px, 64px
```

### RTL Support:
```css
margin-inline-start
padding-inline-end
text-align: start
```

---

## 🔧 Troubleshooting

### Build Errors
إذا واجهت مشاكل في البناء:
1. تأكد من تثبيت جميع dependencies: `npm install`
2. احذف `.next`: `rm -rf .next`
3. أعد البناء: `npm run build`

### Type Errors
إذا ظهرت type errors:
1. تأكد من `tsconfig.json` صحيح
2. نظف cache: `rm -rf .next node_modules/.cache`

---

## 📈 المستقبل

### إضافات مقترحة:
1. ✅ Gender filter (بعد إضافة gender column)
2. ✅ Query params للفلترة الديناميكية
3. ✅ Sorting (by price, experience, rating)
4. ✅ Pagination (للصفحات الكبيرة)
5. ✅ Search box (بحث بالاسم)

---

**تم الإنجاز بنجاح ✅**
