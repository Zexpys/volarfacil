-- ============================================================
-- VolarFácil — Subscription & Referral Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run (uses IF NOT EXISTS and OR REPLACE)
-- ============================================================

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  referral_code text unique not null,
  stripe_customer_id text unique,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null default 'none',
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  intro_offer text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references profiles on delete set null,
  referee_id uuid references profiles on delete cascade not null unique,
  referee_email text not null,
  status text not null default 'pending',
  stripe_discount_applied boolean default false,
  reward_issued_at timestamptz,
  voided_reason text,
  created_at timestamptz default now()
);

create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade not null,
  amount_cents integer not null,
  reason text not null,
  referral_id uuid references referrals on delete set null,
  stripe_invoice_id text,
  stripe_balance_txn_id text,
  created_at timestamptz default now()
);

-- ─── Row Level Security ────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table referrals enable row level security;
alter table credits enable row level security;

-- Profiles: users can read their own row but cannot update sensitive fields
-- (stripe_customer_id and referral_code are managed server-side only)
drop policy if exists "profiles: own row" on profiles;
create policy "profiles: select own" on profiles
  for select using (auth.uid() = id);

-- Subscriptions, referrals, credits: read-only for users (writes happen via service role in webhooks)
drop policy if exists "subscriptions: own row" on subscriptions;
create policy "subscriptions: select own" on subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "referrals: own rows" on referrals;
create policy "referrals: select own" on referrals
  for select using (auth.uid() = referrer_id or auth.uid() = referee_id);

drop policy if exists "credits: own row" on credits;
create policy "credits: select own" on credits
  for select using (auth.uid() = user_id);

-- ─── Trigger: auto-create profile on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  new_code text;
  code_taken boolean;
  attempts integer := 0;
begin
  -- Generate unique 8-char alphanumeric referral code (max 100 attempts)
  loop
    attempts := attempts + 1;
    if attempts > 100 then
      raise exception 'Could not generate unique referral code after 100 attempts';
    end if;
    new_code := upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8));
    select exists(select 1 from profiles where referral_code = new_code) into code_taken;
    exit when not code_taken;
  end loop;

  insert into profiles (id, email, referral_code)
  values (new.id, new.email, new_code)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
