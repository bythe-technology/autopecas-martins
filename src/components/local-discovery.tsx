import Link from "next/link";
import { ArrowRight, Pin, ShieldCheck, Package } from "./icons";

export function LocalDiscovery() {
  return <section className="local-discovery section" aria-labelledby="local-title"><div className="container">
    <div className="local-discovery-heading"><div><p className="eyebrow">AUTO PEÇAS MARTINS · DESDE 1971</p><h2 id="local-title">Sua autopeças em Jacupiranga.<br />Perto de você e do seu carro.</h2></div><p>Loja de autopeças e oficina na Vila Elias, com atendimento para Jacupiranga e o Vale do Ribeira. Consulte o estoque e confirme a aplicação com quem conhece as peças.</p></div>
    <div className="local-discovery-grid">
      <Link href="/pecas"><Package size={26}/><h3>Explore todas as peças</h3><p>Faróis, lanternas, retrovisores, calhas, borrachas, molduras e outros itens do estoque.</p><span>Ver peças por página <ArrowRight size={18}/></span></Link>
      <Link href="/contato"><Pin size={26}/><h3>Visite nossa loja</h3><p>Av. Hilda Mohring de Macedo, 1309, Vila Elias. Jacupiranga, SP, CEP 11940-000.</p><span>Contato e localização <ArrowRight size={18}/></span></Link>
      <Link href="/#servicos"><ShieldCheck size={26}/><h3>Peças e oficina juntas</h3><p>Consulte troca de óleo, alinhamento 3D, balanceamento, freios e avaliação da suspensão.</p><span>Conhecer os serviços <ArrowRight size={18}/></span></Link>
    </div>
    <div className="local-questions"><h2>Dúvidas antes de escolher sua peça?</h2>
      <details><summary>Como comprar uma peça na Auto Peças Martins?</summary><p>Escolha o produto no catálogo e toque em “Confirmar no WhatsApp”. A equipe recebe o nome e o código da peça para conferir preço, disponibilidade e os próximos passos.</p></details>
      <details><summary>Como saber se a peça serve no meu carro?</summary><p>Use a busca por marca, modelo e ano. Antes de comprar, informe também versão, motorização, carroceria e lado da peça para que a equipe confirme a aplicação.</p></details>
      <details><summary>Não encontrei a peça no catálogo. Posso consultar?</summary><p>Sim. O catálogo reúne os itens anunciados, e você pode chamar a equipe pelo WhatsApp para consultar outras peças e alternativas no estoque em Jacupiranga.</p></details>
    </div>
  </div></section>;
}
