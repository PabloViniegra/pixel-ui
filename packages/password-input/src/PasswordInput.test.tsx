import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PasswordInput } from './PasswordInput.js';

describe('PasswordInput', () => {
  it('hides the text until the toggle is pressed', async () => {
    const onVisibleChange = vi.fn();
    render(
      <PasswordInput
        aria-label="Password"
        defaultValue="secret"
        onVisibleChange={onVisibleChange}
      />,
    );
    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onVisibleChange).toHaveBeenLastCalledWith(true);
  });

  it('takes a custom toggle label and autoComplete', () => {
    render(<PasswordInput aria-label="Clave" autoComplete="new-password" toggleLabel="Mostrar" />);
    expect(screen.getByRole('button', { name: 'Mostrar' })).toBeInTheDocument();
    expect(screen.getByLabelText('Clave')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('disables the toggle with its Field and keeps the field invalid', () => {
    render(
      <Field label="Password" error="Too short" disabled>
        <PasswordInput />
      </Field>,
    );
    expect(screen.getByLabelText('Password')).toBeInvalid();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
  });
});
