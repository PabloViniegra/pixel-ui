import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea.js';

describe('Textarea', () => {
  it('is labelled and flagged invalid by its Field', () => {
    render(
      <Field label="Notes" error="Too long">
        <Textarea />
      </Field>,
    );
    const box = screen.getByRole('textbox', { name: 'Notes' });
    expect(box).toBeInvalid();
    expect(box).toHaveAccessibleDescription('Too long');
  });

  it('takes invalid without a Field and defaults to four rows', async () => {
    render(<Textarea aria-label="Notes" invalid />);
    const box = screen.getByRole('textbox', { name: 'Notes' });
    expect(box).toBeInvalid();
    expect(box).toHaveAttribute('rows', '4');
    await userEvent.type(box, 'Line one');
    expect(box).toHaveValue('Line one');
  });
});
