-- Migration: Onboarding System Rebuild
-- Date: 2026-01-24
-- Description: Implements new 6-state profile lifecycle, adds missing fields, creates audit log

-- ============================================
-- PART 1: Update Profile Status Enum
-- ============================================

-- Step 1: Drop ALL existing policies on profiles table
-- Must be done before altering column type that is used in policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view active profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view published profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create draft profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Step 2: Create new enum type
CREATE TYPE profile_status_new AS ENUM (
  'draft',
  'under_review',
  'needs_changes',
  'approved',
  'published',
  'suspended'
);

-- Step 3: Migrate existing data using safer approach
-- Instead of ALTER TYPE (which fails), we:
-- 3a. Add new column with new type
ALTER TABLE public.profiles 
  ADD COLUMN status_new profile_status_new;

-- 3b. Populate new column by casting old status to text first
UPDATE public.profiles 
SET status_new = 
  CASE 
    WHEN status::text = 'pending_payment' THEN 'draft'::profile_status_new
    WHEN status::text = 'payment_submitted' THEN 'under_review'::profile_status_new
    WHEN status::text = 'active' THEN 'published'::profile_status_new
    WHEN status::text = 'inactive' THEN 'suspended'::profile_status_new
    ELSE 'draft'::profile_status_new
  END;

-- 3c. Drop old column
ALTER TABLE public.profiles 
  DROP COLUMN status;

-- 3d. Rename new column to old name
ALTER TABLE public.profiles 
  RENAME COLUMN status_new TO status;

-- 3e. Set default
ALTER TABLE public.profiles 
  ALTER COLUMN status SET DEFAULT 'draft'::profile_status_new;

-- Step 4: Drop old type (if exists) and rename new
DROP TYPE IF EXISTS profile_status;
ALTER TYPE profile_status_new RENAME TO profile_status;

-- ============================================
-- PART 2: Add Missing Columns to Profiles
-- ============================================

-- Core Identity
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS age integer;

-- Experience (structured JSON array)
-- Format: [{ organization, role, start_date, end_date, description }]
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS experiences jsonb DEFAULT '[]'::jsonb;

-- Specialization
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS teaching_types text[];

-- Qualifications (structured JSON array)
-- Format: [{ name, issuer, year }]
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS qualifications jsonb DEFAULT '[]'::jsonb;

-- Target Audience (detailed)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS student_age_min integer;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS student_age_max integer;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS student_gender text;

-- Pricing
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS price_amount decimal;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS price_currency text DEFAULT 'EGP';

-- Video URL (if not exists)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS video_url text;

-- Country (if not exists)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS country text;

-- Legal Acknowledgement
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS legal_acknowledgement boolean DEFAULT false;

-- Invitation System (Auth after Approval)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS invitation_token uuid;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS invitation_sent_at timestamptz;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS invitation_expires_at timestamptz;

-- Admin Notes (for needs_changes state)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- Make user_id nullable (profiles created before auth)
ALTER TABLE public.profiles 
  ALTER COLUMN user_id DROP NOT NULL;

-- ============================================
-- PART 3: Create Admin Audit Log Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN (
    'approve', 
    'reject', 
    'request_changes', 
    'suspend',
    'unsuspend',
    'send_invitation',
    'manual_status_change'
  )),
  previous_status text,
  new_status text,
  notes text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_log_profile_id ON public.admin_audit_log(profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- ============================================
-- PART 4: Update RLS Policies
-- ============================================

-- Note: Old policies were already dropped in PART 1 before altering status column

-- New Policies for Profiles

-- 1. Anyone can insert a draft profile (no auth required)
CREATE POLICY "Anyone can create draft profile"
  ON public.profiles FOR INSERT
  WITH CHECK (status = 'draft' AND user_id IS NULL);

-- 2. Users can view their own profile (after account creation)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Public can view published profiles only
CREATE POLICY "Public can view published profiles"
  ON public.profiles FOR SELECT
  USING (status = 'published');

-- 5. Draft profiles can be updated by token (for wizard steps)
-- Note: This requires a function to validate the session token
-- For now, we'll handle this via server actions

-- RLS for Audit Log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view/insert audit logs (handled via service role in server actions)
-- No public policies needed

-- ============================================
-- PART 5: Create Indexes for Performance
-- ============================================

-- Index for published profiles (directory listing)
CREATE INDEX IF NOT EXISTS idx_profiles_published ON public.profiles(status) WHERE status = 'published';

-- Index for admin review queue
CREATE INDEX IF NOT EXISTS idx_profiles_under_review ON public.profiles(status, created_at) WHERE status = 'under_review';

-- Index for invitation token lookup
CREATE INDEX IF NOT EXISTS idx_profiles_invitation_token ON public.profiles(invitation_token) WHERE invitation_token IS NOT NULL;

-- ============================================
-- COMPLETE
-- ============================================

COMMENT ON TABLE public.profiles IS 'Teacher profiles with 6-state lifecycle: draft → under_review → approved/rejected/needs_changes → published/suspended';
COMMENT ON COLUMN public.profiles.invitation_token IS 'One-time use token for account creation after approval (72h expiry)';
COMMENT ON COLUMN public.profiles.experiences IS 'Structured JSON: [{organization, role, start_date, end_date, description}]';
COMMENT ON COLUMN public.profiles.qualifications IS 'Structured JSON: [{name, issuer, year}]';
