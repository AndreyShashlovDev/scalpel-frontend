import react from '@vitejs/plugin-react'
import fs from 'fs'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const buildNumber = packageJson.version

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    // basicSsl(),
    svgr({include: '**/*.svg'}),
    // VitePWA({
    //   disable: false,
    //   registerType: 'autoUpdate',
    //   injectRegister: false,
    //   includeAssets: ['favicon.ico', '/icons/icon-192x192.png', 'robots.txt'],
    //   injectManifest: {
    //     injectionPoint: 'self.__WB_MANIFEST',
    //     globPatterns: []
    //   },
    //   workbox: {
    //     // Пропустить предварительное кэширование
    //     globPatterns: []
    //   },
    //   strategies: 'injectManifest',
    //   manifest: false,
    // })
  ],
  define: {
    'process.env.VITE_BUILD_NUMBER': JSON.stringify(buildNumber),
  },
})
