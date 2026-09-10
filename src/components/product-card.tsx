import Image from "next/image";
import Link from "next/link";
import { CatalogProduct, formatPrice } from "@/lib/catalog";
import { ArrowRight, Package } from "./icons";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return <article className="product-card"><Link href={`/produto/${product.slug}`} className={`product-visual category-${product.category.toLowerCase().replaceAll(" ", "-").replaceAll("ç", "c").replaceAll("ã", "a")}`} aria-label={`Ver detalhes de ${product.name}`}><span className="lot-badge">LOTE APM1</span>{product.imageNote && <span className="image-note">{product.imageNote}</span>}{product.imageSrc ? <Image src={product.imageSrc} alt={product.name} fill sizes="(max-width: 520px) 100vw, (max-width: 850px) 50vw, 25vw" /> : <><Package size={42} /><small>Foto aguardando conferência</small></>}</Link><div className="product-details"><div className="product-meta"><span>{product.category}</span><span className={product.availability === "Últimas unidades" ? "stock low" : "stock"}>{product.availability}</span></div><h3><Link href={`/produto/${product.slug}`}>{product.name}</Link></h3><p className="application">{product.application}</p><div className="product-bottom"><div><small>Cód. {product.code}</small><strong>{formatPrice(product.priceCents)}</strong></div><Link href={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`} className="round-link"><ArrowRight /></Link></div></div></article>;
}
