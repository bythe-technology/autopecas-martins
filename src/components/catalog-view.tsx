"use client";

import { useMemo, useState } from "react";
import { categories, catalogProducts } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Search } from "./icons";

export function CatalogView({ initialCategory = "Todas", initialQuery = "" }: { initialCategory?: string; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(() => categories.includes(initialCategory as (typeof categories)[number]) ? initialCategory : "Todas");
  const products = useMemo(() => catalogProducts.filter((product) => {
    const normalized = `${product.name} ${product.code} ${product.brand ?? ""} ${product.application}`.toLocaleLowerCase("pt-BR");
    return normalized.includes(query.toLocaleLowerCase("pt-BR")) && (category === "Todas" || product.category === category);
  }), [query, category]);
  return <><div className="catalog-controls"><label className="search-field"><Search size={19} /><span className="sr-only">Buscar peça</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque por peça, código ou veículo" /></label><div className="category-row" aria-label="Categorias">{["Todas", ...categories].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><p className="catalog-count">{products.length} {products.length === 1 ? "peça encontrada" : "peças encontradas"}</p><div className="product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>{products.length === 0 && <div className="empty-state"><h2>Não encontramos essa peça no catálogo inicial.</h2><p>Fale com a equipe para consultar alternativas e a disponibilidade do estoque.</p></div>}</>;
}
