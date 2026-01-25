-- Migration: Add Onboarding Fields
-- Description: Adds missing columns for the refined onboarding wizard (Step 1 & 2)

-- Step 1 Details
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS full_name_en text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS title text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS gender text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS birth_date date;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS specializations jsonb DEFAULT '{}'::jsonb;

-- Step 2 Details
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS madhab text;

-- Comment on columns
COMMENT ON COLUMN public.profiles.full_name_en IS 'English Full Name';
COMMENT ON COLUMN public.profiles.title IS 'Teacher Title (e.g., Sheikh, Ustad)';
COMMENT ON COLUMN public.profiles.gender IS 'Teacher Gender (male/female)';
COMMENT ON COLUMN public.profiles.birth_date IS 'Date of Birth (YYYY-MM-DD)';
COMMENT ON COLUMN public.profiles.specializations IS 'Dynamic specializations (Quran types, Arabic areas, etc.)';
COMMENT ON COLUMN public.profiles.madhab IS 'Islamic School of Thought (Fiqh School)';
