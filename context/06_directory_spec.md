# 06 — Directory Engine

## هيكلية المسارات الكاملة (22 صفحة)

```
src/app/find/
├── page.tsx                                    # /find
├── [subject]/
│   ├── page.tsx                               # /find/quran
│   └── [gender]/
│       ├── page.tsx                           # /find/quran/female
│       └── [audience]/
│           └── page.tsx                       # /find/quran/female/kids
```

**جميع الصفحات المُولّدة:**
```
/find
/find/quran                    /find/tajweed                 /find/arabic                 /find/islamic-studies
/find/quran/male              /find/tajweed/male            /find/arabic/male            /find/islamic-studies/male
/find/quran/female            /find/tajweed/female          /find/arabic/female          /find/islamic-studies/female
/find/quran/male/kids         /find/tajweed/male/kids       /find/arabic/male/kids       /find/islamic-studies/male/kids
/find/quran/male/adults       /find/tajweed/male/adults     /find/arabic/male/adults     /find/islamic-studies/male/adults
/find/quran/female/kids       /find/tajweed/female/kids     /find/arabic/female/kids     /find/islamic-studies/female/kids
/find/quran/female/adults     /find/tajweed/female/adults   /find/arabic/female/adults   /find/islamic-studies/female/adults
```

---

## القيم المسموحة

| Segment | القيم |
|---------|-------|
| `[subject]` | `quran`, `tajweed`, `arabic`, `islamic-studies` |
| `[gender]` | `male`, `female` |
| `[audience]` | `kids`, `adults` |

---

## الفلاتر الإضافية (Query Params)

**اللغة:**
```
?lang=english&lang_level=native
?lang=arabic&lang_level=advanced
```

**السعر:**
```
?price_min=50&price_max=200&currency=EGP
?price_min=10&price_max=50&currency=USD
```

**أمثلة كاملة:**
```
/find/quran/female/kids?lang=english&lang_level=native&price_max=100&currency=USD
```

---

## منطق الصفحة (Server Component)

```tsx
export default async function DirectoryPage({ params, searchParams }) {
  const { subject, gender, audience } = await params;

  // Validation
  if (subject && !VALID_SUBJECTS.includes(subject)) notFound();
  if (gender && !VALID_GENDERS.includes(gender)) notFound();
  if (audience && !VALID_AUDIENCES.includes(audience)) notFound();

  // Get filters from query params
  const filters: FilterParams = {
    subject,
    gender,
    audience,
    lang: searchParams.lang,
    lang_level: searchParams.lang_level,
    price_min: searchParams.price_min ? parseInt(searchParams.price_min) : undefined,
    price_max: searchParams.price_max ? parseInt(searchParams.price_max) : undefined,
    currency: searchParams.currency,
  };

  // Fetch teachers
  const teachers = await getFilteredProfiles(filters);

  return (
    <>
      <SEOHead filters={filters} />
      <Breadcrumbs filters={filters} />
      <DirectoryHeader count={teachers.length} filters={filters} />
      <TeacherGrid teachers={teachers} />
    </>
  );
}
```

---

## دالة الفلترة (getFilteredProfiles)

**الموقع:** `src/lib/data/teachers.ts`

```typescript
export async function getFilteredProfiles(filters: FilterParams) {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('status', 'published');

  // Subject filter
  if (filters.subject) {
    query = query.contains('subjects', [filters.subject]);
  }

  // Gender filter
  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }

  // Audience filter (kids/adults)
  if (filters.audience === 'kids') {
    query = query.lte('age_min', 17);
  } else if (filters.audience === 'adults') {
    query = query.gte('age_max', 18);
  }

  // Language filter
  if (filters.lang) {
    query = query.contains('languages', [filters.lang]);
  }

  // Price filter
  if (filters.price_min || filters.price_max) {
    if (filters.price_min) query = query.gte('price', filters.price_min);
    if (filters.price_max) query = query.lte('price', filters.price_max);
    if (filters.currency) query = query.eq('currency', filters.currency);
  }

  const { data } = await query.order('created_at', { ascending: false });
  return data || [];
}
```

---

## الـ SEO لكل صفحة

**كل صفحة تحصل على:**
1. **عنوان فريد** (Title)
2. **وصف فريد** (Description)
3. **JSON-LD Schema** (ItemList)
4. **Breadcrumbs**
5. **Canonical URL**

**مثال:**
```typescript
// /find/quran/female/kids
export async function generateMetadata({ params }) {
  return {
    title: 'Female Quran Teachers for Kids Online | Misbah',
    description: 'Find qualified female Quran teachers for kids. Online lessons with certified instructors.',
  };
}
```

---

## الترتيب الافتراضي

1. `status = 'published'` فقط
2. `created_at DESC` (الأحدث أولاً)

---

## Breadcrumbs

كل صفحة تعرض breadcrumbs:
```
Home > Find Teachers > Quran > Female > Kids
```

**مثال التنفيذ:**
```tsx
<nav className={styles.breadcrumbs}>
  <Link href="/">Home</Link>
  <span>›</span>
  <Link href="/find">Find Teachers</Link>
  {subject && (
    <>
      <span>›</span>
      <Link href={`/find/${subject}`}>{getSubjectLabel(subject)}</Link>
    </>
  )}
  {gender && (
    <>
      <span>›</span>
      <Link href={`/find/${subject}/${gender}`}>{getGenderLabel(gender)}</Link>
    </>
  )}
  {audience && (
    <>
      <span>›</span>
      <span>{getAudienceLabel(audience)}</span>
    </>
  )}
</nav>
```
