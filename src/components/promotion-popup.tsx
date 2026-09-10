"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Close, ShieldCheck, Tag, WhatsAppIcon } from "./icons";
import { whatsappUrl } from "./whatsapp-link";

const STORAGE_KEY = "apm-promotion-seen-at";
const EIGHT_HOURS = 8 * 60 * 60 * 1000;

export function PromotionPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const lastSeen = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    if (Date.now() - lastSeen < EIGHT_HOURS) return;
    const timer = window.setTimeout(() => setVisible(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;
  return <aside className="promotion-popup" role="dialog" aria-modal="false" aria-labelledby="promotion-title">
    <button type="button" className="promotion-close" onClick={close} aria-label="Fechar promoção"><Close size={19} /></button>
    <span className="promotion-alert"><span /> OPORTUNIDADES EM DESTAQUE</span>
    <h2 id="promotion-title">Seu carro precisa de atenção?</h2>
    <div className="promotion-options">
      <Link href="/liquidacoes" onClick={close}><Tag size={21} /><span><strong>Queima de estoque</strong><small>Peças selecionadas enquanto durarem os lotes.</small></span></Link>
      <a href={whatsappUrl("Olá! Vi o destaque de suspensão no site e gostaria de agendar uma avaliação para o meu carro.")} target="_blank" rel="noreferrer" onClick={close}><ShieldCheck size={21} /><span><strong>Avaliação da suspensão</strong><small>Consulte horários diretamente com a oficina.</small></span><WhatsAppIcon size={18} /></a>
    </div>
    <small className="promotion-footnote">Preço, aplicação e agenda sujeitos à confirmação.</small>
  </aside>;
}
