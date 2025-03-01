import react from '@vitejs/plugin-react'
import fs from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const buildNumber = packageJson.version

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const isDev = command === 'serve' || mode === 'development'

  const plugins = [
    react(),
    svgr({include: '**/*.svg'}),
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
            'rxjs': ['rxjs', 'rxjs/operators'],
            'ethereum-providers': ['ethers'],
            'ui': ['recharts'],
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
