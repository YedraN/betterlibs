import type { ReactNode } from 'react'
import { Accordion, AccordionItem } from '../../components/Accordion/Accordion'
import { Container } from '../../components/Container/Container'
import { Grid } from '../../components/Grid/Grid'
import { Section } from '../../components/Section/Section'
import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { type BlockBaseProps, BlockSection, blockTitleId, itemHeadingLevel } from '../shared'
import styles from './FAQ.module.css'

export type FaqItem = {
  question: string
  answer: ReactNode
  /** Respuesta en texto plano para los datos estructurados (si `answer` no es texto). */
  answerText?: string
}

export type FAQProps = BlockBaseProps & {
  items: FaqItem[]
  /**
   * - `accordion`: preguntas desplegables, una columna.
   * - `split`: cabecera a la izquierda (fija al hacer scroll) y preguntas a la derecha.
   * - `columns`: todas las respuestas a la vista en dos columnas (pocas preguntas y cortas).
   * @default 'accordion'
   */
  variant?: 'accordion' | 'split' | 'columns'
  /** Abre la primera pregunta al cargar. @default false */
  openFirst?: boolean
  /** Añade los datos estructurados `FAQPage` de schema.org. @default false */
  structuredData?: boolean
}

function answerToText(item: FaqItem) {
  return item.answerText ?? (typeof item.answer === 'string' ? item.answer : undefined)
}

function Schema({ items }: { items: FaqItem[] }) {
  const entities = items
    .map((item) => ({ item, text: answerToText(item) }))
    .filter((entry): entry is { item: FaqItem; text: string } => Boolean(entry.text))
    .map(({ item, text }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text },
    }))
  if (entities.length === 0) return null
  const data = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: entities }
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado y escapado
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** Preguntas frecuentes en acordeón, en dos columnas o con la cabecera a un lado. */
export function FAQ({
  items,
  variant = 'accordion',
  openFirst = false,
  structuredData = false,
  headingLevel = 2,
  ...block
}: FAQProps) {
  const itemLevel = itemHeadingLevel(headingLevel)
  const Question = `h${itemLevel}` as const
  const accordion = (
    <Accordion
      headingLevel={itemLevel}
      defaultValue={openFirst ? 'faq-0' : undefined}
      className={styles.accordion}
    >
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
        <AccordionItem key={index} value={`faq-${index}`} title={item.question}>
          {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
        </AccordionItem>
      ))}
    </Accordion>
  )
  const schema = structuredData ? <Schema items={items} /> : null

  if (variant === 'split') {
    const {
      title,
      eyebrow,
      description,
      actions,
      tone,
      spacing,
      containerSize,
      id,
      className,
      style,
    } = block
    const titleId = blockTitleId(id, title)
    return (
      <Section
        id={id}
        tone={tone}
        spacing={spacing}
        className={className}
        style={style}
        aria-labelledby={title ? titleId : undefined}
      >
        <Container size={containerSize ?? 'xl'} className={styles.split}>
          {title && (
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              actions={actions}
              headingLevel={headingLevel}
              titleId={titleId}
              className={styles.splitHeader}
            />
          )}
          {accordion}
        </Container>
        {schema}
      </Section>
    )
  }

  return (
    <BlockSection
      {...block}
      headingLevel={headingLevel}
      containerSize={block.containerSize ?? (variant === 'accordion' ? 'md' : 'xl')}
    >
      {variant === 'columns' ? (
        <Grid columns={{ base: 1, md: 2 }} gap="8" className={styles.columns}>
          {items.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
            <div key={index} className={styles.entry}>
              <Question className={styles.question}>{item.question}</Question>
              <div className={styles.answer}>
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </div>
            </div>
          ))}
        </Grid>
      ) : (
        accordion
      )}
      {schema}
    </BlockSection>
  )
}
