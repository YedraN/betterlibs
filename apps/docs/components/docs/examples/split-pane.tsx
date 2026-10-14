'use client'
import { SplitPane } from '@betterlibs/react/advanced'
export function SplitPaneExample({ vertical = false }: { vertical?: boolean }) {
  return (
    <SplitPane
      label="Editor y vista previa"
      orientation={vertical ? 'vertical' : 'horizontal'}
      first={
        <div>
          <h3>Editor</h3>
          <p>Escribe el contenido de tu próxima colección.</p>
        </div>
      }
      second={
        <div>
          <h3>Vista previa</h3>
          <p>Los paneles conservan su contenido al ajustar el tamaño.</p>
        </div>
      }
    />
  )
}
