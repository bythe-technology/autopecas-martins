import Link from "next/link";
import { MessageCircle, Pin } from "./icons";
import { store } from "@/lib/store";
import { whatsappUrl } from "./whatsapp-link";

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid"><div><strong>Auto Peças Martins</strong><p>Peças, oficina e atendimento perto de você em Jacupiranga.</p></div><div><span className="footer-label">Navegue</span><Link href="/catalogo">Catálogo</Link><Link href="/liquidacoes">Liquidações</Link><Link href="/oficinas-e-frotas">Oficinas e frotas</Link></div><div><span className="footer-label">Atendimento</span><a href={whatsappUrl("Olá! Vim pelo site da Auto Peças Martins.")} target="_blank" rel="noreferrer"><MessageCircle size={17} /> {store.phoneDisplay}</a><Link href="/contato"><Pin size={17} /> {store.city}, {store.state}</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Auto Peças Martins</span><Link href="/privacidade">Privacidade</Link></div></footer>;
}

