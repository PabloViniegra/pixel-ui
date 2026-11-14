import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from './AlertDialog.js';

describe('AlertDialog', () => {
  it('opens as an alertdialog with focus on Cancel and confirms', async () => {
    const onConfirm = vi.fn();
    render(
      <AlertDialog
        title="Delete project?"
        description="This cannot be undone."
        confirmLabel="Delete"
        trigger={<button type="button">Delete project</button>}
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    const dialog = screen.getByRole('alertdialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('cancels on Escape but ignores backdrop clicks', async () => {
    const onCancel = vi.fn();
    render(<AlertDialog title="Sure?" description="Really." defaultOpen onCancel={onCancel} />);
    const dialog = screen.getByRole('alertdialog');
    await userEvent.click(dialog);
    expect(dialog).toHaveAttribute('open');

    act(() => {
      dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    });
    expect(onCancel).toHaveBeenCalledOnce();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('stays open and busy while an async confirm is pending, closing once it resolves', async () => {
    let resolve!: () => void;
    const onConfirm = () =>
      new Promise<void>((r) => {
        resolve = r;
      });
    render(<AlertDialog title="Revoke?" description="Now." defaultOpen onConfirm={onConfirm} />);
    const confirm = screen.getByRole('button', { name: 'Continue' });
    await userEvent.click(confirm);
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

    await act(async () => resolve());
    expect(screen.getByRole('alertdialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('stays open when an async confirm rejects', async () => {
    render(
      <AlertDialog
        title="Revoke?"
        description="Now."
        defaultOpen
        onConfirm={() => Promise.reject(new Error('nope'))}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alertdialog')).toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Continue' })).not.toHaveAttribute('aria-busy');
  });
});
