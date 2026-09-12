import type { Metadata } from "next";

export const siteUrl = "https://www.apmartins.com.br";
export const siteName = "Auto Peças Martins";
export const defaultSocialImage = {
  url: "/images/fachada-editorial-apm.png",
  width: 1448,
  height: 1086,
  alt: "Fachada da Auto Peças Martins em Jacupiranga, São Paulo",
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName,
      locale: "pt_BR",
      images: [defaultSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultSocialImage.url],
    },
  };
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, siteUrl).toString();
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
