"use client";

import { useMemo, useState } from "react";
import { CatalogProduct, categories, catalogProducts } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Search } from "./icons";
import { WhatsAppLink } from "./whatsapp-link";

type VehicleFilter = { make?: string; model?: string; year?: string };

export function CatalogView({ initialCategory = "Todas", initialQuery = "", vehicle = {}, products: suppliedProducts }: { initialCategory?: string; initialQuery?: string; vehicle?: VehicleFilter; products?: CatalogProduct[] }) {
  const [partQuery, setPartQuery] = useState(initialQuery);
  const [vehicleQuery, setVehicleQuery] = useState("");
  const [category, setCategory] = useState(() => categories.includes(initialCategory as (typeof categories)[number]) ? initialCategory : "Todas");
  const products = useMemo(() => (suppliedProducts ?? catalogProducts).filter((product) => {
    const fitment = product.fitment ? `${product.fitment.make} ${product.fitment.models.join(" ")} ${product.fitment.yearFrom ?? ""} ${product.fitment.yearTo ?? ""}` : "";
    const normalized = `${product.name} ${product.code} ${product.brand ?? ""} ${product.application} ${fitment}`.toLocaleLowerCase("pt-BR");
    const selectedYear = Number(vehicle.year);
    const application = product.application.toLocaleLowerCase("pt-BR");
    const fallbackVehicleMatch = application.includes((vehicle.make ?? "").toLocaleLowerCase("pt-BR"))
      && (!vehicle.model || application.includes(vehicle.model.toLocaleLowerCase("pt-BR")))
      && (!vehicle.year || [...application.matchAll(/(19\d{2}|20\d{2})(?:\s+a\s+(19\d{2}|20\d{2}))?/g)].some((match) => selectedYear >= Number(match[1]) && selectedYear <= Number(match[2] ?? match[1])));
    const matchesStructuredVehicle = !vehicle.make || (product.fitment ? Boolean(product.fitment.make === vehicle.make
      && (!vehicle.model || product.fitment.models.includes(vehicle.model))
      && (!vehicle.year || ((!product.fitment.yearFrom || selectedYear >= product.fitment.yearFrom) && (!product.fitment.yearTo || selectedYear <= product.fitment.yearTo)))) : fallbackVehicleMatch);
    return matchesStructuredVehicle && normalized.includes(partQuery.toLocaleLowerCase("pt-BR")) && normalized.includes(vehicleQuery.toLocaleLowerCase("pt-BR")) && (category === "Todas" || product.category === category);
  }), [partQuery, vehicleQuery, category, vehicle.make, vehicle.model, vehicle.year, suppliedProducts]);
  return <><div className="catalog-controls"><div className="catalog-search-grid"><label className="search-field"><Search size={19} /><span><small>PEÇA OU CÓDIGO</small><input value={partQuery} onChange={(event) => setPartQuery(event.target.value)} placeholder="Ex.: farol, retrovisor, 160047" /></span></label><label className="search-field"><Search size={19} /><span><small>MARCA OU MODELO DO CARRO</small><input value={vehicleQuery} onChange={(event) => setVehicleQuery(event.target.value)} placeholder="Ex.: Chevrolet Onix, Fiat Palio" /></span></label></div><div className="category-row" aria-label="Categorias">{["Todas", ...categories].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><p className="catalog-count" aria-live="polite">{products.length} {products.length === 1 ? "peça encontrada" : "peças encontradas"}</p><div className="product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>{products.length === 0 && <div className="empty-state"><h2>Não encontramos essa combinação.</h2><p>Os filtros mostram somente peças anunciadas. Fale com um atendente para consultarmos outros itens e alternativas no estoque.</p><WhatsAppLink message="Olá! Não encontrei uma peça para o meu veículo no site. Podem me ajudar? Meu carro é [marca, modelo e ano]." label="Perguntar no WhatsApp" /></div>}</>;
}
