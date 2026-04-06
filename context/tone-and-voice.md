# Tone and Voice Guidelines

**Last Updated:** 2026-02-04

This document records critical decisions about Misbah's tone, voice, and messaging strategy. All copywriting and UI text MUST follow these guidelines.

---

## 1. Core Principle: Implicit Selectivity, Not Explicit Exclusivity

**The Shift:**
- FROM: "Closed club" / "Exclusive" / "Premium" messaging
- TO: "Professional directory for serious teachers"

**Why:**
- Misbah IS selective implicitly (paid subscription + manual review + not everyone is accepted)
- But we don't market this as "exclusivity" or "elitism"
- We focus on **professionalism** and **clear standards**, not on being "closed"

**In Practice:**
- We have standards → We communicate them clearly
- We review manually → We explain why (quality, seriousness)
- We charge subscription → We explain the value (professional presence, no commissions)
- We DON'T say: "not for everyone", "elite", "exclusive", "closed club"

---

## 2. Forbidden vs. Allowed Terminology

### ❌ Forbidden (Arabic)
| الممنوع | السبب |
|---------|-------|
| نادي مغلق / نادي محترم | يوحي بالعنصرية والانغلاق |
| معلمون مميزون / نخبة المعلمين | يوحي بالتفوق والتمييز |
| ليس دليلاً عاماً / ليس للجميع | دفاعي ومستفز |
| انضم لمئات المعلمين المتميزين | مبالغة وتسويق زائد |
| مجتمع ودي | غير واضح ومضلل |

### ✅ Allowed (Arabic)
| المسموح | الاستخدام |
|---------|-----------|
| دليل لمعلمين جادين | الوصف الأساسي لمصباح |
| دليل احترافي | بديل "نادي مهني" |
| دليل منتقى بعناية / دليل مُراجَع | التأكيد على المراجعة اليدوية |
| معلمون جادون | بديل "معلمون مميزون" |
| معايير واضحة للقبول | شرح العملية دون دفاعية |
| مراجعة يدوية | التأكيد على الجودة |

### ❌ Forbidden (English)
| Forbidden | Why |
|-----------|-----|
| Closed club / exclusive | Implies elitism |
| Premium teachers / elite teachers | Suggests superiority |
| Not a mass directory / not for everyone | Defensive and off-putting |
| Join hundreds of distinguished teachers | Exaggerated marketing |
| Friendly community | Unclear and misleading |

### ✅ Allowed (English)
| Allowed | Usage |
|---------|-------|
| Professional directory for serious teachers | Core description |
| Directory for serious teachers | Short form |
| Manually reviewed directory | Emphasizes quality control |
| Serious teachers | Replacement for "premium/distinguished" |
| Clear standards | Explains the process without defensiveness |
| Manual review | Quality emphasis |

---

## 3. Specific Changes Made (2026-02-04)

### 3.1 Hero Section
**Before:**
- AR: "نادي المعلمين المميزين الذين تم التحقق من هويتهم"
- EN: "The verified club of distinguished teachers"

**After:**
- AR: "دليل لمعلمي القرآن والعربية والدراسات الإسلامية"
- EN: "Professional directory for Quran, Arabic, and Islamic Studies teachers"

### 3.2 Value Proposition
**Before:**
- AR: "معلمون مميزون. تحقق يدوي من الهوية. تواصل مباشر."
- EN: "Distinguished teachers. Manual identity verification. Direct contact."

**After:**
- AR: "معلمون جادون. مراجعة يدوية. تواصل مباشر."
- EN: "Serious teachers. Manual review. Direct contact."

### 3.3 Trust Badges
**Before:**
- ["تحقق من الهوية", "دليل منتقى", "لا نتدخل في أسعارك"]

**After:**
- ["مراجعة يدوية", "معايير واضحة", "معلمون جادون"]

### 3.4 For Teachers Section
**Before:**
- Title: "انضم لنادي المعلمين المحترم"
- Point: "نادي محترم — معلمون جادون فقط، ليس دليلاً عاماً"

**After:**
- Title: "انضم لدليل المعلمين الجادين"
- Point: "معايير واضحة — نراجع كل ملف يدوياً قبل النشر"

### 3.5 Disclaimers Removed
**Removed from all public pages:**
- "مصباح ليس دليلاً عاماً" (Misbah is not a mass directory)
- "ليس كل من يتقدم يُقبل" (Not everyone who applies is accepted)
- All defensive language about selectivity

**Why:** Disclaimers are defensive and off-putting. Keep legal protection in `/legal/disclaimer` only.

### 3.6 About Page Restructure
**Before:** Mixed messaging about "closed club" and "exclusivity"

