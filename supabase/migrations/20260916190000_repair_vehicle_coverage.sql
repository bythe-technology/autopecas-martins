-- Completa os itens antigos que não receberam aplicação na importação do lote.
-- A regra é deliberadamente conservadora: só associa um modelo quando ele
-- aparece de forma inequívoca no nome; os demais ficam como aplicação universal.
with missing as (
  select p.id, p.store_id, upper(p.name) as item_name
  from catalog.products p
  join catalog.stores s on s.id = p.store_id
  where s.slug = 'auto-pecas-martins'
    and p.publication_status = 'published'
    and not exists (
      select 1 from catalog.product_vehicle_applications a
      where a.product_id = p.id and a.store_id = p.store_id
    )
), classified as (
  select *,
    case
      when item_name ~ 'NISSAN|FRONTIER|KICKS|MARCH|SENTRA|VERSA' then 'Nissan'
      when item_name ~ 'PEUGEOT|206|207' then 'Peugeot'
      when item_name ~ 'HYUNDAI|HB20' then 'Hyundai'
      when item_name ~ 'RENAULT|CLIO|SCENIC|SCENIX' then 'Renault'
      when item_name ~ 'MITSUBISHI|L200' then 'Mitsubishi'
      when item_name ~ 'TOYOTA|HILUX|BANDEIRANTE|COROLLA' then 'Toyota'
      when item_name ~ 'MERCEDES|ATEGO|709|912|1111|MB ' then 'Mercedes-Benz'
      when item_name ~ 'FORD|CARGO|F1000|F350|F4000|FIESTA|ESCORT|CORCEL|PAMPA|DEL REY|COURIER|RANGER|BELINA' then 'Ford'
      when item_name ~ 'VOLKSWAGEN|\bVW\b|KOMBI|GOL|FUSCA|BRASILIA|SANTANA|PARATI|SAVEIRO|PASSAT|VOYAGE|GOLF|SEDAN' then 'Volkswagen'
      when item_name ~ 'FIAT|PALIO|SIENA|UNO|FIORINO|ELBA|PREMIO|STRADA|WEEKEND|DUCATO|147' then 'Fiat'
      when item_name ~ 'CHEVROLET|CHEVY|CHEVETTE|CORSA|CELTA|MONZA|VECTRA|OPALA|S10|D20|C10|C14|D10|SILVERADO|VERANEIO|CARAVAN|COBALT|ONIX|PRISMA|SPIN' then 'Chevrolet'
      else 'Diversos'
    end as vehicle_make,
    case
      when item_name ~ 'FRONTIER' then 'Frontier'
      when item_name ~ 'KICKS' then 'Kicks'
      when item_name ~ 'MARCH' then 'March'
      when item_name ~ 'SENTRA' then 'Sentra'
      when item_name ~ 'VERSA' then 'Versa'
      when item_name ~ '206' then '206'
      when item_name ~ '207' then '207'
      when item_name ~ 'HB20' then 'HB20'
      when item_name ~ 'CLIO' then 'Clio'
      when item_name ~ 'SCENIC|SCENIX' then 'Scénic'
      when item_name ~ 'L200' then 'L200'
      when item_name ~ 'HILUX' then 'Hilux'
      when item_name ~ 'BANDEIRANTE' then 'Bandeirante'
      when item_name ~ 'COROLLA' then 'Corolla'
      when item_name ~ 'ATEGO' then 'Atego'
      when item_name ~ '709|912' then '709/912'
      when item_name ~ '1111' then '1111'
      when item_name ~ 'CARGO' then 'Cargo'
      when item_name ~ 'F1000' then 'F1000'
      when item_name ~ 'F350|F4000' then 'F350/F4000'
      when item_name ~ 'FIESTA' then 'Fiesta'
      when item_name ~ 'ESCORT' then 'Escort'
      when item_name ~ 'CORCEL' then 'Corcel'
      when item_name ~ 'PAMPA' then 'Pampa'
      when item_name ~ 'DEL REY' then 'Del Rey'
      when item_name ~ 'COURIER' then 'Courier'
      when item_name ~ 'RANGER' then 'Ranger'
      when item_name ~ 'BELINA' then 'Belina'
      when item_name ~ 'KOMBI' then 'Kombi'
      when item_name ~ 'GOL' then 'Gol'
      when item_name ~ 'FUSCA' then 'Fusca'
      when item_name ~ 'BRASILIA' then 'Brasília'
      when item_name ~ 'SANTANA' then 'Santana'
      when item_name ~ 'PARATI' then 'Parati'
      when item_name ~ 'SAVEIRO' then 'Saveiro'
      when item_name ~ 'PASSAT' then 'Passat'
      when item_name ~ 'VOYAGE' then 'Voyage'
      when item_name ~ 'GOLF' then 'Golf'
      when item_name ~ 'SEDAN' then 'Sedan'
      when item_name ~ 'PALIO' then 'Palio'
      when item_name ~ 'SIENA' then 'Siena'
      when item_name ~ 'UNO' then 'Uno'
      when item_name ~ 'FIORINO' then 'Fiorino'
      when item_name ~ 'ELBA' then 'Elba'
      when item_name ~ 'PREMIO' then 'Prêmio'
      when item_name ~ 'STRADA' then 'Strada'
      when item_name ~ 'WEEKEND' then 'Weekend'
      when item_name ~ 'DUCATO' then 'Ducato'
      when item_name ~ '\m147\M' then '147'
      when item_name ~ 'CHEVETTE' then 'Chevette'
      when item_name ~ 'CORSA' then 'Corsa'
      when item_name ~ 'CELTA' then 'Celta'
      when item_name ~ 'MONZA' then 'Monza'
      when item_name ~ 'VECTRA' then 'Vectra'
      when item_name ~ 'OPALA' then 'Opala'
      when item_name ~ 'S10' then 'S10'
      when item_name ~ 'D20' then 'D20'
      when item_name ~ 'C10' then 'C10'
      when item_name ~ 'C14' then 'C14'
      when item_name ~ 'D10' then 'D10'
      when item_name ~ 'SILVERADO' then 'Silverado'
      when item_name ~ 'VERANEIO' then 'Veraneio'
      when item_name ~ 'CARAVAN' then 'Caravan'
      when item_name ~ 'COBALT' then 'Cobalt'
      when item_name ~ 'ONIX' then 'Onix'
      when item_name ~ 'PRISMA' then 'Prisma'
      when item_name ~ 'SPIN' then 'Spin'
      when item_name ~ 'CAMINHAO|ONIBUS|CARRETA|REBOQUE' then 'Linha pesada'
      when item_name ~ 'UNIVERSAL|FRISO' then 'Universal'
      else 'Aplicação universal'
    end as vehicle_model
  from missing
)
insert into catalog.product_vehicle_applications
  (store_id, product_id, vehicle_type, make, model, year_from, year_to, notes, confidence, source)
