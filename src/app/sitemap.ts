import type { MetadataRoute } from "next";
import { catalogProducts } from "@/lib/catalog";

const baseUrl = "https://autopecasmartins.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/catalogo", "/liquidacoes", "/oficinas-e-frotas", "/contato"];
  return [...pages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : .8 })), ...catalogProducts.map((product) => ({ url: `${baseUrl}/produto/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .7 }))];
}
