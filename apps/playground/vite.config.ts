import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Las rutas son del lado del cliente: el servidor de desarrollo devuelve index.html para todas.
  appType: 'spa',
})
