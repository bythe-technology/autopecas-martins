import type { MetadataRoute } from "next";
import { getPublicCatalogPage } from "@/lib/catalog-db";
import { siteUrl } from "@/lib/seo";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/catalogo", "/pecas", "/liquidacoes", "/oficinas-e-frotas", "/contato"];
  const firstPage = await getPublicCatalogPage({ limit: 48 });
  const offsets = Array.from(
    { length: Math.ceil(firstPage.total / 48) },
    (_, index) => index * 48,
  ).slice(1);
  const remainingPages = await Promise.all(offsets.map((offset) => getPublicCatalogPage({ limit: 48, offset })));
  const products = [...new Map(
    [firstPage, ...remainingPages].flatMap((page) => page.products).map((product) => [product.slug, product]),
  ).values()];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : .8 })),
    ...products.map((product) => ({ url: `${siteUrl}/produto/${product.slug}`, changeFrequency: "weekly" as const, priority: .7 })),
  ];
}
