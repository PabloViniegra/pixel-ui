import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd } from './Kbd.js';

describe('Kbd', () => {
  it('nests one key cap per key inside a combination', () => {
    const { container } = render(<Kbd keys={['⌘', 'Shift', 'P']} />);
    const group = container.firstElementChild;
    expect(group?.tagName).toBe('KBD');
    expect(Array.from(group?.querySelectorAll('kbd') ?? [], (k) => k.textContent)).toEqual([
      '⌘',
      'Shift',
      'P',
    ]);
  });

  it('renders a single key cap from children', () => {
    const { container } = render(<Kbd size="sm">Esc</Kbd>);
    const key = container.firstElementChild;
    expect(key).toHaveTextContent('Esc');
    expect(key).toHaveAttribute('data-size', 'sm');
    expect(key?.querySelector('kbd')).toBeNull();
  });
});
