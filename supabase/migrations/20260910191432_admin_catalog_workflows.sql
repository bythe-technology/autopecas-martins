create or replace function public.admin_list_products(search_term text default null, result_limit integer default 100)
returns table (id uuid, name text, internal_code text, manufacturer_code text, brand text, regular_price_cents integer, publication_status text, availability_status text, updated_at timestamptz)
language sql stable security invoker set search_path = '' as $$
  select p.id, p.name, p.internal_code, p.manufacturer_code, p.brand, p.regular_price_cents,
    p.publication_status::text, p.availability_status::text, p.updated_at
  from catalog.products p
  where catalog.is_active_member(p.store_id)
    and (search_term is null or trim(search_term) = '' or p.name ilike '%' || trim(search_term) || '%' or p.internal_code ilike '%' || trim(search_term) || '%' or coalesce(p.manufacturer_code, '') ilike '%' || trim(search_term) || '%')
  order by p.updated_at desc
  limit least(greatest(result_limit, 1), 250);
$$;

create or replace function public.admin_list_promotions()
returns table (product_id uuid, product_name text, regular_price_cents integer, promotional_price_cents integer, starts_at timestamptz, ends_at timestamptz)
language sql stable security invoker set search_path = '' as $$
  select p.id, p.name, p.regular_price_cents, pr.promotional_price_cents, pr.starts_at, pr.ends_at
  from catalog.products p
  left join catalog.product_promotions pr on pr.product_id = p.id
  where catalog.is_active_member(p.store_id) and p.publication_status = 'published'
  order by (pr.product_id is not null) desc, p.updated_at desc
  limit 250;
$$;

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
  generated_slug := trim(both '-' from regexp_replace(lower(unaccent(trim(product_name))) || '-' || lower(substr(gen_random_uuid()::text,1,6)), '[^a-z0-9]+', '-', 'g'));
  insert into catalog.products(store_id, internal_code, manufacturer_code, slug, name, brand, description, price_mode, regular_price_cents, publication_status, availability_status, published_at)
  values(target_store, generated_code, nullif(trim(manufacturer_code),''), generated_slug, trim(product_name), nullif(trim(product_brand),''), nullif(trim(product_description),''), 'fixed', product_price_cents,
    case when publish_now then 'published'::catalog.publication_status else 'draft'::catalog.publication_status end,
    product_availability::catalog.availability_status, case when publish_now then now() else null end)
  returning id into new_id;
  return new_id;
end; $$;

create or replace function public.admin_set_promotion(target_product_id uuid, promo_price_cents integer, promo_starts_at timestamptz, promo_ends_at timestamptz)
returns void language plpgsql security invoker set search_path = '' as $$
declare target_store uuid;
begin
  select p.store_id into target_store from catalog.products p where p.id = target_product_id and catalog.is_active_member(p.store_id);
  if target_store is null then raise exception 'product not found'; end if;
  if promo_price_cents <= 0 or promo_starts_at >= promo_ends_at then raise exception 'invalid promotion'; end if;
  insert into catalog.product_promotions(product_id, store_id, promotional_price_cents, starts_at, ends_at)
  values(target_product_id, target_store, promo_price_cents, promo_starts_at, promo_ends_at)
  on conflict(product_id) do update set promotional_price_cents=excluded.promotional_price_cents, starts_at=excluded.starts_at, ends_at=excluded.ends_at;
end; $$;

create or replace function public.admin_remove_promotion(target_product_id uuid)
returns void language sql security invoker set search_path = '' as $$
  delete from catalog.product_promotions pr where pr.product_id = target_product_id and catalog.is_active_member(pr.store_id);
$$;

revoke all on function public.admin_list_products(text,integer), public.admin_list_promotions(), public.admin_create_product(text,text,text,text,integer,text,boolean), public.admin_set_promotion(uuid,integer,timestamptz,timestamptz), public.admin_remove_promotion(uuid) from public, anon;
grant execute on function public.admin_list_products(text,integer), public.admin_list_promotions(), public.admin_create_product(text,text,text,text,integer,text,boolean), public.admin_set_promotion(uuid,integer,timestamptz,timestamptz), public.admin_remove_promotion(uuid) to authenticated;
