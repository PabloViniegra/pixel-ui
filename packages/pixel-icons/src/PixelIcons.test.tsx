import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckIcon, createAnimatedPixelIcon, pixelPath } from './index.js';

describe('PixelIcons', () => {
  it('merges horizontal runs into one rectangle each', () => {
    expect(pixelPath(['.##.', '#..#'])).toBe('M1 0h2v1h-2zM0 1h1v1h-1zM3 1h1v1h-1z');
  });

  it('is decorative by default and named when labelled', () => {
    const { container, rerender } = render(<CheckIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    rerender(<CheckIcon label="Done" size={32} />);
    const icon = screen.getByRole('img', { name: 'Done' });
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('shape-rendering', 'crispEdges');
  });

  it('lays animated frames out as one strip and exposes the loop to CSS', () => {
    const frame = (lit: string) => [lit.padEnd(16, '.'), ...Array(15).fill('.'.repeat(16))];
    const Blink = createAnimatedPixelIcon('Blink', [frame('#'), frame('.#')], { duration: 400 });
    const { container } = render(<Blink style={{ color: 'red' }} />);
    const svg = container.querySelector('svg');
    expect(svg?.querySelector('.pxl-icon-frames path')).toHaveAttribute(
      'd',
      'M0 0h1v1h-1zM17 0h1v1h-1z',
    );
    expect(svg?.style.getPropertyValue('--pxl-icon-frames')).toBe('2');
    expect(svg?.style.getPropertyValue('--pxl-icon-duration')).toBe('400ms');
    expect(svg?.style.color).toBe('red');
  });
});
