import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import million from 'million/compiler'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Re-enable Million.js with SSR-safe settings
    million.vite({ 
      auto: {
        threshold: 0.05, // More conservative threshold
        skip: ['App', 'Router', 'BrowserRouter', 'Routes', 'Route'], // Skip routing components
        rsc: false // Disable React Server Components optimizations for now
      },
      ssr: true, // Enable SSR support
      optimize: false // Disable aggressive optimizations that can cause hydration issues
    }),
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          apollo: ['@apollo/client'],
        }
      }
    }
  },
  ssr: {
    noExternal: ['@apollo/client']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@apollo/client']
  }
})