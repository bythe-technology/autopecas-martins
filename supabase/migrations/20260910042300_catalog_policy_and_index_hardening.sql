-- Keep public storefront reads on the anonymous role and reserve authenticated reads
-- for active members of the owning store. This avoids evaluating two permissive
-- SELECT policies for authenticated requests.

drop policy if exists "published products are public" on catalog.products;
create policy "published products are public"
on catalog.products for select to anon
using (publication_status = 'published');

drop policy if exists "published categories are public" on catalog.categories;
create policy "published categories are public"
on catalog.categories for select to anon
using (
  exists (
    select 1 from catalog.products p
    where p.category_id = categories.id
      and p.store_id = categories.store_id
      and p.publication_status = 'published'
  )
);

drop policy if exists "published promotion is public" on catalog.product_promotions;
create policy "published promotion is public"
on catalog.product_promotions for select to anon
using (
  exists (
    select 1 from catalog.products p
    where p.id = product_promotions.product_id
      and p.store_id = product_promotions.store_id
      and p.publication_status = 'published'
  )
);

drop policy if exists "published images are public" on catalog.product_images;
create policy "published images are public"
on catalog.product_images for select to anon
using (
  status = 'ready'
  and exists (
    select 1 from catalog.products p
    where p.id = product_images.product_id
      and p.store_id = product_images.store_id
      and p.publication_status = 'published'
  )
);

create index if not exists audit_events_actor_idx
  on catalog.audit_events (actor_id)
  where actor_id is not null;

create index if not exists audit_events_store_idx
  on catalog.audit_events (store_id);

create index if not exists product_promotions_store_product_idx
  on catalog.product_promotions (store_id, product_id);

create index if not exists products_store_category_idx
  on catalog.products (store_id, category_id)
  where category_id is not null;
