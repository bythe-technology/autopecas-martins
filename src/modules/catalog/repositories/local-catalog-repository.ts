import { catalogProducts } from "@/lib/catalog";
import type { CatalogRepository } from "./catalog-repository";
import type { CatalogProductRecord } from "../types";

function mapProduct(product: (typeof catalogProducts)[number]): CatalogProductRecord {
  return {
    id: product.slug,
    storeId: "auto-pecas-martins",
    categoryId: product.category,
    internalCode: product.code,
    manufacturerCode: product.code,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    description: product.description,
    applicationNote: product.application,
    priceCents: product.priceCents,
    publicationStatus: "published",
    availabilityStatus: product.availability === "Últimas unidades" ? "limited" : "available",
  };
}

export class LocalCatalogRepository implements CatalogRepository {
  async listPublished(): Promise<CatalogProductRecord[]> {
    return catalogProducts.map(mapProduct);
  }

  async findPublishedBySlug(_storeSlug: string, productSlug: string): Promise<CatalogProductRecord | null> {
    const product = catalogProducts.find((item) => item.slug === productSlug);
    return product ? mapProduct(product) : null;
  }
}
