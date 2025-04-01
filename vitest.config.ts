import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['**/*.{test,spec}.{ts,tsx}'],
    deps: {
      optimizer: {
        web: {
          include: ['reflect-metadata']
        }
      }
    },
    alias: {
      '@di-core': resolve(__dirname, './src/utils/di-core'),
    },
  },
  resolve: {
    alias: {
      '@di-core': resolve(__dirname, './src/utils/di-core'),
    }
  }
})
