-- Migration: Add Missing Fields to Profiles
-- Date: 2026-01-25
-- Description: Adds teaching_format, availability_status, and localized bio_text to profiles table.

-- 1. Create teaching_format ENUM
DO $$ BEGIN
    CREATE TYPE teaching_format AS ENUM ('online', 'in_person', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create availability_status ENUM
DO $$ BEGIN
    CREATE TYPE availability_status AS ENUM ('accepting', 'limited', 'not_accepting');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Add columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS teaching_format teaching_format DEFAULT 'online',
  ADD COLUMN IF NOT EXISTS availability_status availability_status DEFAULT 'accepting',
  ADD COLUMN IF NOT EXISTS bio_text_ar text,
  ADD COLUMN IF NOT EXISTS bio_text_en text;

-- 4. Comment on columns
COMMENT ON COLUMN public.profiles.teaching_format IS 'Method of teaching: online, in_person, or hybrid';
COMMENT ON COLUMN public.profiles.availability_status IS 'Current availability for new students';
COMMENT ON COLUMN public.profiles.bio_text_ar IS 'Detailed biography or experience summary in Arabic';
COMMENT ON COLUMN public.profiles.bio_text_en IS 'Detailed biography or experience summary in English';
