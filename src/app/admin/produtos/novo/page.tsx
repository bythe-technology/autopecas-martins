import Link from "next/link";
import { ProductForm } from "@/components/product-form";

export default function NewProductPage() { return <main className="admin-content"><Link href="/admin" className="back-link">← Voltar para o painel</Link><div className="admin-heading"><div><p>NOVO PRODUTO</p><h1>Adicionar peça</h1></div></div><ProductForm /></main>; }
