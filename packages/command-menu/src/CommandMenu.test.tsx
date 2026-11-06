import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { type CommandItem, CommandMenu } from './CommandMenu.js';

const commands = (onSelect = vi.fn()): CommandItem[] => [
  { id: 'deploy', label: 'Deploy project', group: 'Actions', onSelect },
  { id: 'logs', label: 'View logs', group: 'Actions', keywords: ['output'], onSelect },
  { id: 'billing', label: 'Billing', group: 'Settings', disabled: true, onSelect },
  { id: 'theme', label: 'Toggle theme', group: 'Settings', shortcut: ['⌘', 'J'], onSelect },
];

describe('CommandMenu', () => {
  it('opens with ⌘K and filters by label and keywords', async () => {
    const user = userEvent.setup();
    render(<CommandMenu commands={commands()} />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    const input = screen.getByRole('combobox', { name: 'Search commands' });
    expect(input).toHaveFocus();
    expect(screen.getAllByRole('option')).toHaveLength(4);

    await user.type(input, 'output');
    const [only, ...others] = screen.getAllByRole('option');
    expect(others).toHaveLength(0);
    expect(only).toHaveAccessibleName('View logs');

    await user.clear(input);
    await user.type(input, 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('moves the active option past disabled items and selects with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(<CommandMenu commands={commands(onSelect)} defaultOpen onOpenChange={onOpenChange} />);
    const input = screen.getByRole('combobox');
    const active = () => document.getElementById(input.getAttribute('aria-activedescendant') ?? '');

    expect(active()).toHaveAccessibleName('Deploy project');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(active()).toHaveAccessibleName('Toggle theme');
    expect(active()).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
