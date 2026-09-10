create or replace function public.get_my_store_membership()
returns table (
  store_id uuid,
  role text,
  active boolean,
  must_change_password boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select m.store_id, m.role::text, m.active, m.must_change_password
  from catalog.store_memberships m
  where m.user_id = (select auth.uid())
    and m.active = true
  limit 1;
$$;

create or replace function public.complete_my_password_change(target_store_id uuid)
returns void
language sql
security invoker
set search_path = ''
as $$
  select catalog.complete_password_change(target_store_id);
$$;

revoke all on function public.get_my_store_membership() from public, anon;
revoke all on function public.complete_my_password_change(uuid) from public, anon;
grant execute on function public.get_my_store_membership() to authenticated;
grant execute on function public.complete_my_password_change(uuid) to authenticated;
