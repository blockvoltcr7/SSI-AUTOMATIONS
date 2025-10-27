/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled cacheComponents due to conflicts with:
  // 1. ThemeProvider cookie access during SSR
  // 2. Authentication routes that require dynamic rendering
  // TODO: Re-enable after upgrading next-themes or when Next.js has better support
  // cacheComponents: true,
  output: 'standalone', // Optimize for production
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  pageExtensions: ["ts", "tsx"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  turbopack: {}, // Empty turbopack config to silence warning about webpack config
  // Increase the max HTTP header size to handle large Supabase auth cookies
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || [])];
    }

    // Fix for Solana wallet adapter and WalletConnect dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
      "pino-pretty": false,
    };

    // Ignore pino-pretty warnings
    config.ignoreWarnings = [
      { module: /pino-pretty/ },
      { module: /node_modules\/pino/ },
    ];

    return config;
  },
};

export default nextConfig;
