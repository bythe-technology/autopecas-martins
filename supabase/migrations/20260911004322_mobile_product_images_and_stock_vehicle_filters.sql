insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('catalog-products','catalog-products',true,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=8388608,allowed_mime_types=excluded.allowed_mime_types;

create policy "catalog members upload product photos" on storage.objects for insert to authenticated
with check(bucket_id='catalog-products' and catalog.is_active_member((storage.foldername(name))[1]::uuid));
create policy "catalog members update product photos" on storage.objects for update to authenticated
using(bucket_id='catalog-products' and catalog.is_active_member((storage.foldername(name))[1]::uuid))
with check(bucket_id='catalog-products' and catalog.is_active_member((storage.foldername(name))[1]::uuid));
create policy "catalog members delete product photos" on storage.objects for delete to authenticated
using(bucket_id='catalog-products' and catalog.is_active_member((storage.foldername(name))[1]::uuid));

create or replace function public.admin_product_image_upload_target(target_product_id uuid)
returns table(store_id uuid) language sql stable security definer set search_path='' as $$
 select p.store_id from catalog.products p
 where p.id=target_product_id and catalog.is_active_member(p.store_id);
$$;
revoke all on function public.admin_product_image_upload_target(uuid) from public,anon;
grant execute on function public.admin_product_image_upload_target(uuid) to authenticated;

create or replace function public.public_stock_vehicle_options()
returns table(make text,model text,year_from integer,year_to integer)
language sql stable security definer set search_path='' as $$
 select distinct a.make,a.model,a.year_from,a.year_to
 from catalog.product_vehicle_applications a
 join catalog.products p on p.id=a.product_id and p.store_id=a.store_id
 join catalog.stores s on s.id=p.store_id
 where s.slug='auto-pecas-martins' and p.publication_status='published' and p.availability_status<>'out_of_stock'
 order by a.make,a.model,a.year_from,a.year_to;
$$;
revoke all on function public.public_stock_vehicle_options() from public;
grant execute on function public.public_stock_vehicle_options() to anon,authenticated;

create or replace function public.public_catalog_products_page_v4(page_limit integer default 24,page_offset integer default 0,filter_make text default null,filter_model text default null,filter_year integer default null)
returns table(slug text,name text,internal_code text,manufacturer_code text,brand text,category text,regular_price_cents integer,availability_status text,application text,image_url text)
language sql stable security definer set search_path='' as $$
 select p.slug,p.name,p.internal_code,p.manufacturer_code,p.brand,c.name,p.regular_price_cents,p.availability_status::text,
 coalesce(string_agg(distinct concat_ws(' ',a.make,a.model,case when a.year_from is not null then a.year_from::text end,case when a.year_to is not null then 'a '||a.year_to::text end),', '),'Consulte a aplicação com nossa equipe'),i.image_url
 from catalog.products p join catalog.stores s on s.id=p.store_id join catalog.categories c on c.id=p.category_id
 left join catalog.product_vehicle_applications a on a.product_id=p.id and a.store_id=p.store_id
 left join catalog.product_external_images i on i.product_id=p.id and i.review_status='approved'
 where s.slug='auto-pecas-martins' and p.publication_status='published' and p.availability_status<>'out_of_stock'
 and (nullif(trim(filter_make),'') is null or exists(select 1 from catalog.product_vehicle_applications f where f.product_id=p.id and f.make=filter_make and (nullif(trim(filter_model),'') is null or f.model=filter_model) and (filter_year is null or ((f.year_from is null or f.year_from<=filter_year) and (f.year_to is null or f.year_to>=filter_year)))))
 group by p.id,c.name,i.image_url
 order by case when i.image_url is not null or upper(coalesce(p.manufacturer_code,'')) in ('160047','FG51LD','CHG041260-7','FF48LD','416147','23023','22020','23035','21244','RX2276','RX4528','12089','111194-0','1581','25566','38936','39570','27004') then 0 else 1 end,p.featured_priority nulls last,p.name
 limit least(greatest(coalesce(page_limit,24),1),200) offset greatest(coalesce(page_offset,0),0);
$$;
revoke all on function public.public_catalog_products_page_v4(integer,integer,text,text,integer) from public;
grant execute on function public.public_catalog_products_page_v4(integer,integer,text,text,integer) to anon,authenticated;
