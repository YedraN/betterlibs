import type { StorybookConfig } from '@storybook/react-vite'
import { generateScopedName } from '../../../packages/react/css-modules.js'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    '../../../packages/react/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true },
  docs: { defaultName: 'Documentación' },
  viteFinal: (config) => ({
    ...config,
    css: { ...config.css, modules: { ...config.css?.modules, generateScopedName } },
  }),
}

export default config
