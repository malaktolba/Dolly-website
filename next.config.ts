import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "files.easy-orders.net" },
      { protocol: "https", hostname: "easyorders.fra1.digitaloceanspaces.com" },
    ],
  },
};

export default nextConfig;
