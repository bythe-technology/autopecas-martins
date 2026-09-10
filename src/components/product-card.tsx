import Link from "next/link";
import { CatalogProduct, formatPrice } from "@/lib/catalog";
import { ArrowRight, Package } from "./icons";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return <article className="product-card"><div className="product-visual"><Package size={38} /><span>Foto em breve</span></div><div className="product-details"><div className="product-meta"><span>{product.category}</span><span className={product.availability === "Últimas unidades" ? "stock low" : "stock"}>{product.availability}</span></div><h3>{product.name}</h3><p className="application">{product.application}</p><div className="product-bottom"><div><small>Cód. {product.code}</small><strong>{formatPrice(product.priceCents)}</strong></div><Link href={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`} className="round-link"><ArrowRight /></Link></div></div></article>;
}
