import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from './Collapsible.js';

describe('Collapsible', () => {
  it('toggles from its summary and reports the new state', async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Collapsible title="More" onOpenChange={onOpenChange}>
        Hidden text
      </Collapsible>,
    );
    const details = container.querySelector('details') as HTMLDetailsElement;
    expect(details.open).toBe(false);
    await userEvent.click(screen.getByText('More'));
    expect(details.open).toBe(true);
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
  });

  it('starts open with defaultOpen', () => {
    const { container } = render(<Collapsible title="More" defaultOpen />);
    expect(container.querySelector('details')).toHaveAttribute('open');
  });

  it('stays as the controlled prop says when the parent ignores a toggle', async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Collapsible title="More" open onOpenChange={onOpenChange}>
        Text
      </Collapsible>,
    );
    await userEvent.click(screen.getByText('More'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector('details')).toHaveAttribute('open');
  });
});
