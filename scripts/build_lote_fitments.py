"""Infer vehicle applications stated in LOTES APM1 descriptions.

This intentionally uses only vehicle names and year ranges present in the source.
It does not invent compatibility from a product code.
"""
from __future__ import annotations

import json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROWS = json.loads((ROOT / "data/imports/lote-apm1/rows.json").read_text(encoding="utf-8"))
OUT = ROOT / "supabase/migrations/20260910203000_publish_lote_with_fitments.sql"

MAKES = {
 "Volkswagen": {"Gol":["gol"],"Parati":["parati","par"],"Voyage":["voyage","voy"],"Saveiro":["saveiro","sav"],"Passat":["passat"],"Santana":["santana"],"Quantum":["quantum"],"Kombi":["kombi"],"Fox":["fox"],"CrossFox":["crossfox"],"SpaceFox":["spacefox"],"Polo":["polo"],"Virtus":["virtus"],"Up":["up"],"Fusca":["fusca"],"Brasília":["brasilia"],"Variant":["variant"],"TL":[" tl "],"Apollo":["apollo"],"Logus":["logus"],"Pointer":["pointer"],"Bora":["bora"],"Jetta":["jetta"],"Amarok":["amarok"],"Delivery":["delivery"],"Worker":["worker"]},
 "Chevrolet": {"Corsa":["corsa"],"Classic":["classic"],"Celta":["celta"],"Prisma":["prisma"],"Onix":["onix"],"Spin":["spin"],"Agile":["agile"],"Montana":["montana"],"Monza":["monza"],"Kadett":["kadett"],"Ipanema":["ipanema"],"Vectra":["vectra"],"Astra":["astra"],"Omega":["omega"],"Opala":["opala"],"Caravan":["caravan"],"Chevette":["chevette"],"Marajó":["marajo"],"S10":["s10","s-10"],"Blazer":["blazer"],"Silverado":["silverado"],"Veraneio":["veraneio"],"C10":["c-10","c10"],"C14":["c-14","c14"],"D10":["d-10","d10"],"Meriva":["meriva"],"Zafira":["zafira"],"Cobalt":["cobalt"],"Cruze":["cruze"],"Tracker":["tracker"],"Sonic":["sonic"],"Malibu":["malibu"]},
 "Fiat": {"Palio":["palio"],"Siena":["siena"],"Strada":["strada"],"Weekend":["weekend","week","weed"," sw "],"Uno":["uno"],"Prêmio":["premio"],"Elba":["elba"],"Fiorino":["fiorino"],"Ducato":["ducato"],"Idea":["idea"],"Punto":["punto"],"Linea":["linea"],"Marea":["marea"],"Brava":["brava"],"Tempra":["tempra"],"Tipo":["tipo"],"Doblo":["doblo"],"Stilo":["stilo"],"Toro":["toro"],"Mobi":["mobi"],"Argo":["argo"],"Cronos":["cronos"],"147":["147"]},
 "Ford": {"Corcel":["corcel"],"Belina":["belina"],"Del Rey":["delrey","del rey"],"Pampa":["pampa"],"Escort":["escort"],"Verona":["verona"],"Fiesta":["fiesta"],"Courier":["courier"],"Ka":[" ka "],"EcoSport":["ecosport"],"Focus":["focus"],"Fusion":["fusion"],"Ranger":["ranger"],"F1000":["f1000","f-1000"],"F250":["f250","f-250"]},
 "Toyota": {"Corolla":["corolla"],"Hilux":["hilux"],"Bandeirante":["bandeirante","bandeirantes"],"Etios":["etios"]},
 "Honda": {"Civic":["civic"],"Fit":[" fit "],"City":["city"],"CR-V":["cr-v","crv"]},
 "Renault": {"Clio":["clio"],"Scénic":["scenic"],"Mégane":["megane"],"Sandero":["sandero"],"Logan":["logan"],"Duster":["duster"],"Kangoo":["kangoo"],"Master":["master"]},
 "Peugeot": {"206":["206"],"207":["207"],"307":["307"],"Partner":["partner"]},
 "Citroën": {"C3":["c3"],"C4":["c4"],"Xsara":["xsara"],"Berlingo":["berlingo"]},
 "Mitsubishi": {"L200":["l200","l-200"],"Pajero":["pajero"]},
 "Hyundai": {"HB20":["hb20"],"Tucson":["tucson"],"Santa Fe":["santa fe"],"HR":[" hr "]},
 "Kia": {"Bongo":["bongo"],"Sportage":["sportage"]},
 "Nissan": {"Frontier":["frontier"],"March":["march"],"Versa":["versa"]},
 "Mercedes-Benz": {"Sprinter":["sprinter"]},
}

def norm(value: str) -> str:
 return " " + re.sub(r"[^a-z0-9]+", " ", unicodedata.normalize("NFKD", value).encode("ascii","ignore").decode().lower()).strip() + " "

