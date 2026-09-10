"use client";

import { useMemo, useState } from "react";
import { categories, catalogProducts } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Search } from "./icons";

export function CatalogView({ initialCategory = "Todas", initialQuery = "" }: { initialCategory?: string; initialQuery?: string }) {
  const [partQuery, setPartQuery] = useState(initialQuery);
  const [vehicleQuery, setVehicleQuery] = useState("");
  const [category, setCategory] = useState(() => categories.includes(initialCategory as (typeof categories)[number]) ? initialCategory : "Todas");
  const products = useMemo(() => catalogProducts.filter((product) => {
    const fitment = product.fitment ? `${product.fitment.make} ${product.fitment.models.join(" ")} ${product.fitment.yearFrom ?? ""} ${product.fitment.yearTo ?? ""}` : "";
    const normalized = `${product.name} ${product.code} ${product.brand ?? ""} ${product.application} ${fitment}`.toLocaleLowerCase("pt-BR");
    return normalized.includes(partQuery.toLocaleLowerCase("pt-BR")) && normalized.includes(vehicleQuery.toLocaleLowerCase("pt-BR")) && (category === "Todas" || product.category === category);
  }), [partQuery, vehicleQuery, category]);
  return <><div className="catalog-controls"><div className="catalog-search-grid"><label className="search-field"><Search size={19} /><span><small>PEÇA OU CÓDIGO</small><input value={partQuery} onChange={(event) => setPartQuery(event.target.value)} placeholder="Ex.: farol, retrovisor, 160047" /></span></label><label className="search-field"><Search size={19} /><span><small>MARCA OU MODELO DO CARRO</small><input value={vehicleQuery} onChange={(event) => setVehicleQuery(event.target.value)} placeholder="Ex.: Chevrolet Onix, Fiat Palio" /></span></label></div><div className="category-row" aria-label="Categorias">{["Todas", ...categories].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><p className="catalog-count" aria-live="polite">{products.length} {products.length === 1 ? "peça encontrada" : "peças encontradas"}</p><div className="product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>{products.length === 0 && <div className="empty-state"><h2>Não encontramos essa combinação.</h2><p>Tente apenas o nome da peça ou do carro. Se preferir, fale com a equipe para consultarmos o estoque completo.</p></div>}</>;
}
