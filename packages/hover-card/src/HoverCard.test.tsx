import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HoverCard } from './HoverCard.js';

const card = () => screen.queryByText('Profile preview');

function setup() {
  render(
    <HoverCard content="Profile preview" openDelay={500} closeDelay={250}>
      <a href="#ada">@ada</a>
    </HoverCard>,
  );
  return screen.getByRole('link');
}

describe('HoverCard', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('opens after the hover delay and closes after leaving', () => {
    vi.useFakeTimers();
    const link = setup();
    fireEvent.pointerEnter(link, { pointerType: 'mouse' });
    act(() => vi.advanceTimersByTime(400));
    expect(card()).toBeNull();
    act(() => vi.advanceTimersByTime(100));
    expect(card()).toBeInTheDocument();
    expect(link).toHaveAttribute('aria-describedby', card()?.id);

    fireEvent.pointerLeave(link);
    fireEvent.pointerEnter(card() as HTMLElement);
    act(() => vi.advanceTimersByTime(300));
    expect(card()).toBeInTheDocument();
    fireEvent.pointerLeave(card() as HTMLElement);
    act(() => vi.advanceTimersByTime(250));
    expect(card()).toBeNull();
  });

  it('ignores touch', () => {
    vi.useFakeTimers();
    fireEvent.pointerEnter(setup(), { pointerType: 'touch' });
    act(() => vi.advanceTimersByTime(1000));
    expect(card()).toBeNull();
  });

  it('opens on keyboard focus and closes on Escape', async () => {
    // jsdom does not implement :focus-visible.
    const matches = Element.prototype.matches;
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, s) {
      return s === ':focus-visible' || matches.call(this, s);
    });
    setup();
    await userEvent.tab();
    expect(await screen.findByText('Profile preview')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(card()).toBeNull();
  });
});
