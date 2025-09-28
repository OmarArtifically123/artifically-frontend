import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import million from 'million/compiler'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const ssrBuild = configEnv.isSsrBuild
  const enableMillion = process.env.ENABLE_MILLION === 'true'

  const build = {
    rollupOptions: {}
  }

  if (!ssrBuild) {
    build.manifest = true
    build.ssrManifest = true
    build.rollupOptions.output = {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router-dom'],
        apollo: ['@apollo/client']
      }
    }
  }

  const plugins = [react()]

  if (enableMillion) {
    plugins.unshift(
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

  return {
    plugins,
    build,
    ssr: {
      noExternal: ['@apollo/client']
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@apollo/client']
    }
  }
})
