'use client'
import { Dropzone } from '@betterlibs/react/advanced'
export function DropzoneExample() {
  return (
    <Dropzone
      label="Archivos del proyecto"
      accept="image/png,image/jpeg,.txt,.pdf"
      maxFiles={3}
      maxBytes={5 * 1024 * 1024}
    />
  )
}
