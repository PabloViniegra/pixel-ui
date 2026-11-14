import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResizablePanel, ResizablePanels } from './Resizable.js';

function setup(onLayout = vi.fn()) {
  render(
    <ResizablePanels onLayout={onLayout}>
      <ResizablePanel defaultSize={30} minSize={20}>
        A
      </ResizablePanel>
      <ResizablePanel minSize={40}>B</ResizablePanel>
    </ResizablePanels>,
  );
  return { onLayout, handle: screen.getByRole('separator', { name: 'Resize' }) };
}

describe('ResizablePanels', () => {
  it('splits the remaining space and exposes the handle range', () => {
    const { handle } = setup();
    expect(handle).toHaveAttribute('aria-valuenow', '30');
    expect(handle).toHaveAttribute('aria-valuemin', '20');
    expect(handle).toHaveAttribute('aria-valuemax', '60');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByText('B').style.flex).toBe('70 1 0px');
  });

  it('resizes with the keyboard within the limits', async () => {
    const { handle, onLayout } = setup();
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onLayout).toHaveBeenLastCalledWith([35, 65]);
    await userEvent.keyboard('{End}');
    expect(onLayout).toHaveBeenLastCalledWith([60, 40]);
    await userEvent.keyboard('{Home}');
    expect(handle).toHaveAttribute('aria-valuenow', '20');
  });

  it('resizes by dragging relative to the group size', () => {
    const { handle, onLayout } = setup();
    const group = handle.parentElement as HTMLElement;
    Object.defineProperty(group, 'offsetWidth', { value: 1000 });
    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 400, pointerId: 1 });
    expect(onLayout).toHaveBeenLastCalledWith([40, 60]);
    fireEvent.pointerUp(handle, { pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 500, pointerId: 1 });
    expect(onLayout).toHaveBeenCalledTimes(1);
  });

  it('lays out again when a panel is added', () => {
    const layout = (side: boolean) => (
      <ResizablePanels>
        <ResizablePanel defaultSize={30}>A</ResizablePanel>
        <ResizablePanel>B</ResizablePanel>
        {side && <ResizablePanel defaultSize={20}>C</ResizablePanel>}
      </ResizablePanels>
    );
    const { rerender } = render(layout(false));
    rerender(layout(true));
    expect(screen.getByText('B').style.flex).toBe('50 1 0px');
    expect(screen.getByText('C').style.flex).toBe('20 1 0px');
    expect(screen.getAllByRole('separator')[1]).toHaveAttribute('aria-valuenow', '50');
  });
});
