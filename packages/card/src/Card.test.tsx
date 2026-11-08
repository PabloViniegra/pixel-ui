import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardDescription, CardHeader, CardLink, CardTitle } from './Card.js';

describe('Card', () => {
  it('renders its parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('exposes a clickable card as a link named by its title', () => {
    render(
      <Card>
        <CardTitle>
          <CardLink href="/docs">Docs</CardLink>
        </CardTitle>
      </Card>,
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
  });
});
