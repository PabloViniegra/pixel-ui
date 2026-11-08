import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateField } from './DateField.js';

describe('DateField', () => {
  it('orders segments by locale and emits a date once every segment is filled', async () => {
    const onChange = vi.fn();
    render(
      <Field label="Start date">
        <DateField locale="en-US" onChange={onChange} name="start" />
      </Field>,
    );
    const group = screen.getByRole('group', { name: 'Start date' });
    const [first, second, third] = screen.getAllByRole('spinbutton');
    expect(first).toHaveAccessibleName('Month');
    expect(second).toHaveAccessibleName('Day');
    expect(third).toHaveAccessibleName('Year');

    await userEvent.click(screen.getByText('Start date'));
    expect(first).toHaveFocus();
    await userEvent.keyboard('3');
    expect(second).toHaveFocus();
    await userEvent.keyboard('14');
    expect(third).toHaveFocus();
    await userEvent.keyboard('2026');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 14));
    expect(group.querySelector('input[type="hidden"]')).toHaveValue('2026-03-14');
  });

  it('steps with the arrow keys and clears with Backspace', async () => {
    const onChange = vi.fn();
    render(
      <DateField
        locale="en-GB"
        aria-label="Due"
        defaultValue={new Date(2026, 0, 31)}
        onChange={onChange}
      />,
    );
    const day = screen.getByRole('spinbutton', { name: 'Day' });
    day.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(day).toHaveAttribute('aria-valuenow', '1');
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 0, 1));

    await userEvent.keyboard('{Backspace}');
    expect(day).toHaveValue('');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('reverts to the controlled value when the parent rejects a typed date', async () => {
    const onChange = vi.fn();
    render(
      <DateField
        locale="en-GB"
        aria-label="Due"
        value={new Date(2026, 0, 31)}
        onChange={onChange}
      />,
    );
    const day = screen.getByRole('spinbutton', { name: 'Day' });
    day.focus();
    await userEvent.keyboard('15');
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 15));
    expect(day).toHaveValue('31');
  });

  it('flags impossible dates as invalid', async () => {
    render(<DateField locale="en-GB" aria-label="Due" />);
    screen.getByRole('spinbutton', { name: 'Day' }).focus();
    await userEvent.keyboard('31022026');
    expect(screen.getByRole('spinbutton', { name: 'Year' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
