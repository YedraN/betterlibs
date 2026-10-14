'use client'
import { CodeBlock } from '@betterlibs/react/advanced'
export function CodeBlockExample() {
  return (
    <CodeBlock
      label="Una acción con Betterlibs"
      lineNumbers
      snippets={[
        {
          id: 'react',
          label: 'React',
          language: 'tsx',
          code: "import { Button } from '@betterlibs/react'\n\nexport function Action() {\n  return <Button>Guardar colección</Button>\n}",
        },
        {
          id: 'html',
          label: 'HTML',
          language: 'html',
          code: '<button type="button">\n  Guardar colección\n</button>',
        },
      ]}
    />
  )
}
