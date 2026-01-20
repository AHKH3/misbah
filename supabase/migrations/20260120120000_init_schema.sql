-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Enums
create type profile_status as enum ('pending_payment', 'payment_submitted', 'active', 'inactive');
create type teaching_format as enum ('online', 'in_person', 'hybrid');
create type subscription_status as enum ('pending', 'verified', 'rejected');

-- Profiles Table
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  subjects text[] not null, -- Domain restricted in UI, strictly typed here as text[]
  audience text[] not null,
  experience_text text,
  teaching_format teaching_format not null,
  contact_method jsonb not null default '{}'::jsonb,
  status profile_status not null default 'pending_payment',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_user_id_key unique (user_id)
);

-- Subscriptions Table
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  plan_id text not null default 'monthly', -- capable of expansion
  payment_proof_url text,
  status subscription_status not null default 'pending',
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

-- RLS Policies for Profiles
-- 1. Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

-- 2. Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- 3. Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- 4. Public can view ACTIVE profiles only
create policy "Public can view active profiles"
  on public.profiles for select
  using (status = 'active');

-- RLS Policies for Subscriptions
-- 1. Users can view their own subscriptions (via profile)
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = subscriptions.profile_id
      and profiles.user_id = auth.uid()
    )
  );

-- 2. Users can insert/upload proof (via server action ideally, but allowing insert for now)
create policy "Users can create subscriptions"
  on public.subscriptions for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = subscriptions.profile_id
      and profiles.user_id = auth.uid()
    )
  );

-- Storage Setup (Payment Proofs)
-- Note: We assume the 'payment-proofs' bucket is created via dashboard or seeding.
-- Since we are in SQL, we can try to insert into storage.buckets if the extension allows,
-- but usually it's safer to handle storage policies assuming the bucket exists.

-- Storage Policies (assuming 'payment-proofs' bucket)
-- We need to manually insert the bucket entry if we want it purely SQL-driven, 
-- but usually Supabase migrations handle `storage.buckets` insertions.

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

create policy "Users can upload payment proofs"
on storage.objects for insert
with check (
  bucket_id = 'payment-proofs' and
  auth.role() = 'authenticated'
);

create policy "Users can read own payment proofs"
on storage.objects for select
using (
  bucket_id = 'payment-proofs' and
  auth.uid() = owner
);
