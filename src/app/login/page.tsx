"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
    if (signInError) { setError("E-mail ou senha incorretos."); setLoading(false); return; }
    window.location.assign("/admin");
  }

  return <main className="login-page"><section className="login-card"><Image src="/icon.png" alt="Auto Peças Martins" width={82} height={82} priority /><p className="eyebrow">ÁREA RESTRITA</p><h1>Entrar no painel</h1><p>Acesse para cadastrar peças, fotos, preços e compatibilidades.</p><form onSubmit={submit}><label><span>E-mail</span><input name="email" type="email" autoComplete="username" required /></label><label><span>Senha</span><input name="password" type="password" autoComplete="current-password" required minLength={12} /></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={loading}>{loading ? "Entrando…" : "Entrar com segurança"}</button></form><Link href="/">← Voltar ao site</Link></section></main>;
}
