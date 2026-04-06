-- Migration: Enable Manual Payments
-- Date: 2026-01-25
-- Description: Adds payment status/fields to profiles AND sets up storage for proofs.

-- 1. Create payment_status ENUM
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'proof_submitted', 'confirmed', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_proof_url text,
  ADD COLUMN IF NOT EXISTS payment_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_start_date timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_end_date timestamptz;

-- 3. Create Storage Bucket for Payment Proofs
-- Note: Supabase storage buckets are usually created via API or SQL extension.
-- We use the standard storage.buckets insert.

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies
-- Allow authenticated users to upload their own proof
DROP POLICY IF EXISTS "Users can upload their payment proof" ON storage.objects;

CREATE POLICY "Users can upload their payment proof"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment_proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own proof
DROP POLICY IF EXISTS "Users can view their payment proof" ON storage.objects;

CREATE POLICY "Users can view their payment proof"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment_proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to view all proofs
-- We assume admin checks via admin_users logic, but storage policies can be tricky with cross-schema joins.
-- For MVP Simplification: We allow read access if user is admin (using a simpler check if possible, or just allowing public read for signed URLs).
-- Actually, we'll generate signed URLs for admins, so NO public read needed. 
-- But admins need to LIST/GET? 
-- Signed URLs bypass RLS on Select, so we just need them to hold the path.

-- We can add a policy for admins to SELECT if we really need direct access without signing.
-- But standard practice: Admin generates signed URL using service key or high-privilege client?
-- Or we use RLS:
-- CREATE POLICY "Admins can view all proofs"
-- ON storage.objects FOR SELECT
-- USING (
--   bucket_id = 'payment_proofs' AND
--   EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
-- );
-- Note: Cross-schema policy needs permissions. 'public.admin_users' is in public schema. storage schema can access it.
