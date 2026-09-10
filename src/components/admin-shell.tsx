import Image from "next/image";
import Link from "next/link";
import { Package, Plus, Tag } from "./icons";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><Image src="/images/logo-apm-header-white.png" alt="" width={52} height={52} /><span><strong>Painel Martins</strong><small>Gestão do catálogo</small></span></Link><nav><Link href="/admin"><Package />Visão geral</Link><Link href="/admin/produtos/novo"><Plus />Adicionar peça</Link><Link href="/admin"><Tag />Promoções</Link></nav><div className="admin-user"><span>JM</span><div><strong>Jeany Martins</strong><small>Administradora</small></div></div></aside><div className="admin-main"><header className="admin-topbar"><div><small>AUTO PEÇAS MARTINS</small><strong>Painel de produtos</strong></div><Link href="/" target="_blank">Ver site</Link></header>{children}</div></div>;
}

