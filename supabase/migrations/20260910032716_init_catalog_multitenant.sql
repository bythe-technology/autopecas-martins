-- Catalog foundation shared by small BYTHE clients.
-- Tables are empty on purpose: source pricing and images still require client validation.

create schema if not exists catalog;

create type catalog.member_role as enum ('owner', 'editor');
create type catalog.publication_status as enum ('draft', 'published', 'archived');
create type catalog.availability_status as enum ('available', 'limited', 'out_of_stock', 'on_request');
create type catalog.price_mode as enum ('fixed', 'on_request');

create table catalog.stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name text not null check (char_length(trim(display_name)) between 2 and 120),
  whatsapp_e164 text,
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table catalog.store_memberships (
  store_id uuid not null references catalog.stores(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role catalog.member_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (store_id, user_id)
);

create table catalog.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references catalog.stores(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 80),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (store_id, id),
  unique (store_id, slug)
);

create table catalog.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references catalog.stores(id) on delete cascade,
  category_id uuid,
  internal_code text not null check (char_length(trim(internal_code)) between 2 and 64),
  manufacturer_code text,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(trim(name)) between 2 and 180),
  brand text,
  description text,
  application_note text,
  price_mode catalog.price_mode not null default 'fixed',
  regular_price_cents integer check (regular_price_cents > 0),
  publication_status catalog.publication_status not null default 'draft',
  availability_status catalog.availability_status not null default 'available',
  version integer not null default 1 check (version > 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (store_id, category_id) references catalog.categories(store_id, id) on delete restrict,
  unique (store_id, id),
  unique (store_id, internal_code),
  unique (store_id, slug),
  check ((price_mode = 'fixed' and regular_price_cents is not null) or (price_mode = 'on_request' and regular_price_cents is null)),
  check ((publication_status = 'published' and published_at is not null) or publication_status <> 'published')
);

create table catalog.product_promotions (
  product_id uuid primary key,
  store_id uuid not null,
  promotional_price_cents integer not null check (promotional_price_cents > 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (store_id, product_id) references catalog.products(store_id, id) on delete cascade,
  check (starts_at < ends_at)
);

create table catalog.product_images (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null,
  product_id uuid not null,
  object_path text not null,
  alt_text text,
  position smallint not null default 0 check (position >= 0),
  width integer check (width > 0),
  height integer check (height > 0),
  bytes integer check (bytes > 0),
  status text not null default 'pending' check (status in ('pending', 'ready')),
  created_at timestamptz not null default now(),
  foreign key (store_id, product_id) references catalog.products(store_id, id) on delete cascade,
  unique (store_id, product_id, position),
  unique (object_path)
);

create table catalog.audit_events (
  id bigint generated always as identity primary key,
  store_id uuid not null references catalog.stores(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  request_id uuid,
  created_at timestamptz not null default now()
);

create index products_store_status_category_idx on catalog.products (store_id, publication_status, availability_status, category_id);
create index products_store_search_idx on catalog.products (store_id, name, internal_code);
create index promotions_active_window_idx on catalog.product_promotions (store_id, starts_at, ends_at);
create index memberships_user_store_idx on catalog.store_memberships (user_id, store_id) where active;

alter table catalog.stores enable row level security;
alter table catalog.store_memberships enable row level security;
alter table catalog.categories enable row level security;
alter table catalog.products enable row level security;
alter table catalog.product_promotions enable row level security;
alter table catalog.product_images enable row level security;
alter table catalog.audit_events enable row level security;

revoke all on all tables in schema catalog from anon, authenticated;
revoke all on all sequences in schema catalog from anon, authenticated;
revoke all on schema catalog from public;
grant usage on schema catalog to anon, authenticated;
grant select on catalog.categories, catalog.products, catalog.product_promotions, catalog.product_images to anon, authenticated;
grant select, insert, update, delete on catalog.categories, catalog.products, catalog.product_promotions, catalog.product_images to authenticated;

create function catalog.is_active_member(target_store_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1 from catalog.store_memberships
    where store_id = target_store_id and user_id = (select auth.uid()) and active
  );
$$;

create function catalog.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function catalog.is_active_member(uuid) from public;
grant execute on function catalog.is_active_member(uuid) to authenticated;

create policy "published products are public" on catalog.products for select to anon, authenticated using (publication_status = 'published');
create policy "store members manage products" on catalog.products for all to authenticated using (catalog.is_active_member(store_id)) with check (catalog.is_active_member(store_id));
create policy "published categories are public" on catalog.categories for select to anon, authenticated using (exists (select 1 from catalog.products p where p.category_id = categories.id and p.publication_status = 'published'));
create policy "store members manage categories" on catalog.categories for all to authenticated using (catalog.is_active_member(store_id)) with check (catalog.is_active_member(store_id));
create policy "published promotion is public" on catalog.product_promotions for select to anon, authenticated using (exists (select 1 from catalog.products p where p.id = product_promotions.product_id and p.publication_status = 'published'));
create policy "store members manage promotions" on catalog.product_promotions for all to authenticated using (catalog.is_active_member(store_id)) with check (catalog.is_active_member(store_id));
create policy "published images are public" on catalog.product_images for select to anon, authenticated using (status = 'ready' and exists (select 1 from catalog.products p where p.id = product_images.product_id and p.publication_status = 'published'));
create policy "store members manage product images" on catalog.product_images for all to authenticated using (catalog.is_active_member(store_id)) with check (catalog.is_active_member(store_id));
create policy "members see their own memberships" on catalog.store_memberships for select to authenticated using (user_id = (select auth.uid()));

create trigger stores_touch_updated_at before update on catalog.stores for each row execute function catalog.touch_updated_at();
create trigger products_touch_updated_at before update on catalog.products for each row execute function catalog.touch_updated_at();
create trigger promotions_touch_updated_at before update on catalog.product_promotions for each row execute function catalog.touch_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-staging', 'catalog-staging', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']::text[])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "catalog members read staging files" on storage.objects for select to authenticated using (bucket_id = 'catalog-staging' and catalog.is_active_member((storage.foldername(name))[1]::uuid));
create policy "catalog members upload staging files" on storage.objects for insert to authenticated with check (bucket_id = 'catalog-staging' and catalog.is_active_member((storage.foldername(name))[1]::uuid));
create policy "catalog members update staging files" on storage.objects for update to authenticated using (bucket_id = 'catalog-staging' and catalog.is_active_member((storage.foldername(name))[1]::uuid)) with check (bucket_id = 'catalog-staging' and catalog.is_active_member((storage.foldername(name))[1]::uuid));
create policy "catalog members delete staging files" on storage.objects for delete to authenticated using (bucket_id = 'catalog-staging' and catalog.is_active_member((storage.foldername(name))[1]::uuid));
