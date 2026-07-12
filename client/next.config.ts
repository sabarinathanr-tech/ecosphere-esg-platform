import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Package import optimization (tree-shaking for heavy libs) ─────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "@tanstack/react-query",
    ],
  },

  // ── Image optimization ─────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],  // serve modern formats
    minimumCacheTTL: 3600,                  // cache for 1 hour
  },

  // ── HTTP headers for aggressive caching of static assets ──────────────────
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },

  // ── Compiler optimizations ─────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ── Compress responses ─────────────────────────────────────────────────────
  compress: true,

  // ── Powered by header (security + minor perf) ─────────────────────────────
  poweredByHeader: false,
};

export default nextConfig;
