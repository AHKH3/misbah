-- Migration: Remove madhab (Islamic school of thought) field
-- Date: 2026-02-04
-- Purpose: Remove madhab column from profiles table
-- Reason: Platform will accept Sunni teachers only without explicitly mentioning it

-- Drop the madhab column from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS madhab;

-- Note: This is a permanent removal as the platform decision is to not display madhab information
