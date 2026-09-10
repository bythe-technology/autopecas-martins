import Image from "next/image";

export default function Loading() {
  return <main className="page-loading" aria-label="Carregando página" aria-live="polite"><div className="loading-brand"><Image className="loading-logo" src="/images/logo-apm-clean.png" alt="Auto Peças Martins" width={64} height={64} priority /><strong>Preparando as melhores peças…</strong></div><div className="loading-track"><span /></div><div className="loading-skeleton"><span /><span /><span /></div></main>;
}
