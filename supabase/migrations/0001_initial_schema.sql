-- ============================================================================
-- HOME meal planner — initial schema
-- ============================================================================
-- Model:
--   auth.users (Supabase Auth)
--     └─ profiles (household members: "Family", "Kids", etc.)
--          ├─ profile_settings (1:1)
--          ├─ meals
--          │    └─ recipe_ingredients (1:N — normalized for cross-recipe search)
--          ├─ ingredients (ingredient library, distinct from per-recipe lines)
--          ├─ plans (one row per assigned day)
--          └─ locked_days (one row per locked day)
--
--   Global seed tables (read-only to clients):
--     seed_meals + seed_recipe_ingredients + seed_ingredients
--     — copied into a new user's profile on signup
--
-- RLS: every per-user table is locked down so a user can only touch rows
-- belonging to a profile they own. Seed tables are readable by any
-- authenticated user; writes go through service role only.
-- ============================================================================


-- ── extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";  -- gen_random_uuid()
create extension if not exists "pg_trgm";   -- trigram index for ILIKE search


-- ============================================================================
-- profiles — household members under one auth.users account
-- ============================================================================
create table public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  created_at  timestamptz not null default now()
);

create index profiles_user_id_idx on public.profiles(user_id);

alter table public.profiles enable row level security;

create policy "profiles: owner read"   on public.profiles for select using (user_id = auth.uid());
create policy "profiles: owner insert" on public.profiles for insert with check (user_id = auth.uid());
create policy "profiles: owner update" on public.profiles for update using (user_id = auth.uid());
create policy "profiles: owner delete" on public.profiles for delete using (user_id = auth.uid());


-- ============================================================================
-- profile_settings — 1:1 with profiles
-- ============================================================================
create table public.profile_settings (
  profile_id          uuid primary key references public.profiles(id) on delete cascade,
  eatout_enabled      boolean not null default false,
  eatout_count        int     not null default 4 check (eatout_count >= 0),
  eatout_same_night   boolean not null default false,
  eatout_dow          int     not null default 5 check (eatout_dow between 0 and 6),  -- 0=Sun..6=Sat
  household_size      int     not null default 4 check (household_size > 0),
  enabled_categories  text[]  not null default array['Beef','Chicken','Pork','Seafood','Vegetarian','Other']
);

alter table public.profile_settings enable row level security;

create policy "profile_settings: owner read"
  on public.profile_settings for select
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "profile_settings: owner insert"
  on public.profile_settings for insert
  with check (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "profile_settings: owner update"
  on public.profile_settings for update
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "profile_settings: owner delete"
  on public.profile_settings for delete
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));


-- ============================================================================
-- seed_meals — declared BEFORE meals because meals.source_seed_id references it
-- ============================================================================
create table public.seed_meals (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null check (category in ('Beef','Chicken','Pork','Seafood','Vegetarian','Other')),
  tags          text[] not null default '{}',
  servings      text,
  prep_time     text,
  cook_time     text,
  instructions  text[] not null default '{}'
);


-- ============================================================================
-- meals — meal library, per profile
-- ============================================================================
create table public.meals (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  -- Links back to the seed entry this meal was copied from (null if user-created).
  -- Lets a future "restore defaults" or "what's new in seed" feature work.
  source_seed_id  uuid references public.seed_meals(id) on delete set null,
  name            text not null check (length(trim(name)) > 0),
  category        text not null check (category in ('Beef','Chicken','Pork','Seafood','Vegetarian','Other')),
  tags            text[] not null default '{}',
  -- Recipe meta — stored as text because the source data is human-readable
  -- ("20 min", "4 servings"). If you ever need to filter/sort by duration,
  -- promote to interval columns later.
  servings        text,
  prep_time       text,
  cook_time       text,
  instructions    text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index meals_profile_id_idx       on public.meals(profile_id);
create index meals_profile_category_idx on public.meals(profile_id, category);

alter table public.meals enable row level security;

create policy "meals: owner read"
  on public.meals for select
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "meals: owner insert"
  on public.meals for insert
  with check (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "meals: owner update"
  on public.meals for update
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "meals: owner delete"
  on public.meals for delete
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));


