import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from './Link.js';

describe('Link', () => {
  it('opens external links safely in a new tab and says so', () => {
    render(
      <Link href="https://example.com" external rel="me">
        Docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Docs (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'me noopener noreferrer');
  });

  it('leaves internal links untouched', () => {
    render(<Link href="/pricing">Pricing</Link>);
    const link = screen.getByRole('link', { name: 'Pricing' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
});
