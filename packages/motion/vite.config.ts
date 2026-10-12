import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
    lib: { entry: resolve(import.meta.dirname, 'src/index.ts'), formats: ['es'] },
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^motion($|\/)/, /^@betterlibs\//],
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] },
})
