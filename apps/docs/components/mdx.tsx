import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { CssReference, PropsTable } from './docs/api'
import { CookieConsentDemo, NewsletterDemo } from './docs/blocks-demos'
import { ContactFormDemo } from './docs/contact-form-demo'
import { Preview } from './docs/preview'
import { ThemeBuilder } from './docs/theme-builder'
import { ToastDemo } from './docs/toast-demo'
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
    PropsTable,
    CssReference,
    ContactFormDemo,
    ToastDemo,
    NewsletterDemo,
    CookieConsentDemo,
    ThemeBuilder,
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
