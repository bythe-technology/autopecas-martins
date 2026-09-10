create or replace function public.admin_list_products_page(search_term text default null, result_limit integer default 50, result_offset integer default 0)
returns table (id uuid, name text, internal_code text, manufacturer_code text, brand text, regular_price_cents integer, publication_status text, availability_status text, updated_at timestamptz, total_count bigint)
language sql stable security invoker set search_path = '' as $$
 select p.id,p.name,p.internal_code,p.manufacturer_code,p.brand,p.regular_price_cents,p.publication_status::text,p.availability_status::text,p.updated_at,count(*) over()
 from catalog.products p where catalog.is_active_member(p.store_id) and (search_term is null or trim(search_term)='' or p.name ilike '%'||trim(search_term)||'%' or p.internal_code ilike '%'||trim(search_term)||'%' or coalesce(p.manufacturer_code,'') ilike '%'||trim(search_term)||'%')
 order by p.updated_at desc limit least(greatest(result_limit,1),100) offset greatest(result_offset,0);
$$;
revoke all on function public.admin_list_products_page(text,integer,integer) from public, anon;
grant execute on function public.admin_list_products_page(text,integer,integer) to authenticated;
