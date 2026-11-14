import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea.js';

describe('ScrollArea', () => {
  it('is a focusable named region when labelled', () => {
    render(<ScrollArea aria-label="Releases">content</ScrollArea>);
    const region = screen.getByRole('region', { name: 'Releases' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveAttribute('data-orientation', 'vertical');
  });

  it('has no landmark role without a label', () => {
    render(<ScrollArea data-testid="area" orientation="both" />);
    expect(screen.getByTestId('area')).not.toHaveAttribute('role');
  });
});
