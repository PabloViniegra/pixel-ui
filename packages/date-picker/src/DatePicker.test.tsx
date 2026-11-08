import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker.js';

describe('DatePicker', () => {
  it('picks a day from the calendar, fills the field and returns focus', async () => {
    const onChange = vi.fn();
    render(
      <Field label="Due date">
        <DatePicker locale="en-US" defaultValue={new Date(2026, 2, 10)} onChange={onChange} />
      </Field>,
    );
    const trigger = screen.getByRole('button', { name: 'Choose date' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tuesday, March 10, 2026' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 11));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('spinbutton', { name: 'Day' })).toHaveValue('11');
  });

  it('opens with Alt+ArrowDown from a segment and closes on Escape', async () => {
    render(<DatePicker locale="en-US" aria-label="Due date" />);
    screen.getByRole('spinbutton', { name: 'Month' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose date' })).toHaveFocus();
  });

  it('disables the calendar button inside a disabled Field', () => {
    render(
      <Field label="Due date" disabled>
        <DatePicker locale="en-GB" />
      </Field>,
    );
    expect(screen.getByRole('button', { name: 'Choose date' })).toBeDisabled();
  });
});
