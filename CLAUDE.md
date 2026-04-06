# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Misbah (مصباح)** is a bilingual (Arabic/English) professional directory platform for independent Quran, Arabic, and Islamic studies teachers. It is built on Next.js 16 (App Router) with TypeScript, Supabase (PostgreSQL), and CSS Modules.

**Critical Product Philosophy:**
- Read `/context/product.md` and `/context/product-guidelines.md` FIRST before making any feature decisions
- This is a **directory**, NOT a marketplace/academy/booking platform
- Individual teachers only (no institutions)
- SEO-first approach with no visibility guarantees (see `/context/seo-philosophy.md`)
- Manual human review required for all teacher profiles
- Strict UI/UX guidelines in `/context/ui-ux.md` (monochrome base + soft icon colors, 8px spacing system, CSS Modules only)

---

## Development Commands

```bash
# Development server
npm run dev                    # Start at http://localhost:3000

# Production build
npm run build                  # Build for production
npm run start                  # Start production server

# Code quality
npm run lint                   # Run ESLint

# E2E Testing (Playwright)
npx playwright test            # Run all tests
npx playwright test --ui       # Interactive UI mode
npx playwright test --headed   # Run with browser visible
npx playwright test tests/onboarding.spec.ts  # Run specific test
npx playwright show-report     # View test report

# Supabase (Local Development)
npx supabase start             # Start local Supabase
npx supabase stop              # Stop local Supabase
npx supabase db reset          # Reset local database
npx supabase migration new <name>  # Create new migration
npx supabase db push           # Push schema changes
npx supabase gen types typescript --local > src/lib/types/database.ts  # Generate types
```

---

## Architecture Overview

### App Router Structure

**Route Groups:**
- `/(legal)/` - Legal pages with shared layout (terms, privacy, disclaimer)
- `/onboarding/` - 5-step wizard with shared layout and progress indicator
- `/admin/` - Admin dashboard (email-gated in MVP, should be upgraded to RBAC)
- `/teachers/[id]/` - Dynamic teacher profile pages (SEO-optimized)
- `/directory/` - Public browsable directory

### State Management

**Zustand Store** (`/src/app/onboarding/stores/wizard-store.ts`):
- Manages 5-step onboarding wizard state
- Persists to localStorage under `misbah-onboarding-wizard`
- Excludes sensitive data (video URLs) from persistence
- Provides computed helpers: `getTotalExperienceYears()`, `getAge()`
- Methods: `updateStep()`, `addEducation()`, `removeExperience()`, etc.

**I18n Context** (`/src/lib/i18n/provider.tsx`):
- React Context for Arabic/English switching
- Persists locale to localStorage: `misbah-locale`
- Updates `<html lang>` and `dir` attributes for RTL support
- Dynamically loads translations from `/src/lib/i18n/locales/`

### Database Patterns (Supabase)

**Three Client Types:**
1. **Server Client** (`/src/utils/supabase/server.ts`) - SSR-safe, manages cookies
2. **Browser Client** (`/src/utils/supabase/client.ts`) - Client-side queries
3. **Middleware** (`/src/utils/supabase/middleware.ts`) - Session refresh

**Key Tables:**
- `profiles` - Teacher profiles with 6-state lifecycle (draft → under_review → approved → published)
- `subscriptions` - Payment tracking (annual subscription model)
- `admin_audit_log` - Tracks all admin actions with IP/user agent

**Profile Lifecycle:**
```
draft (wizard) → under_review (submitted) →
approved (admin approved) → published (payment completed)
                  ↓
         needs_changes / suspended
```

**Critical Pattern:** Profiles are created WITHOUT user accounts. Auth accounts are created AFTER admin approval via invitation tokens (72h expiry).

### Server Actions Pattern

All data mutations use Next.js Server Actions (`'use server'`):
- `/src/app/onboarding/actions.ts` - `submitProfileAction()`
- `/src/app/admin/actions.ts` - `approveProfile()`, `rejectProfile()`, `suspendProfile()`
- `/src/app/onboarding/payment/actions.ts` - `submitPaymentProof()`

**Validation:** All actions use Zod schemas for type-safe validation.

### UI Component System

**Location:** `/src/components/ui/`

**Styling:** CSS Modules ONLY (no Tailwind, no CSS-in-JS)
- File-per-component: `button.tsx` → `button.module.css`
- 8px spacing system (see `/context/ui-ux.md`)
- Monochrome color palette with luminance-based hierarchy
- RTL-safe properties: `margin-inline-start`, `padding-inline-end`

**Key Components:**
- `Button` - Primary pill-shaped action button
- `RadioPills` - Radio buttons styled as pills (used for gender, titles)
- `Timeline` - Education/experience display (Step 2)
- `Card`, `Badge`, `Avatar`, `Accordion`

**Forbidden:**
- Colored buttons, colored text, or colored backgrounds (icon colors `--icon-*` are allowed for icons only per Section 3.4 of `/context/ui-ux.md`)
- Arbitrary spacing values (use 4px/8px/16px/24px/32px/48px/64px only)
- Centered paragraphs
- Linear animations

---

## Critical Development Rules

### Product Constraints

1. **Scope Boundaries** (Non-negotiable):
   - NO booking/scheduling features
   - NO payment processing for students (teacher-student interactions are off-platform)
   - NO ratings/reviews/rankings
   - NO institutional/academy listings (individual teachers ONLY)
   - NO "top teacher" or "featured" promotions

