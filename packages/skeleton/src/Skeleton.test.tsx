import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton.js';

describe('Skeleton', () => {
  it('is hidden from assistive tech and sized by props', () => {
    const { container } = render(<Skeleton width={120} height={16} radius="full" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.width).toBe('120px');
    expect(el).toHaveAttribute('data-radius', 'full');
  });

  it('renders one bar per line', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.querySelectorAll('.pxl-skeleton')).toHaveLength(3);
  });
});
