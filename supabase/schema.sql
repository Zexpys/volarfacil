-- ============================================================
-- VolarFácil — Subscription & Referral Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Profiles (one per auth user, created automatically via trigger)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  referral_code text unique not null,
  stripe_customer_id text unique,
  created_at timestamptz default now()
);

-- Subscriptions (mirrors Stripe subscription state)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null default 'none',
  -- status: 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete' | 'none'
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  intro_offer text, -- 'trial' | 'referral' | null
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Referrals (tracks who referred who)
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references profiles on delete set null,
  referee_id uuid references profiles on delete cascade not null unique,
  -- unique(referee_id): one referral record per user — no retroactive re-assignment
  referee_email text not null,
  status text not null default 'pending',
  -- status: 'pending' | 'converted' | 'rewarded' | 'voided'
  stripe_discount_applied boolean default false,
  reward_issued_at timestamptz,
  voided_reason text, -- 'refund' | 'dispute' | 'fraud' | 'failed_first_payment' | 'self_referral'
  created_at timestamptz default now()
);

-- Credits (ledger of referral credits)
create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade not null,
  amount_cents integer not null, -- negative = credit applied to invoice
  reason text not null,          -- 'referral_reward' | 'applied_to_invoice'
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

-- Users can only read/update their own profile
create policy "profiles: own row" on profiles
  for all using (auth.uid() = id);

-- Users can only read their own subscription
create policy "subscriptions: own row" on subscriptions
  for select using (auth.uid() = user_id);

-- Users can read referrals where they are referrer or referee
create policy "referrals: own rows" on referrals
  for select using (auth.uid() = referrer_id or auth.uid() = referee_id);

-- Users can only read their own credits
create policy "credits: own row" on credits
  for select using (auth.uid() = user_id);

-- ─── Trigger: auto-create profile on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  new_code text;
  code_taken boolean;
begin
  -- Generate unique 8-char alphanumeric referral code
  loop
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

-- Drop and recreate trigger (safe to re-run)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
