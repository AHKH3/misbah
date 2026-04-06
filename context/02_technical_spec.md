# 02 — Technical Specification

## 1. Tech Stack

| الطبقة | الأداة | الإصدار | الغرض |
|--------|--------|---------|-------|
| **Framework** | Next.js (App Router) | 16.x | SSR، SEO، Routing |
| **Language** | TypeScript | 5.x | Type Safety |
| **UI** | React | 19.x | Components |
| **Styling** | CSS Modules | - | Zero-runtime، Semantic |
| **Database** | Supabase (PostgreSQL) | - | Auth، Storage، DB |
| **State** | Zustand | 5.x | Client State |
| **Validation** | Zod | 4.x | Schema Validation |
| **Icons** | Lucide React | - | Consistent Icons |
| **Testing** | Playwright | - | E2E Tests |
| **Hosting** | Vercel | - | Edge، CDN |
| **Analytics** | Vercel Analytics | - | Simple، Privacy-first |

---

## 2. Database Schema (v3.0 - Final)

### `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Identity & SEO
  slug TEXT UNIQUE NOT NULL,
  full_name JSONB NOT NULL, -- {"ar": "...", "en": "..."}
  full_name_en TEXT, -- for slug generation
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  title TEXT, -- sheikh/teacher/professor
  birth_date DATE,
  country JSONB NOT NULL, -- {"ar": "...", "en": "..."}

  -- Contact (Public - displayed directly)
  contact_method JSONB NOT NULL, -- {whatsapp, telegram, email, website}
  misbah_email TEXT NOT NULL UNIQUE, -- for admin communication

  -- Teaching Info
  subjects JSONB NOT NULL, -- [{main, specializations}]
  languages JSONB NOT NULL, -- [{language, level}]
  age_min INTEGER,
  age_max INTEGER,
  student_gender TEXT, -- "male" | "female" | "both"
  price NUMERIC,
  currency TEXT,

  -- Education & Experience
  education JSONB NOT NULL, -- [{type, degree, institution, field, start_year, end_year, notes}]
  experience JSONB NOT NULL, -- [{institution_type, role, start_month, start_year, end_month, end_year, current, description}]

  -- Presentation (SEO-Critical)
  bio_text_ar TEXT NOT NULL,
  bio_text_en TEXT NOT NULL,
  video_url TEXT NOT NULL,

  -- Status & Admin
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'suspended', 'rejected')),
  is_founding BOOLEAN DEFAULT false,
  ban_until TIMESTAMPTZ,
  ban_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX idx_profiles_slug ON profiles(slug);
CREATE UNIQUE INDEX idx_profiles_misbah_email ON profiles(misbah_email);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_ban ON profiles(ban_until) WHERE ban_until IS NOT NULL;
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
```

### `contact_clicks` Table
```sql
CREATE TABLE contact_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('whatsapp', 'telegram', 'email', 'website')),
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_clicks_profile ON contact_clicks(profile_id);
CREATE INDEX idx_clicks_date ON contact_clicks(clicked_at);
CREATE INDEX idx_clicks_type ON contact_clicks(contact_type);
```

### `duplicate_alerts` Table
```sql
CREATE TABLE duplicate_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  new_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  existing_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  match_score DECIMAL NOT NULL CHECK (match_score >= 0 AND match_score <= 1),
  matched_fields JSONB NOT NULL, -- {"name": true, "whatsapp": true, ...}
  reviewed BOOLEAN DEFAULT false,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_dup_new_profile ON duplicate_alerts(new_profile_id);
CREATE INDEX idx_dup_existing_profile ON duplicate_alerts(existing_profile_id);
CREATE INDEX idx_dup_unreviewed ON duplicate_alerts(reviewed) WHERE reviewed = false;
CREATE INDEX idx_dup_score ON duplicate_alerts(match_score DESC);
```

### `admin_audit_log` Table
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'approve', 'reject', 'suspend', 'confirm_payment'
  target_id UUID NOT NULL,
  reason TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_target ON admin_audit_log(target_id);
CREATE INDEX idx_audit_action ON admin_audit_log(action);
CREATE INDEX idx_audit_created_at ON admin_audit_log(created_at);
```

---

## 3. Project Structure (Current)

```
src/
├── app/
│   ├── (legal)/              # Terms, Privacy, Disclaimer
│   ├── about/
│   ├── contact/
│   ├── for-teachers/
│   ├── find/                 # Directory with filters
│   │   ├── page.tsx         # /find
│   │   └── [subject]/
│   │       ├── page.tsx     # /find/quran
│   │       └── [gender]/
│   │           ├── page.tsx # /find/quran/female
│   │           └── [audience]/
│   │               └── page.tsx # /find/quran/female/kids
│   ├── teachers/
│   │   └── [slug]/          # /teachers/ahmed-ali-egypt-quran
│   ├── onboarding/
│   │   ├── step-1/ to step-6/
│   │   ├── payment/
│   │   ├── success/
│   │   ├── stores/
│   │   └── actions.ts
│   ├── invite/              # Invitation system (post-approval)
│   ├── admin/
│   │   ├── page.tsx         # Dashboard
│   │   ├── profile/[id]/    # Profile detail
│   │   ├── review/          # Review queue
│   │   ├── duplicates/      # Duplicate alerts
│   │   ├── analytics/       # Contact analytics
│   │   ├── payments/        # Payment review
│   │   ├── reports/         # User reports
│   │   └── actions.ts
│   ├── api/
│   │   └── track-contact-click/ # Anonymous tracking endpoint
│   ├── sitemap.ts
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Button, Card, Badge, etc.
│   ├── landing/             # Landing page sections
│   ├── layout/              # Header, Footer
│   └── report/              # Reporting system
├── lib/
│   ├── auth/               # is-admin helper
│   ├── data/               # teachers.ts (data fetching)
│   ├── i18n/               # Internationalization
│   ├── types/              # TypeScript types
│   ├── utils/              # Helpers
│   ├── email/              # Resend templates (NOT YET IMPLEMENTED)
│   ├── notifications/      # Telegram Bot (NOT YET IMPLEMENTED)
│   └── hooks/
└── utils/
    └── supabase/           # Client factories
```

---

## 4. External Integrations (Planned)

### Resend (Email)
- **للمعلم:** إيميل القبول + إيميل إنشاء الحساب
- **للأدمن:** (عبر Telegram فقط)
- **الوضع الحالي:** NOT YET IMPLEMENTED

### Telegram Bot
- **إشعارات الأدمن:**
  - معلم جديد سجّل
  - معلم رفع صورة دفع
  - تنبيه تكرار (≥ 60%)
- **الوضع الحالي:** NOT YET IMPLEMENTED
