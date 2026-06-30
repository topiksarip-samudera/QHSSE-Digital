import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@qhsse/shared'],
  output: 'standalone',
  allowedDevOrigins: ['*.trycloudflare.com', '*.qhsse.my.id'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
