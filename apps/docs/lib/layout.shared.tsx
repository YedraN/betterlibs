import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { appName, gitConfig, storybookUrl } from './shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-semibold">
          <span
            aria-hidden="true"
            className="grid size-6 place-items-center rounded-md bg-fd-primary text-xs text-fd-primary-foreground"
          >
            b
          </span>
          {appName}
        </span>
      ),
    },
    links: [
      { text: 'Documentación', url: '/docs', active: 'nested-url' },
      { text: 'Storybook', url: storybookUrl, external: true },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  }
}
