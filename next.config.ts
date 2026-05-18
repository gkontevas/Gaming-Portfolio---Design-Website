import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
