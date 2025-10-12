import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import million from 'million/compiler'
import { gzipSync } from 'node:zlib'

const KB = 1024

const bundleBudgetPlugin = ({
  jsBudgetBytes = 200 * KB,
  cssBudgetBytes = 20 * KB,
} = {}) => {
  const formatSize = (bytes) => {
    if (bytes < KB) return `${bytes} B`
    return `${(bytes / KB).toFixed(1)} KB`
  }

  const collectStaticChunks = (bundle, rootChunk) => {
    const stack = [rootChunk.fileName]
    const visited = new Set()

    while (stack.length > 0) {
      const currentFile = stack.pop()
      if (!currentFile || visited.has(currentFile)) continue
      visited.add(currentFile)

      const chunk = bundle[currentFile]
      if (!chunk || chunk.type !== 'chunk') continue

      const imports = [...(chunk.imports ?? []), ...(chunk.implicitlyLoadedBefore ?? [])]
      for (const imported of imports) {
        if (visited.has(imported)) continue

        const importedChunk = bundle[imported]
        if (importedChunk && importedChunk.type === 'chunk' && importedChunk.isDynamicEntry) {
          continue
        }

        stack.push(imported)
      }
    }

    return visited
  }

  const sumGzipSize = (content) => gzipSync(Buffer.from(content)).length

  return {
    name: 'bundle-budget-guard',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const entryCandidates = Object.values(bundle).filter(
        (chunk) => chunk.type === 'chunk' && chunk.isEntry,
      )

      const entryChunk = entryCandidates.find((chunk) => {
        const facade = typeof chunk.facadeModuleId === 'string'
          ? chunk.facadeModuleId.replace(/\\/g, '/')
          : ''
        return (
          facade.endsWith('src/entry-client.jsx') ||
          facade.endsWith('/index.html') ||
          chunk.name === 'index'
        )
      }) ?? entryCandidates[0]

      if (!entryChunk) {
        this.warn('[bundle-budget] Unable to locate main entry chunk; skipping budget check')
        return
      }

      const staticChunkFiles = collectStaticChunks(bundle, entryChunk)
      let totalJsBytes = 0
      const cssFiles = new Set()

      for (const fileName of staticChunkFiles) {
        const chunk = bundle[fileName]
        if (!chunk || chunk.type !== 'chunk') continue

        totalJsBytes += sumGzipSize(chunk.code)

        const css = chunk.viteMetadata?.importedCss
        if (css) {
          for (const cssFile of css) {
            cssFiles.add(cssFile)
          }
        }
      }

      let totalCssBytes = 0
      for (const fileName of cssFiles) {
        const asset = bundle[fileName]
        if (!asset) continue

        const source = asset.type === 'asset' ? asset.source : asset.code
        if (!source) continue

        const raw = typeof source === 'string' ? source : Buffer.from(source)
        totalCssBytes += gzipSync(Buffer.from(raw)).length
      }

      if (totalJsBytes > jsBudgetBytes) {
        this.error(
          new Error(
            `[bundle-budget] Main route JS (${formatSize(totalJsBytes)}) exceeds budget of ${formatSize(jsBudgetBytes)}`,
          ),
        )
      }

      if (totalCssBytes > cssBudgetBytes) {
        this.error(
          new Error(
            `[bundle-budget] Main route CSS (${formatSize(totalCssBytes)}) exceeds budget of ${formatSize(cssBudgetBytes)}`,
          ),
        )
      }

      this.warn(
        `[bundle-budget] Main route payload — JS: ${formatSize(totalJsBytes)}, CSS: ${formatSize(totalCssBytes)}`,
      )
    },
  }
}

const performanceBudgetPlugin = ({ entryLimitKB = 300 } = {}) => {
  let trackedChunks = []

  return {
    name: 'performance-budget',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      trackedChunks = Object.values(bundle)
        .filter((chunk) => chunk.type === 'chunk' && chunk.isEntry)
        .map((chunk) => ({
          name: chunk.name,
          size: chunk.code.length,
        }))
    },
    closeBundle() {
      trackedChunks.forEach((chunk) => {
        const sizeKb = chunk.size / KB
        if (sizeKb > entryLimitKB) {
          this.warn(
            `[performance-budget] Main bundle "${chunk.name}" exceeds budget: ${sizeKb.toFixed(1)}KB (limit ${entryLimitKB}KB)`,
          )
        }
      })
      trackedChunks = []
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const ssrBuild = configEnv.isSsrBuild
  const enableMillion = process.env.ENABLE_MILLION === 'true'
  const enableAnalyze = process.env.ANALYZE === 'true'

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

  if (enableAnalyze) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html'
      })
    )
  }

  const manualChunkGroups = {
    'react-core': ['react', 'react-dom'],
    router: ['react-router-dom'],
    apollo: ['@apollo/client', 'graphql'],
    'animations-critical': ['framer-motion'],
    'animations-deferred': ['gsap', '@gsap/react'],
    'ui-utils': ['lodash', 'date-fns'],
    three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
    analytics: ['@vercel/analytics', '@builder.io/partytown'],
  }

  const build = {
    target: 'es2015',
    minify: 'esbuild',
    cssCodeSplit: true,
    cssMinify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
  }

  if (!ssrBuild) {
    build.manifest = true
    build.ssrManifest = true
    build.rollupOptions = {
      output: {
        manualChunks(id) {
          if (id.includes('src/components/HeroScene')) {
            return 'three'
          }

          if (!id.includes('node_modules')) {
            return undefined
          }

          for (const [chunkName, modules] of Object.entries(manualChunkGroups)) {
            if (modules.some((moduleId) => id.includes(`/node_modules/${moduleId}/`))) {
              return chunkName
            }
          }

          if (id.includes('/node_modules/three') || id.includes('/node_modules/@react-three/')) {
            return 'three'
          }
          
          if (id.includes('/node_modules/gsap')) {
            return 'animations-deferred'
          }

          return 'vendor'
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }

    plugins.push(
      bundleBudgetPlugin({
        jsBudgetBytes: 200 * KB,
        cssBudgetBytes: 20 * KB,
      })
    )

    plugins.push(
      performanceBudgetPlugin({
        entryLimitKB: 300,
      }),
    )
  }

  return {
    plugins,
    build,
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-virtual',
        'use-debounce',
        '@vercel/analytics',
      ],
    }
  }
})