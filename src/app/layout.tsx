import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PromotionPopup } from "@/components/promotion-popup";
import { defaultSocialImage, siteName, siteUrl } from "@/lib/seo";

const display = localFont({
  src: [
    { path: "./fonts/BarlowCondensed-SemiBold-latin.woff2", weight: "600", style: "normal" },
    { path: "./fonts/BarlowCondensed-Bold-latin.woff2", weight: "700", style: "normal" },
    { path: "./fonts/BarlowCondensed-ExtraBold-latin.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});
const body = localFont({
  src: "./fonts/DMSans-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-body",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

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
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}><body>{children}<PromotionPopup /></body></html>;
}
