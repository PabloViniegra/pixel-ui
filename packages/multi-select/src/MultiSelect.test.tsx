import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MultiSelect } from './MultiSelect.js';

const options = ['Production', 'Preview', 'Development'];

function setup(defaultValue: string[] = []) {
  const onChange = vi.fn();
  render(
    <form aria-label="env">
      <Field label="Environments">
        <MultiSelect options={options} defaultValue={defaultValue} onChange={onChange} name="env" />
      </Field>
    </form>,
  );
  return { input: screen.getByRole('combobox', { name: 'Environments' }), onChange };
}

const submitted = () =>
  new FormData(screen.getByRole('form', { name: 'env' }) as HTMLFormElement).getAll('env');

describe('MultiSelect', () => {
  it('toggles several options and keeps the list open', async () => {
    const { input, onChange } = setup();
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    const listbox = screen.getByRole('listbox', { name: 'Environments' });
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');

    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(
      ['Production', 'Preview'],
      [
        { value: 'Production', label: 'Production' },
        { value: 'Preview', label: 'Preview' },
      ],
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(submitted()).toEqual(['Production', 'Preview']);

    await userEvent.click(screen.getByRole('option', { name: 'Production' }));
    expect(onChange).toHaveBeenLastCalledWith(
      ['Preview'],
      [{ value: 'Preview', label: 'Preview' }],
    );
  });

  it('filters by typing and clears the query after choosing', async () => {
    const { input } = setup();
    await userEvent.type(input, 'dev');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    expect(input).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Remove Development' })).toBeInTheDocument();
  });

  it('keeps the chosen option active with a custom filter', async () => {
    const startsWith = (o: { label: string }, q: string) =>
      o.label !== 'Production' && o.label.toLowerCase().startsWith(q.toLowerCase());
    render(<MultiSelect aria-label="Env" options={options} filter={startsWith} />);
    const input = screen.getByRole('combobox', { name: 'Env' });
    await userEvent.type(input, 'dev{Enter}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Development' }).id,
    );
  });

  it('keeps chips but blocks changes when read-only', async () => {
    render(<MultiSelect aria-label="Env" options={options} defaultValue={['Preview']} readOnly />);
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Preview' })).not.toBeInTheDocument();
    screen.getByRole('combobox', { name: 'Env' }).focus();
    await userEvent.keyboard('{ArrowDown}{Backspace}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('removes values with the chip button and with Backspace', async () => {
    const { input } = setup(['Production', 'Preview']);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Production' }));
    expect(submitted()).toEqual(['Preview']);
    expect(input).toHaveFocus();
    await userEvent.keyboard('{Backspace}');
    expect(submitted()).toEqual([]);
  });
});
