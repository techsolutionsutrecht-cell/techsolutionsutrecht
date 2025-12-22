import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
      }
    ],
  },
  serverActions: {
    bodySizeLimit: '20mb',
  },
  experimental: {
    // سایر تنظیمات experimental
  },
};

export default nextConfig;
