-- Contact views tracking table
CREATE TABLE public.profile_contact_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now() NOT NULL,
  ip_hash text NOT NULL, -- SHA-256 hash of IP (privacy-preserving)
  user_agent text,
  referrer text,
  session_id text -- Browser-generated session ID to prevent double-counting
);

-- Indexes for analytics queries
CREATE INDEX idx_contact_views_profile ON public.profile_contact_views(profile_id, viewed_at DESC);
CREATE INDEX idx_contact_views_date ON public.profile_contact_views(viewed_at DESC);
CREATE INDEX idx_contact_views_session ON public.profile_contact_views(session_id, profile_id);

-- RLS policies
ALTER TABLE public.profile_contact_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
DROP POLICY IF EXISTS "Anyone can log contact views" ON public.profile_contact_views;

CREATE POLICY "Anyone can log contact views"
  ON public.profile_contact_views FOR INSERT
  WITH CHECK (true);

-- Only admins can view analytics
DROP POLICY IF EXISTS "Admins can view contact views" ON public.profile_contact_views;

CREATE POLICY "Admins can view contact views"
  ON public.profile_contact_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Aggregate view for quick analytics
CREATE MATERIALIZED VIEW profile_contact_stats AS
SELECT
  profile_id,
  COUNT(*) as total_views,
  COUNT(DISTINCT DATE(viewed_at)) as days_with_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  MAX(viewed_at) as last_viewed_at,
  MIN(viewed_at) as first_viewed_at
FROM profile_contact_views
GROUP BY profile_id;

-- Index on materialized view
CREATE UNIQUE INDEX idx_contact_stats_profile ON profile_contact_stats(profile_id);

-- Refresh function (call daily via cron or manually)
CREATE OR REPLACE FUNCTION refresh_contact_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY profile_contact_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
