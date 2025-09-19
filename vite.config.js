import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // local dev → backend
        "/api": "http://localhost:4000"
      }
    },
    define: {
      __API_URL__: JSON.stringify(
        process.env.VITE_API_URL || "http://localhost:4000/api/v1"
      )
    }
  };
});
