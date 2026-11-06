/**
 * JS mirror of the CSS motion tokens, for components that animate from script
 * (e.g. ScrambleText) and must stay in sync with the CSS timings.
 */
export const duration = {
  instant: 80,
  fast: 140,
  base: 240,
  slow: 480,
} as const;

export const easing = {
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  steps: 'steps(6, end)',
} as const;

/** Size of one pixel-grid unit in px. */
export const unit = 4;

export const pixelFonts = ['square', 'grid', 'circle', 'triangle', 'line'] as const;
export type PixelFont = (typeof pixelFonts)[number];

/** CSS variable holding the font stack for a Geist Pixel variant. */
export function pixelFontVar(font: PixelFont): string {
  return font === 'square' ? 'var(--pxl-font-pixel)' : `var(--pxl-font-pixel-${font})`;
}
