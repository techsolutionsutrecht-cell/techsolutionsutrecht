import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'www.techsolutionsutrecht.nl',
      },
      {
        protocol: 'https',
        hostname: 'techsolutionsutrecht.nl',
      }
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    } as any,
    optimizePackageImports: ['lucide-react'], // Tree-shake icons
  },
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