def years(text: str):
 pairs = re.findall(r"(?<!\d)(\d{2,4})\s*[/-]\s*(\d{2,4}|\.\.\.?)(?!\d)", text)
 if not pairs: return None, None
 a,b=pairs[-1]
 def full(x):
  if not x.isdigit(): return None
  n=int(x)
  if len(x)==2: return 1900+n if n>=40 else 2000+n
  return n if len(x)==4 and 1900 <= n <= 2100 else None
 start, end = full(a), full(b)
 return (start, end) if not (start and end and end < start) else (None, None)

apps=[]; unmatched=[]
for row in ROWS:
 text=norm(row["description"]); found=[]
 for make, models in MAKES.items():
  for model, aliases in models.items():
   if model == "Up" and " pick up " in text: continue
   if any(f" {norm(alias).strip()} " in text for alias in aliases): found.append((make,model))
 start,end=years(row["description"])
 if not found: unmatched.append(row["internal_code"])
 for make,model in sorted(set(found)):
  apps.append({"internal_code":row["internal_code"],"make":make,"model":model,"year_from":start,"year_to":end})

payload=json.dumps(apps,ensure_ascii=False,separators=(",",":")).replace("'","''")
sql=f"""-- Generated from explicit model/year text in LOTES APM1.pdf.
with target_store as (select id from catalog.stores where slug='auto-pecas-martins'),
payload as (select * from jsonb_to_recordset('{payload}'::jsonb) as x(internal_code text, make text, model text, year_from smallint, year_to smallint))
insert into catalog.product_vehicle_applications(store_id,product_id,vehicle_type,make,model,year_from,year_to,notes,confidence,source)
select s.id,p.id,case when payload.model in ('Delivery','Worker','HR') then 'truck' when payload.model in ('Ducato','Fiorino','Kombi','Sprinter','Master','Bongo') then 'van' else 'car' end,
 payload.make,payload.model,payload.year_from,payload.year_to,'Aplicação extraída da descrição do lote APM1. Confirme versão e carroceria antes da compra.','medium','lote_apm1'
from payload cross join target_store s join catalog.products p on p.store_id=s.id and p.internal_code=payload.internal_code
on conflict (store_id,product_id,make,model,year_from,year_to) do nothing;

update catalog.products p set publication_status='published', published_at=coalesce(p.published_at,now()),
 application_note=case when exists(select 1 from catalog.product_vehicle_applications a where a.product_id=p.id) then 'Aplicação identificada no lote. Confirme versão, carroceria e lado com a equipe.' else 'Aplicação não especificada no lote. Confirme medidas e compatibilidade com a equipe.' end,
 description='Produto do lote especial APM1. Preço unitário conforme a lista fornecida; disponibilidade e aplicação sujeitas à confirmação.'
from catalog.stores s where p.store_id=s.id and s.slug='auto-pecas-martins' and p.internal_code like 'APM1-%';

create or replace function public.public_catalog_products()
returns table(slug text,name text,internal_code text,brand text,category text,regular_price_cents integer,availability_status text,application text)
language sql stable security invoker set search_path='' as $$
 select p.slug,p.name,p.internal_code,p.brand,c.name,p.regular_price_cents,p.availability_status::text,
 coalesce(string_agg(distinct concat_ws(' ',a.make,a.model,case when a.year_from is not null then a.year_from::text end,case when a.year_to is not null then 'a '||a.year_to::text end),', '),'Consulte a aplicação com nossa equipe')
 from catalog.products p join catalog.stores s on s.id=p.store_id join catalog.categories c on c.id=p.category_id left join catalog.product_vehicle_applications a on a.product_id=p.id and a.store_id=p.store_id
 where s.slug='auto-pecas-martins' and p.publication_status='published' group by p.id,c.name order by p.name;
$$;
create or replace function public.public_catalog_product(product_slug text)
returns table(slug text,name text,internal_code text,brand text,category text,regular_price_cents integer,availability_status text,application text,description text)
language sql stable security invoker set search_path='' as $$
 select p.slug,p.name,p.internal_code,p.brand,c.name,p.regular_price_cents,p.availability_status::text,
 coalesce(string_agg(distinct concat_ws(' ',a.make,a.model,case when a.year_from is not null then a.year_from::text end,case when a.year_to is not null then 'a '||a.year_to::text end),', '),'Consulte a aplicação com nossa equipe'),coalesce(p.description,'Confirme aplicação e disponibilidade com nossa equipe.')
 from catalog.products p join catalog.stores s on s.id=p.store_id join catalog.categories c on c.id=p.category_id left join catalog.product_vehicle_applications a on a.product_id=p.id and a.store_id=p.store_id
 where s.slug='auto-pecas-martins' and p.publication_status='published' and p.slug=product_slug group by p.id,c.name limit 1;
$$;
revoke all on function public.public_catalog_products(), public.public_catalog_product(text) from public;
grant execute on function public.public_catalog_products(), public.public_catalog_product(text) to anon, authenticated;
"""
OUT.write_text(sql,encoding="utf-8")
print(json.dumps({"products":len(ROWS),"applications":len(apps),"products_with_fitment":len(set(x['internal_code'] for x in apps)),"without_explicit_vehicle":len(unmatched)},ensure_ascii=False))

