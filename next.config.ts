import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/secure-links",
        destination: "/forms-portals-resources",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
