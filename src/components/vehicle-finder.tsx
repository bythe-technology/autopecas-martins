"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Search } from "./icons";

type VehicleOption = { codigo: string | number; nome: string };

export function VehicleFinder({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [brandCode, setBrandCode] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [yearCode, setYearCode] = useState("");
  const [brands, setBrands] = useState<VehicleOption[]>([]);
  const [models, setModels] = useState<VehicleOption[]>([]);
  const [years, setYears] = useState<VehicleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const brand = useMemo(() => brands.find((item) => String(item.codigo) === brandCode)?.nome ?? "", [brandCode, brands]);
  const model = useMemo(() => models.find((item) => String(item.codigo) === modelCode)?.nome ?? "", [modelCode, models]);
  const year = useMemo(() => years.find((item) => String(item.codigo) === yearCode)?.nome ?? "", [yearCode, years]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/vehicles?resource=brands", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(); return response.json() as Promise<VehicleOption[]>; })
      .then(setBrands).catch(() => setError(true)).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setModels([]); setModelCode(""); setYears([]); setYearCode("");
    if (!brandCode) return;
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/vehicles?resource=models&brand=${brandCode}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(); return response.json() as Promise<VehicleOption[]>; })
      .then(setModels).catch(() => setError(true)).finally(() => setLoading(false));
    return () => controller.abort();
  }, [brandCode]);

  useEffect(() => {
    setYears([]); setYearCode("");
    if (!brandCode || !modelCode) return;
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/vehicles?resource=years&brand=${brandCode}&model=${modelCode}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(); return response.json() as Promise<VehicleOption[]>; })
      .then(setYears).catch(() => setError(true)).finally(() => setLoading(false));
    return () => controller.abort();
  }, [brandCode, modelCode]);

  function search() {
    const query = [brand, model, year.replace(/ Gasolina| Álcool| Diesel| Zero KM gasolina/gi, "")].filter(Boolean).join(" ");
    router.push(`/catalogo?busca=${encodeURIComponent(query)}`);
  }

  return <div className={compact ? "vehicle-finder compact" : "vehicle-finder"}>
    {!compact && <div className="finder-heading"><span className="icon-box"><Car size={24} /></span><div><p className="eyebrow">BUSCA PELO SEU CARRO</p><h2>Encontre uma peça compatível.</h2></div></div>}
    <div className="vehicle-fields">
      <label><span>Marca</span><select value={brandCode} disabled={loading && brands.length === 0} onChange={(event) => setBrandCode(event.target.value)}><option value="">{loading && brands.length === 0 ? "Carregando marcas…" : "Selecione a marca"}</option>{brands.map((item) => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)}</select></label>
      <label><span>Modelo</span><select value={modelCode} disabled={!brandCode || loading} onChange={(event) => setModelCode(event.target.value)}><option value="">Selecione o modelo</option>{models.map((item) => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)}</select></label>
      <label><span>Ano</span><select value={yearCode} disabled={!modelCode || loading} onChange={(event) => setYearCode(event.target.value)}><option value="">Todos os anos</option>{years.map((item) => <option key={item.codigo} value={item.codigo}>{item.nome}</option>)}</select></label>
      <button type="button" className="button button-primary" disabled={!brandCode} onClick={search}><Search size={18} /> Buscar peças</button>
    </div>
    {!compact && <p className="finder-note" role={error ? "alert" : undefined}>{error ? "A lista completa está temporariamente indisponível. Você ainda pode buscar pelo nome no catálogo." : "Marcas, modelos e anos da base FIPE. Nossa equipe confirma a aplicação antes da venda."}</p>}
  </div>;
}
