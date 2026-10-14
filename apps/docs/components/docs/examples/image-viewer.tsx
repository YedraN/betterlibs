'use client'
import { ImageViewer } from '@betterlibs/react/advanced'
export function ImageViewerExample() {
  return (
    <ImageViewer
      label="Portadas de colección"
      images={[
        {
          id: 'atlas',
          src: '/images/viewer-atlas.svg',
          alt: 'Portada Atlas con una retícula y una letra A',
          caption: 'Atlas: una estructura para conectar piezas.',
        },
        {
          id: 'notebook',
          src: '/images/viewer-cuaderno.svg',
          alt: 'Cuaderno con líneas de texto y una marca de lectura',
          caption: 'Cuaderno: espacio para tus referencias.',
        },
      ]}
    />
  )
}
