create or replace function public.admin_list_products_without_external_images(result_limit integer default 100)
returns table(id uuid, name text, internal_code text, brand text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.name, p.internal_code, p.brand
  from catalog.products p
  join catalog.stores s on s.id = p.store_id
  left join catalog.product_external_images pei on pei.product_id = p.id
  where s.slug = 'auto-pecas-martins'
    and catalog.is_active_member(p.store_id)
    and p.publication_status <> 'archived'
    and pei.product_id is null
  order by p.internal_code
  limit least(greatest(coalesce(result_limit, 100), 1), 100);
$$;
grant execute on function public.admin_list_products_without_external_images(integer) to authenticated;
