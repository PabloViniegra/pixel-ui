import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogClose } from './Dialog.js';

describe('Dialog', () => {
  it('opens from its trigger and closes from a DialogClose action', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog
        title="Delete project"
        description="This cannot be undone."
        trigger={<button type="button">Delete</button>}
        footer={
          <DialogClose>
            <button type="button">Cancel</button>
          </DialogClose>
        }
        onOpenChange={onOpenChange}
      />,
    );
    expect(screen.queryByText('Delete project')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete project' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(dialog).not.toHaveAttribute('open');
  });

  it('hides the close button and ignores Escape when not dismissible', () => {
    render(<Dialog title="Deploying" defaultOpen dismissible={false} />);
    const dialog = screen.getByRole('dialog');
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(dialog).toHaveAttribute('open');
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('stays open when the browser closes it without a cancel event', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog title="Deploying" defaultOpen dismissible={false} onOpenChange={onOpenChange} />,
    );
    const dialog = screen.getByRole('dialog');
    expect(fireEvent.keyDown(dialog, { key: 'Escape' })).toBe(false);

    act(() => (dialog as HTMLDialogElement).close());
    expect(dialog).toHaveAttribute('open');
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
