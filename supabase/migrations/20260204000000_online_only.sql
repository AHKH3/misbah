-- Migration: Convert teaching_format to online-only
-- Date: 2026-02-04
-- Purpose: Remove in_person and hybrid options, keep only 'online'

-- Step 1: Create new enum with only 'online'
CREATE TYPE teaching_format_new AS ENUM ('online');

-- Step 2: Update all existing records to 'online'
-- This ensures no data loss - all in_person and hybrid teachers become online
UPDATE profiles
SET teaching_format = 'online'::teaching_format
WHERE teaching_format IN ('in_person', 'hybrid');

-- Step 3: Convert the column to the new enum type
ALTER TABLE profiles
    ALTER COLUMN teaching_format TYPE teaching_format_new
    USING teaching_format::text::teaching_format_new;

-- Step 4: Drop the old enum type
DROP TYPE teaching_format;

-- Step 5: Rename the new enum to the original name
ALTER TYPE teaching_format_new RENAME TO teaching_format;

-- Note: All profiles are now online-only teachers
