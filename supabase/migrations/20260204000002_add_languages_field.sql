-- Migration: Add languages field to profiles table
-- Date: 2026-02-04
-- Description: Adds a JSONB array column to store teacher languages with proficiency levels

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::JSONB;

-- Add comment for documentation
COMMENT ON COLUMN profiles.languages IS 'Array of language objects with id, language name, and proficiency level (beginner, intermediate, advanced, native)';
