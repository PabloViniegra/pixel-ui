import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Clock, FlipCounter } from './FlipClock.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('FlipCounter', () => {
  it('pads, exposes the value once and flips only the changed digit', () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<FlipCounter value={7} minDigits={3} />);
    expect(screen.getByText('007')).toHaveClass('pxl-visually-hidden');

    rerender(<FlipCounter value={8} minDigits={3} />);
    const flipping = container.querySelectorAll('[data-flipping]');
    expect(flipping).toHaveLength(1);
    expect(flipping[0]?.textContent).toBe('8778');

    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(container.querySelector('[data-flipping]')).toBeNull();
  });
});

describe('Clock', () => {
  it('ticks in the requested time zone', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-06T13:05:09Z'));
    render(<Clock timeZone="Europe/Madrid" />);
    const timer = screen.getByRole('timer');
    expect(timer).toHaveTextContent('14:05:09');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(timer).toHaveTextContent('14:05:10');
  });
});
