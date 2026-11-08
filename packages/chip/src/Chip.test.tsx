import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip.js';

describe('Chip', () => {
  it('toggles when selectable', async () => {
    const onSelectedChange = vi.fn();
    render(
      <Chip selected={false} onSelectedChange={onSelectedChange}>
        Preview
      </Chip>,
    );
    const toggle = screen.getByRole('button', { name: 'Preview', pressed: false });
    await userEvent.click(toggle);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it('is removed by click or by Backspace on the remove button', async () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>react</Chip>);
    const remove = screen.getByRole('button', { name: 'Remove react' });
    await userEvent.click(remove);
    remove.focus();
    await userEvent.keyboard('{Backspace}');
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it('is plain text when neither selectable nor removable', () => {
    render(<Chip>static</Chip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
