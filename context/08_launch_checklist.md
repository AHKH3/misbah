# 08 — Launch Checklist

## المرحلة 1: التنظيف (Day 1)
- [ ] حذف الملفات اليتيمة
- [ ] دمج `src/utils` في `src/lib`
- [ ] إصلاح الـ imports المكسورة
- [ ] `npm run build` بنجاح

## المرحلة 2: قاعدة البيانات (Day 2)
- [ ] إنشاء migration جديد (Schema v2.0)
- [ ] إضافة `slug`, `gender`, `teaches_kids`, `teaches_adults`
- [ ] تطبيق على Supabase Remote
- [ ] اختبار الـ RLS policies

## المرحلة 3: الدليل (Day 3-4)
- [ ] بناء `/find/[subject]/page.tsx`
- [ ] بناء `/find/[subject]/[gender]/page.tsx`
- [ ] بناء `TeacherCard` component
- [ ] اختبار SEO

## المرحلة 4: البروفايل (Day 5)
- [ ] بناء `/teacher/[slug]/page.tsx`
- [ ] إضافة JSON-LD
- [ ] إضافة Metadata الديناميكية
- [ ] اختبار OG Tags

## المرحلة 5: التسجيل (Day 6)
- [ ] تحديث Onboarding Wizard
- [ ] إضافة حقول جديدة
- [ ] توليد `slug` تلقائياً
- [ ] اختبار التسجيل

## المرحلة 6: المراجعة (Day 7)
- [ ] تحديث Admin Panel
- [ ] عرض `video_review_url` للأدمن
- [ ] اختبار Approve/Reject

## المرحلة 7: الإطلاق
- [ ] تحديث `sitemap.ts`
- [ ] تقديم لـ Google Search Console
- [ ] دعوة 5-10 معلمين للتسجيل
- [ ] 🎉 **GO LIVE**
