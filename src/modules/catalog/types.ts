export type PublicationStatus = "draft" | "published" | "archived";
export type AvailabilityStatus = "available" | "limited" | "out_of_stock" | "on_request";

export interface CatalogProductRecord {
  id: string;
  storeId: string;
  categoryId: string | null;
  internalCode: string;
  manufacturerCode: string | null;
  slug: string;
  name: string;
  brand: string | null;
  description: string | null;
  applicationNote: string | null;
  priceCents: number | null;
  publicationStatus: PublicationStatus;
  availabilityStatus: AvailabilityStatus;
}
