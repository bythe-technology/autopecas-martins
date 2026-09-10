create or replace function public.admin_create_product(
  product_name text, manufacturer_code text, product_brand text, product_description text,
  product_price_cents integer, product_availability text, publish_now boolean
) returns uuid language plpgsql security invoker set search_path = '' as $$
declare target_store uuid; new_id uuid; generated_code text; generated_slug text;
begin
  select m.store_id into target_store from catalog.store_memberships m where m.user_id = (select auth.uid()) and m.active limit 1;
  if target_store is null then raise exception 'active membership not found'; end if;
  if char_length(trim(product_name)) < 2 then raise exception 'invalid product name'; end if;
  if product_price_cents is null or product_price_cents <= 0 then raise exception 'invalid price'; end if;
  if product_availability not in ('available','limited','out_of_stock','on_request') then raise exception 'invalid availability'; end if;
  generated_code := 'APM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  generated_slug := trim(both '-' from regexp_replace(lower(trim(product_name)) || '-' || lower(substr(gen_random_uuid()::text,1,6)), '[^a-z0-9]+', '-', 'g'));
  insert into catalog.products(store_id, internal_code, manufacturer_code, slug, name, brand, description, price_mode, regular_price_cents, publication_status, availability_status, published_at)
  values(target_store, generated_code, nullif(trim(manufacturer_code),''), generated_slug, trim(product_name), nullif(trim(product_brand),''), nullif(trim(product_description),''), 'fixed', product_price_cents,
    case when publish_now then 'published'::catalog.publication_status else 'draft'::catalog.publication_status end,
    product_availability::catalog.availability_status, case when publish_now then now() else null end)
  returning id into new_id;
  return new_id;
end; $$;

create or replace function public.admin_delete_product(target_product_id uuid)
returns void language sql security invoker set search_path = '' as $$
  delete from catalog.products p
  where p.id = target_product_id and catalog.is_active_member(p.store_id);
$$;

revoke all on function public.admin_delete_product(uuid) from public, anon;
grant execute on function public.admin_delete_product(uuid) to authenticated;
