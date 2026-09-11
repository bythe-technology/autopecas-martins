alter table catalog.product_external_images add column if not exists source_url text;
alter table catalog.product_external_images add column if not exists review_status text not null default 'pending';
alter table catalog.product_external_images drop constraint if exists product_external_images_review_status_check;
alter table catalog.product_external_images add constraint product_external_images_review_status_check check (review_status in ('pending','approved','rejected'));
create index if not exists product_external_images_store_idx on catalog.product_external_images(store_id);

create or replace function public.admin_list_pending_product_images(result_limit integer default 100)
returns table(product_id uuid,name text,internal_code text,brand text,image_url text,source_url text)
language sql stable security definer set search_path='' as $$
 select p.id,p.name,p.internal_code,p.brand,i.image_url,i.source_url from catalog.product_external_images i join catalog.products p on p.id=i.product_id where i.review_status='pending' and catalog.is_active_member(i.store_id) order by i.updated_at limit least(greatest(coalesce(result_limit,100),1),100);
$$;
revoke all on function public.admin_list_pending_product_images(integer) from public,anon;
grant execute on function public.admin_list_pending_product_images(integer) to authenticated;

create or replace function public.admin_review_product_image(target_product_id uuid,target_status text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if target_status not in ('approved','rejected') then raise exception 'invalid status'; end if;
 update catalog.product_external_images i set review_status=target_status,updated_at=now() where i.product_id=target_product_id and catalog.is_active_member(i.store_id);
 if not found then raise exception 'access denied'; end if;
end;
$$;
revoke all on function public.admin_review_product_image(uuid,text) from public,anon;
grant execute on function public.admin_review_product_image(uuid,text) to authenticated;
