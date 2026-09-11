"use client";
import {useRef,useState} from "react";
import {Camera,Package} from "./icons";
import {saveProductImage,uploadProductImage} from "@/app/admin/imagens/actions";

type Product={id:string;name:string;internal_code:string;brand:string|null};
export function AdminProductImageCard({product}:{product:Product}){
 const camera=useRef<HTMLInputElement>(null); const gallery=useRef<HTMLInputElement>(null); const [fileName,setFileName]=useState("");
 return <article className="mobile-image-card"><div className="mobile-image-product"><span><Package size={22}/></span><div><strong>{product.name}</strong><small>{product.internal_code}{product.brand?` · ${product.brand}`:""}</small></div></div>
 <form action={uploadProductImage} className="mobile-photo-form"><input type="hidden" name="product_id" value={product.id}/><input ref={camera} className="sr-only" name="photo" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>setFileName(e.target.files?.[0]?.name??"")}/><input ref={gallery} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const file=e.target.files?.[0];if(file&&camera.current){const dt=new DataTransfer();dt.items.add(file);camera.current.files=dt.files;setFileName(file.name)}}}/><div className="mobile-photo-actions"><button type="button" onClick={()=>camera.current?.click()}><Camera size={22}/><span><strong>Tirar foto</strong><small>Usar a câmera</small></span></button><button type="button" onClick={()=>gallery.current?.click()}><Package size={22}/><span><strong>Galeria</strong><small>Escolher foto</small></span></button></div>{fileName&&<div className="selected-photo"><span>{fileName}</span><button className="button button-primary">Enviar foto</button></div>}</form>
 <details className="image-url-option"><summary>Ou colar um link da imagem</summary><form action={saveProductImage}><input type="hidden" name="product_id" value={product.id}/><input name="image_url" type="url" inputMode="url" placeholder="https://.../imagem.jpg" required/><button className="button button-secondary">Salvar link</button></form></details></article>
}
