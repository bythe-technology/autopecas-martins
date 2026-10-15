import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { getPublicCatalogPage } from "@/lib/catalog-db";
import { pageMetadata, serializeJsonLd, siteUrl } from "@/lib/seo";

type Props = { searchParams: Promise<{ pagina?: string }> };
const PAGE_SIZE = 24;
function pageNumber(value?: string) {
  return value && /^[1-9]\d{0,3}$/.test(value) ? Number(value) : 1;
}
function pagePath(page: number) { return page === 1 ? "/pecas" : `/pecas?pagina=${page}`; }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = pageNumber((await searchParams).pagina);
  return pageMetadata({ title: `Peças automotivas em Jacupiranga${page > 1 ? ` — página ${page}` : ""}`, description: "Explore peças em estoque na Auto Peças Martins em Jacupiranga: iluminação, retrovisores, calhas, borrachas e molduras. Confirme aplicação pelo WhatsApp.", path: pagePath(page) });
}

export default async function PartsIndex({ searchParams }: Props) {
  const page = pageNumber((await searchParams).pagina);
  const result = await getPublicCatalogPage({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  if (page > 1 && result.products.length === 0) notFound();
  const pages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Peças automotivas em Jacupiranga", url: `${siteUrl}${pagePath(page)}`, mainEntity: { "@type": "ItemList", itemListElement: result.products.map((product, index) => ({ "@type": "ListItem", position: (page - 1) * PAGE_SIZE + index + 1, url: `${siteUrl}/produto/${product.slug}`, name: product.name })) } };
  return <main id="conteudo"><SiteHeader/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}/><section className="inner-hero"><div className="container"><p className="eyebrow">AUTO PEÇAS MARTINS · JACUPIRANGA</p><h1>Conheça as peças<br/>do nosso estoque.</h1><p>Encontre iluminação, retrovisores, calhas, borrachas e outros componentes. Confirme versão, preço e disponibilidade com a equipe antes de comprar.</p><Link className="button button-primary" href="/catalogo">Buscar por marca, modelo e ano</Link></div></section><section className="section"><div className="container"><p className="catalog-count">{result.total} peças anunciadas · Página {page} de {pages}</p><div className="product-grid">{result.products.map(product => <ProductCard key={product.slug} product={product}/>)}</div><nav className="parts-pagination" aria-label="Páginas do estoque">{Array.from({ length: pages }, (_, index) => index + 1).map(number => <Link key={number} href={pagePath(number)} prefetch={false} aria-current={page === number ? "page" : undefined} aria-label={`Página ${number}`}>{number}</Link>)}</nav></div></section><SiteFooter/></main>;
}
