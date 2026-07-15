import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained `out/` directory that can be uploaded to any
  // static host (for example Alibaba Cloud OSS) without a Node.js runtime.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
