create table if not exists catalog.product_external_images (product_id uuid primary key references catalog.products(id) on delete cascade, store_id uuid not null references catalog.stores(id) on delete cascade, image_url text not null check (image_url ~* '^https?://'), updated_at timestamptz not null default now());
alter table catalog.product_external_images enable row level security;
grant select, insert, update, delete on catalog.product_external_images to authenticated;
create policy "store members manage external images" on catalog.product_external_images for all to authenticated using (catalog.is_active_member(store_id)) with check (catalog.is_active_member(store_id));
