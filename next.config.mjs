import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["artifically.com"],
  },
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "zustand$": resolve(__dirname, "lib/zustand/react-safe.ts"),
    };
    return config;
  },
};

export default nextConfig;