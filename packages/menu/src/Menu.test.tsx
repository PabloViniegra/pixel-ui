import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown, MenuItem, MenuSeparator } from './Menu.js';

function setup(onSelect = vi.fn()) {
  render(
    <Dropdown trigger={<button type="button">Actions</button>}>
      <MenuItem onSelect={() => onSelect('redeploy')}>Redeploy</MenuItem>
      <MenuItem disabled>Promote</MenuItem>
      <MenuItem onSelect={() => onSelect('inspect')}>Inspect</MenuItem>
      <MenuSeparator />
      <MenuItem tone="danger" onSelect={() => onSelect('delete')}>
        Delete
      </MenuItem>
    </Dropdown>,
  );
  return { onSelect, trigger: screen.getByRole('button', { name: 'Actions' }) };
}

describe('Dropdown', () => {
  it('opens on the first item and skips disabled items with arrows', async () => {
    const { trigger } = setup();
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Redeploy' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Inspect' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('r');
    expect(screen.getByRole('menuitem', { name: 'Redeploy' })).toHaveFocus();
  });

  it('runs the action, closes and returns focus to the trigger', async () => {
    const { trigger, onSelect } = setup();
    trigger.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('delete');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('ignores disabled items and closes on Escape', async () => {
    const { trigger, onSelect } = setup();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Promote' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
