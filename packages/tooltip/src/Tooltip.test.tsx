import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip.js';

describe('Tooltip', () => {
  it('describes its trigger after the hover delay and stays open while the pointer moves onto it', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Copy deployment URL" delay={300}>
        <button type="button">Copy</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button', { name: 'Copy' });

    fireEvent.pointerEnter(button, { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(300));
    expect(button).toHaveAccessibleDescription('Copy deployment URL');

    fireEvent.pointerLeave(button);
    fireEvent.pointerEnter(screen.getByRole('tooltip'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerLeave(screen.getByRole('tooltip'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('closes on Escape', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint" delay={0}>
        <button type="button">Help</button>
      </Tooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole('button'), { pointerType: 'mouse' });
    act(() => vi.runAllTimers());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
