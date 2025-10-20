import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import bundleAnalyzer from "@next/bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";

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
  },
  async headers() {
    const staticAssetHeaders = {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    };

    return [
      {
        source: "/_next/static/(.*)",
        headers: [staticAssetHeaders],
      },
      {
        source: "/(.*)\\.(?:js|css|json|ico|svg|png|jpg|jpeg|gif|webp|avif|ttf|otf|woff|woff2)$",
        headers: [staticAssetHeaders],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "accept",
            value: ".*text/html.*",
          },
        ],
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  webpack(config, { dev, isServer }) {
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

    if (!dev && !isServer) {
      config.optimization = config.optimization ?? {};
      config.optimization.runtimeChunk = "single";
      const existingSplitChunks = config.optimization.splitChunks ?? {};
      config.optimization.splitChunks = {
        ...existingSplitChunks,
        chunks: "all",
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        minSize: 20000,
        cacheGroups: {
          ...(existingSplitChunks.cacheGroups ?? {}),
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const context = module?.context ?? "";
              const match = context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1].replace("@", "") : "vendor";
              return `vendor.${packageName}`;
            },
            chunks: "all",
            enforce: true,
            maxSize: 120 * 1024,
            reuseExistingChunk: true,
          },
        },
      };

      config.optimization.minimize = true;
      config.optimization.minimizer = [
        ...(config.optimization.minimizer ?? []),
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: true,
              passes: 2,
            },
            format: {
              comments: false,
            },
          },
        }),
      ];
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);