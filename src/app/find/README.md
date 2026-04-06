# /find Routes - Dynamic Teacher Directory

نظام ديناميكي لفلترة وعرض المعلمين حسب المعايير المختلفة.

## الهيكلية

```
/find/
├── page.tsx                                  # جميع المعلمين
├── [subject]/page.tsx                        # فلتر بالمادة
├── [subject]/[gender]/page.tsx              # فلتر بالمادة والجنس
└── [subject]/[gender]/[audience]/page.tsx   # فلتر بالمادة والجنس والفئة
```

## القيم المسموحة

### Subjects
- `quran` - القرآن الكريم
- `arabic` - اللغة العربية
- `islamic_studies` - الدراسات الإسلامية

### Gender
- `male` - معلم
- `female` - معلمة

### Audience
- `kids` - أطفال (أقل من 18)
- `adults` - كبار (18 فما فوق)

## أمثلة URLs

```
/find                              # كل المعلمين (12 combinations total)
/find/quran                        # معلمو القرآن (4 combinations)
/find/quran/male                   # معلمو القرآن الذكور (2 combinations)
/find/quran/male/kids              # معلمو القرآن الذكور للأطفال (1)
/find/arabic/female/adults         # معلمات العربية للكبار (1)
```

## SEO Metadata

كل route له:
- ✅ Title فريد بالعربية
- ✅ Description فريد بالعربية والإنجليزية
- ✅ OpenGraph tags
- ✅ Alternates للغات
- ✅ JSON-LD ItemList schema

## الفلترة

### Server-Side (في getFilteredProfiles)
- Subject (في الـ query)
- Audience (age range في الـ query)
- Price range (في الـ query)

### Client-Side (بعد الاستعلام)
- Language
- Language Level

### معطل حالياً
- Gender filter (يتطلب إضافة gender field للـ profiles table)

## Static Generation

يتم توليد 12 صفحة ثابتة عند Build:
- 3 subjects × 2 genders × 2 audiences = 12 combinations

## الانتقال من /directory

`/directory` الآن يعمل redirect إلى `/find` للحفاظ على backward compatibility.

## التصميم

- CSS Modules فقط (`find.module.css`)
- نظام 8px spacing
- Monochrome color palette
- RTL support كامل
