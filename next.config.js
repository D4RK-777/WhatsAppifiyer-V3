const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  reactStrictMode: true,
  
  
  // Configure images for static export
  images: {
    unoptimized: true, // Disable default image optimization for static export
  },
  
  // Webpack configuration for file handling
  webpack: (config, { isServer }) => {
    // Configure module resolution
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ];
    
    // Set up path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/ai': path.resolve(__dirname, 'src/ai'),
    };

    // Add file-loader rule for static assets
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            publicPath: '/_next/static/media',
            outputPath: 'static/media',
            esModule: false, // Important for compatibility with some setups
          },
        },
      ],
    });
    
    return config;
  },
  
  // External packages that should be included in the build

  
  
  // Configure base path if your app is not served from the root
  // basePath: '/your-base-path',
  
  // Configure asset prefix for CDN or custom domain
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://your-cdn-url.com' : '',
};

module.exports = nextConfig;
