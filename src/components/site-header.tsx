import Image from "next/image";
import Link from "next/link";
import { Pin } from "./icons";

export function SiteHeader() {
  return <header className="site-header"><div className="container header-inner">
    <Link href="/" className="brand" aria-label="Auto Peças Martins, página inicial"><Image src="/images/logo-apm-referencia.png" alt="Logotipo APM Auto Peças Martins" width={66} height={66} priority /><span><strong>AUTO PEÇAS</strong><small>MARTINS · JACUPIRANGA</small></span></Link>
    <nav aria-label="Navegação principal"><Link href="/catalogo">Peças</Link><a href="/#servicos">Serviços</a><a href="/#oficina">A oficina</a></nav>
    <a className="location" href="/#contato"><Pin size={18} /> Jacupiranga, SP</a>
  </div></header>;
}
