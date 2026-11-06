import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import { pixelTheme } from './theme.js';
import '@pixel-ui/tokens/styles.css';
import './preview.css';

interface PixelUIParams {
  name?: string;
  version?: string;
}

/** Syncs the toolbar theme with `data-theme` on <html>. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark';
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return <Story />;
};

/** Pixel badge showing the package name + version of the component on screen. */
const withVersion: Decorator = (Story, context) => {
  const meta = context.parameters.pixelui as PixelUIParams | undefined;
  return (
    <>
      {meta?.version && context.viewMode === 'story' && (
        <a
          className="sb-pxl-version"
          href={`https://www.npmjs.com/package/${meta.name}/v/${meta.version}`}
          target="_blank"
          rel="noreferrer"
          title={`${meta.name}@${meta.version}`}
        >
          <span className="sb-pxl-version__name">{meta.name}</span>
          <span className="sb-pxl-version__tag">v{meta.version}</span>
        </a>
      )}
      <Story />
    </>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [withVersion, withTheme],
  parameters: {
    layout: 'centered',
    controls: { expanded: true, sort: 'requiredFirst' },
    backgrounds: { disabled: true },
    a11y: { test: 'error' },
    docs: { theme: pixelTheme },
    options: {
      storySort: {
        order: ['Introduction', 'Versions', 'Foundations', 'Components'],
      },
    },
  },
};

export default preview;
