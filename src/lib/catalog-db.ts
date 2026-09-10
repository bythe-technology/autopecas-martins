import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CatalogProduct, catalogProducts } from "@/lib/catalog";

type CatalogRow = { slug: string; name: string; internal_code: string; brand: string | null; category: CatalogProduct["category"]; regular_price_cents: number; availability_status: string; application: string; description?: string };

function toProduct(row: CatalogRow): CatalogProduct {
  const local = catalogProducts.find((item) => item.code === row.internal_code);
  return { slug: row.slug, name: row.name, code: row.internal_code, brand: row.brand, category: row.category, priceCents: row.regular_price_cents, availability: row.availability_status === "limited" ? "Últimas unidades" : "Disponível", application: row.application, description: row.description ?? "Produto do lote especial APM1. Confirme aplicação e disponibilidade com nossa equipe.", imageSrc: local?.imageSrc, imageNote: local?.imageNote, fitment: local?.fitment };
}

export async function getPublicCatalog(): Promise<CatalogProduct[]> {
  const { data, error } = await (await createSupabaseServerClient()).rpc("public_catalog_products");
  return error || !data ? catalogProducts : (data as CatalogRow[]).map(toProduct);
}

export async function getPublicProduct(slug: string): Promise<CatalogProduct | undefined> {
  const local = catalogProducts.find((item) => item.slug === slug);
  const { data, error } = await (await createSupabaseServerClient()).rpc("public_catalog_product", { product_slug: slug });
  return error || !data?.length ? local : toProduct(data[0] as CatalogRow);
}
