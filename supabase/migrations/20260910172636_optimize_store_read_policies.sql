drop policy if exists "stores are not directly readable" on catalog.stores;

create policy "anonymous users cannot read stores"
on catalog.stores
for select
to anon
using (false);
