import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator.js';

describe('Separator', () => {
  it('is decorative by default', () => {
    render(<Separator />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('exposes its orientation when semantic', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});
