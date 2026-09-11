import { readFile, writeFile } from "node:fs/promises";

const rows = JSON.parse(await readFile("data/imports/lote-apm1/rows.json", "utf8"));
const vehicleTerms = /(gol|palio|corsa|uno|siena|strada|saveiro|parati|fox|onix|prisma|s10|corolla|fiesta|ecosport|civic|astra|celta|vectra|montana|clio|kangoo|focus|ka|hilux|ranger)/i;
const ranked = rows.map((row) => {
  const stockValue = Number(row.total_cents ?? 0);
  const quantity = Number(row.quantity ?? 0);
  const identifiable = vehicleTerms.test(row.description) ? 1 : 0;
  const score = stockValue + quantity * 1000 + identifiable * 50000;
  return { internal_code: row.internal_code, score, quantity, stock_value_cents: stockValue };
}).sort((a, b) => b.score - a.score).slice(0, 200);

await writeFile("data/featured-product-codes.json", JSON.stringify(ranked, null, 2));
const values = ranked.map((row, index) => `('${row.internal_code}',${index + 1})`).join(",\n");
await writeFile("supabase/migrations/20260911001736_prioritize_featured_products.sql", `alter table catalog.products add column if not exists featured_priority integer;\nupdate catalog.products set featured_priority=null;\nupdate catalog.products p set featured_priority=v.priority from (values\n${values}\n) v(internal_code,priority) where p.internal_code=v.internal_code;\ncreate index if not exists products_featured_priority_idx on catalog.products(store_id,featured_priority) where featured_priority is not null;\n`);
console.log(`selected ${ranked.length}`);
