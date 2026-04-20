import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint not configured for this project
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Force SWC even though babel.config.js exists (legacy RN file)
    forceSwcTransforms: true,
  },
};

export default nextConfig;
