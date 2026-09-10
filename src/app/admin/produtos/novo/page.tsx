import Link from "next/link";
import { ProductForm } from "@/components/product-form";
import { ArrowLeft } from "@/components/icons";

export default function NewProductPage() { return <main className="admin-content"><Link href="/admin" className="back-link"><ArrowLeft size={17} /> Voltar ao início</Link><div className="admin-heading"><div><p>NOVO PRODUTO</p><h1>Adicionar peça</h1><span className="admin-heading-note">Cadastre com calma. Você pode salvar como rascunho.</span></div></div><ProductForm /></main>; }
