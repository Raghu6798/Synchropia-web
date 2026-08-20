import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: [
    "lightningcss",
    "@tailwindcss/postcss",
    "@tailwindcss/oxide",
  ],
};

export default nextConfig;
