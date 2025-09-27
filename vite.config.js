import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import million from 'million/compiler'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    million.vite({
      auto: true,
      mode: 'react',
      isolate: true,
    }),
    react(),
  ],
  
  // Resolve path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
    // Handle SPA routing in development
    historyApiFallback: {
      index: '/index.html',
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    
    // Optimize bundle
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          graphql: ['@apollo/client', 'graphql'],
          performance: ['million'],
          api: ['axios'],
        },
      },
    },
    
    // Asset optimization
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    
    // Performance
    chunkSizeWarningLimit: 1000,
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@apollo/client',
      'graphql',
      'million/react',
    ],
  },

  // Preview server (for production build testing)
  preview: {
    port: 4173,
    host: true,
  },
})