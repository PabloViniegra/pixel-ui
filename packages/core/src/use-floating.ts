import { type RefObject, useCallback } from 'react';
import { clamp } from './cells.js';
import { type Align, computePosition, type Side } from './position.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

export interface UseFloatingOptions {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  side?: Side;
  align?: Align;
  offset?: number;
  padding?: number;
}

/**
 * Promotes an open `popover="manual"` element to the top layer (so it escapes
 * overflow, stacking contexts and modal dialogs) and keeps it anchored with
 * fixed positioning while the page scrolls or resizes.
 */
export function useFloating({
  open,
  anchorRef,
  floatingRef,
  side = 'bottom',
  align = 'center',
  offset = 8,
  padding = 8,
}: UseFloatingOptions): void {
  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const a = anchor.getBoundingClientRect();
    const pos = computePosition(
      a,
      { width: floating.offsetWidth, height: floating.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
      { side, align, offset, padding },
    );
    floating.style.left = `${pos.x}px`;
    floating.style.top = `${pos.y}px`;
    floating.style.setProperty('--pxl-anchor-width', `${a.width}px`);
    floating.dataset.side = pos.side;
    // Scale from the point facing the anchor's centre, not from the panel's own centre.
    const vertical = pos.side === 'top' || pos.side === 'bottom';
    const along = vertical
      ? clamp(a.left + a.width / 2 - pos.x, 0, floating.offsetWidth)
      : clamp(a.top + a.height / 2 - pos.y, 0, floating.offsetHeight);
    const edge = { top: '100%', bottom: '0', left: '100%', right: '0' }[pos.side];
    floating.style.setProperty(
      '--pxl-origin',
      vertical ? `${along}px ${edge}` : `${edge} ${along}px`,
    );
  }, [anchorRef, floatingRef, side, align, offset, padding]);

  useIsomorphicLayoutEffect(() => {
    const floating = floatingRef.current;
    if (!open || !floating) return;
    try {
      if (!floating.matches(':popover-open')) floating.showPopover?.();
    } catch {
      // Older engines without the Popover API: fixed positioning still works.
    }
    update();

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    if (anchorRef.current) observer?.observe(anchorRef.current);
    observer?.observe(floating);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [open, update]);
}
