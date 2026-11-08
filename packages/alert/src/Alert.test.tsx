import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert.js';

describe('Alert', () => {
  it('announces warnings and errors, but not neutral messages', () => {
    const { rerender } = render(<Alert title="Saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    rerender(<Alert tone="danger" title="Failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });

  it('calls onDismiss from the close button', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Saved" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
