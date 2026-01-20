-- Add rejection reason
alter table public.subscriptions add column rejection_reason text;

-- Admin RLS Policies (Hardcoded to a specific email for MVP simplicity)
-- Replace 'admin@example.com' with actual admin email or role check in production

-- Profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@example.com');

create policy "Admins can update all profiles"
  on public.profiles for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@example.com');

-- Subscriptions
create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@example.com');

create policy "Admins can update all subscriptions"
  on public.subscriptions for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@example.com');

-- Storage
create policy "Admins can view all proof"
  on storage.objects for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'admin@example.com');
