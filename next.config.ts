import type { NextConfig } from "next";

/**
 * Statik çıktı: `npm run build` sonrası `out/` klasörü herhangi bir
 * hostinge (cPanel, Apache, Nginx, Netlify, Vercel…) olduğu gibi yüklenebilir.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
