import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // REMOVA completamente output e basePath para desenvolvimento
  images: {
    unoptimized: true, // Isso permite SVG e imagens locais
  },
  // Configurações para evitar erros durante desenvolvimento
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Garantir que funciona em desenvolvimento
  trailingSlash: false,
  skipTrailingSlashRedirect: true
};

export default nextConfig;