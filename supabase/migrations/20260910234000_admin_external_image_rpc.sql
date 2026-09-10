create or replace function public.admin_save_external_product_image(target_product_id uuid, target_image_url text)
returns void language plpgsql security definer set search_path = '' as $$
declare target_store_id uuid;
begin
  if target_image_url !~* '^https?://[^[:space:]]+$' then raise exception 'invalid image url'; end if;
  select p.store_id into target_store_id from catalog.products p where p.id = target_product_id;
  if target_store_id is null or not catalog.is_active_member(target_store_id) then raise exception 'access denied'; end if;
  insert into catalog.product_external_images(product_id, store_id, image_url, updated_at)
  values(target_product_id, target_store_id, target_image_url, now())
  on conflict(product_id) do update set image_url = excluded.image_url, updated_at = now();
end;
$$;
grant execute on function public.admin_save_external_product_image(uuid, text) to authenticated;
