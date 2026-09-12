import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import { CatalogProduct, catalogProducts } from "@/lib/catalog";
import { supabasePublicConfig } from "@/lib/supabase/config";

type CatalogRow = { slug: string; name: string; internal_code: string; manufacturer_code: string | null; brand: string | null; category: CatalogProduct["category"]; regular_price_cents: number; availability_status: string; application: string; description?: string; image_url?: string | null };
export type StockVehicleOption = { make: string; model: string; year_from: number | null; year_to: number | null };

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

export async function getPublicCatalog(options: { limit?: number; offset?: number; make?: string; model?: string; year?: string } = {}): Promise<CatalogProduct[]> {
  const { data, error } = await createPublicCatalogClient().rpc("public_catalog_products_page_v4", {
    page_limit: Math.min(Math.max(options.limit ?? 24, 1), 200),
    page_offset: Math.max(options.offset ?? 0, 0),
    filter_make: options.make || null,
    filter_model: options.model || null,
    filter_year: options.year && /^\d{4}$/.test(options.year) ? Number(options.year) : null,
  });
  if (error) console.error("public_catalog_products failed:", error.message);
  return error || !data ? catalogProducts : (data as CatalogRow[]).map(toProduct);
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
