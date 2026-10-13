import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { CssReference, PropsTable } from './docs/api'
import { CookieConsentDemo, NewsletterDemo } from './docs/blocks-demos'
import { CatalogFormsDemo, CatalogOverlaysDemo, PositionDemo } from './docs/catalog-demo'
import { ContactFormDemo } from './docs/contact-form-demo'
import { AnimatedNumberDemo, EditorialPageDemo } from './docs/editorial-demo'
import { MotionDemo } from './docs/motion-demo'
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
    MotionDemo,
    AnimatedNumberDemo,
    EditorialPageDemo,
    PropsTable,
    CssReference,
    ContactFormDemo,
    CatalogFormsDemo,
    CatalogOverlaysDemo,
    PositionDemo,
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
