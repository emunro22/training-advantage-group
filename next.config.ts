import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
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
