import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimeField } from './TimeField.js';
import { TimePicker } from './TimePicker.js';

const segment = (name: string) => screen.getByRole('spinbutton', { name });

describe('TimeField', () => {
  it('fills segments by typing and emits a 24-hour value', async () => {
    const onChange = vi.fn();
    render(<TimeField aria-label="Start" hourCycle={24} onChange={onChange} />);
    expect(screen.getByRole('group', { name: 'Start' })).toBeInTheDocument();
    await userEvent.click(segment('Hour'));
    await userEvent.keyboard('9');
    expect(segment('Minute')).toHaveFocus();
    await userEvent.keyboard('05');
    expect(onChange).toHaveBeenLastCalledWith('09:05');
  });

  it('keeps midnight and steps with wrapping arrows', async () => {
    const onChange = vi.fn();
    render(
      <TimeField aria-label="Start" hourCycle={24} defaultValue="00:59" onChange={onChange} />,
    );
    expect(segment('Hour')).toHaveValue('00');
    await userEvent.click(segment('Minute'));
    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('00:00');
    await userEvent.click(segment('Hour'));
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('23:00');
  });

  it('maps a 12-hour clock with a period segment', async () => {
    const onChange = vi.fn();
    render(
      <TimeField
        aria-label="Start"
        hourCycle={12}
        locale="en-US"
        defaultValue="14:30"
        onChange={onChange}
      />,
    );
    expect(segment('Hour')).toHaveValue('02');
    expect(segment('AM/PM')).toHaveValue('PM');
    await userEvent.click(segment('AM/PM'));
    await userEvent.keyboard('a');
    expect(onChange).toHaveBeenLastCalledWith('02:30');
    await userEvent.click(segment('Hour'));
    await userEvent.keyboard('12');
    expect(onChange).toHaveBeenLastCalledWith('00:30');
  });

  it('clears with Backspace and flags times out of range', async () => {
    const onChange = vi.fn();
    render(
      <TimeField
        aria-label="Start"
        hourCycle={24}
        defaultValue="07:00"
        min="08:00"
        onChange={onChange}
      />,
    );
    expect(segment('Hour')).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(segment('Minute'));
    await userEvent.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});

describe('TimePicker', () => {
  it('opens a list from the trigger, picks a time and returns focus', async () => {
    const onChange = vi.fn();
    render(
      <TimePicker
        aria-label="Start"
        hourCycle={24}
        locale="en-GB"
        min="09:00"
        max="10:00"
        interval={30}
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Choose time' });
    await userEvent.click(trigger);
    const list = screen.getByRole('listbox', { name: 'Choose time' });
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      '09:00',
      '09:30',
      '10:00',
    ]);
    expect(screen.getAllByRole('option')[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('09:30');
    expect(list).toHaveAttribute('data-closing');
    expect(trigger).toHaveFocus();
    expect(segment('Minute')).toHaveValue('30');
  });

  it('opens with Alt+ArrowDown and closes on Escape', async () => {
    render(<TimePicker aria-label="Start" hourCycle={24} defaultValue="12:10" />);
    await userEvent.click(segment('Hour'));
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(screen.getByRole('option', { name: '12:30' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Choose time' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('starts on the last time when the value is after every option', async () => {
    render(<TimePicker aria-label="Start" hourCycle={24} locale="en-GB" defaultValue="23:50" />);
    await userEvent.click(screen.getByRole('button', { name: 'Choose time' }));
    expect(screen.getByRole('option', { name: '23:30' })).toHaveFocus();
  });

  it('disables the trigger when min is after max', () => {
    render(<TimePicker aria-label="Start" hourCycle={24} min="18:00" max="09:00" />);
    expect(screen.getByRole('button', { name: 'Choose time' })).toBeDisabled();
  });
});
