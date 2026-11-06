import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider.js';

describe('Slider', () => {
  it('lights cells up to the value and reports changes', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={50} segments={10} onValueChange={onValueChange} />,
    );
    expect(container.querySelectorAll('[data-lit]')).toHaveLength(5);

    fireEvent.change(screen.getByRole('slider', { name: 'Volume' }), { target: { value: '80' } });
    expect(onValueChange).toHaveBeenCalledWith(80);
    expect(container.querySelectorAll('[data-lit]')).toHaveLength(8);
  });

  it('exposes formatted text to assistive tech', () => {
    render(
      <Slider
        aria-label="Opacity"
        defaultValue={0.4}
        max={1}
        step={0.1}
        format={(v) => `${Math.round(v * 100)}%`}
      />,
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '40%');
  });
});
