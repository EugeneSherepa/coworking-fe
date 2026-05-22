import type { NextConfig } from "next";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/coworking-fe",
  assetPrefix: "/coworking-fe/",
};

export default nextConfig;
