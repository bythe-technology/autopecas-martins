alter table catalog.store_memberships
  add column must_change_password boolean not null default false;

grant select on catalog.stores to authenticated;

create policy "members see their store"
on catalog.stores for select to authenticated
using (catalog.is_active_member(id));

create or replace function catalog.complete_password_change(target_store_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  update catalog.store_memberships
  set must_change_password = false
  where store_id = target_store_id
    and user_id = (select auth.uid())
    and active;

  if not found then
    raise exception 'active membership not found' using errcode = '42501';
  end if;
end;
$$;

revoke all on function catalog.complete_password_change(uuid) from public;
grant execute on function catalog.complete_password_change(uuid) to authenticated;
