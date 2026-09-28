import '@betterlibs/tokens/index.css'
import '@betterlibs/react/styles.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('No se encuentra el elemento #root')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción las páginas llegan prerenderizadas (`scripts/prerender.ts`): se hidratan.
// En desarrollo el HTML viene vacío y se renderiza en el cliente.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
