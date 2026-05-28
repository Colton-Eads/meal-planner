-- ============================================================================
-- Self-service account deletion
-- ============================================================================
-- Supabase locks auth.users — clients cannot DELETE from it directly. The
-- standard self-delete pattern is a SECURITY DEFINER RPC scoped to auth.uid()
-- so the caller can only ever delete their own account.
--
-- All per-user tables (profiles, subscriptions, etc.) cascade off auth.users,
-- so deleting the auth row wipes everything downstream automatically.
-- ============================================================================

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

-- Lock down: only authenticated users can call this. PUBLIC includes the
-- anon role, which we explicitly don't want to be able to invoke account
-- deletion (defense in depth — anon has no auth.uid() anyway, but belt-
-- and-suspenders).
revoke execute on function public.delete_my_account() from public;
grant   execute on function public.delete_my_account() to authenticated;
