import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import million from 'million/compiler'
import { resolve } from 'path'

export default defineConfig(({ ssrBuild }) => {
  const isSSR = Boolean(ssrBuild)

  return {
    plugins: [
      !isSSR &&
        million.vite({
          auto: true,
          mode: 'react',
          isolate: true,
        }),
      react(),
    ].filter(Boolean),

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
      outDir: isSSR ? 'dist/server' : 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      manifest: !isSSR,
      ssrManifest: !isSSR,

      // Optimize bundle
      rollupOptions: isSSR
        ? {}
        : {
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

    ssr: {
      noExternal: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        '@apollo/client',
        'graphql',
        'million',
        'million/react',
      ],
    },

    // Optimizations
    optimizeDeps: isSSR
      ? {}
      : {
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
  }
})