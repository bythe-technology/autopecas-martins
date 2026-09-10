import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Privacidade | Auto Peças Martins", robots: { index: false, follow: true } };

export default function PrivacyPage() {
  return <main id="conteudo"><SiteHeader /><section className="inner-hero compact-hero"><div className="container"><p className="eyebrow">PRIVACIDADE</p><h1>Seus dados,<br />com clareza.</h1></div></section><article className="container legal-content"><h2>Como este site funciona</h2><p>Você pode navegar pelo catálogo sem criar uma conta. Ao clicar no WhatsApp, a conversa acontece no aplicativo e segue as regras da plataforma.</p><h2>Dados usados</h2><p>O site pode registrar informações técnicas básicas de acesso para segurança e desempenho. Não solicitamos CPF, placa ou chassi em formulários públicos nesta versão.</p><h2>Contato</h2><p>Para dúvidas sobre informações fornecidas à Auto Peças Martins, entre em contato pelos canais indicados na página de contato.</p><p className="legal-date">Versão inicial · setembro de 2026</p></article><SiteFooter /></main>;
}
