import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { ArrowRight, ChevronRight, Package, Search, Wrench } from "@/components/icons";
import { catalogProducts, categories } from "@/lib/catalog";

const featured = catalogProducts.slice(0, 4);
const services = ["Troca de óleo", "Alinhamento 3D", "Balanceamento", "Suspensão", "Freios"];

export default function HomePage() {
  return <main><SiteHeader /><section className="hero"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">DESDE 1983 EM JACUPIRANGA</p><h1>Peça certa.<br /><em>Atendimento de verdade.</em></h1><p className="hero-text">Encontre peças para o seu carro e conte com nossa equipe para cuidar da manutenção. Consulte pelo WhatsApp.</p><div className="hero-actions"><Link href="/catalogo" className="button button-primary">Ver peças do lote<ArrowRight size={18} /></Link><a href="#servicos" className="button button-ghost">Serviços de oficina</a></div><div className="hero-trust"><span><strong>+40 anos</strong> de experiência</span><span><strong>Estoque local</strong> para retirada</span></div></div><div className="hero-image"><Image src="/images/fachada-autopecas-martins.png" alt="Fachada da Auto Peças Martins em Jacupiranga" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><div className="hero-stamp"><Package size={22} /><span>PEÇAS E<br />SERVIÇOS</span></div></div></div></section>

    <section className="quick-search"><div className="container quick-search-inner"><div><p className="eyebrow">ENCONTRE NO ESTOQUE</p><h2>Qual peça você procura?</h2></div><Link className="search-cta" href="/catalogo"><Search size={20} /><span>Nome, código ou veículo</span><ChevronRight size={20} /></Link></div></section>

    <section className="catalog-preview section"><div className="container"><div className="section-heading"><div><p className="eyebrow">LOTES EM DESTAQUE</p><h2>Peças para aproveitar agora.</h2></div><Link href="/catalogo" className="text-link">Ver catálogo completo <ArrowRight size={18} /></Link></div><div className="category-list">{categories.map((category) => <Link key={category} href={`/catalogo?categoria=${encodeURIComponent(category)}`}><Package size={20} />{category}<ChevronRight size={17} /></Link>)}</div><div className="product-grid">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div></div></section>

    <section className="services section" id="servicos"><div className="container services-grid"><div className="services-copy"><p className="eyebrow">OFICINA AUTO PEÇAS MARTINS</p><h2>Seu carro bem cuidado, com quem entende.</h2><p>Além das peças, nossa equipe atende serviços de manutenção para você sair com tudo resolvido em um só lugar.</p><WhatsAppLink message="Olá! Vi os serviços de oficina no site da Auto Peças Martins. Gostaria de um orçamento para meu veículo e de saber as condições de parcelamento." label="Pedir orçamento da oficina" /></div><div className="services-content"><div className="installment"><span>PARCELE SEU ORÇAMENTO DE OFICINA</span><strong>em até 10x<br />sem juros</strong><small>no cartão · consulte condições com a equipe</small></div><div className="service-list">{services.map((service, index) => <a key={service} href="#contato"><span>0{index + 1}</span>{service}<ArrowRight size={18} /></a>)}</div></div></div></section>

    <section className="story section" id="oficina"><div className="container story-grid"><div className="story-image"><Image src="/images/estoque-autopecas-martins.png" alt="Estoque de peças da Auto Peças Martins" fill sizes="(max-width: 800px) 100vw, 45vw" /></div><div><p className="eyebrow">AUTO PEÇAS MARTINS</p><h2>Estoque, experiência e atendimento perto de você.</h2><p>Em Jacupiranga, reunimos peças de diversas linhas e serviços para o seu veículo. Se tiver dúvida sobre aplicação ou disponibilidade, nossa equipe confirma com você pelo WhatsApp.</p><Link href="/catalogo" className="text-link">Explorar peças disponíveis <ArrowRight size={18} /></Link></div></div></section>

    <section className="contact" id="contato"><div className="container contact-inner"><div><p className="eyebrow">VAMOS CONVERSAR</p><h2>Precisa de uma peça ou de um orçamento?</h2></div><WhatsAppLink message="Olá! Quero consultar uma peça ou serviço da Auto Peças Martins." label="Chamar no WhatsApp" className="button button-light" /></div></section>
    <footer><div className="container footer-inner"><span>Auto Peças Martins · Jacupiranga, SP</span><span>Catálogo de lançamento · preços e estoque sujeitos à confirmação</span></div></footer>
  </main>;
}
