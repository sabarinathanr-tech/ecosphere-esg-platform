import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
  images: {
    domains: ["api.dicebear.com", "avatars.githubusercontent.com"],
  },
};

export default nextConfig;
