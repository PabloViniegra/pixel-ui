import { create } from 'storybook/theming';

export const pixelTheme = create({
  base: 'dark',
  brandTitle: 'PixelUI',
  brandUrl: 'https://github.com/OWNER/pixel-ui',
  brandTarget: '_blank',

  fontBase: '"Geist", system-ui, sans-serif',
  fontCode: '"Geist Mono", ui-monospace, monospace',

  colorPrimary: '#ededed',
  colorSecondary: '#3291ff',

  appBg: '#000000',
  appContentBg: '#0a0a0a',
  appPreviewBg: '#000000',
  appBorderColor: '#292929',
  appBorderRadius: 0,

  textColor: '#ededed',
  textMutedColor: '#a1a1a1',
  textInverseColor: '#000000',

  barBg: '#000000',
  barTextColor: '#a1a1a1',
  barSelectedColor: '#ededed',
  barHoverColor: '#3291ff',

  inputBg: '#0a0a0a',
  inputBorder: '#292929',
  inputTextColor: '#ededed',
  inputBorderRadius: 0,
});
