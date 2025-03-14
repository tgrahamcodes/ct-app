import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    config.resolve.alias['components'] = path.resolve(__dirname, 'components');
    return config;
  },
  // Optional: if you're using TypeScript
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;