-- ============================================================================
-- recipe_ingredients — one row per ingredient line in a recipe
-- ============================================================================
-- Normalized so we can answer "which recipes use garlic?" with a JOIN
-- instead of jsonb path gymnastics.
-- ============================================================================
create table public.recipe_ingredients (
  id          uuid primary key default gen_random_uuid(),
  meal_id     uuid not null references public.meals(id) on delete cascade,
  position    int  not null default 0,        -- preserves order in the recipe
  quantity    text,
  unit        text,
  name        text not null check (length(trim(name)) > 0),
  created_at  timestamptz not null default now()
);

create index recipe_ingredients_meal_id_idx on public.recipe_ingredients(meal_id);

-- Trigram GIN index — makes `WHERE name ILIKE '%garlic%'` index-backed.
-- Without this, ingredient search across a large library is a sequential scan.
create index recipe_ingredients_name_trgm_idx
  on public.recipe_ingredients using gin (name gin_trgm_ops);

alter table public.recipe_ingredients enable row level security;

-- Two hops to get to the user: ingredient → meal → profile → user.
-- Use EXISTS so the planner can short-circuit per-row.
create policy "recipe_ingredients: owner read"
  on public.recipe_ingredients for select
  using (exists (
    select 1 from public.meals m
    join public.profiles p on p.id = m.profile_id
    where m.id = recipe_ingredients.meal_id and p.user_id = auth.uid()
  ));
create policy "recipe_ingredients: owner insert"
  on public.recipe_ingredients for insert
  with check (exists (
    select 1 from public.meals m
    join public.profiles p on p.id = m.profile_id
    where m.id = recipe_ingredients.meal_id and p.user_id = auth.uid()
  ));
create policy "recipe_ingredients: owner update"
  on public.recipe_ingredients for update
  using (exists (
    select 1 from public.meals m
    join public.profiles p on p.id = m.profile_id
    where m.id = recipe_ingredients.meal_id and p.user_id = auth.uid()
  ));
create policy "recipe_ingredients: owner delete"
  on public.recipe_ingredients for delete
  using (exists (
    select 1 from public.meals m
    join public.profiles p on p.id = m.profile_id
    where m.id = recipe_ingredients.meal_id and p.user_id = auth.uid()
  ));


-- ============================================================================
-- ingredients — ingredient LIBRARY (distinct from recipe_ingredients above)
-- ============================================================================
-- This is the user's catalog of known ingredients with grocery categorization
-- and default quantities. recipe_ingredients references no FK here — the link
-- is by-name lookup, which matches how the existing app autocompletes defaults.
-- ============================================================================
create table public.ingredients (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  name          text not null check (length(trim(name)) > 0),
  default_qty   text,
  default_unit  text,
  alt_measure   text,
  category      text not null default 'Pantry' check (category in (
    'Meat & Seafood','Produce','Dairy & Eggs','Bread & Pasta',
    'Canned & Jarred','Frozen','Pantry','Other'
  )),
  created_at    timestamptz not null default now()
);

create index ingredients_profile_id_idx on public.ingredients(profile_id);
-- Case-insensitive lookup by name within a profile (autocomplete path)
create unique index ingredients_profile_name_lower_idx
  on public.ingredients(profile_id, lower(name));

alter table public.ingredients enable row level security;

create policy "ingredients: owner read"
  on public.ingredients for select
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "ingredients: owner insert"
  on public.ingredients for insert
  with check (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "ingredients: owner update"
  on public.ingredients for update
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "ingredients: owner delete"
  on public.ingredients for delete
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));


-- ============================================================================
-- plans — one row per assigned day
--   meal_id NOT NULL + special NULL → regular meal
--   meal_id NULL     + special NOT NULL → EAT_OUT or LEFTOVER
--   absence of a row → unassigned
-- ============================================================================
create table public.plans (
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  year        int  not null,
  month       int  not null check (month between 0 and 11),  -- JS month convention
  day         int  not null check (day between 1 and 31),
  meal_id     uuid references public.meals(id) on delete set null,
  special     text check (special in ('EAT_OUT','LEFTOVER')),
  updated_at  timestamptz not null default now(),
  primary key (profile_id, year, month, day),
  constraint plans_exactly_one_value check (
    (meal_id is not null and special is null) or
    (meal_id is null     and special is not null)
  )
);

