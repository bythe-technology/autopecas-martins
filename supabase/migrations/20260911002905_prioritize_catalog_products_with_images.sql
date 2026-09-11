create or replace function public.public_catalog_products_page_v3(page_limit integer default 24,page_offset integer default 0)
returns table(slug text,name text,internal_code text,manufacturer_code text,brand text,category text,regular_price_cents integer,availability_status text,application text,image_url text)
language sql stable security definer set search_path='' as $$
 select p.slug,p.name,p.internal_code,p.manufacturer_code,p.brand,c.name,p.regular_price_cents,p.availability_status::text,
 coalesce(string_agg(distinct concat_ws(' ',a.make,a.model,case when a.year_from is not null then a.year_from::text end,case when a.year_to is not null then 'a '||a.year_to::text end),', '),'Consulte a aplicação com nossa equipe'),i.image_url
 from catalog.products p join catalog.stores s on s.id=p.store_id join catalog.categories c on c.id=p.category_id
 left join catalog.product_vehicle_applications a on a.product_id=p.id and a.store_id=p.store_id
 left join catalog.product_external_images i on i.product_id=p.id and i.review_status='approved'
 where s.slug='auto-pecas-martins' and p.publication_status='published'
 group by p.id,c.name,i.image_url
 order by case when i.image_url is not null or upper(coalesce(p.manufacturer_code,'')) in
 ('160047','FG51LD','CHG041260-7','FF48LD','416147','23023','22020','23035','21244','RX2276','RX4528','12089','111194-0','1581','25566','38936','39570','27004') then 0 else 1 end,
 p.featured_priority nulls last,p.name
 limit least(greatest(coalesce(page_limit,24),1),60) offset greatest(coalesce(page_offset,0),0);
$$;
revoke all on function public.public_catalog_products_page_v3(integer,integer) from public;
grant execute on function public.public_catalog_products_page_v3(integer,integer) to anon,authenticated;

create or replace function public.public_catalog_product_v3(product_slug text)
returns table(slug text,name text,internal_code text,manufacturer_code text,brand text,category text,regular_price_cents integer,availability_status text,application text,image_url text)
language sql stable security definer set search_path='' as $$
 select p.slug,p.name,p.internal_code,p.manufacturer_code,p.brand,c.name,p.regular_price_cents,p.availability_status::text,
 coalesce(string_agg(distinct concat_ws(' ',a.make,a.model,case when a.year_from is not null then a.year_from::text end,case when a.year_to is not null then 'a '||a.year_to::text end),', '),'Consulte a aplicação com nossa equipe'),i.image_url
 from catalog.products p join catalog.stores s on s.id=p.store_id join catalog.categories c on c.id=p.category_id
 left join catalog.product_vehicle_applications a on a.product_id=p.id and a.store_id=p.store_id
 left join catalog.product_external_images i on i.product_id=p.id and i.review_status='approved'
 where s.slug='auto-pecas-martins' and p.slug=product_slug and p.publication_status='published'
 group by p.id,c.name,i.image_url;
$$;
revoke all on function public.public_catalog_product_v3(text) from public;
grant execute on function public.public_catalog_product_v3(text) to anon,authenticated;
