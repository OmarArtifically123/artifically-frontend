import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import bundleAnalyzer from "@next/bundle-analyzer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["artifically.com", "cdn.artifically.com"],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    serverComponents: true,
  },
  webpack(config) {
    // ✅ Ensure peer dependencies resolve to the project copy without clobbering Next.js internals
    const alias = { ...(config.resolve.alias ?? {}) };

    const ensureAlias = (key, target) => {
      if (!alias[key]) {
        alias[key] = resolve(__dirname, target);
      }
    };

    ensureAlias("@react-three/fiber", "node_modules/@react-three/fiber");
    ensureAlias("@react-three/drei", "node_modules/@react-three/drei");
    ensureAlias("zustand", "node_modules/zustand");

    config.resolve.alias = alias;

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);