import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Autocomplete } from './Autocomplete.js';

const options = [
  { value: 'fra1', label: 'Frankfurt' },
  { value: 'gru1', label: 'São Paulo' },
  { value: 'syd1', label: 'Sydney', disabled: true },
  { value: 'sfo1', label: 'San Francisco' },
];

function setup(onChange = vi.fn()) {
  render(
    <Field label="Region">
      <Autocomplete options={options} onChange={onChange} />
    </Field>,
  );
  return { input: screen.getByRole('combobox', { name: 'Region' }), onChange };
}

describe('Autocomplete', () => {
  it('filters ignoring accents and selects with the keyboard', async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, 'sa');
    const listbox = screen.getByRole('listbox', { name: 'Region' });
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'São Paulo',
      'San Francisco',
    ]);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('sfo1', { value: 'sfo1', label: 'San Francisco' });
    expect(input).toHaveValue('San Francisco');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('skips disabled options and restores the selected label on blur', async () => {
    const { input, onChange } = setup();
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'San Francisco' }).id,
    );
    await userEvent.click(screen.getByRole('option', { name: 'Frankfurt' }));
    expect(onChange).toHaveBeenLastCalledWith('fra1', options[0]);

    await userEvent.clear(input);
    await userEvent.type(input, 'xyz');
    expect(screen.getByRole('status')).toHaveTextContent('No results');
    expect(input).not.toHaveAttribute('aria-controls');
    await userEvent.tab();
    expect(input).toHaveValue('Frankfurt');
  });

  it('shows the label of a value or options set after mounting', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Autocomplete aria-label="Region" options={[]} value="gru1" onChange={onChange} />,
    );
    const input = screen.getByRole('combobox', { name: 'Region' });
    rerender(
      <Autocomplete aria-label="Region" options={options} value="gru1" onChange={onChange} />,
    );
    expect(input).toHaveValue('São Paulo');
    rerender(
      <Autocomplete aria-label="Region" options={options} value="fra1" onChange={onChange} />,
    );
    expect(input).toHaveValue('Frankfurt');
    await userEvent.click(input);
    await userEvent.tab();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not open or change when read-only', async () => {
    const onChange = vi.fn();
    render(
      <Autocomplete
        aria-label="Region"
        options={options}
        defaultValue="fra1"
        readOnly
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Region' });
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears the selection when the text is erased', async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, 'fra{Enter}');
    await userEvent.clear(input);
    await userEvent.tab();
    expect(onChange).toHaveBeenLastCalledWith(null, null);
  });
});
