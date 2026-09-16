"use client";

import { useEffect, useRef, useState } from "react";
import { CatalogProduct, categories } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Search } from "./icons";
import { WhatsAppLink } from "./whatsapp-link";

type VehicleFilter = { make?: string; model?: string; year?: string };
type CatalogResponse = { products: CatalogProduct[]; total: number };

const PAGE_SIZE = 24;

function buildCatalogUrl({ offset, partQuery, vehicleQuery, category, vehicle }: {
  offset: number;
  partQuery: string;
  vehicleQuery: string;
  category: string;
  vehicle: VehicleFilter;
}) {
  const params = new URLSearchParams({ offset: String(offset) });
  if (partQuery.trim()) params.set("busca", partQuery.trim());
  if (vehicleQuery.trim()) params.set("veiculo", vehicleQuery.trim());
  if (category !== "Todas") params.set("categoria", category);
  if (vehicle.make) params.set("marca", vehicle.make);
  if (vehicle.model) params.set("modelo", vehicle.model);
  if (vehicle.year) params.set("ano", vehicle.year);
  return `/api/catalog?${params.toString()}`;
}

export function CatalogView({
  initialCategory = "Todas",
  initialQuery = "",
  vehicle = {},
  products: initialProducts,
  total: initialTotal,
}: {
  initialCategory?: string;
  initialQuery?: string;
  vehicle?: VehicleFilter;
  products: CatalogProduct[];
  total: number;
}) {
  const [partQuery, setPartQuery] = useState(initialQuery);
  const [vehicleQuery, setVehicleQuery] = useState("");
  const [category, setCategory] = useState(() => categories.includes(initialCategory as (typeof categories)[number]) ? initialCategory : "Todas");
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setError("");
      try {
        const response = await fetch(buildCatalogUrl({ offset: 0, partQuery, vehicleQuery, category, vehicle }), { signal: controller.signal });
        if (!response.ok) throw new Error("Falha ao consultar o catálogo");
        const page = await response.json() as CatalogResponse;
        setProducts(page.products);
        setTotal(page.total);
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setError("Não foi possível atualizar a busca. Tente novamente.");
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [partQuery, vehicleQuery, category, vehicle]);

  async function loadMore() {
    setIsLoadingMore(true);
    setError("");
    try {
      const response = await fetch(buildCatalogUrl({ offset: products.length, partQuery, vehicleQuery, category, vehicle }));
      if (!response.ok) throw new Error("Falha ao carregar mais produtos");
      const page = await response.json() as CatalogResponse;
      setProducts((current) => {
        const unique = new Map(current.map((product) => [product.slug, product]));
        for (const product of page.products) unique.set(product.slug, product);
        return [...unique.values()];
      });
      setTotal(page.total);
    } catch {
      setError("Não foi possível carregar mais peças. Tente novamente.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  const hasMore = products.length < total;
  const countLabel = isSearching
    ? "Atualizando resultados…"
    : `${products.length} de ${total} ${total === 1 ? "peça carregada" : "peças carregadas"}`;

  return <>
    <div className="catalog-controls">
      <div className="catalog-search-grid">
        <label className="search-field"><Search size={19} /><span><small>PEÇA OU CÓDIGO</small><input value={partQuery} onChange={(event) => setPartQuery(event.target.value)} placeholder="Ex.: farol, retrovisor, 160047" /></span></label>
        <label className="search-field"><Search size={19} /><span><small>MARCA OU MODELO DO CARRO</small><input value={vehicleQuery} onChange={(event) => setVehicleQuery(event.target.value)} placeholder="Ex.: Chevrolet Onix, Fiat Palio" /></span></label>
      </div>
      <div className="category-row" aria-label="Categorias">{["Todas", ...categories].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
    </div>
    <p className="catalog-count" aria-live="polite">{countLabel}</p>
    <div className={`product-grid${isSearching ? " is-updating" : ""}`}>{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
    {hasMore && !isSearching && <div className="catalog-pagination"><button className="button button-secondary" type="button" onClick={loadMore} disabled={isLoadingMore}>{isLoadingMore ? "Carregando…" : `Carregar mais ${Math.min(PAGE_SIZE, total - products.length)} peças`}</button><small>Os próximos produtos são buscados somente quando você pedir.</small></div>}
    {error && <p className="catalog-error" role="alert">{error}</p>}
    {!isSearching && products.length === 0 && <div className="empty-state"><h2>Não encontramos essa combinação.</h2><p>Os filtros mostram somente peças anunciadas. Fale com um atendente para consultarmos outros itens e alternativas no estoque.</p><WhatsAppLink message="Olá! Não encontrei uma peça para o meu veículo no site. Podem me ajudar? Meu carro é [marca, modelo e ano]." label="Perguntar no WhatsApp" /></div>}
  </>;
}
