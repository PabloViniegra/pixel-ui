import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PixelTransition, startPixelTransition } from './PixelTransition.js';

afterEach(() => {
  Reflect.deleteProperty(document, 'startViewTransition');
});

describe('startPixelTransition', () => {
  it('applies the update directly when view transitions are unavailable', async () => {
    const update = vi.fn();
    await startPixelTransition(update);
    expect(update).toHaveBeenCalledOnce();
    expect(document.documentElement).not.toHaveAttribute('data-pxl-transition');
  });

  it('flags the page during the transition and clears it afterwards', async () => {
    let finish = () => {};
    const finished = new Promise<void>((resolve) => {
      finish = resolve;
    });
    Object.assign(document, {
      startViewTransition: vi.fn((cb: () => void) => {
        cb();
        return { finished };
      }),
    });
    const update = vi.fn();
    const done = startPixelTransition(update);
    expect(update).toHaveBeenCalledOnce();
    expect(document.documentElement).toHaveAttribute('data-pxl-transition', 'page');
    finish();
    await done;
    expect(document.documentElement).not.toHaveAttribute('data-pxl-transition');
  });
});

describe('PixelTransition', () => {
  it('gives each region a valid, distinct view-transition-name', () => {
    const { container } = render(
      <>
        <PixelTransition>A</PixelTransition>
        <PixelTransition name="hero">B</PixelTransition>
      </>,
    );
    const [a, b] = container.querySelectorAll<HTMLElement>('.pxl-pixel-transition');
    expect(a?.style.viewTransitionName).toMatch(/^pxl-[\w-]+$/);
    expect(b?.style.viewTransitionName).toBe('hero');
  });
});
