import Image from "next/image";
import Link from "next/link";
import { Clock, InstagramIcon, Pin, WhatsAppIcon } from "./icons";
import { store } from "@/lib/store";
import { whatsappUrl } from "./whatsapp-link";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name}, ${store.address}, ${store.city} - ${store.state}`)}`;

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-main">
      <div className="footer-about"><Link href="/" className="footer-brand"><Image src="/images/logo-apm-header-white.png" alt="" width={68} height={68} /><span><strong>Auto Peças Martins</strong><small>Peças e serviços automotivos</small></span></Link><p>Atendimento local, estoque diversificado e suporte para encontrar a peça certa para o seu veículo.</p><span className="company-document">AUTO PEÇAS MARTINS LTDA · CNPJ {store.cnpj}</span></div>
      <div className="footer-column"><span className="footer-label">Navegação</span><Link href="/catalogo">Catálogo de peças</Link><Link href="/liquidacoes">Liquidações</Link><Link href="/#servicos">Serviços de oficina</Link><Link href="/oficinas-e-frotas">Oficinas e frotas</Link><Link href="/contato">Contato e localização</Link></div>
      <div className="footer-column"><span className="footer-label">Fale conosco</span><a href={whatsappUrl("Olá! Vim pelo site da Auto Peças Martins.")} target="_blank" rel="noreferrer"><WhatsAppIcon size={20} /><span><small>WhatsApp</small>{store.phoneDisplay}</span></a><span className="social-pending" title="Aguardando confirmação do perfil oficial"><InstagramIcon size={20} /><span><small>Instagram</small>Perfil em confirmação</span></span><a href={mapsUrl} target="_blank" rel="noreferrer"><Pin size={18} /><span><small>Visite a loja</small>{store.address}<br />{store.city} · {store.state}</span></a></div>
      <div className="footer-column footer-hours-column"><span className="footer-label">Horário</span><div className="footer-hours"><Clock size={18} /><span>{store.hours.map((hour) => <small key={hour}>{hour}</small>)}<small>Feriados: consulte a equipe</small></span></div><a className="bythe-credit" href="https://bythe.tech" target="_blank" rel="noreferrer" aria-label="Site desenvolvido pela BYTHE Technology"><span>DESENVOLVIDO POR</span><Image src="/brand/bythe-wordmark-blue.svg" alt="BYTHE Technology" width={92} height={18} /></a></div>
    </div>
    <div className="container footer-meta"><span>© {new Date().getFullYear()} Auto Peças Martins. Todos os direitos reservados.</span><div><Link href="/privacidade">Política de privacidade</Link><span>Preços e estoque sujeitos à confirmação.</span></div></div>
  </footer>;
}
