import { ScrollProgress, TextReveal } from '../dist/index.js'
export function ReadingFixture() {
  return (
    <>
      <h1>
        <TextReveal lines={['Espacio para leer.', 'Tiempo para entender.']} />
      </h1>
      <ScrollProgress />
    </>
  )
}
