import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { CatalogProduct, catalogProducts } from "@/lib/catalog";
import { supabasePublicConfig } from "@/lib/supabase/config";

type CatalogRow = { slug: string; name: string; internal_code: string; manufacturer_code: string | null; brand: string | null; category: CatalogProduct["category"]; regular_price_cents: number; availability_status: string; application: string; description?: string; image_url?: string | null; total_count?: number };
export type StockVehicleOption = { make: string; model: string; year_from: number | null; year_to: number | null };
export type CatalogPage = { products: CatalogProduct[]; total: number };
export type CatalogPageOptions = { limit?: number; offset?: number; make?: string; model?: string; year?: string; query?: string; vehicleQuery?: string; category?: string };

function toProduct(row: CatalogRow): CatalogProduct {
  const local = catalogProducts.find(
    (item) => item.code === row.internal_code || item.code.toLowerCase() === row.manufacturer_code?.toLowerCase(),
  );
  return { slug: row.slug, name: row.name, code: row.internal_code, brand: row.brand, category: row.category, priceCents: row.regular_price_cents, availability: row.availability_status === "limited" ? "Últimas unidades" : "Disponível", application: row.application, description: row.description ?? "Produto do lote especial APM1. Confirme aplicação e disponibilidade com nossa equipe.", imageSrc: local?.imageSrc ?? row.image_url ?? undefined, imageNote: local?.imageNote ?? (row.image_url ? "Imagem aprovada" : undefined), fitment: local?.fitment };
}

// The public catalog does not need an authenticated session. Keeping this
// client cookie-free makes server rendering reliable on the home page and
// prevents a missing admin session from silently switching to local data.
function createPublicCatalogClient() {
  return createClient(supabasePublicConfig.url, supabasePublicConfig.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getPublicCatalogPage(options: CatalogPageOptions = {}): Promise<CatalogPage> {
  const limit = Math.min(Math.max(options.limit ?? 24, 1), 48);
  const offset = Math.max(options.offset ?? 0, 0);
  const { data, error } = await createPublicCatalogClient().rpc("public_catalog_products_page_v5", {
    page_limit: limit,
    page_offset: offset,
    filter_make: options.make || null,
    filter_model: options.model || null,
    filter_year: options.year && /^\d{4}$/.test(options.year) ? Number(options.year) : null,
    filter_query: options.query?.slice(0, 80) || null,
    filter_vehicle_query: options.vehicleQuery?.slice(0, 80) || null,
    filter_category: options.category || null,
  });
  if (error) console.error("public_catalog_products failed:", error.message);
  if (error || !data) {
    const products = catalogProducts.slice(offset, offset + limit);
    return { products, total: catalogProducts.length };
  }
  const rows = data as CatalogRow[];
  return { products: rows.map(toProduct), total: Number(rows[0]?.total_count ?? 0) };
}

export async function getPublicCatalog(options: CatalogPageOptions = {}): Promise<CatalogProduct[]> {
  return (await getPublicCatalogPage(options)).products;
}

export async function getStockVehicleOptions(): Promise<StockVehicleOption[]> {
  const { data, error } = await createPublicCatalogClient().rpc("public_stock_vehicle_options");
  if (error) console.error("public_stock_vehicle_options failed:", error.message);
  return error || !data ? [] : data as StockVehicleOption[];
}

export const getPublicProduct = cache(async (slug: string): Promise<CatalogProduct | undefined> => {
  const local = catalogProducts.find((item) => item.slug === slug);
  const { data, error } = await createPublicCatalogClient().rpc("public_catalog_product_v3", { product_slug: slug });
  if (error) console.error("public_catalog_product failed:", error.message);
  return error || !data?.length ? local : toProduct(data[0] as CatalogRow);
});
