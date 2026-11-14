import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField.js';

describe('NumberField', () => {
  it('steps with the buttons and clamps to the bounds', async () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="Replicas" defaultValue={9} max={10} onChange={onChange} />);
    const input = screen.getByRole('spinbutton', { name: 'Replicas' });
    const increase = screen.getByRole('button', { name: 'Increase' });

    await userEvent.click(increase);
    expect(input).toHaveValue('10');
    expect(input).toHaveAttribute('aria-valuenow', '10');
    expect(increase).toBeDisabled();
    expect(onChange).toHaveBeenLastCalledWith(10);

    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(input).toHaveValue('9');
  });

  it('steps with the keyboard, without float drift', async () => {
    render(<NumberField aria-label="Opacity" defaultValue={0.1} min={0} max={1} step={0.1} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(input).toHaveValue('0.3');
    await userEvent.keyboard('{End}');
    expect(input).toHaveValue('1');
    await userEvent.keyboard('{Home}{PageUp}');
    expect(input).toHaveValue('1');
  });

  it('commits typed text on blur, clamping and rejecting garbage', async () => {
    const onChange = vi.fn();
    render(<NumberField aria-label="Port" defaultValue={80} max={65535} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');

    await userEvent.clear(input);
    await userEvent.type(input, '99999');
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.tab();
    expect(input).toHaveValue('65535');
    expect(onChange).toHaveBeenLastCalledWith(65535);

    await userEvent.clear(input);
    await userEvent.type(input, 'abc{Enter}');
    expect(input).toHaveValue('65535');

    await userEvent.clear(input);
    await userEvent.tab();
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