**After:** Clear structure:
1. What is Misbah? (Professional directory)
2. Why manual review? (Quality, seriousness, not competency test)
3. For whom? (Serious independent teachers + students seeking them)
4. How does it work? (Submit → Review → Approval → Payment → Publish)

### 3.7 FAQ Rebuild
**Removed defensive questions:**
- "لماذا مصباح ليس مجانياً؟" (Why isn't Misbah free?)
- "ما الذي يجعل مصباح مختلفاً؟" (What makes Misbah different?)

**Added practical questions:**
- "ما هي معايير قبول المعلمين؟" (What are the teacher acceptance criteria?)
- "كم تستغرق المراجعة؟" (How long does review take?)
- "ماذا لو رُفض ملفي؟" (What if my profile is rejected?)

---

## 4. Scope Clarifications (Implicit Standards)

These are part of our standards but NOT explicitly marketed as "restrictions":

### 4.1 Madhab (School of Thought)
**Decision:** Sunni teachers only, but we don't mention madhab at all.

**Why:**
- It's our implicit standard (we won't accept non-Sunni applications)
- But we don't advertise it or make it a "selling point"
- We simply don't mention madhab in the UI or forms

**Implementation:**
- ✅ Removed madhab field from onboarding form
- ✅ Removed madhab from profile schema
- ✅ No mention in marketing/copy
- ⚠️ Admin reviewers know this standard internally

### 4.2 Teaching Mode: Online Only
**Decision:** Online teaching only. No in-person/hybrid options.

**Why:**
- Misbah is a global directory for online teachers
- In-person teaching is location-dependent and not our scope
- Simplifies the platform and user expectations

**Implementation:**
- ✅ Removed "في الموقع" (in-person) option from forms
- ✅ Removed location/city fields (not needed for online-only)
- ✅ Only "عبر الإنترنت" (online) remains as the teaching mode
- ✅ Updated product.md to clarify "online only"

**Marketing:**
- We DO say: "دليل لمعلمي القرآن عبر الإنترنت" (directory for online Quran teachers)
- We DON'T say: "نحن لا نقبل المعلمين الحضوريين" (we don't accept in-person teachers) ← defensive

---

## 5. Tone Checklist for New Copy

Before publishing any UI text, marketing copy, or documentation, check:

- [ ] Does it avoid "closed club" / "exclusive" / "elite" language?
- [ ] Does it use "serious teachers" instead of "distinguished/premium teachers"?
- [ ] Does it avoid defensive phrases like "not for everyone" or "not a mass directory"?
- [ ] Does it focus on **standards** and **professionalism** rather than **exclusivity**?
- [ ] Is it confident without being elitist?
- [ ] Does it respect both teachers and students as equals?
- [ ] Does it avoid over-promising or marketing hype?

---

## 6. Where These Guidelines Apply

### Must Follow Strictly:
- `/src/lib/i18n/locales/` - All UI text in Arabic and English
- Landing page (home)
- About page
- FAQ
- Directory page
- Onboarding wizard intro/success pages
- All public-facing marketing

### Reference for Consistency:
- `/conductor/identity.md` - Arabic identity document
- `/conductor/product.md` - Product scope and positioning
- Error messages and notifications
- Email templates (future)
- Social media posts (future)

### Does NOT Apply:
- Internal admin notes
- Code comments
- Technical documentation
- Legal pages (disclaimer/terms/privacy can be more explicit about limitations)

---

## 7. Examples: Before/After

### Example 1: Hero CTA for Teachers
❌ **Before:** "انضم لنادي المعلمين المحترم"
✅ **After:** "انضم لدليل المعلمين الجادين"

### Example 2: Directory Description
❌ **Before:** "تصفح معلمينا المتميزين الذين تم التحقق منهم يدوياً"
✅ **After:** "تصفح معلمي القرآن والعربية والدراسات الإسلامية"

### Example 3: Onboarding Subtitle
❌ **Before:** "انضم لمئات المعلمين المتميزين في مصباح"
✅ **After:** "تقدّم للانضمام لدليل المعلمين الجادين"

### Example 4: About Page Intro
❌ **Before:** "مصباح نادي مهني مغلق للمعلمين المميزين الذين يقدّرون الانتماء لمجتمع محترم"
✅ **After:** "مصباح دليل احترافي لمعلمي القرآن والعربية والدراسات الإسلامية عبر الإنترنت"

---

## 8. Related Documents

- `/conductor/identity.md` - Arabic identity and terminology
- `/conductor/product.md` - Product scope and value proposition
- `/conductor/ui-ux.md` - Visual design and tone (calm, quiet)
- `/conductor/seo-philosophy.md` - SEO messaging (eligibility, not guarantee)

---

**Note to Future Claude:** If the user corrects tone/voice/messaging, update this file FIRST, then propagate changes to i18n files and conductor docs. This file is the source of truth for how we talk about Misbah.
