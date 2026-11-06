import type { StorybookConfig } from '@storybook/react-vite';
import { defaultClientConditions } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../../../packages/*/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: {
    // TypeScript 7 ships without a programmatic API, so use the Babel-based
    // react-docgen instead of react-docgen-typescript.
    reactDocgen: 'react-docgen',
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {};
    // Load workspace packages straight from src/ (the "source" export condition)
    // so stories hot-reload without building the packages first.
    viteConfig.resolve.conditions = ['source', ...defaultClientConditions];
    return viteConfig;
  },
};

export default config;
