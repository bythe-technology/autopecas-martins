import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ArrowRight, Package } from "@/components/icons";
import { ProductImage } from "@/components/product-image";
import { catalogProducts, formatPrice } from "@/lib/catalog";
import { getPublicProduct } from "@/lib/catalog-db";
import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return { title: "Peça não encontrada", robots: { index: false, follow: true } };
  const title = `${product.name} em Jacupiranga`;
  const description = `${product.application}. Consulte preço, compatibilidade e disponibilidade na Auto Peças Martins em Jacupiranga.`;
  const image = product.imageSrc ? absoluteUrl(product.imageSrc) : absoluteUrl("/images/logo-apm-clean.png");
  return {
    title,
    description,
    alternates: { canonical: `/produto/${slug}` },
    openGraph: { title, description, url: `/produto/${slug}`, type: "website", siteName, locale: "pt_BR", images: [{ url: image, alt: product.name }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) notFound();
  const productUrl = `${siteUrl}/produto/${slug}`;
  const image = product.imageSrc ? absoluteUrl(product.imageSrc) : undefined;
  const message = `Olá! Vi no site a peça ${product.name}, código ${product.code}, anunciada por ${formatPrice(product.priceCents)}. Meu veículo é [modelo/ano]. Gostaria de confirmar aplicação e disponibilidade.`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#produto`,
        url: productUrl,
        name: product.name,
        sku: product.code,
        category: product.category,
        brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
        description: product.description,
        image: image ? [image] : undefined,
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "BRL",
          price: (product.priceCents / 100).toFixed(2),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${siteUrl}/#loja` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Catálogo", item: `${siteUrl}/catalogo` },
          { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
        ],
      },
    ],
  };
  return <main id="conteudo"><SiteHeader /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><section className="section product-page"><div className="container"><Link href="/catalogo" className="breadcrumb">Catálogo <ArrowRight size={15} /> {product.category}</Link><div className="product-layout"><div className={`product-large-visual ${product.imageSrc ? "has-photo" : ""}`}><span className="lot-badge">LOTE APM1</span>{product.imageNote ? <span className="image-note">{product.imageNote}</span> : null}{product.imageSrc ? <ProductImage src={product.imageSrc} alt={`${product.name} para ${product.application}`} priority /> : <><Package size={72} /><span>Imagem em validação</span><small>A foto será adicionada após conferência do código e da aplicação.</small></>}</div><article className="product-summary"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-application">{product.application}</p><div className="price-block"><span>Preço de referência do lote</span><strong>{formatPrice(product.priceCents)}</strong><small>Preço, estoque e aplicação sujeitos à confirmação</small></div><WhatsAppLink message={message} label="Confirmar no WhatsApp" /><dl><div><dt>Código</dt><dd>{product.code}</dd></div><div><dt>Marca</dt><dd>{product.brand ?? "Não informada"}</dd></div><div><dt>Disponibilidade</dt><dd>{product.availability}</dd></div></dl><div className="compatibility-note"><strong>Confirme antes de comprar</strong><p>{product.description} Informe também modelo, ano e motorização do seu carro.</p></div></article></div></div></section><SiteFooter /></main>;
}
