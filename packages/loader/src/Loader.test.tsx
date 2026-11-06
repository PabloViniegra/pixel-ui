import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Loader } from './Loader.js';

describe('Loader', () => {
  it('announces its label as a status', () => {
    render(<Loader label="Fetching logs" />);
    expect(screen.getByRole('status')).toHaveTextContent('Fetching logs');
  });

  it('renders a 3×3 grid', () => {
    const { container } = render(<Loader pattern="scan" />);
    expect(container.querySelectorAll('.pxl-loader__cell')).toHaveLength(9);
  });
});
