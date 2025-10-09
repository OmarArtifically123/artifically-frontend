import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import million from 'million/compiler'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const ssrBuild = configEnv.isSsrBuild
  const enableMillion = process.env.ENABLE_MILLION === 'true'
  const enableAnalyze = process.env.ANALYZE === 'true'

  const plugins = []

  if (enableMillion) {
    plugins.push(
      million.vite({
        auto: {
          threshold: 0.05,
          skip: ['App', 'Router', 'BrowserRouter', 'Routes', 'Route'],
          rsc: false
        },
        ssr: true,
        optimize: false
      })
    )
  }

  plugins.push(
    react(),
    enableAnalyze &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html'
      })
  )

  const build = {
    target: 'es2015',
    minify: 'esbuild',
    cssCodeSplit: true,
    cssMinify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    rollupOptions: {}
  }

  if (!ssrBuild) {
    build.manifest = true
    build.ssrManifest = true
    build.rollupOptions.output = {
      manualChunks: (id) => {
        if (!id.includes('node_modules')) {
          return undefined
        }

        if (id.includes('three')) {
          return 'three-vendor'
        }

        if (id.includes('framer-motion')) {
          return 'framer-vendor'
        }

        if (id.includes('gsap')) {
          return 'gsap-vendor'
        }

        return 'vendor'
      },
      entryFileNames: 'assets/[name]-[hash].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]'
    }
  }

  return {
    plugins: plugins.filter(Boolean),
    build,
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  }
})