create index plans_profile_month_idx on public.plans(profile_id, year, month);

alter table public.plans enable row level security;

create policy "plans: owner read"
  on public.plans for select
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "plans: owner insert"
  on public.plans for insert
  with check (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "plans: owner update"
  on public.plans for update
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "plans: owner delete"
  on public.plans for delete
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));


-- ============================================================================
-- locked_days — one row per locked day
-- ============================================================================
create table public.locked_days (
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  year        int  not null,
  month       int  not null check (month between 0 and 11),
  day         int  not null check (day between 1 and 31),
  primary key (profile_id, year, month, day)
);

alter table public.locked_days enable row level security;

create policy "locked_days: owner read"
  on public.locked_days for select
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "locked_days: owner insert"
  on public.locked_days for insert
  with check (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "locked_days: owner delete"
  on public.locked_days for delete
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));
-- no UPDATE: locking is a binary toggle; insert/delete the row instead


-- ============================================================================
-- seed_recipe_ingredients — global, mirrors recipe_ingredients
-- ============================================================================
create table public.seed_recipe_ingredients (
  id            uuid primary key default gen_random_uuid(),
  seed_meal_id  uuid not null references public.seed_meals(id) on delete cascade,
  position      int  not null default 0,
  quantity      text,
  unit          text,
  name          text not null
);

create index seed_recipe_ingredients_meal_id_idx
  on public.seed_recipe_ingredients(seed_meal_id);


-- ============================================================================
-- seed_ingredients — global ingredient library defaults
-- ============================================================================
create table public.seed_ingredients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  default_qty   text,
  default_unit  text,
  alt_measure   text,
  category      text not null default 'Pantry'
);


-- ============================================================================
-- Seed-table RLS: authenticated users can read, nobody can write via client
-- (writes happen via service role from migration / admin tooling)
-- ============================================================================
alter table public.seed_meals              enable row level security;
alter table public.seed_recipe_ingredients enable row level security;
alter table public.seed_ingredients        enable row level security;

create policy "seed_meals: authenticated read"
  on public.seed_meals for select to authenticated using (true);
create policy "seed_recipe_ingredients: authenticated read"
  on public.seed_recipe_ingredients for select to authenticated using (true);
create policy "seed_ingredients: authenticated read"
  on public.seed_ingredients for select to authenticated using (true);


-- ============================================================================
-- on-signup trigger — create a default profile + seed it
-- ============================================================================
-- SECURITY DEFINER bypasses RLS so we can insert into the new user's tables.
-- The function is intentionally small and only writes to known-good tables.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_profile_id uuid;
begin
  -- 1. Default profile
  insert into public.profiles (user_id, name)
  values (new.id, 'Family')
  returning id into new_profile_id;

  -- 2. Settings row
  insert into public.profile_settings (profile_id) values (new_profile_id);

  -- 3. Copy seed meals, preserving the link back to their seed_meal_id
  insert into public.meals
    (profile_id, source_seed_id, name, category, tags, servings, prep_time, cook_time, instructions)
  select
    new_profile_id, s.id, s.name, s.category, s.tags, s.servings, s.prep_time, s.cook_time, s.instructions
  from public.seed_meals s;

  -- 4. Copy seed recipe ingredients, joining through source_seed_id to find
  --    the freshly-inserted meal that came from each seed row
  insert into public.recipe_ingredients
    (meal_id, position, quantity, unit, name)
  select
    m.id, sri.position, sri.quantity, sri.unit, sri.name
  from public.seed_recipe_ingredients sri
  join public.meals m
    on m.source_seed_id = sri.seed_meal_id
   and m.profile_id     = new_profile_id;

  -- 5. Copy seed ingredient library
  insert into public.ingredients
    (profile_id, name, default_qty, default_unit, alt_measure, category)
  select
    new_profile_id, name, default_qty, default_unit, alt_measure, category
  from public.seed_ingredients;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================================
-- updated_at maintenance
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger meals_touch_updated_at
  before update on public.meals
  for each row execute function public.touch_updated_at();

create trigger plans_touch_updated_at
  before update on public.plans
  for each row execute function public.touch_updated_at();
