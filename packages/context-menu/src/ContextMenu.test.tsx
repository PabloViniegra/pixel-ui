import { MenuItem } from '@pablo-v/menu';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu } from './ContextMenu.js';

function setup(onSelect = vi.fn()) {
  render(
    <ContextMenu
      aria-label="Actions"
      content={
        <>
          <MenuItem onSelect={onSelect}>Copy</MenuItem>
          <MenuItem disabled>Paste</MenuItem>
        </>
      }
    >
      <div data-testid="area">Area</div>
    </ContextMenu>,
  );
  return onSelect;
}

describe('ContextMenu', () => {
  it('opens at the pointer on right-click and focuses the first item', () => {
    setup();
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 });
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
  });

  it('runs the action and closes', async () => {
    const onSelect = setup();
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 });
    await userEvent.click(screen.getByRole('menuitem', { name: 'Copy' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('stays open on a disabled item and closes on Escape', async () => {
    setup();
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 });
    await userEvent.click(screen.getByRole('menuitem', { name: 'Paste' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
