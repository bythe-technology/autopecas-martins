"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Search } from "./icons";
import { vehicleOptions } from "@/lib/store";

export function VehicleFinder({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const models = useMemo(() => vehicleOptions.find((item) => item.brand === brand)?.models ?? [], [brand]);

  function search() {
    const query = [brand, model, year].filter(Boolean).join(" ");
    router.push(`/catalogo?busca=${encodeURIComponent(query)}`);
  }

  return <div className={compact ? "vehicle-finder compact" : "vehicle-finder"}>
    {!compact && <div className="finder-heading"><span className="icon-box"><Car size={24} /></span><div><p className="eyebrow">BUSCA PELO SEU CARRO</p><h2>Encontre uma peça compatível.</h2></div></div>}
    <div className="vehicle-fields">
      <label><span>Marca</span><select value={brand} onChange={(event) => { setBrand(event.target.value); setModel(""); }}><option value="">Selecione</option>{vehicleOptions.map((item) => <option key={item.brand}>{item.brand}</option>)}</select></label>
      <label><span>Modelo</span><select value={model} disabled={!brand} onChange={(event) => setModel(event.target.value)}><option value="">Selecione</option>{models.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Ano</span><select value={year} onChange={(event) => setYear(event.target.value)}><option value="">Todos</option>{Array.from({ length: 40 }, (_, index) => 2026 - index).map((item) => <option key={item}>{item}</option>)}</select></label>
      <button type="button" className="button button-primary" disabled={!brand} onClick={search}><Search size={18} /> Buscar peças</button>
    </div>
    {!compact && <p className="finder-note">A compatibilidade é uma orientação. Nossa equipe confirma a aplicação antes da venda.</p>}
  </div>;
}
