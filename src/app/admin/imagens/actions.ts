"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function saveProductImage(formData: FormData) { const productId = String(formData.get("product_id") ?? ""); const url = String(formData.get("image_url") ?? "").trim(); if (!productId || !/^https?:\/\/[^\s]+$/i.test(url)) return; const supabase = await createSupabaseServerClient(); const { error } = await supabase.rpc("admin_save_external_product_image", { target_product_id: productId, target_image_url: url }); if (error) throw new Error("Não foi possível salvar a URL da imagem."); revalidatePath("/admin/imagens"); }
