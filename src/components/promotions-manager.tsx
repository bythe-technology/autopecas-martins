"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatPrice } from "@/lib/catalog";
import type { AdminPromotionProduct } from "@/types/admin-catalog";

export function PromotionsManager({ products }: { products: AdminPromotionProduct[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const cents = Math.round(Number(String(form.get("price")).replace(",", ".")) * 100);
    const { error } = await createSupabaseBrowserClient().rpc("admin_set_promotion", { target_product_id: String(form.get("product")), promo_price_cents: cents, promo_starts_at: new Date(String(form.get("starts"))).toISOString(), promo_ends_at: new Date(String(form.get("ends"))).toISOString() });
    setBusy(false); setMessage(error ? "Não foi possível salvar. Confira os dados." : "Promoção salva com sucesso."); if (!error) router.refresh();
  }
  async function remove(productId: string) { setBusy(true); const { error } = await createSupabaseBrowserClient().rpc("admin_remove_promotion", { target_product_id: productId }); setBusy(false); setMessage(error ? "Não foi possível remover." : "Promoção removida."); if (!error) router.refresh(); }
  const active = products.filter((item) => item.promotional_price_cents);
  return <div className="promotion-admin-grid"><form className="form-card promotion-form" onSubmit={save}><h2>Criar promoção</h2><p>O produto precisa estar publicado.</p><label><span>Produto</span><select name="product" required defaultValue=""><option value="" disabled>Selecione uma peça</option>{products.map((item) => <option value={item.product_id} key={item.product_id}>{item.product_name}</option>)}</select></label><label><span>Preço promocional</span><input name="price" inputMode="decimal" placeholder="Ex.: 99,90" required /></label><div className="promotion-dates"><label><span>Começa em</span><input name="starts" type="datetime-local" required /></label><label><span>Termina em</span><input name="ends" type="datetime-local" required /></label></div><button className="button button-primary" disabled={busy}>{busy ? "Salvando…" : "Ativar promoção"}</button>{message && <p className="form-feedback" role="status">{message}</p>}</form><section className="admin-products promotion-list"><div className="admin-section-title"><div><h2>Promoções ativas</h2><p>{active.length} destaque(s) configurado(s).</p></div></div>{active.length === 0 ? <div className="admin-empty"><strong>Nenhuma promoção ativa</strong><p>Use o formulário para criar o primeiro destaque.</p></div> : active.map((item) => <article className="promotion-row" key={item.product_id}><div><strong>{item.product_name}</strong><small>{item.regular_price_cents ? `De ${formatPrice(item.regular_price_cents)} por ` : ""}{formatPrice(item.promotional_price_cents!)}</small></div><button type="button" disabled={busy} onClick={() => remove(item.product_id)}>Remover</button></article>)}</section></div>;
}
