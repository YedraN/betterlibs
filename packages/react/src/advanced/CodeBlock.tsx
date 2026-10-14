'use client'

import { useId, useState } from 'react'
import styles from './CodeBlock.module.css'
import { CopyButton } from './CopyButton'

export type CodeSnippet = { id: string; label: string; code: string; language?: string }
export type CodeBlockProps = {
  label: string
  snippets: CodeSnippet[]
  defaultSnippet?: string
  lineNumbers?: boolean
}

/** Código escapado por React, sin eval ni HTML externo. Variantes con radios nativos. */
export function CodeBlock({
  label,
  snippets,
  defaultSnippet,
  lineNumbers = false,
}: CodeBlockProps) {
  const radioName = useId()
  const [selected, setSelected] = useState(defaultSnippet ?? snippets[0]?.id)
  const snippet = snippets.find((item) => item.id === selected) ?? snippets[0]
  const lines =
    snippet?.code
      .split('\n')
      .map((line, index) => ({ id: `${snippet.id}-line-${index}`, line, number: index + 1 })) ?? []
  if (!snippet) return <p>No hay código configurado.</p>
  return (
    <figure className={styles.root}>
      <figcaption>{label}</figcaption>
      <div className={styles.header}>
        <fieldset>
          <legend className={styles.hidden}>Variante de código</legend>
          {snippets.map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name={radioName}
                checked={snippet.id === item.id}
                onChange={() => setSelected(item.id)}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        <CopyButton text={snippet.code} label={`Copiar ${snippet.label}`} />
      </div>
      <pre tabIndex={0} aria-label={`${label}: ${snippet.label}`}>
        <code data-language={snippet.language}>
          {lineNumbers
            ? lines.map(({ line, number, id }) => (
                <span className={styles.line} key={id}>
                  <span aria-hidden="true" className={styles.number}>
                    {number}
                  </span>
                  {line || '\u00a0'}
                </span>
              ))
            : snippet.code}
        </code>
      </pre>
    </figure>
  )
}
