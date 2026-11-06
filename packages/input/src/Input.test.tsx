import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input.js';

describe('Input', () => {
  it('takes its label, description and required state from Field', () => {
    render(
      <Field label="Email" description="We never share it." required>
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription('We never share it.');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('is invalid and described by the error inside a Field with an error', () => {
    render(
      <Field label="Email" description="Work address" error="Enter a valid email">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Enter a valid email');
  });

  it('forwards typing to the native input', async () => {
    render(<Input aria-label="Project" prefix="pixel-ui/" />);
    const input = screen.getByRole('textbox', { name: 'Project' });
    await userEvent.type(input, 'docs');
    expect(input).toHaveValue('docs');
  });
});
