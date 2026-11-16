import { Field } from '@pablo-v/field';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput.js';

describe('SearchInput', () => {
  it('is a searchbox that shows a clear button only when it has text', async () => {
    render(<SearchInput aria-label="Search" />);
    const box = screen.getByRole('searchbox', { name: 'Search' });
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    await userEvent.type(box, 'acme');
    expect(box).toHaveValue('acme');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('clears with the button and returns focus to the field', async () => {
    const onValueChange = vi.fn();
    const onClear = vi.fn();
    render(
      <SearchInput
        aria-label="Search"
        defaultValue="acme"
        onValueChange={onValueChange}
        onClear={onClear}
        clearLabel="Borrar"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    const box = screen.getByRole('searchbox');
    expect(box).toHaveValue('');
    expect(box).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('clears on Escape without letting the key reach a parent', async () => {
    const onParentKeyDown = vi.fn();
    render(
      <div onKeyDown={onParentKeyDown}>
        <SearchInput aria-label="Search" defaultValue="acme" />
      </div>,
    );
    const box = screen.getByRole('searchbox');
    box.focus();
    await userEvent.keyboard('{Escape}');
    expect(box).toHaveValue('');
    expect(onParentKeyDown).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onParentKeyDown).toHaveBeenCalledOnce();
  });

  it('follows a controlled value', () => {
    const { rerender } = render(
      <SearchInput aria-label="Search" value="a" onValueChange={() => {}} />,
    );
    rerender(<SearchInput aria-label="Search" value="ab" onValueChange={() => {}} />);
    expect(screen.getByRole('searchbox')).toHaveValue('ab');
  });

  it('hides the clear button when its Field is disabled', () => {
    render(
      <Field label="Search" disabled>
        <SearchInput defaultValue="acme" />
      </Field>,
    );
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeDisabled();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
