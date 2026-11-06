import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrambleText } from './ScrambleText.js';

describe('ScrambleText', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'performance'] }));
  afterEach(() => vi.useRealTimers());

  it('always exposes the final text to assistive tech', () => {
    render(<ScrambleText text="HELLO" />);
    expect(screen.getByText('HELLO', { selector: '.pxl-visually-hidden' })).toBeInTheDocument();
  });

  it('resolves to the final text and calls onComplete', () => {
    const onComplete = vi.fn();
    const { container } = render(
      <ScrambleText text="PIXEL" duration={300} onComplete={onComplete} />,
    );
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(container.querySelector('.pxl-scramble__output')).toHaveTextContent('PIXEL');
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
