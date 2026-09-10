import type { CatalogProductRecord } from "../types";

export interface CatalogRepository {
  listPublished(storeSlug: string): Promise<CatalogProductRecord[]>;
  findPublishedBySlug(storeSlug: string, productSlug: string): Promise<CatalogProductRecord | null>;
}
