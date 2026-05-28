-- ============================================================================
-- Fix: plans.meal_id FK was ON DELETE SET NULL, but the check constraint
-- requires (meal_id IS NOT NULL XOR special IS NOT NULL). Setting meal_id to
-- NULL on meal delete would leave the row with both columns NULL, violating
-- the constraint and silently breaking meal deletion.
--
-- Switching to CASCADE: deleting a meal removes any plan rows referencing it.
-- A "this day used to be planned" entry becomes simply unassigned, which is
-- the same effective behavior as the localStorage version (where the stale
-- meal_id resolved to "no such meal" client-side).
-- ============================================================================

alter table public.plans drop constraint plans_meal_id_fkey;

alter table public.plans
  add constraint plans_meal_id_fkey
  foreign key (meal_id) references public.meals(id) on delete cascade;
