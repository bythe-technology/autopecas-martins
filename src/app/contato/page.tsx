import Image from "next/image";
import { Clock, MessageCircle, Pin } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { whatsappUrl } from "@/components/whatsapp-link";
import { store } from "@/lib/store";

export const metadata = { title: "Contato e localização | Auto Peças Martins", description: "Fale com a Auto Peças Martins em Jacupiranga pelo WhatsApp e consulte peças e serviços." };

export default function ContactPage() {
  return <main id="conteudo"><SiteHeader /><section className="inner-hero"><div className="container"><p className="eyebrow">CONTATO</p><h1>Estamos em<br />Jacupiranga.</h1><p>Fale com a equipe antes de sair de casa para confirmar a peça, a aplicação e a disponibilidade.</p></div></section><section className="section"><div className="container contact-page-grid"><div className="contact-cards"><a href={whatsappUrl("Olá! Vim pelo site e gostaria de falar com a Auto Peças Martins.")} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small><strong>{store.phoneDisplay}</strong></span></a><div><MessageCircle /><span><small>Telefone fixo</small><strong>{store.landlineDisplay}</strong></span></div><div><Pin /><span><small>Endereço</small><strong>{store.address}<br />{store.city} · {store.state}</strong></span></div><div><Clock /><span><small>Horário</small><strong>Confirme o horário pelo WhatsApp</strong></span></div></div><div className="contact-photo"><Image src="/images/fachada-editorial-apm.png" alt="Fachada da Auto Peças Martins" fill sizes="(max-width: 850px) 100vw, 50vw" /></div></div></section><SiteFooter /></main>;
}