select store_id, id,
  case when vehicle_make in ('Diversos','Mercedes-Benz','Ford') and item_name ~ 'CAMINHAO|ONIBUS|CARRETA|REBOQUE|CARGO|ATEGO|709|912|1111' then 'truck' else 'car' end,
  vehicle_make, vehicle_model, null, null,
  case when vehicle_make = 'Diversos' then 'Aplicação universal ou linha pesada; confirme medidas, carroceria e lado com a equipe.' else 'Modelo identificado no nome do item; confirme versão, carroceria e faixa de ano com a equipe.' end,
  case when vehicle_make = 'Diversos' then 'low'::catalog.import_confidence else 'medium'::catalog.import_confidence end,
  'manual'
from classified
on conflict (store_id, product_id, make, model, year_from, year_to) do nothing;

-- Aproveita faixas curtas presentes no nome (05/14, 93/98, 85/...) para
-- alimentar o seletor de ano sem transformar anos ausentes em palpites.
with candidates as (
  select a.id, regexp_match(upper(p.name), '(^|[^0-9])([0-9]{2})[[:space:]]*/[[:space:]]*([0-9]{2})([^0-9]|$)') as pair,
         regexp_match(upper(p.name), '(^|[^0-9])([0-9]{4})[[:space:]]*/') as open_start
  from catalog.product_vehicle_applications a
  join catalog.products p on p.id=a.product_id
  where a.source='manual' and a.year_from is null and a.model not in ('Universal','Aplicação universal','Linha pesada')
), parsed as (
  select id,
    case when open_start is not null then (open_start[2])::integer when pair is not null then case when (pair[2])::integer>=30 then 1900+(pair[2])::integer else 2000+(pair[2])::integer end end as year_from,
    case when pair is not null then case when (pair[3])::integer>=30 then 1900+(pair[3])::integer else 2000+(pair[3])::integer end end as year_to
  from candidates
)
update catalog.product_vehicle_applications a
set year_from=p.year_from,year_to=p.year_to
from parsed p
where a.id=p.id and p.year_from between 1900 and 2100 and (p.year_to is null or p.year_from<=p.year_to);

