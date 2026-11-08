import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker.js';

describe('DateRangePicker', () => {
  it('picks both ends in the calendar and fills both fields', async () => {
    const onChange = vi.fn();
    render(
      <Field label="Stay">
        <DateRangePicker
          locale="en-US"
          calendarProps={{ defaultMonth: new Date(2026, 2, 1) }}
          onChange={onChange}
        />
      </Field>,
    );
    expect(screen.getByRole('group', { name: 'Stay Start date' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Choose dates' }));
    await userEvent.click(screen.getByRole('button', { name: 'Thursday, March 12, 2026' }));
    await userEvent.click(screen.getByRole('button', { name: 'Monday, March 16, 2026' }));

    expect(onChange).toHaveBeenLastCalledWith({
      start: new Date(2026, 2, 12),
      end: new Date(2026, 2, 16),
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const days = screen.getAllByRole('spinbutton', { name: 'Day' });
    expect(days.map((d) => (d as HTMLInputElement).value)).toEqual(['12', '16']);
  });

  it('keeps a reversed typed range and flags it instead of emitting it', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        locale="en-GB"
        aria-label="Stay"
        startName="from"
        endName="to"
        defaultValue={{ start: new Date(2026, 2, 10), end: new Date(2026, 2, 20) }}
        onChange={onChange}
      />,
    );
    const [, endDay] = screen.getAllByRole('spinbutton', { name: 'Day' });
    endDay?.focus();
    await userEvent.keyboard('05');
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(endDay).toHaveValue('05');
    expect(endDay).toHaveAttribute('aria-invalid', 'true');
    const hidden = (n: string) => document.querySelector(`input[type="hidden"][name="${n}"]`);
    expect(hidden('from')).toHaveValue('');
    expect(hidden('to')).toHaveValue('');
  });
});