2. **Video Policy**:
   - ONE educational sample video REQUIRED (Quran recitation, lesson excerpt)
   - YouTube links only (no hosting on Misbah)
   - Optional intro video (NOT required)

3. **Manual Review Required**:
   - All profiles reviewed by humans within 24 hours
   - Review checks: scope, content clarity, video relevance
   - NOT a competency test (minimum viability only)

### SEO Philosophy

**Read `/context/seo-philosophy.md` before any SEO work:**
- "Eligibility to win, NOT guarantee of visibility"
- Each teacher page MUST have unique metadata
- Avoid keyword cannibalization between teacher pages
- Let search engines choose naturally (no artificial ranking)
- Most teacher pages may remain "silent" in search - this is correct

### Testing Strategy

**E2E-First Approach:**
- Focus on critical user flows (Playwright tests in `/tests/`)
- No enforced code coverage percentage
- Presentational code doesn't require unit tests

**Existing Tests:**
- `tests/public-pages.spec.ts` - Landing, directory, legal pages
- `tests/onboarding.spec.ts` - 5-step wizard flow
- `tests/admin.spec.ts` - Admin dashboard and review workflow

### Commit Protocol

**From `/context/workflow.md`:**
- Phase-based commits (group of related tasks), not per-task
- Summaries in git commit messages (not Git Notes)
- Prioritize production stability and SEO integrity

---

## Path Aliases

TypeScript paths configured in `tsconfig.json`:
```typescript
"@/*" → "./src/*"
```

**Example:**
```typescript
import { Button } from '@/components/ui'
import { createClient } from '@/utils/supabase/server'
import { WizardStore } from '@/app/onboarding/stores/wizard-store'
```

---

## Environment Setup

**Required Environment Variables** (`.env.local`):
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

**Local Supabase:**
```bash
npx supabase start  # Starts at http://localhost:54321
# Note: Local URLs will differ from production
```

---

## Key Files to Reference

Before making changes to specific areas, read these files:

| Area | Reference Files |
|------|----------------|
| Product scope | `/context/product.md`, `/context/product-guidelines.md` |
| UI/Design | `/context/ui-ux.md` |
| SEO | `/context/seo-philosophy.md` |
| Onboarding logic | `/context/05_onboarding_flow.md` |
| Identity/legal | `/context/identity.md` |
| Tech decisions | `/context/02_technical_spec.md` |
| Workflow | `/context/workflow.md` |

---

## Admin System (MVP State)

**Current Implementation:**
- Email whitelist in `/src/app/admin/page.tsx`: `admin@misbah.site`, `admin@example.com`
- Hardcoded for MVP - should be upgraded to proper role-based table in production

**To Check Admin Access:**
```typescript
const { data: { user } } = await supabase.auth.getUser()
const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email)
```

---

## Translation System

**Adding New Translations:**

1. Add keys to `/src/lib/i18n/locales/ar.ts` and `en.ts`:
```typescript
export default {
  common: {
    submit: "إرسال",  // AR
    submit: "Submit", // EN
  }
}
```

2. Use in components:
```typescript
import { useI18n } from '@/lib/i18n'

const { t } = useI18n()
return <button>{t('common.submit')}</button>
```

**RTL Support:**
- Always use `margin-inline-*` and `padding-inline-*`
- Use `text-align: start` (never `left`)
- CSS modules automatically handle `dir="rtl"` from `<html>`

---

## Database Migrations

**Location:** `/supabase/migrations/`

**Recent Migrations:**
- `20260124170000_onboarding_rebuild.sql` - Profile schema rebuild
- `20260124210000_add_onboarding_fields.sql` - Additional fields

**Creating New Migrations:**
```bash
npx supabase migration new descriptive_name
# Edit the generated .sql file
npx supabase db reset  # Apply to local DB
```

**Applying to Production:**
```bash
npx supabase db push
# Or use Supabase dashboard for manual review
```

---

## Common Patterns

### Server Component Data Fetching
```typescript
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select()
  return <div>{/* render */}</div>
}
```

### Client Component with State
```typescript
'use client'
import { useWizardStore } from '@/app/onboarding/stores/wizard-store'

export default function Step1() {
  const { step1, updateStep1 } = useWizardStore()
  // ...
}
```

### Server Actions
```typescript
'use server'
import { createClient } from '@/utils/supabase/server'

export async function submitProfileAction(formData: FormData) {
  const supabase = await createClient()
  // Validate with Zod
  // Insert/update database
  // Return result
}
```

---

## Deployment

**Platform:** Vercel (optimized for Next.js)

**Environment Variables Required:**
- Supabase credentials (URL, anon key, service role key)
- Production URLs must match Supabase dashboard configuration

**SEO Checklist Before Deploy:**
- Verify unique meta titles/descriptions per teacher page
- Check structured data (Person/ProfilePage schema)
- Validate sitemap generation
- Test RTL rendering for Arabic pages

---

## Final Notes

- **Simplicity is strategic:** Avoid overengineering (see `/context/02_technical_spec.md`)
- **Bilingual from ground up:** All UI supports Arabic/English
- **No external UI framework:** Custom CSS Modules components only
- **Profile ≠ User:** Profiles exist before authentication (decoupled until approval)
- **Manual review is core:** Not a bottleneck - it's the product
- **"Calm" design:** Quiet depth, content over chrome, premium through restraint
