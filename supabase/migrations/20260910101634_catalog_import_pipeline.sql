-- Private, auditable staging area for supplier spreadsheets and PDFs.
-- Source cost and exact inventory never receive grants for the anonymous role.

create type catalog.import_batch_status as enum ('parsed', 'reviewing', 'imported', 'failed');
create type catalog.import_row_status as enum ('pending', 'approved', 'rejected', 'imported');
create type catalog.import_confidence as enum ('high', 'medium', 'low');

create table catalog.import_batches (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references catalog.stores(id) on delete cascade,
  source_name text not null check (char_length(trim(source_name)) between 3 and 255),
  source_sha256 text not null check (source_sha256 ~ '^[a-f0-9]{64}$'),
  source_rows integer not null check (source_rows > 0),
  summary jsonb not null default '{}'::jsonb check (jsonb_typeof(summary) = 'object'),
  status catalog.import_batch_status not null default 'parsed',
  imported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, id),
  unique (store_id, source_sha256),
  check ((status = 'imported' and imported_at is not null) or status <> 'imported')
);

create table catalog.import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  store_id uuid not null,
  source_page integer not null check (source_page > 0),
  source_row integer not null check (source_row > 0),
  category_name text not null check (char_length(trim(category_name)) between 2 and 80),
  raw_description text not null check (char_length(trim(raw_description)) between 2 and 500),
  manufacturer_code text,
  brand text,
  quantity integer not null check (quantity > 0),
  source_price_cents integer not null check (source_price_cents > 0),
  sale_price_cents integer not null check (sale_price_cents > 0),
  total_cents integer not null check (total_cents > 0),
  confidence catalog.import_confidence not null,
  issues text[] not null default '{}',
  source_fingerprint text not null check (source_fingerprint ~ '^[a-f0-9]{64}$'),
  review_status catalog.import_row_status not null default 'pending',
  product_id uuid,
  parsed_at timestamptz not null default now(),
  unique (store_id, id),
  unique (store_id, source_fingerprint),
  unique (batch_id, source_row),
  foreign key (store_id, batch_id) references catalog.import_batches(store_id, id) on delete cascade,
  foreign key (store_id, product_id) references catalog.products(store_id, id) on delete set null
);

create index import_batches_store_status_idx
  on catalog.import_batches (store_id, status, created_at desc);
create index import_rows_store_batch_review_idx
  on catalog.import_rows (store_id, batch_id, review_status);
create index import_rows_store_manufacturer_code_idx
  on catalog.import_rows (store_id, manufacturer_code)
  where manufacturer_code is not null;
create index import_rows_store_confidence_idx
  on catalog.import_rows (store_id, confidence);
create index import_rows_store_product_idx
  on catalog.import_rows (store_id, product_id)
  where product_id is not null;

alter table catalog.import_batches enable row level security;
alter table catalog.import_rows enable row level security;

revoke all on catalog.import_batches, catalog.import_rows from anon, authenticated;
grant select, insert, update, delete on catalog.import_batches, catalog.import_rows to authenticated;

create policy "store members manage import batches"
on catalog.import_batches for all to authenticated
using (catalog.is_active_member(store_id))
with check (catalog.is_active_member(store_id));

create policy "store members manage import rows"
on catalog.import_rows for all to authenticated
using (catalog.is_active_member(store_id))
with check (catalog.is_active_member(store_id));

create trigger import_batches_touch_updated_at
before update on catalog.import_batches
for each row execute function catalog.touch_updated_at();
