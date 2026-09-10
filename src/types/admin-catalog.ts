export type AdminProduct = {
  id: string;
  name: string;
  internal_code: string;
  manufacturer_code: string | null;
  brand: string | null;
  regular_price_cents: number | null;
  publication_status: "draft" | "published" | "archived";
  availability_status: "available" | "limited" | "out_of_stock" | "on_request";
  updated_at: string;
  total_count?: number;
};

export type AdminPromotionProduct = {
  product_id: string;
  product_name: string;
  regular_price_cents: number | null;
  promotional_price_cents: number | null;
  starts_at: string | null;
  ends_at: string | null;
};
