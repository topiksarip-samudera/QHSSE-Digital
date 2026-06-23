import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@qhsse/shared'],
  output: 'standalone',
};

export default nextConfig;
