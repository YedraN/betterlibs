import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { generateScopedName } from './css-modules.js'

export default defineConfig({
  plugins: [react()],
  css: { modules: { generateScopedName } },
  build: {
    outDir: 'dist/advanced',
    target: 'es2022',
    cssCodeSplit: false,
    sourcemap: true,
    lib: { entry: resolve(import.meta.dirname, 'src/advanced/index.ts'), formats: ['es'] },
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@radix-ui\//, /^@betterlibs\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src/advanced',
        entryFileNames: '[name].js',
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith('.css') ? 'styles.css' : '[name][extname]',
      },
    },
  },
})
