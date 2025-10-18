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
    // ✅ Ensure third-party React ecosystem packages resolve to the workspace copy without
    //    overriding Next.js' own React runtime (which provides required experimental APIs).
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@react-three/fiber": resolve(__dirname, "node_modules/@react-three/fiber"),
      "@react-three/drei": resolve(__dirname, "node_modules/@react-three/drei"),
      zustand: resolve(__dirname, "node_modules/zustand"),
    };

    return config;
  },
};

export default nextConfig;