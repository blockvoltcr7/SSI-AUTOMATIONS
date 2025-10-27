/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true, // Enable "use cache" directive (moved out of experimental)
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
