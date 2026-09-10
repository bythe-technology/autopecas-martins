import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://autopecasmartins.com.br"),
  title: { default: "Auto Peças Martins | Peças e oficina em Jacupiranga", template: "%s" },
  description: "Peças, serviços de oficina e atendimento pelo WhatsApp em Jacupiranga.",
  openGraph: { locale: "pt_BR", type: "website", siteName: "Auto Peças Martins", images: ["/images/fachada-editorial-apm.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>;
}
