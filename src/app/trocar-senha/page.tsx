"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirmation = String(form.get("confirmation"));
    if (password.length < 14 || password !== confirmation) { setError("Use ao menos 14 caracteres e repita a mesma senha."); setLoading(false); return; }
    const supabase = createSupabaseBrowserClient();
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) { setError("Não foi possível alterar a senha. Tente novamente."); setLoading(false); return; }
    const { data: memberships, error: membershipError } = await supabase.schema("catalog").from("store_memberships").select("store_id").eq("active", true).limit(1);
    const storeId = memberships?.[0]?.store_id;
    if (membershipError || !storeId) { setError("Seu acesso à loja não foi localizado."); setLoading(false); return; }
    const { error: completionError } = await supabase.schema("catalog").rpc("complete_password_change", { target_store_id: storeId });
    if (completionError) { setError("A senha mudou, mas não foi possível concluir a ativação. Entre novamente."); setLoading(false); return; }
    window.location.assign("/admin");
  }

  return <main className="login-page"><section className="login-card"><p className="eyebrow">PRIMEIRO ACESSO</p><h1>Crie sua senha pessoal</h1><p>Troque a senha temporária antes de acessar o painel.</p><form onSubmit={submit}><label><span>Nova senha</span><input name="password" type="password" autoComplete="new-password" minLength={14} required /></label><label><span>Repita a nova senha</span><input name="confirmation" type="password" autoComplete="new-password" minLength={14} required /></label><small>Use pelo menos 14 caracteres, misturando palavras, números e símbolos.</small>{error && <p className="login-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={loading}>{loading ? "Protegendo acesso…" : "Salvar nova senha"}</button></form></section></main>;
}
