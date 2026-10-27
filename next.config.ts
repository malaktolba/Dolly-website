import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  experimental: {
    // Product photos are uploaded through server actions (already resized in the browser)
    serverActions: { bodySizeLimit: "6mb" },
    // Pre-render pages one at a time: parallel build workers contend for the local database
    cpus: 1,
  },
  images: {
    // Served as-is: the source photos are already web-sized, and this avoids paid image resizing on Cloudflare.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "files.easy-orders.net" },
      { protocol: "https", hostname: "easyorders.fra1.digitaloceanspaces.com" },
    ],
  },
};

export default nextConfig;

// Gives `next dev` access to the local D1 database and .dev.vars
initOpenNextCloudflareForDev();
