import Link from "next/link";
import { ArrowLeft, Tag } from "@/components/icons";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PromotionsManager } from "@/components/promotions-manager";
import type { AdminPromotionProduct } from "@/types/admin-catalog";

export default async function PromotionsPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_list_promotions");
  return <main className="admin-content"><Link href="/admin" className="back-link"><ArrowLeft size={17} /> Voltar ao início</Link><div className="admin-heading"><div><p>DESTAQUES DO SITE</p><h1>Promoções e banners</h1><span className="admin-heading-note">Escolha um produto, o preço e o período da oferta.</span></div><span className="heading-icon"><Tag size={25} /></span></div>{error ? <div className="admin-notice error">Não foi possível carregar as promoções.</div> : <PromotionsManager products={(data ?? []) as AdminPromotionProduct[]} />}</main>;
}
