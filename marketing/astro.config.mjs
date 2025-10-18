import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import react from "@astrojs/react";
import node from "@astrojs/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolveFromRoot = (relativePath) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  root: __dirname,

  // ✅ Astro should render via middleware for Next.js or Vercel, not prerender statically
  output: "server",
  adapter: node({ mode: "middleware" }),

  server: {
    host: true,
    port: Number(process.env.MARKETING_DEV_PORT) || 4321,
  },

  publicDir: resolveFromRoot("../public"),

  build: {
    client: "../dist/marketing/client",
    server: "../dist/marketing/server",
    serverEntry: "entry.mjs",
    // ✅ Disable static exports (prevents /blog/page: /blog errors)
    format: "directory",
    staticPaths: false,
  },

  compressHTML: true,
  integrations: [react()],

  vite: {
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: [
        {
          find: "@frontend/rsc",
          replacement: fileURLToPath(new URL("../rsc", import.meta.url)),
        },
        {
          find: "@frontend/rsc/",
          replacement: fileURLToPath(new URL("../rsc/", import.meta.url)),
        },
        {
          find: "@frontend/styles",
          replacement: fileURLToPath(new URL("../styles", import.meta.url)),
        },
        {
          find: "@frontend/styles/",
          replacement: fileURLToPath(new URL("../styles/", import.meta.url)),
        },
        {
          find: "@frontend",
          replacement: fileURLToPath(new URL("../src", import.meta.url)),
        },
        {
          find: "@marketing",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
        // ✅ Remove Zustand alias entirely (no "react-safe.ts")
      ],
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  },
});
