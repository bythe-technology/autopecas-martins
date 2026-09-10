"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function saveProductImage(formData: FormData) { const productId = String(formData.get("product_id") ?? ""); const url = String(formData.get("image_url") ?? "").trim(); if (!productId || !/^https?:\/\/[^\s]+$/i.test(url)) return; const supabase = await createSupabaseServerClient(); const { data: memberships } = await supabase.rpc("get_my_store_membership"); const storeId = memberships?.[0]?.store_id; if (!storeId) return; await supabase.from("product_external_images").upsert({ product_id: productId, store_id: storeId, image_url: url, updated_at: new Date().toISOString() }); revalidatePath("/admin/imagens"); }
