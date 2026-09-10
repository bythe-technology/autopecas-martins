import Link from "next/link";
import { CatalogView } from "@/components/catalog-view";
import { ArrowRight } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleFinder } from "@/components/vehicle-finder";
import { getPublicCatalog } from "@/lib/catalog-db";

export const metadata = { title: "Catálogo de peças | Auto Peças Martins" };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ categoria?: string; busca?: string; marca?: string; modelo?: string; ano?: string }> }) { const [{ categoria, busca, marca, modelo, ano }, products] = await Promise.all([searchParams, getPublicCatalog({ limit: 60 })]); return <main id="conteudo"><SiteHeader /><section className="catalog-hero"><div className="container catalog-hero-grid"><div><p className="eyebrow">LOTES SELECIONADOS</p><h1>Peças em estoque<br /><em>para o seu veículo.</em></h1><p>Busque pelo nome, código ou carro. Antes de comprar, nossa equipe confirma aplicação, preço e disponibilidade.</p><Link href="/contato" className="text-link">Não encontrou? Consulte alternativas <ArrowRight size={18} /></Link></div><VehicleFinder compact /></div></section><section className="section"><div className="container"><CatalogView products={products} initialCategory={categoria} initialQuery={busca} vehicle={{ make: marca, model: modelo, year: ano }} /></div></section><SiteFooter /></main>; }
