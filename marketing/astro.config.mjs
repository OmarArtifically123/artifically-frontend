import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import react from "@astrojs/react";
import node from "@astrojs/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolveFromRoot = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  root: __dirname,
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
  },
  compressHTML: true,
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        "@frontend": fileURLToPath(new URL("../src", import.meta.url)),
        "@marketing": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});