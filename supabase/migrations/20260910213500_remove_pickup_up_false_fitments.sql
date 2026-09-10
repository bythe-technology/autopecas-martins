delete from catalog.product_vehicle_applications a
using catalog.products p, catalog.stores s
where a.product_id=p.id and p.store_id=s.id and s.slug='auto-pecas-martins'
  and a.make='Volkswagen' and a.model='Up' and p.name ilike '%pick%up%';
