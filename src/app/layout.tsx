import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import { PromotionPopup } from "@/components/promotion-popup";
import { defaultSocialImage, siteName, siteUrl } from "@/lib/seo";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: { default: "Auto Peças Martins em Jacupiranga | Peças e Oficina", template: "%s | Auto Peças Martins" },
  description: "Autopeças e oficina em Jacupiranga, SP. Consulte peças automotivas, promoções e serviços para seu veículo com atendimento direto pelo WhatsApp.",
  category: "Autopeças e serviços automotivos",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { locale: "pt_BR", type: "website", siteName, url: "/", images: [defaultSocialImage] },
  twitter: { card: "summary_large_image", images: [defaultSocialImage.url] },
  formatDetection: { telephone: true, address: true, email: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}><body>{children}<PromotionPopup /></body></html>;
}
