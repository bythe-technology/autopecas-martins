import Link from "next/link";
import { CatalogView } from "@/components/catalog-view";
import { ArrowRight } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleFinder } from "@/components/vehicle-finder";
import { getPublicCatalog, getStockVehicleOptions } from "@/lib/catalog-db";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Catálogo de autopeças em Jacupiranga", description: "Pesquise peças automotivas em estoque por nome, código, marca, modelo e ano do veículo. Consulte a Auto Peças Martins em Jacupiranga pelo WhatsApp.", path: "/catalogo" });

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ categoria?: string; busca?: string; marca?: string; modelo?: string; ano?: string }> }) { const params=await searchParams; const {categoria,busca,marca,modelo,ano}=params; const [products,vehicleOptions]=await Promise.all([getPublicCatalog({limit:200,make:marca,model:modelo,year:ano}),getStockVehicleOptions()]); return <main id="conteudo"><SiteHeader /><section className="catalog-hero"><div className="container catalog-hero-grid"><div><p className="eyebrow">LOTES SELECIONADOS</p><h1>Peças em estoque<br /><em>para o seu veículo.</em></h1><p>Busque pelo nome, código ou carro. Antes de comprar, nossa equipe confirma aplicação, preço e disponibilidade.</p><Link href="/contato" className="text-link">Não encontrou? Consulte alternativas <ArrowRight size={18} /></Link></div><VehicleFinder compact options={vehicleOptions} /></div></section><section className="section"><div className="container"><CatalogView products={products} initialCategory={categoria} initialQuery={busca} vehicle={{ make: marca, model: modelo, year: ano }} /></div></section><SiteFooter /></main>; }
