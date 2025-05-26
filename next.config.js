const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  webpack: (config, { isServer }) => {
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ];
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/ai': path.resolve(__dirname, 'src/ai'),
    };
    
    return config;
  },
  
  serverExternalPackages: ['@genkit-ai/googleai', 'genkit'],
  
  output: 'standalone',
};

module.exports = nextConfig;
