create table catalog.product_vehicle_applications (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null,
  product_id uuid not null,
  vehicle_type text not null default 'car' check (vehicle_type in ('car', 'truck', 'van')),
  make text not null check (char_length(trim(make)) between 2 and 80),
  model text not null check (char_length(trim(model)) between 1 and 120),
  year_from smallint check (year_from between 1900 and 2100),
  year_to smallint check (year_to between 1900 and 2100),
  notes text,
  confidence catalog.import_confidence not null default 'medium',
  source text not null default 'lote_apm1' check (source in ('lote_apm1', 'manufacturer', 'retailer_research', 'manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (store_id, product_id) references catalog.products(store_id, id) on delete cascade,
  unique (store_id, product_id, make, model, year_from, year_to),
  check (year_to is null or year_from is null or year_to >= year_from)
);

create index product_vehicle_applications_lookup_idx
  on catalog.product_vehicle_applications (store_id, make, model, year_from, year_to);
create index product_vehicle_applications_product_idx
  on catalog.product_vehicle_applications (store_id, product_id);

alter table catalog.product_vehicle_applications enable row level security;
revoke all on catalog.product_vehicle_applications from anon, authenticated;
grant select on catalog.product_vehicle_applications to anon, authenticated;
grant insert, update, delete on catalog.product_vehicle_applications to authenticated;

create policy "published vehicle applications are public"
on catalog.product_vehicle_applications for select to anon
using (exists (
  select 1 from catalog.products product
  where product.store_id = product_vehicle_applications.store_id
    and product.id = product_vehicle_applications.product_id
    and product.publication_status = 'published'
));

create policy "store members manage vehicle applications"
on catalog.product_vehicle_applications for all to authenticated
using (catalog.is_active_member(store_id))
with check (catalog.is_active_member(store_id));

create trigger product_vehicle_applications_touch_updated_at
before update on catalog.product_vehicle_applications
for each row execute function catalog.touch_updated_at();

with target_store as (
  select id from catalog.stores where slug = 'auto-pecas-martins'
), applications(manufacturer_code, make, model, year_from, year_to, confidence, source) as (
  values
    ('160047','Volkswagen','Santana',1987,1990,'medium','retailer_research'),
    ('FG51LD','Chevrolet','Opala',1980,1987,'high','retailer_research'),
    ('FG51LD','Chevrolet','Caravan',1980,1987,'high','retailer_research'),
    ('CHG041260-7','Volkswagen','Fox',2004,2010,'medium','lote_apm1'),
    ('CHG041260-7','Volkswagen','CrossFox',2005,2010,'medium','retailer_research'),
    ('FF48LD','Fiat','Palio',2008,2012,'medium','retailer_research'),
    ('FF48LD','Fiat','Siena',2008,2015,'medium','retailer_research'),
    ('FF48LD','Fiat','Strada',2009,2016,'medium','retailer_research'),
    ('416147','Chevrolet','Agile',2009,2014,'medium','retailer_research'),
    ('23023','Chevrolet','S10',2012,2026,'high','manufacturer'),
    ('22020','Volkswagen','Virtus',2018,2026,'medium','manufacturer'),
    ('23035','Chevrolet','Onix Plus',2019,2026,'high','manufacturer'),
    ('21244','Chevrolet','Agile',2009,2014,'high','manufacturer'),
    ('21244','Chevrolet','Montana',2011,2021,'high','manufacturer'),
    ('RX2276','Chevrolet','Onix',2013,2019,'high','retailer_research'),
    ('RX2276','Chevrolet','Prisma',2013,2019,'high','retailer_research'),
    ('RX4528','Fiat','Palio',2012,2021,'medium','lote_apm1'),
    ('RX4528','Fiat','Strada',2012,2021,'medium','lote_apm1'),
    ('12089','Chevrolet','Corsa Classic',2010,2015,'high','retailer_research'),
    ('111194-0','Fiat','Strada',2012,2014,'medium','lote_apm1'),
    ('1581','Chevrolet','Onix',2013,2016,'high','retailer_research'),
    ('1581','Chevrolet','Prisma',2013,2016,'high','retailer_research'),
    ('25566','Chevrolet','Corsa Classic',2010,2014,'medium','retailer_research'),
    ('38936','Fiat','Ducato',null,null,'medium','lote_apm1'),
    ('39570','Toyota','Bandeirante',1993,null,'medium','lote_apm1'),
    ('27004','Toyota','Corolla',2008,2014,'high','manufacturer')
)
insert into catalog.product_vehicle_applications (
  store_id, product_id, make, model, year_from, year_to, confidence, source
)
select s.id, p.id, a.make, a.model, a.year_from, a.year_to,
  a.confidence::catalog.import_confidence, a.source
from applications a
cross join target_store s
join catalog.products p on p.store_id = s.id and p.manufacturer_code = a.manufacturer_code
on conflict (store_id, product_id, make, model, year_from, year_to) do nothing;
