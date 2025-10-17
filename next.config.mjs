import path, { dirname, resolve } from "path";
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
    // ✅ Force all React-based packages (Zustand, Drei, Fiber, etc.) to use your main React instance
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      react: resolve(__dirname, "node_modules/react"),
      "react-dom": resolve(__dirname, "node_modules/react-dom"),
      "@react-three/fiber": resolve(__dirname, "node_modules/@react-three/fiber"),
      "@react-three/drei": resolve(__dirname, "node_modules/@react-three/drei"),
      zustand: resolve(__dirname, "node_modules/zustand"),
    };

    return config;
  },
};

export default nextConfig;
