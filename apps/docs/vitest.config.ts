import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const storybookProject = (theme: 'dark' | 'light') => ({
  extends: true as const,
  plugins: [
    storybookTest({ configDir: path.join(dirname, '.storybook'), initialGlobals: { theme } }),
  ],
  test: {
    name: `storybook-${theme}`,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' as const }],
    },
  },
});

export default defineConfig({
  test: {
    projects: [storybookProject('dark'), storybookProject('light')],
  },
});
