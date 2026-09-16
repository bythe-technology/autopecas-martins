create or replace function public.public_catalog_products_page_v5(
  page_limit integer default 24,
  page_offset integer default 0,
  filter_make text default null,
  filter_model text default null,
  filter_year integer default null,
  filter_query text default null,
  filter_vehicle_query text default null,
  filter_category text default null
)
returns table(
  slug text,
  name text,
  internal_code text,
  manufacturer_code text,
  brand text,
  category text,
  regular_price_cents integer,
  availability_status text,
  application text,
  image_url text,
  total_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with catalog_rows as (
    select
      p.id,
      p.slug,
      p.name,
      p.internal_code,
      p.manufacturer_code,
      p.brand,
      c.name as category,
      p.regular_price_cents,
      p.availability_status::text,
      coalesce(
        string_agg(
          distinct concat_ws(
            ' ',
            a.make,
            a.model,
            case when a.year_from is not null then a.year_from::text end,
            case when a.year_to is not null then 'a ' || a.year_to::text end
          ),
          ', '
        ),
        'Consulte a aplicação com nossa equipe'
      ) as application,
      i.image_url,
      p.featured_priority
    from catalog.products p
    join catalog.stores s on s.id = p.store_id
    join catalog.categories c on c.id = p.category_id
    left join catalog.product_vehicle_applications a on a.product_id = p.id and a.store_id = p.store_id
    left join catalog.product_external_images i on i.product_id = p.id and i.review_status = 'approved'
    where s.slug = 'auto-pecas-martins'
      and p.publication_status = 'published'
      and p.availability_status <> 'out_of_stock'
      and (
        nullif(trim(filter_make), '') is null
        or exists (
          select 1
          from catalog.product_vehicle_applications f
          where f.product_id = p.id
            and f.make = filter_make
            and (nullif(trim(filter_model), '') is null or f.model = filter_model)
            and (
              filter_year is null
              or ((f.year_from is null or f.year_from <= filter_year) and (f.year_to is null or f.year_to >= filter_year))
            )
        )
      )
      and (nullif(trim(filter_category), '') is null or lower(c.name) = lower(trim(filter_category)))
      and (
        nullif(trim(filter_query), '') is null
        or concat_ws(' ', p.name, p.internal_code, p.manufacturer_code, p.brand, c.name) ilike '%' || trim(filter_query) || '%'
        or exists (
          select 1
          from catalog.product_vehicle_applications q
          where q.product_id = p.id
            and concat_ws(' ', q.make, q.model, q.year_from::text, q.year_to::text) ilike '%' || trim(filter_query) || '%'
        )
      )
      and (
        nullif(trim(filter_vehicle_query), '') is null
        or exists (
          select 1
          from catalog.product_vehicle_applications v
          where v.product_id = p.id
            and concat_ws(' ', v.make, v.model, v.year_from::text, v.year_to::text) ilike '%' || trim(filter_vehicle_query) || '%'
        )
      )
    group by p.id, c.name, i.image_url
  ),
  counted_rows as (
    select catalog_rows.*, count(*) over () as total_count
    from catalog_rows
  )
  select
    counted_rows.slug,
    counted_rows.name,
    counted_rows.internal_code,
    counted_rows.manufacturer_code,
    counted_rows.brand,
    counted_rows.category,
    counted_rows.regular_price_cents,
    counted_rows.availability_status,
    counted_rows.application,
    counted_rows.image_url,
    counted_rows.total_count
  from counted_rows
  order by
    case
      when counted_rows.image_url is not null
        or upper(coalesce(counted_rows.manufacturer_code, '')) in (
          '160047','FG51LD','CHG041260-7','FF48LD','416147','23023','22020','23035','21244',
          'RX2276','RX4528','12089','111194-0','1581','25566','38936','39570','27004'
        ) then 0
      else 1
    end,
    counted_rows.featured_priority nulls last,
    counted_rows.name
  limit least(greatest(coalesce(page_limit, 24), 1), 48)
  offset greatest(coalesce(page_offset, 0), 0);
$$;

revoke all on function public.public_catalog_products_page_v5(integer, integer, text, text, integer, text, text, text) from public;
grant execute on function public.public_catalog_products_page_v5(integer, integer, text, text, integer, text, text, text) to anon, authenticated;
