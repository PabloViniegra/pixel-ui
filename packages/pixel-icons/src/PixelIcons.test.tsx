import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckIcon, pixelPath } from './index.js';

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
});
