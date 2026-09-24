import { createGetUrl } from 'fumadocs-core/source'

export const appName = 'Betterlibs UI'
export const docsRoute = '/docs'
export const docsContentRoute = '/llms.mdx/docs'
export const storybookUrl = process.env.NEXT_PUBLIC_STORYBOOK_URL ?? 'http://localhost:6006'

export const gitConfig = {
  user: 'YedraN',
  repo: 'betterlibs',
  branch: 'main',
  contentDir: 'apps/docs/content/docs',
}

const getContentUrl = createGetUrl(docsContentRoute)

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md']
  return { segments, url: getContentUrl(segments, page.locale) }
}
