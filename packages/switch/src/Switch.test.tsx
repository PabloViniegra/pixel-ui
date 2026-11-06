import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch.js';

describe('Switch', () => {
  it('toggles when uncontrolled and is labelled', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Analytics" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Analytics' });
    expect(control).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles from the label', async () => {
    render(<Switch label="Analytics" />);
    await userEvent.click(screen.getByText('Analytics'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not change when controlled', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="x" checked={false} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('works with the keyboard', async () => {
    render(<Switch aria-label="x" />);
    screen.getByRole('switch').focus();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
