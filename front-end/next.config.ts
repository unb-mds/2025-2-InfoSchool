// front-end/next/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração básica
  output: "standalone", // IMPORTANTE para Vercel
  images: {
    unoptimized: true, // Simplifica o deploy
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignora erros ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora erros TypeScript
  },
};

export default nextConfig;
