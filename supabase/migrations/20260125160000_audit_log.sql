-- Migration: Create Admin Audit Log Table
-- Date: 2026-01-25
-- Description: Creates table for tracking admin actions (missed in previous steps).

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id),
  target_profile_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  previous_status text,
  new_status text,
  notes text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;

CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_audit_log;

CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );
