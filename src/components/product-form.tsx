"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronRight, Package } from "./icons";
import { categories } from "@/lib/catalog";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type VehicleOption = { codigo: string | number; nome: string };
type ImagePreview = { id: string; src: string; name: string };

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

async function fetchVehicleOptions(url: string, signal: AbortSignal): Promise<VehicleOption[]> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Falha ao carregar veículos");
  return response.json() as Promise<VehicleOption[]>;
}

export function ProductForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [brandCode, setBrandCode] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [yearCode, setYearCode] = useState("");
  const [brands, setBrands] = useState<VehicleOption[]>([]);
  const [models, setModels] = useState<VehicleOption[]>([]);
  const [years, setYears] = useState<VehicleOption[]>([]);
  const [vehicleError, setVehicleError] = useState("");
  const [name, setName] = useState("");
  const [manufacturerCode, setManufacturerCode] = useState("");
  const [partBrand, setPartBrand] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("available");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [checks, setChecks] = useState([false, false, false]);

  useEffect(() => {
    const controller = new AbortController();
    fetchVehicleOptions("/api/vehicles?resource=brands", controller.signal).then(setBrands).catch((error: Error) => {
      if (error.name !== "AbortError") setVehicleError("Não foi possível carregar a base FIPE agora.");
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setModels([]); setModelCode(""); setYears([]); setYearCode("");
    if (!brandCode) return;
    const controller = new AbortController();
    fetchVehicleOptions(`/api/vehicles?resource=models&brand=${brandCode}`, controller.signal).then(setModels).catch((error: Error) => {
      if (error.name !== "AbortError") setVehicleError("Não foi possível carregar os modelos.");
    });
    return () => controller.abort();
  }, [brandCode]);

  useEffect(() => {
    setYears([]); setYearCode("");
    if (!brandCode || !modelCode) return;
    const controller = new AbortController();
    fetchVehicleOptions(`/api/vehicles?resource=years&brand=${brandCode}&model=${modelCode}`, controller.signal).then(setYears).catch((error: Error) => {
      if (error.name !== "AbortError") setVehicleError("Não foi possível carregar os anos.");
    });
    return () => controller.abort();
  }, [brandCode, modelCode]);

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setImageError("");
    const validFiles = files.filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE).slice(0, MAX_IMAGES - images.length);
    if (validFiles.length !== files.length) setImageError("Algumas imagens foram ignoradas. Use JPG, PNG ou WebP de até 8 MB.");
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((current) => current.length < MAX_IMAGES ? [...current, { id: crypto.randomUUID(), src: String(reader.result), name: file.name }] : current);
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  }

  function addImageUrl() {
    setImageError("");
    try {
      const url = new URL(imageUrl);
      if (!/^https?:$/.test(url.protocol)) throw new Error();
      if (images.length >= MAX_IMAGES) return setImageError("O limite é de cinco fotos por produto.");
      setImages((current) => [...current, { id: crypto.randomUUID(), src: url.toString(), name: "Imagem da internet" }]);
      setImageUrl("");
    } catch { setImageError("Cole um endereço completo começando com http:// ou https://."); }
  }

  async function saveProduct(publish: boolean) {
    setSaveError("");
    const priceCents = Math.round(Number(price.replace(/[^0-9,.-]/g, "").replace(",", ".")) * 100);
    if (name.trim().length < 2 || !Number.isInteger(priceCents) || priceCents <= 0) return setSaveError("Preencha o nome e um preço válido antes de salvar.");
    if (publish && checks.some((checked) => !checked)) return setSaveError("Confirme os três itens da revisão antes de publicar.");
    setSaving(true);
    const { error } = await createSupabaseBrowserClient().rpc("admin_create_product", { product_name: name.trim(), manufacturer_code: manufacturerCode.trim(), product_brand: partBrand.trim(), product_description: description.trim(), product_price_cents: priceCents, product_availability: availability, publish_now: publish });
    setSaving(false);
    if (error) return setSaveError("Não foi possível salvar a peça. Confira os campos e tente novamente.");
    router.push("/admin/produtos"); router.refresh();
  }

  return <div className="product-form">
    <div className="form-steps">{["Fotos", "Informações", "Revisar"].map((label, index) => <button type="button" key={label} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""} onClick={() => setStep(index + 1)}><span>{index + 1}</span>{label}</button>)}</div>
    {step === 1 && <section className="form-card"><p className="eyebrow">ETAPA 1 DE 3</p><h2>Adicione fotos da peça</h2><p>A primeira foto será a capa. No celular, você pode fotografar a peça na hora ou escolher uma imagem da galeria.</p>
      <div className="upload-options">
        <label className="upload-area"><Camera size={38} /><strong>Tirar foto agora</strong><span>Abre a câmera traseira do celular</span><input type="file" accept="image/*" capture="environment" onChange={addFiles} /></label>
        <label className="upload-area"><Package size={38} /><strong>Escolher da galeria</strong><span>JPG, PNG ou WebP · até 5 fotos</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addFiles} /></label>
      </div>
      <div className="url-upload"><label><span>Ou use uma imagem da internet</span><div><input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://site.com/foto-da-peca.jpg" /><button type="button" onClick={addImageUrl}>Adicionar URL</button></div></label></div>
      {imageError && <p className="form-error" role="alert">{imageError}</p>}
      {images.length > 0 && <div className="image-previews">{images.map((image, index) => <figure key={image.id}><Image src={image.src} alt={image.name} fill unoptimized sizes="140px" /><figcaption>{index === 0 ? "CAPA" : `FOTO ${index + 1}`}</figcaption><button type="button" aria-label={`Remover ${image.name}`} onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))}>×</button></figure>)}</div>}
      <div className="form-actions"><span /><button type="button" className="button button-primary" onClick={() => setStep(2)}>Continuar <ChevronRight /></button></div></section>}
    {step === 2 && <section className="form-card"><p className="eyebrow">ETAPA 2 DE 3</p><h2>Informações da peça</h2><p>Preencha o que souber. A base FIPE completa está disponível aqui para cadastrar novas compatibilidades.</p><div className="form-grid"><label className="wide"><span>Nome da peça</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Farol Santana com auxiliar - LE" /></label><label><span>Código interno</span><input placeholder="Gerado automaticamente" disabled /></label><label><span>Código do fabricante</span><input value={manufacturerCode} onChange={(event) => setManufacturerCode(event.target.value)} placeholder="Ex.: FG51LD" /></label><label><span>Categoria</span><select defaultValue=""><option value="" disabled>Selecione</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label><span>Marca da peça</span><input value={partBrand} onChange={(event) => setPartBrand(event.target.value)} placeholder="Ex.: Rufato" /></label><label><span>Preço</span><input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" placeholder="R$ 0,00" /></label><label><span>Disponibilidade</span><select value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="available">Disponível</option><option value="limited">Últimas unidades</option><option value="on_request">Sob consulta</option><option value="out_of_stock">Esgotado</option></select></label>
        <div className="vehicle-application-fields"><h3>Compatibilidade do veículo</h3><p>Selecione na base FIPE completa.</p><div className="vehicle-application-grid"><label><span>Marca</span><select value={brandCode} onChange={(event) => setBrandCode(event.target.value)}><option value="">Selecione</option>{brands.map((item) => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)}</select></label><label><span>Modelo</span><select value={modelCode} disabled={!brandCode} onChange={(event) => setModelCode(event.target.value)}><option value="">Selecione</option>{models.map((item) => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)}</select></label><label><span>Ano</span><select value={yearCode} disabled={!modelCode} onChange={(event) => setYearCode(event.target.value)}><option value="">Todos os anos compatíveis</option>{years.map((item) => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)}</select></label></div>{vehicleError && <p className="form-error" role="alert">{vehicleError}</p>}<button type="button" className="text-link" disabled={!brandCode || !modelCode}>+ Adicionar compatibilidade</button></div>
        <label className="wide"><span>Descrição</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="Detalhes importantes, lado, unidade ou kit..." /></label></div><div className="form-actions"><button type="button" className="button button-ghost" onClick={() => setStep(1)}>Voltar</button><button type="button" className="button button-primary" onClick={() => setStep(3)}>Revisar <ChevronRight /></button></div></section>}
    {step === 3 && <section className="form-card"><p className="eyebrow">ETAPA 3 DE 3</p><h2>Revise antes de publicar</h2><div className="preview-card"><span>{images[0] ? <Image src={images[0].src} alt="Capa escolhida" width={72} height={72} unoptimized /> : <Package size={42} />}</span><div><small>Prévia do produto</small><strong>{name || "Sua peça aparecerá aqui"}</strong><p>{price ? `Preço informado: R$ ${price}` : "Confira fotos, preço, código e aplicação antes de deixar o anúncio visível."}</p></div></div><div className="review-checks">{["Confirmei o preço", "Confirmei a aplicação", "Confirmei a disponibilidade"].map((label, index) => <label key={label}><input type="checkbox" checked={checks[index]} onChange={(event) => setChecks((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} /> {label}</label>)}</div>{saveError && <p className="form-error" role="alert">{saveError}</p>}<div className="form-actions"><button type="button" className="button button-ghost" onClick={() => setStep(2)}>Voltar</button><div><button type="button" disabled={saving} className="button button-ghost" onClick={() => saveProduct(false)}>Salvar rascunho</button><button type="button" disabled={saving} className="button button-primary" onClick={() => saveProduct(true)}>{saving ? "Salvando…" : "Publicar peça"}</button></div></div></section>}
  </div>;
}
