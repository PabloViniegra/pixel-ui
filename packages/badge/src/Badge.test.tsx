import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge.js';

describe('Badge', () => {
  it('renders text with tone and appearance', () => {
    render(
      <Badge tone="danger" appearance="solid">
        Error
      </Badge>,
    );
    const badge = screen.getByText('Error');
    expect(badge).toHaveAttribute('data-tone', 'danger');
    expect(badge).toHaveAttribute('data-appearance', 'solid');
  });

  it('renders a decorative pulsing dot', () => {
    const { container } = render(<Badge dot="pulse">Building</Badge>);
    const dot = container.querySelector('.pxl-badge__dot');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot).toHaveAttribute('data-pulse', 'true');
  });
});
