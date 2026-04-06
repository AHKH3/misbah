-- Migration: Add Plan Requirements
-- Date: 2026-02-08
-- Description: Adds slug, misbah_email, founding teacher flag, ban system, contact tracking, and duplicate detection

-- ============================================
-- PART 1: Add New Columns to Profiles Table
-- ============================================

-- Add slug for SEO-friendly URLs
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS slug text;

-- Add misbah_email for communication with Misbah platform
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS misbah_email text;

-- Add founding teacher flag (first 20 teachers get lifetime discount)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_founding boolean DEFAULT false;

-- Add ban system fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ban_until timestamptz;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ban_reason text;

-- Make slug unique and not null after backfilling
-- We'll generate slugs for existing profiles in the application layer
-- For now, add constraint that new profiles must have slug
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_slug_unique UNIQUE (slug);

-- Comments for documentation
COMMENT ON COLUMN public.profiles.slug IS 'SEO-friendly URL slug: firstname-lastname-country-subject (unique)';
COMMENT ON COLUMN public.profiles.misbah_email IS 'Email for communication with Misbah platform (review results, notifications)';
COMMENT ON COLUMN public.profiles.is_founding IS 'True if teacher is one of the first 20 founding members (lifetime pricing)';
COMMENT ON COLUMN public.profiles.ban_until IS 'Ban expiration date (NULL = not banned, can be 30/90 days or permanent)';
COMMENT ON COLUMN public.profiles.ban_reason IS 'Admin reason for ban/rejection';

-- ============================================
-- PART 2: Create Contact Clicks Tracking Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.contact_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_type text NOT NULL CHECK (contact_type IN ('whatsapp', 'telegram', 'email')),
  clicked_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_contact_clicks_profile_id ON public.contact_clicks(profile_id);
CREATE INDEX IF NOT EXISTS idx_contact_clicks_date ON public.contact_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_clicks_type ON public.contact_clicks(contact_type);

-- Comments
COMMENT ON TABLE public.contact_clicks IS 'Anonymous tracking of contact button clicks (no visitor data stored)';
COMMENT ON COLUMN public.contact_clicks.contact_type IS 'Type of contact method clicked: whatsapp, telegram, or email';

-- ============================================
-- PART 3: Create Duplicate Alerts Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.duplicate_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  new_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  existing_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_score decimal(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  matched_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed boolean DEFAULT false,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_new_profile ON public.duplicate_alerts(new_profile_id);
CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_existing_profile ON public.duplicate_alerts(existing_profile_id);
CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_unreviewed ON public.duplicate_alerts(reviewed) WHERE reviewed = false;
CREATE INDEX IF NOT EXISTS idx_duplicate_alerts_score ON public.duplicate_alerts(match_score DESC);

-- Comments
COMMENT ON TABLE public.duplicate_alerts IS 'Alerts for potential duplicate profile submissions (fraud prevention)';
COMMENT ON COLUMN public.duplicate_alerts.match_score IS 'Weighted similarity score 0-100% (≥60% = warning, ≥85% = red alert)';
COMMENT ON COLUMN public.duplicate_alerts.matched_fields IS 'JSON object showing which fields matched: {name: 30, whatsapp: 25, youtube: 20, etc}';

-- ============================================
-- PART 4: Update RLS Policies for New Tables
-- ============================================

-- Contact Clicks: No read access for public (admin analytics only)
ALTER TABLE public.contact_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking (handled via API route)
CREATE POLICY "Anyone can insert contact clicks"
  ON public.contact_clicks FOR INSERT
  WITH CHECK (true);

-- Duplicate Alerts: Admin-only access
ALTER TABLE public.duplicate_alerts ENABLE ROW LEVEL SECURITY;

-- No public policies (handled via service role in admin actions)

-- ============================================
-- PART 5: Add Indexes for Profiles
-- ============================================

-- Index for slug lookups (primary profile access method)
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug) WHERE slug IS NOT NULL;

-- Index for misbah_email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_misbah_email ON public.profiles(misbah_email);

-- Index for banned profiles
CREATE INDEX IF NOT EXISTS idx_profiles_ban_until ON public.profiles(ban_until) WHERE ban_until IS NOT NULL;

-- Index for founding teachers
CREATE INDEX IF NOT EXISTS idx_profiles_founding ON public.profiles(is_founding) WHERE is_founding = true;

-- ============================================
-- COMPLETE
-- ============================================

COMMENT ON TABLE public.contact_clicks IS 'Anonymous tracking of contact button clicks for pricing analytics';
COMMENT ON TABLE public.duplicate_alerts IS 'Fraud prevention: weighted matching algorithm detects potential duplicate submissions';
