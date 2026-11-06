import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useDismiss } from './use-dismiss.js';

function Layer({ onDismiss, children }: { onDismiss: () => void; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(true, onDismiss, [ref]);
  return <div ref={ref}>{children}</div>;
}

describe('useDismiss', () => {
  it('closes only the innermost open layer on Escape', () => {
    const outer = vi.fn();
    const inner = vi.fn();
    const { rerender } = render(
      <Layer onDismiss={outer}>
        <Layer onDismiss={inner} />
      </Layer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(inner).toHaveBeenCalledOnce();
    expect(outer).not.toHaveBeenCalled();

    rerender(<Layer onDismiss={outer} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(outer).toHaveBeenCalledOnce();
  });
});
