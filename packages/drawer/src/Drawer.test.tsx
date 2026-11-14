import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Drawer, DrawerClose } from './Drawer.js';

describe('Drawer', () => {
  it('opens from its trigger and closes from a DrawerClose action', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer
        title="Settings"
        description="Applies to the next deployment."
        side="left"
        trigger={<button type="button">Open</button>}
        footer={
          <DrawerClose>
            <button type="button">Done</button>
          </DrawerClose>
        }
        onOpenChange={onOpenChange}
      />,
    );
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const drawer = screen.getByRole('dialog', { name: 'Settings' });
    expect(drawer).toHaveAttribute('open');
    expect(drawer).toHaveAttribute('data-side', 'left');
    expect(drawer).toHaveAccessibleDescription('Applies to the next deployment.');

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(drawer).not.toHaveAttribute('open');
  });

  it('closes from the close button', async () => {
    render(<Drawer title="Settings" defaultOpen />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });
});
