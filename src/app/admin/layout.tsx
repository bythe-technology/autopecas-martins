import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Painel | Auto Peças Martins", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: membership } = await supabase.schema("catalog").from("store_memberships").select("store_id, role, active, must_change_password").eq("user_id", user.id).eq("active", true).limit(1).maybeSingle();
  if (!membership) redirect("/login?erro=sem-acesso");
  if (membership.must_change_password) redirect("/trocar-senha");
  return <AdminShell userEmail={user.email ?? "Usuário autorizado"}>{children}</AdminShell>;
}
