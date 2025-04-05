import react from '@vitejs/plugin-react'
import fs from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const buildNumber = packageJson.version

const pwaConfig = () => {
  return VitePWA({
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    strategies: 'injectManifest',
    srcDir: 'src/service-worker',
    filename: 'SWEntry.ts',
    includeAssets: [],
    injectManifest: {
      injectionPoint: 'self.__WB_MANIFEST',
    },

    manifest: {
      name: 'Scalpel',
      short_name: 'Scalpel',
      description: 'Scalpel private trading platform',
      theme_color: '#080404',
      background_color: '#080404',
      display: 'standalone',
      icons: [
        {
          src: 'pwa/192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa/512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa/192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: 'pwa/512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
    },
    workbox: {
      navigateFallbackDenylist: [/^wss?:\/\//],
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30
            }
          }
        }
      ],
      navigateFallback: 'index.html',
    },

    devOptions: {
      enabled: true,
      type: 'module',
      navigateFallback: 'index.html'
    }
  })
}

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const isDev = command === 'serve' || mode === 'development'

  const plugins = [
    react(),
    svgr({include: '**/*.svg'}),
    pwaConfig(),
  ]

  if (isDev) {
    plugins.push(
      // @ts-expect-error is ok.
      visualizer({
        open: false,
        filename: './dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-core': ['react', 'react-dom', 'react-router-dom'],
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins,
    define: {
      'process.env.VITE_BUILD_NUMBER': JSON.stringify(buildNumber),
    },
  }
})
