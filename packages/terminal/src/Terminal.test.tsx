import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type LogLine, Terminal } from './Terminal.js';

const base: LogLine[] = [
  { id: 1, text: 'Cloning repository' },
  { id: 2, level: 'warn', text: 'Peer dependency missing' },
];

function scrollable(el: HTMLElement, { scrollHeight = 1000, clientHeight = 200 } = {}) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: scrollHeight });
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight });
  el.scrollTo = ((opts: ScrollToOptions) => {
    el.scrollTop = opts.top ?? 0;
  }) as typeof el.scrollTo;
}

describe('Terminal', () => {
  it('exposes a named log region with levelled lines', () => {
    render(<Terminal title="Build logs" lines={base} />);
    const log = screen.getByRole('log', { name: 'Build logs' });
    expect(log).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('Peer dependency missing').closest('li')).toHaveAttribute(
      'data-level',
      'warn',
    );
  });

  it('follows output at the bottom and offers a jump once the reader scrolls away', () => {
    const { rerender } = render(<Terminal title="Build logs" lines={base} />);
    const log = screen.getByRole('log');
    scrollable(log);

    rerender(<Terminal title="Build logs" lines={[...base, { id: 3, text: 'Installing' }]} />);
    expect(log.scrollTop).toBe(1000);

    log.scrollTop = 100;
    fireEvent.scroll(log);
    rerender(
      <Terminal
        title="Build logs"
        lines={[...base, { id: 3, text: 'Installing' }, { id: 4, text: 'Building' }]}
      />,
    );
    expect(log.scrollTop).toBe(100);

    fireEvent.click(screen.getByRole('button', { name: '1 new line' }));
    expect(log.scrollTop).toBe(1000);
    expect(screen.queryByRole('button', { name: /new line/ })).not.toBeInTheDocument();
  });

  it('shows the placeholder only when idle', () => {
    const { rerender } = render(<Terminal lines={[]} />);
    expect(screen.getByText('No output yet')).toBeInTheDocument();
    rerender(<Terminal lines={[]} streaming />);
    expect(screen.queryByText('No output yet')).not.toBeInTheDocument();
  });
});
