import Image from "next/image";
import { Clock, Package, ShieldCheck, Wrench } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Autopeças para oficinas e frotas no Vale do Ribeira", description: "Atendimento comercial e consulta de peças para oficinas mecânicas e frotas de Jacupiranga e do Vale do Ribeira, com resposta direta pelo WhatsApp.", path: "/oficinas-e-frotas" });

export default function BusinessPage() {
  return <main id="conteudo"><SiteHeader /><section className="business-hero"><div className="container business-grid"><div><p className="eyebrow">ATENDIMENTO PROFISSIONAL</p><h1>Uma parceira local<br />para sua oficina.</h1><p>Envie a lista de peças, códigos ou dados dos veículos. Nossa equipe consulta o estoque e organiza a resposta pelo WhatsApp.</p><WhatsAppLink message="Olá! Represento uma oficina ou frota e gostaria de consultar peças com a Auto Peças Martins." label="Falar com atendimento comercial" /></div><div className="business-image"><Image src="/images/oficina-editorial-apm.png" alt="Balcão e estoque de peças da Auto Peças Martins" fill priority sizes="(max-width: 850px) 100vw, 50vw" /></div></div></section><section className="section"><div className="container"><div className="section-heading"><div><p className="eyebrow">COMO FUNCIONA</p><h2>Consulta simples, resposta direta.</h2></div></div><div className="process-grid"><article><span>01</span><Package /><h3>Envie sua necessidade</h3><p>Informe a peça, o código ou os dados do veículo.</p></article><article><span>02</span><ShieldCheck /><h3>Conferimos a aplicação</h3><p>A equipe verifica as informações e a disponibilidade.</p></article><article><span>03</span><Clock /><h3>Combine a retirada</h3><p>Você recebe a resposta e acerta os próximos passos.</p></article></div></div></section><section className="professional-cta"><div className="container"><Wrench size={34} /><div><p className="eyebrow">VALE DO RIBEIRA</p><h2>Precisa consultar vários itens?</h2><p>Envie sua lista pelo WhatsApp e identifique sua oficina ou frota.</p></div><WhatsAppLink message="Olá! Tenho uma lista de peças para consultar para minha oficina/frota." label="Enviar minha lista" className="button button-light" /></div></section><SiteFooter /></main>;
}

