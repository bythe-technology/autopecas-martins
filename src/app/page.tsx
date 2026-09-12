import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VehicleFinder } from "@/components/vehicle-finder";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ArrowRight, Car, ChevronRight, Clock, Package, ShieldCheck } from "@/components/icons";
import { categories } from "@/lib/catalog";
import { getPublicCatalog, getStockVehicleOptions } from "@/lib/catalog-db";
import { services, store } from "@/lib/store";
import { absoluteUrl, pageMetadata, serializeJsonLd, siteUrl } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Auto Peças Martins em Jacupiranga | Peças e Oficina",
    description: "Encontre peças automotivas, ofertas de estoque e serviços de oficina na Auto Peças Martins em Jacupiranga, SP. Atendimento para todo o Vale do Ribeira pelo WhatsApp.",
    path: "/",
  }),
  title: { absolute: "Auto Peças Martins em Jacupiranga | Peças e Oficina" },
};

export default async function HomePage() {
  const [featured, vehicleOptions] = await Promise.all([getPublicCatalog({ limit: 12 }), getStockVehicleOptions()]);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: store.name,
        alternateName: [store.shortName, "APM Auto Peças Martins"],
        inLanguage: "pt-BR",
      },
      {
        "@type": ["AutoPartsStore", "AutomotiveBusiness"],
        "@id": `${siteUrl}/#loja`,
        url: siteUrl,
        name: store.name,
        legalName: "Auto Peças Martins Ltda",
        image: absoluteUrl("/images/fachada-editorial-apm.png"),
        logo: absoluteUrl("/images/logo-apm-clean.png"),
        telephone: [store.phoneDisplay, store.landlineDisplay],
        taxID: store.cnpj,
        foundingDate: store.founded,
        address: { "@type": "PostalAddress", streetAddress: store.streetAddress, addressLocality: store.city, addressRegion: store.state, postalCode: store.postalCode, addressCountry: store.country },
        areaServed: [{ "@type": "City", name: store.city }, { "@type": "AdministrativeArea", name: store.region }],
        sameAs: [store.instagram],
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
          { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "12:00" },
        ],
      },
    ],
  };

  return <main id="conteudo">
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
    <section className="hero hero-full"><Image className="hero-full-image" src="/images/fachada-editorial-apm.png" alt="Fachada azul da Auto Peças Martins em Jacupiranga" fill priority sizes="100vw" /><div className="hero-overlay" /><div className="container hero-full-content"><div className="hero-copy"><p className="eyebrow">TRADIÇÃO EM JACUPIRANGA</p><h1>Peça certa.<br /><em>Atendimento de verdade.</em></h1><p className="hero-text">Peças para carros nacionais e importados, estoque local e uma equipe que ajuda você a confirmar a aplicação antes da compra.</p><div className="hero-actions"><Link href="/catalogo" className="button button-primary">Encontrar minha peça <ArrowRight size={18} /></Link><a href="#servicos" className="button button-ghost">Conhecer a oficina</a></div><div className="hero-trust"><span><strong>Experiência local</strong> em Jacupiranga</span><span><strong>Compra assistida</strong> pelo WhatsApp</span></div></div><div className="hero-stamp"><Package size={22} /><span>PEÇAS E SERVIÇOS<br />NO VALE DO RIBEIRA</span></div></div></section>
    <div className="promo-rail" aria-label="Destaques da loja"><div><span>QUEIMA DE ESTOQUE</span><i>•</i><span>PEÇAS COM PREÇOS ESPECIAIS</span><i>•</i><span>AVALIAÇÃO DE SUSPENSÃO</span><i>•</i><span>ATENDIMENTO PELO WHATSAPP</span><i>•</i><span>QUEIMA DE ESTOQUE</span><i>•</i><span>PEÇAS COM PREÇOS ESPECIAIS</span><i>•</i><span>AVALIAÇÃO DE SUSPENSÃO</span><i>•</i><span>ATENDIMENTO PELO WHATSAPP</span></div></div>
    <section className="finder-section"><div className="container"><VehicleFinder options={vehicleOptions} /></div></section>
    <section className="catalog-preview section"><div className="container"><div className="campaign-banner parts-campaign"><div><span>LOTE ESPECIAL · ENQUANTO DURAR O ESTOQUE</span><strong>Preços para fazer a peça sair da prateleira.</strong><p>Peças selecionadas com estoque local e atendimento para confirmar a aplicação.</p></div><Link href="/liquidacoes" className="button button-light">Ver oportunidades <ArrowRight size={18} /></Link></div><div className="section-heading"><div><p className="eyebrow">OPORTUNIDADES DO ESTOQUE</p><h2>Peças disponíveis agora.</h2></div><Link href="/catalogo" className="text-link">Ver catálogo completo <ArrowRight size={18} /></Link></div><div className="category-list">{categories.map((category) => <Link key={category} href={`/catalogo?categoria=${encodeURIComponent(category)}`}><Package size={20} />{category}<ChevronRight size={17} /></Link>)}</div><div className="product-grid">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div></div></section>
    <section className="services section" id="servicos"><div className="container services-intro"><div><p className="eyebrow">OFICINA AUTO PEÇAS MARTINS</p><h2>Seu carro bem cuidado,<br />do diagnóstico à peça.</h2></div><p>Resolva a manutenção com quem conhece o estoque e entende do seu veículo. Consulte as condições com a equipe.</p></div><div className="container service-showcase"><div className="service-photo"><Image src="/images/oficina-editorial-apm.png" alt="Interior ilustrativo da Auto Peças Martins com balcão e estoque de peças" fill sizes="(max-width: 850px) 100vw, 52vw" /><div className="service-photo-seal"><span>AGENDA DA OFICINA</span><strong>Consulte os horários disponíveis</strong></div></div><div className="service-panel"><div className="installment"><span>CONDIÇÃO ESPECIAL DA OFICINA</span><strong>em até 10x<br />sem juros</strong><small>no cartão · vagas e condições sujeitas à confirmação</small><a href={`https://wa.me/${store.whatsappE164}?text=${encodeURIComponent("Olá! Vi a condição da oficina no site e gostaria de consultar horários e orçamento.")}`} target="_blank" rel="noreferrer">Quero consultar agora <ArrowRight size={17} /></a></div><div className="service-list">{services.map((service, index) => <a key={service.name} href={`https://wa.me/${store.whatsappE164}?text=${encodeURIComponent(`Olá! Vi no site que vocês fazem ${service.name}. Gostaria de consultar um orçamento.`)}`} target="_blank" rel="noreferrer"><span>0{index + 1}</span><div><strong>{service.name}</strong><small>{service.description}</small></div><ArrowRight size={18} /></a>)}</div></div></div></section>
    <section className="trust-strip"><div className="container trust-grid"><div><ShieldCheck /><strong>Aplicação confirmada</strong><span>Conferimos os dados do seu veículo.</span></div><div><Package /><strong>Estoque local</strong><span>Retirada em Jacupiranga após confirmação.</span></div><div><Car /><strong>Peças e oficina</strong><span>Atendimento completo em um só lugar.</span></div><div><Clock /><strong>Resposta humana</strong><span>Fale diretamente com nossa equipe.</span></div></div></section>
    <section className="story section" id="oficina"><div className="container story-grid"><div className="story-image"><Image src="/images/estoque-autopecas-martins.png" alt="Corredor do estoque real da Auto Peças Martins em Jacupiranga" fill sizes="(max-width: 850px) 100vw, 45vw" /></div><div><p className="eyebrow">AUTOPEÇAS EM JACUPIRANGA DESDE 1971</p><h2>Um estoque construído ao longo de décadas.</h2><p>A Auto Peças Martins atende Jacupiranga e todo o Vale do Ribeira com peças para diferentes marcas e modelos, além de serviços de oficina. Se não encontrar no catálogo, conte o que precisa: nossa equipe consulta o estoque e procura uma alternativa.</p><WhatsAppLink message="Olá! Não encontrei a peça que preciso no catálogo. Podem verificar o estoque para mim? Meu veículo é [modelo/ano]." label="Consultar o estoque" /></div></div></section>
    <section className="contact"><div className="container contact-inner"><div><p className="eyebrow">FALE COM QUEM ENTENDE</p><h2>Conte qual é o seu carro.<br />A gente ajuda com a peça.</h2></div><WhatsAppLink message="Olá! Quero consultar uma peça ou serviço da Auto Peças Martins." label="Chamar no WhatsApp" className="button button-light" /></div></section>
    <SiteFooter />
  </main>;
}

