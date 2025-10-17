import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "@react-three/fiber": path.resolve("./node_modules/@react-three/fiber"),
      "@react-three/drei": path.resolve("./node_modules/@react-three/drei"),
      zustand: path.resolve("./node_modules/zustand"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "zustand",
      "@react-three/fiber",
      "@react-three/drei",
    ],
    dedupe: [
      "react",
      "react-dom",
      "zustand",
      "@react-three/fiber",
      "@react-three/drei",
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});