-- Quando a descrição traz o modelo, mas omite o ano, usa a faixa consolidada
-- das demais peças do mesmo modelo. Os poucos modelos sem referência recebem
-- sua faixa de produção brasileira conhecida.
delete from catalog.product_vehicle_applications a
where a.year_from is null and exists (
  select 1 from catalog.product_vehicle_applications known
  where known.product_id=a.product_id and known.store_id=a.store_id
    and known.make=a.make and known.model=a.model and known.year_from is not null
);

with duplicates as (
  select id,row_number() over(partition by store_id,product_id,make,model order by created_at,id) as position
  from catalog.product_vehicle_applications where year_from is null
)
delete from catalog.product_vehicle_applications a using duplicates d
where a.id=d.id and d.position>1;

with model_ranges as (
  select make,model,min(year_from) as year_from,max(coalesce(year_to,2026)) as year_to
  from catalog.product_vehicle_applications
  where year_from is not null
  group by make,model
)
update catalog.product_vehicle_applications a
set year_from=r.year_from,year_to=r.year_to,
    notes=coalesce(a.notes,'')||' Faixa de ano consolidada pelo modelo; confirme a versão antes da compra.'
from model_ranges r
where a.make=r.make and a.model=r.model and a.year_from is null
  and a.model not in ('Universal','Aplicação universal','Linha pesada');

with known_ranges(make,model,year_from,year_to) as (values
  ('Chevrolet','Silverado',1997,2002),('Citroën','C3',2003,2026),('Citroën','C4',2007,2021),
  ('Fiat','Stilo',2003,2011),('Ford','Cargo',1985,2026),('Ford','F350/F4000',1968,2026),
  ('Ford','Ranger',1994,2026),('Mercedes-Benz','1111',1964,1984),('Mercedes-Benz','709/912',1987,2000),
  ('Mercedes-Benz','Atego',2005,2026),('Mercedes-Benz','Cargo',1985,2026),('Mercedes-Benz','Sprinter',1997,2026),
  ('Mitsubishi','L200',1992,2026),('Nissan','Versa',2011,2026),('Peugeot','206',1999,2010),
  ('Peugeot','207',2008,2015),('Renault','Scénic',1999,2010),('Volkswagen','Apollo',1990,1992),
  ('Volkswagen','Delivery',2005,2026),('Volkswagen','Worker',1998,2021)
)
update catalog.product_vehicle_applications a
set year_from=r.year_from,year_to=r.year_to,
    notes=coalesce(a.notes,'')||' Faixa de produção do modelo; confirme a versão antes da compra.'
from known_ranges r
where a.make=r.make and a.model=r.model and a.year_from is null;

-- Itens universais continuam classificados para o estoque, mas não poluem o
-- seletor de marca/modelo do cliente com uma marca que não é fabricante.
create or replace function public.public_stock_vehicle_options()
returns table(make text, model text, year_from integer, year_to integer)
language sql stable security definer set search_path='' as $$
  select a.make, a.model, a.year_from::integer, a.year_to::integer
  from catalog.product_vehicle_applications a
  join catalog.products p on p.id=a.product_id and p.store_id=a.store_id
  join catalog.stores s on s.id=p.store_id
  where s.slug='auto-pecas-martins'
    and p.publication_status='published'
    and p.availability_status<>'out_of_stock'
    and a.make <> 'Diversos'
    and a.model not in ('Universal','Aplicação universal','Linha pesada')
  group by a.make,a.model,a.year_from,a.year_to
  order by a.make,a.model,a.year_from,a.year_to;
$$;
revoke all on function public.public_stock_vehicle_options() from public;
grant execute on function public.public_stock_vehicle_options() to anon,authenticated;
