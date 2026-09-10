import Link from "next/link";
import { ArrowRight, Tag } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { catalogProducts } from "@/lib/catalog";

export const metadata = { title: "Peças em liquidação em Jacupiranga | Auto Peças Martins", description: "Consulte peças selecionadas do estoque da Auto Peças Martins e confirme a aplicação pelo WhatsApp." };

export default function LiquidationsPage() {
  return <main id="conteudo"><SiteHeader /><section className="inner-hero sale-hero"><div className="container"><span className="hero-icon"><Tag size={28} /></span><p className="eyebrow">OPORTUNIDADES DO ESTOQUE</p><h1>Peças selecionadas<br />para aproveitar.</h1><p>Valores de referência do lote. Preço, aplicação e disponibilidade são confirmados pela equipe antes da venda.</p></div></section><section className="section"><div className="container"><div className="notice"><strong>Encontrou uma peça para o seu carro?</strong><span>Abra o produto e envie o código pelo WhatsApp. A equipe confere tudo com você.</span></div><div className="product-grid">{catalogProducts.slice(0, 12).map((product) => <ProductCard key={product.slug} product={product} />)}</div><div className="center-action"><Link href="/catalogo" className="button button-secondary">Ver todas as peças <ArrowRight size={18} /></Link></div></div></section><SiteFooter /></main>;
}
