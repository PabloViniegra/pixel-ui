import { Field } from '@pixel-ui/field';
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
});
