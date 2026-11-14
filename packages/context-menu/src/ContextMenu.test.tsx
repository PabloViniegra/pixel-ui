import { MenuItem } from '@pablo-v/menu';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu } from './ContextMenu.js';

function setup(onSelect = vi.fn()) {
  render(
    <ContextMenu
      aria-label="Actions"
      content={
        <>
          <MenuItem onSelect={onSelect}>Copy</MenuItem>
          <MenuItem disabled>Paste</MenuItem>
        </>
      }
    >
      <div data-testid="area">Area</div>
    </ContextMenu>,
  );
  return onSelect;
}

describe('ContextMenu', () => {
  it('opens at the pointer on right-click and focuses the first item', () => {
    setup();
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 });
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
  });

  it('runs the action and closes', async () => {
    const onSelect = setup();
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 });
    await userEvent.click(screen.getByRole('menuitem', { name: 'Copy' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('stays open on a disabled item and closes on Escape', async () => {
    setup();
    fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 60 });
    await userEvent.click(screen.getByRole('menuitem', { name: 'Paste' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens on a touch long press but not on a short tap or a drag', () => {
    vi.useFakeTimers();
    try {
      setup();
      const area = screen.getByTestId('area');
      const touch = { pointerType: 'touch', clientX: 40, clientY: 60 };
      fireEvent.pointerDown(area, touch);
      fireEvent.pointerUp(area, touch);
      vi.advanceTimersByTime(600);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      fireEvent.pointerDown(area, touch);
      fireEvent.pointerMove(area, { ...touch, clientY: 90 });
      vi.advanceTimersByTime(600);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      fireEvent.pointerDown(area, touch);
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(screen.getByRole('menu', { name: 'Actions' })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it.each([
    ['before', 400],
    ['after', 600],
  ])(
    'returns focus to the trigger when Android fires contextmenu %s the long-press timer',
    async (_, at) => {
      vi.useFakeTimers();
      try {
        render(
          <ContextMenu aria-label="Actions" content={<MenuItem>Copy</MenuItem>}>
            <button type="button">Target</button>
          </ContextMenu>,
        );
        const target = screen.getByRole('button', { name: 'Target' });
        target.focus();
        const touch = { pointerType: 'touch', clientX: 40, clientY: 60 };
        fireEvent.pointerDown(target, touch);
        act(() => {
          vi.advanceTimersByTime(at);
        });
        fireEvent.contextMenu(target, touch);
        act(() => {
          vi.advanceTimersByTime(600);
        });
        expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
        fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
        expect(target).toHaveFocus();
      } finally {
        vi.useRealTimers();
      }
    },
  );
});
