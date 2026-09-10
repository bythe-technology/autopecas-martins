import { WhatsAppIcon } from "./icons";
import { store } from "@/lib/store";

export function whatsappUrl(message: string): string { return `https://wa.me/${store.whatsappE164}?text=${encodeURIComponent(message)}`; }

export function WhatsAppLink({ message, label = "Consultar no WhatsApp", className = "button button-primary" }: { message: string; label?: string; className?: string }) {
  return <a className={className} href={whatsappUrl(message)} target="_blank" rel="noreferrer"><WhatsAppIcon size={19} />{label}</a>;
}
