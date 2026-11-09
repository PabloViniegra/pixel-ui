import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Toolbar, ToolbarButton, ToolbarSeparator } from './Toolbar.js';

function setup() {
  render(
    <>
      <button type="button">Before</button>
      <Toolbar aria-label="Format">
        <ToolbarButton>Bold</ToolbarButton>
        <ToolbarButton disabled>Italic</ToolbarButton>
        <ToolbarSeparator />
        <input aria-label="Font size" defaultValue="13" />
        <ToolbarButton pressed>Code</ToolbarButton>
      </Toolbar>
      <button type="button">After</button>
    </>,
  );
}

function Editor() {
  const [pasted, setPasted] = useState(false);
  return (
    <div popover="manual">
      <Toolbar aria-label="Edit">
        <ToolbarButton onClick={() => setPasted(true)}>Cut</ToolbarButton>
        {pasted && <ToolbarButton>Paste</ToolbarButton>}
      </Toolbar>
    </div>
  );
}

describe('Toolbar', () => {
  it('is a single tab stop that remembers the last focused control', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();

    await userEvent.tab({ shift: true });
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Code' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Code' })).toHaveFocus();
  });

  it('skips disabled controls and leaves caret keys to text fields', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
    await userEvent.keyboard('{ArrowRight}');
    const input = screen.getByRole('textbox', { name: 'Font size' });
    expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(input).toHaveFocus();
  });

  it('exposes toggle state', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Code' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps one tab stop inside a popover and adopts controls added later', async () => {
    render(<Editor />);
    const cut = screen.getByRole('button', { name: 'Cut', hidden: true });
    expect(cut).toHaveAttribute('tabindex', '0');
    await userEvent.click(cut);
    const paste = screen.getByRole('button', { name: 'Paste', hidden: true });
    expect(paste).toHaveAttribute('tabindex', '-1');
    await userEvent.keyboard('{ArrowRight}');
    expect(paste).toHaveFocus();
  });
});
