-- ============================================================================
-- HOME meal planner — subscriptions (SaaS scaffolding)
-- ============================================================================
-- One row per user, written exclusively by the Stripe webhook (service role).
-- The app reads this to know whether a signed-in user can use the product.
-- Absence of a row means "never subscribed" — same as status='inactive'.
-- ============================================================================

create table public.subscriptions (
  user_id                 uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  -- Mirrors Stripe's subscription.status values
  status                  text not null default 'inactive' check (status in (
    'inactive','trialing','active','past_due','canceled',
    'incomplete','incomplete_expired','unpaid'
  )),
  price_id                text,                  -- which Stripe price/tier
  current_period_end      timestamptz,           -- when the paid window ends
  cancel_at_period_end    boolean not null default false,
  trial_end               timestamptz,
  updated_at              timestamptz not null default now()
);

create index subscriptions_status_idx
  on public.subscriptions(status)
  where status in ('active','trialing');

alter table public.subscriptions enable row level security;

-- Users can read their OWN subscription state (to render "Member since X" etc.)
create policy "subscriptions: owner read"
  on public.subscriptions for select
  using (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies: writes ONLY happen via service role
-- (the Stripe webhook handler).


-- ── helper: is this user currently a paying member? ─────────────────────────
-- Called from RLS or app code via supabase.rpc('has_active_subscription').
-- SECURITY DEFINER so it can read subscriptions regardless of the caller's
-- own RLS context (the function still scopes to the passed uid).
create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = uid
      and status in ('active','trialing')
      and (current_period_end is null or current_period_end > now())
  );
$$;


-- ── updated_at maintenance ──────────────────────────────────────────────────
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();
