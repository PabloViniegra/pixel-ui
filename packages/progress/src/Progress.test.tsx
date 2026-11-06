import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress.js';

describe('Progress', () => {
  it('exposes progressbar semantics and lights the right number of cells', () => {
    const { container } = render(<Progress value={50} segments={10} label="Upload" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(container.querySelectorAll('[data-lit]')).toHaveLength(5);
  });

  it('clamps out-of-range values', () => {
    render(<Progress value={180} label="x" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'complete');
  });

  it('is indeterminate without a value', () => {
    render(<Progress label="x" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-state', 'indeterminate');
  });
});
