import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Rating } from './Rating.js';

describe('Rating', () => {
  it('selects with click and arrows, and clears on a second click', async () => {
    const onChange = vi.fn();
    render(<Rating aria-label="Rate" onChange={onChange} />);
    expect(screen.getByRole('radiogroup', { name: 'Rate' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: '3 stars' }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeChecked();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(4);
    await userEvent.click(screen.getByRole('radio', { name: '4 stars' }));
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('lights stars up to the value', () => {
    const { container } = render(<Rating defaultValue={2} />);
    expect(container.querySelectorAll('[data-lit]')).toHaveLength(2);
  });

  it('shows a read-only score as an image with fractional fill', () => {
    const { container } = render(<Rating readOnly value={3.5} />);
    expect(screen.getByRole('img', { name: '3.5 out of 5 stars' })).toBeInTheDocument();
    expect(screen.queryByRole('radio')).toBeNull();
    const stars = container.querySelectorAll<HTMLElement>('.pxl-rating__star');
    expect(stars[3]?.style.getPropertyValue('--_fill')).toBe('50%');
  });
});
