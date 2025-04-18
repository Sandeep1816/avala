/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // Fix for module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Configure port
  env: {
    PORT: 3002
  },
  // Remove redirects and rewrites that might interfere with routing
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  }
};

module.exports = nextConfig; 