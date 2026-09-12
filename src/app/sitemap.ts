import type { MetadataRoute } from "next";
import { getPublicCatalog } from "@/lib/catalog-db";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/catalogo", "/liquidacoes", "/oficinas-e-frotas", "/contato"];
  const batches = await Promise.all([0, 200, 400, 600].map((offset) => getPublicCatalog({ limit: 200, offset })));
  const products = [...new Map(batches.flat().map((product) => [product.slug, product])).values()];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : .8 })),
    ...products.map((product) => ({ url: `${siteUrl}/produto/${product.slug}`, changeFrequency: "weekly" as const, priority: .7 })),
  ];
}
