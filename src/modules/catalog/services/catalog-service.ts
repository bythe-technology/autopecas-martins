import type { CatalogRepository } from "../repositories/catalog-repository";

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  listStorefront(storeSlug: string) {
    return this.repository.listPublished(storeSlug);
  }

  getStorefrontProduct(storeSlug: string, productSlug: string) {
    return this.repository.findPublishedBySlug(storeSlug, productSlug);
  }
}
