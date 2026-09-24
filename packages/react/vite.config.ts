import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { generateScopedName } from './css-modules.js'

const external = [/^react($|\/)/, /^react-dom($|\/)/, /^@radix-ui\//, /^@betterlibs\//]

export default defineConfig({
  plugins: [react()],
  css: {
    modules: { generateScopedName },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rolldownOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith('.css') ? 'styles.css' : '[name][extname]',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
