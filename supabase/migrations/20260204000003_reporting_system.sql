-- Reports table
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN (
    'teacher_redirection',
    'price_mismatch',
    'inappropriate_behavior',
    'other'
  )),
  description text NOT NULL,
  reporter_contact text, -- Optional: email/phone for follow-up
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'investigating',
    'resolved',
    'dismissed'
  )),
  admin_notes text,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index for admin review
CREATE INDEX idx_reports_status ON public.reports(status, created_at DESC);
CREATE INDEX idx_reports_profile ON public.reports(profile_id);

-- RLS policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Public can submit reports (no auth required)
DROP POLICY IF EXISTS "Anyone can submit reports" ON public.reports;

CREATE POLICY "Anyone can submit reports"
  ON public.reports FOR INSERT
  WITH CHECK (true);

-- Only admins can view reports
DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;

CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Admins can update report status
DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );
