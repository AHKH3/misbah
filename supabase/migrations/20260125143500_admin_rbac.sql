-- Migration: Create Admin RBAC System
-- Date: 2026-01-25
-- Description: Creates admin_users table for role-based access control.

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- 2. Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Policies

-- Policy: Admins can view the admin list
-- Drop first to allow re-running this migration
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;

CREATE POLICY "Admins can view admin list"
  ON public.admin_users FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  );

-- Note: We assume initial admin insertion will be handled manually or via a separate seed script
-- because we don't have the UUID of the admin user here.
