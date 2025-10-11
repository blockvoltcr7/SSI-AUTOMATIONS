import rehypePrism from "@mapbox/rehype-prism";
import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Increase the max HTTP header size to handle large Supabase auth cookies
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || [])];
    }
    return config;
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
});

export default withMDX(nextConfig);
