import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { Preview } from './docs/preview'
import {
  ColorScales,
  ContrastReport,
  IconGallery,
  SemanticColors,
  TokenTable,
  TypeScale,
} from './docs/tokens'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Preview,
    ColorScales,
    SemanticColors,
    ContrastReport,
    TypeScale,
    TokenTable,
    IconGallery,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
