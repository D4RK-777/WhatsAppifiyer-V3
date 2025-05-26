/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Add path aliases to webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
  // Add this to handle module resolution in production
  experimental: {
    serverComponentsExternalPackages: ['@genkit-ai/googleai', 'genkit'],
  },
};

module.exports = nextConfig;
