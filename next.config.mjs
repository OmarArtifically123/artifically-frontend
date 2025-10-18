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

export default nextConfig;