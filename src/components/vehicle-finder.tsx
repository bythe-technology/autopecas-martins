"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { catalogProducts } from "@/lib/catalog";
import { Car, Search } from "./icons";

type StockVehicle = { make: string; model: string; years: number[] };

const stockVehicles: StockVehicle[] = catalogProducts.flatMap((product) => {
  if (!product.fitment) return [];
  const { make, models, yearFrom, yearTo } = product.fitment;
  const years = yearFrom ? Array.from({ length: Math.max(1, (yearTo ?? new Date().getFullYear()) - yearFrom + 1) }, (_, index) => yearFrom + index) : [];
  return models.map((model) => ({ make, model, years }));
});

export function VehicleFinder({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const makes = useMemo(() => [...new Set(stockVehicles.map((item) => item.make))].sort(), []);
  const models = useMemo(() => [...new Set(stockVehicles.filter((item) => item.make === make).map((item) => item.model))].sort(), [make]);
  const years = useMemo(() => [...new Set(stockVehicles.filter((item) => item.make === make && item.model === model).flatMap((item) => item.years))].sort((a, b) => b - a), [make, model]);

  function search() {
    const params = new URLSearchParams({ marca: make, modelo: model });
    if (year) params.set("ano", year);
    router.push(`/catalogo?${params.toString()}`);
  }

  return <div className={compact ? "vehicle-finder compact" : "vehicle-finder"}>
    {!compact && <div className="finder-heading"><span className="icon-box"><Car size={24} /></span><div><p className="eyebrow">BUSCA PELO SEU CARRO</p><h2>Encontre uma peça compatível.</h2></div></div>}
    <div className="vehicle-fields">
      <label><span>Marca</span><select value={make} onChange={(event) => { setMake(event.target.value); setModel(""); setYear(""); }}><option value="">Selecione a marca</option>{makes.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Modelo</span><select value={model} disabled={!make} onChange={(event) => { setModel(event.target.value); setYear(""); }}><option value="">Selecione o modelo</option>{models.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Ano</span><select value={year} disabled={!model} onChange={(event) => setYear(event.target.value)}><option value="">Todos os anos</option>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
      <button type="button" className="button button-primary" disabled={!make || !model} onClick={search}><Search size={18} /> Buscar peças</button>
    </div>
    {!compact && <p className="finder-note">Mostramos somente marcas, modelos e anos com peças anunciadas no estoque. Não encontrou seu carro? Consulte nossos atendentes pelo WhatsApp.</p>}
  </div>;
}
