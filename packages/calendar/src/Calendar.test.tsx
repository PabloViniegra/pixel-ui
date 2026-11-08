import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar.js';
import { addMonths, parseISODate, toISODate } from './date.js';

const day = (name: string) => screen.getByRole('button', { name });

describe('Calendar', () => {
  it('brings an outside value change into view', () => {
    const { rerender } = render(
      <Calendar locale="en-US" value={new Date(2026, 0, 10)} onChange={() => {}} />,
    );
    rerender(<Calendar locale="en-US" value={new Date(2026, 4, 20)} onChange={() => {}} />);
    expect(screen.getByRole('heading', { name: 'May 2026' })).toBeInTheDocument();
    expect(day('Wednesday, May 20, 2026')).toHaveAttribute('tabindex', '0');
  });

  it('selects a day and moves between days and months with the keyboard', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        locale="en-US"
        weekStartsOn={0}
        defaultValue={new Date(2026, 0, 31)}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('heading', { name: 'January 2026' })).toBeInTheDocument();
    const selected = day('Saturday, January 31, 2026');
    expect(selected).toHaveAttribute('tabindex', '0');

    selected.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(day('Sunday, February 1, 2026')).toHaveFocus();
    expect(screen.getByRole('heading', { name: 'February 2026' })).toBeInTheDocument();

    await userEvent.keyboard('{PageUp}{Enter}');
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 1));
  });

  it('picks a range in two clicks, in either order', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        mode="range"
        locale="en-US"
        defaultMonth={new Date(2026, 2, 1)}
        onChange={onChange}
      />,
    );
    await userEvent.click(day('Friday, March 20, 2026'));
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(day('Tuesday, March 10, 2026'));
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 10),
      end: new Date(2026, 2, 20),
    });
  });

  it('does not select days outside min and max', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        locale="en-US"
        defaultMonth={new Date(2026, 2, 1)}
        min={new Date(2026, 2, 5)}
        onChange={onChange}
      />,
    );
    const early = day('Wednesday, March 4, 2026');
    expect(early).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(early);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
  });
});

describe('date helpers', () => {
  it('round-trips ISO dates and rejects impossible ones', () => {
    expect(toISODate(parseISODate('2024-02-29') as Date)).toBe('2024-02-29');
    expect(parseISODate('2026-02-29')).toBeNull();
  });

  it('clamps the day when adding months', () => {
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
  });
});
