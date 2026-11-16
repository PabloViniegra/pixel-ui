import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select.js';

describe('Select', () => {
  it('starts on the placeholder and changes value', async () => {
    const onChange = vi.fn();
    render(
      <Field label="Region">
        <Select placeholder="Choose a region" onChange={onChange}>
          <option value="fra1">Frankfurt</option>
          <option value="iad1">Washington, D.C.</option>
        </Select>
      </Field>,
    );
    const select = screen.getByRole('combobox', { name: 'Region' });
    expect(select).toHaveValue('');
    await userEvent.selectOptions(select, 'iad1');
    expect(select).toHaveValue('iad1');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('starts on defaultValue instead of the placeholder', () => {
    render(
      <Select aria-label="Region" placeholder="Choose a region" defaultValue="fra1">
        <option value="fra1">Frankfurt</option>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'Region' })).toHaveValue('fra1');
  });

  it('is disabled and flagged invalid by its Field', () => {
    render(
      <Field label="Region" error="Pick a region" disabled>
        <Select>
          <option value="fra1">Frankfurt</option>
        </Select>
      </Field>,
    );
    const select = screen.getByRole('combobox', { name: 'Region' });
    expect(select).toBeDisabled();
    expect(select).toBeInvalid();
    expect(select).toHaveAccessibleDescription('Pick a region');
  });
});
