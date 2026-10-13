import { useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../react/dist/index.js'
import { useSpringTabsIndicator } from '../src/index'

export function SpringTabsFixture() {
  const ref = useRef<HTMLDivElement>(null)
  useSpringTabsIndicator(ref)
  return (
    <Tabs defaultValue="a">
      <TabsList ref={ref} aria-label="Vista">
        <TabsTrigger value="a">Leer</TabsTrigger>
        <TabsTrigger value="b">Editar</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Leer</TabsContent>
      <TabsContent value="b">Editar</TabsContent>
    </Tabs>
  )
}
