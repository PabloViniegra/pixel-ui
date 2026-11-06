import { Field } from '@pixel-ui/field';
import { render, screen } from '@testing-library/react';
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
});
