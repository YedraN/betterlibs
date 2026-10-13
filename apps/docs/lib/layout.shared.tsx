import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { appName, gitConfig, playgroundUrl, storybookUrl } from './shared'

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
      { text: 'Documentación', url: '/docs', active: 'url' },
      { text: 'Galería', url: '/docs/galeria', active: 'nested-url' },
      { text: 'Plantillas', url: `${playgroundUrl}/plantillas/producto`, external: true },
      { text: 'Storybook', url: storybookUrl, external: true },
      {
        type: 'icon',
        text: 'GitHub',
        label: 'GitHub',
        icon: (
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.608-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.595 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        ),
        url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
        external: true,
      },
    ],
  }
}
