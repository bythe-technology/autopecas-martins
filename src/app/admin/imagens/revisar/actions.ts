"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function reviewProductImage(formData: FormData) { const productId=String(formData.get("product_id")??""); const status=String(formData.get("status")??""); if(!productId||!["approved","rejected"].includes(status)) return; const {error}=await (await createSupabaseServerClient()).rpc("admin_review_product_image",{target_product_id:productId,target_status:status}); if(error) throw new Error("Não foi possível revisar a imagem."); revalidatePath("/admin/imagens/revisar"); }
