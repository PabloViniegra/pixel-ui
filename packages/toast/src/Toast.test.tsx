import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from './store.js';
import { Toaster } from './Toaster.js';

afterEach(() => {
  act(() => toast.dismiss());
  vi.useRealTimers();
});

describe('Toaster', () => {
  it('shows toasts in a labelled region and dismisses them after their duration', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast.success('Deployment ready', { description: 'acme-web is live.', duration: 1000 });
    });
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toHaveTextContent('Deployment ready');

    act(() => vi.advanceTimersByTime(1000));
    expect(region).not.toHaveTextContent('Deployment ready');
  });

  it('pauses the countdown while hovered', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Copied', { duration: 1000 });
    });
    const region = screen.getByRole('region');
    act(() => vi.advanceTimersByTime(600));
    fireEvent.pointerEnter(region);
    act(() => vi.advanceTimersByTime(5000));
    expect(region).toHaveTextContent('Copied');
    fireEvent.pointerLeave(region);
    act(() => vi.advanceTimersByTime(450));
    expect(region).not.toHaveTextContent('Copied');
  });

  it('replaces a toast that reuses an id and runs its action', () => {
    const undo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast('Uploading…', { id: 'up', duration: Number.POSITIVE_INFINITY });
      toast('Uploaded', { id: 'up', action: { label: 'Undo', onClick: undo } });
    });
    expect(screen.queryByText('Uploading…')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(undo).toHaveBeenCalledOnce();
    expect(screen.queryByText('Uploaded')).not.toBeInTheDocument();
  });

  it('restarts the timer when a mounted toast is replaced under the same id', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Deploying…', { id: 'deploy', duration: Number.POSITIVE_INFINITY });
    });
    act(() => {
      toast.success('Deployed', { id: 'deploy', duration: 3000 });
    });
    act(() => vi.advanceTimersByTime(2900));
    expect(screen.getByText('Deployed')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2000));
    act(() => {
      toast('Deployed again', { id: 'deploy', duration: 3000 });
    });
    act(() => vi.advanceTimersByTime(2900));
    expect(screen.getByText('Deployed again')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText('Deployed again')).not.toBeInTheDocument();
  });

  it('keeps a toast with an action until it is dismissed', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast('Archived', { action: { label: 'Undo', onClick: () => {} } });
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });

  it('announces error toasts as alerts and names the close button with dismissLabel', () => {
    render(<Toaster dismissLabel="Descartar" />);
    act(() => {
      toast('Guardado');
      toast.error('Fallo al desplegar');
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Fallo al desplegar');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(within(screen.getByRole('alert')).queryByRole('button')).toBeNull();
    expect(screen.getAllByRole('button', { name: 'Descartar' })).toHaveLength(2);
  });
});
