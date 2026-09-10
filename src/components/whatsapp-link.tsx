import { ArrowRight } from "./icons";

const whatsappNumber = "551338648182";

export function whatsappUrl(message: string): string { return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`; }

export function WhatsAppLink({ message, label = "Consultar no WhatsApp", className = "button button-primary" }: { message: string; label?: string; className?: string }) {
  return <a className={className} href={whatsappUrl(message)} target="_blank" rel="noreferrer">{label}<ArrowRight size={18} /></a>;
}
