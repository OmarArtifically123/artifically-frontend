import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Temporarily comment out Million.js to fix hydration issues
// import million from 'million/compiler'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Temporarily disable Million.js optimizations
    // million.vite({ auto: true }),
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