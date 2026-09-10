import Link from "next/link";
import { CatalogView } from "@/components/catalog-view";
import { ArrowRight } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Catálogo de peças | Auto Peças Martins" };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) { const { categoria } = await searchParams; return <main><SiteHeader /><section className="catalog-hero"><div className="container"><p className="eyebrow">LOTES SELECIONADOS</p><h1>Peças em estoque<br /><em>para o seu veículo.</em></h1><p>Consulte código, aplicação e disponibilidade com nossa equipe antes de finalizar.</p><Link href="/#contato" className="text-link">Não encontrou? Consulte alternativas <ArrowRight size={18} /></Link></div></section><section className="section"><div className="container"><CatalogView initialCategory={categoria} /></div></section></main>; }
