-- Add full_name_en column to profiles table
-- This migration adds an optional English name column to support bilingual teacher names

-- Add the column as nullable initially
alter table public.profiles
add column if not exists full_name_en text;

-- Add comment for documentation
comment on column public.profiles.full_name_en is 'Optional English translation of teacher full name for international students';
