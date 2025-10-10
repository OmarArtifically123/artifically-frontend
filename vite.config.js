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
        if (!visited.has(imported)) {
          stack.push(imported)
        }
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

  const build = {
    target: 'es2015',
    minify: 'esbuild',
    cssCodeSplit: true,
    cssMinify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true
  }

  if (!ssrBuild) {
    build.manifest = true
    build.ssrManifest = true
    build.rollupOptions = {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/three')) return 'three-vendor'
          if (id.includes('node_modules/gsap')) return 'gsap-vendor'
          if (id.includes('node_modules')) return 'vendor'
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
  }

  return {
    plugins,
    build,
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  }
})