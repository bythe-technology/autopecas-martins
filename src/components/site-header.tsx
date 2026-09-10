"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Close, Menu, WhatsAppIcon } from "./icons";
import { whatsappUrl } from "./whatsapp-link";

const links = [
  { href: "/catalogo", label: "Peças" },
  { href: "/liquidacoes", label: "Liquidações" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/oficinas-e-frotas", label: "Oficinas e frotas" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const contactUrl = whatsappUrl("Olá! Vim pelo site da Auto Peças Martins e preciso de ajuda para encontrar uma peça.");

  return <>
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Auto Peças Martins, página inicial">
          <Image src="/icon.png" alt="" width={68} height={68} priority />
          <span><strong>AUTO PEÇAS</strong><small>MARTINS · JACUPIRANGA</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">{links.slice(0, 4).map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
        <a className="header-whatsapp" href={contactUrl} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> Falar no WhatsApp</a>
        <button className="menu-toggle" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <Close size={24} /> : <Menu size={24} />}</button>
      </div>
      {open && <nav className="mobile-nav" aria-label="Navegação móvel">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<a href={contactUrl} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> Falar no WhatsApp</a></nav>}
    </header>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
  </>;
}
