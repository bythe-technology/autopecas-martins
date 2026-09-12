import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "autopecas-martins.vercel.app" }],
      destination: "https://www.apmartins.com.br/:path*",
      permanent: true,
    }];
  },
};

export default nextConfig;
