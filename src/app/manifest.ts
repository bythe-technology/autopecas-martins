import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Auto Peças Martins",
    short_name: "APM",
    description: "Peças automotivas e serviços de oficina em Jacupiranga, SP.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2ea",
    theme_color: "#0869bd",
    lang: "pt-BR",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
