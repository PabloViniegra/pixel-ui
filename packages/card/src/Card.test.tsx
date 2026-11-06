import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardDescription, CardHeader, CardTitle } from './Card.js';

describe('Card', () => {
  it('renders its parts', () => {
    render(
      <Card interactive data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toHaveAttribute('data-interactive', 'true');
  });
});
