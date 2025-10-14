import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  
  // ⚠️ REMOVA output: 'export' durante desenvolvimento
  // output: 'export',
  // distDir: 'out',
};

export default nextConfig;