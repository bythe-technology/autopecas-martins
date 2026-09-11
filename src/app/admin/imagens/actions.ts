"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function saveProductImage(formData: FormData) { const productId = String(formData.get("product_id") ?? ""); const url = String(formData.get("image_url") ?? "").trim(); if (!productId || !/^https?:\/\/[^\s]+$/i.test(url)) return; const supabase = await createSupabaseServerClient(); const { error } = await supabase.rpc("admin_save_external_product_image", { target_product_id: productId, target_image_url: url }); if (error) throw new Error("Não foi possível salvar a URL da imagem."); revalidatePath("/admin/imagens"); }

export async function uploadProductImage(formData: FormData) {
  const productId=String(formData.get("product_id")??"");
  const photo=formData.get("photo");
  if(!productId||!(photo instanceof File)||photo.size===0) return;
  const allowed=new Set(["image/jpeg","image/png","image/webp"]);
  if(!allowed.has(photo.type)||photo.size>8*1024*1024) throw new Error("Envie uma foto JPG, PNG ou WebP de até 8 MB.");
  const bytes=new Uint8Array(await photo.arrayBuffer());
  const validJpeg=bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
  const validPng=bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47;
  const validWebp=String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";
  if(!(validJpeg||validPng||validWebp)) throw new Error("O arquivo selecionado não é uma imagem válida.");
  const supabase=await createSupabaseServerClient();
  const {data:targets,error:targetError}=await supabase.rpc("admin_product_image_upload_target",{target_product_id:productId});
  const storeId=targets?.[0]?.store_id;
  if(targetError||!storeId) throw new Error("Você não tem permissão para alterar esta peça.");
  const extension=photo.type==="image/png"?"png":photo.type==="image/webp"?"webp":"jpg";
  const path=`${storeId}/${productId}/${crypto.randomUUID()}.${extension}`;
  const {error:uploadError}=await supabase.storage.from("catalog-products").upload(path,bytes,{contentType:photo.type,upsert:false});
  if(uploadError) throw new Error("Não foi possível enviar a foto. Tente novamente.");
  const {data:{publicUrl}}=supabase.storage.from("catalog-products").getPublicUrl(path);
  const {error:saveError}=await supabase.rpc("admin_save_external_product_image",{target_product_id:productId,target_image_url:publicUrl});
  if(saveError) { await supabase.storage.from("catalog-products").remove([path]); throw new Error("A foto foi enviada, mas não pôde ser vinculada à peça."); }
  revalidatePath("/admin/imagens"); revalidatePath("/admin/imagens/revisar");
}
