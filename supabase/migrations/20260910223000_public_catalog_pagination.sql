create or replace function public.public_catalog_products_page(page_limit integer default 24, page_offset integer default 0)
returns table(slug text, name text, internal_code text, brand text, category text, regular_price_cents integer, availability_status text, application text)
language sql stable security definer set search_path = '' as $$
 select p.slug,p.name,p.internal_code,p.brand,c.name,p.regular_price_cents,p.availability_status::text,
 coalesce(string_agg(distinct concat_ws(' ',a.make,a.model,case when a.year_from is not null then a.year_from::text end,case when a.year_to is not null then 'a '||a.year_to::text end),', '),'Consulte a aplicação com nossa equipe')
 from catalog.products p join catalog.stores s on s.id=p.store_id join catalog.categories c on c.id=p.category_id left join catalog.product_vehicle_applications a on a.product_id=p.id and a.store_id=p.store_id
 where s.slug='auto-pecas-martins' and p.publication_status='published' group by p.id,c.name order by p.name
 limit least(greatest(coalesce(page_limit,24),1),60) offset greatest(coalesce(page_offset,0),0);
$$;
grant execute on function public.public_catalog_products_page(integer,integer) to anon, authenticated;
