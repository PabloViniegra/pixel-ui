'use client';

import { cx } from '@pixel-ui/core';
import { type ComponentPropsWithRef, type CSSProperties, useId } from 'react';
import { flushSync } from 'react-dom';

export interface PixelTransitionOptions {
  /**
   * `page` dissolves the whole document; `elements` leaves the page to the
   * default cross-fade and only dissolves `<PixelTransition>` regions.
   * @default 'page'
   */
  scope?: 'page' | 'elements';
}

let latest = 0;

/**
 * Runs a React state update inside a view transition that dissolves through a
 * pixel grid. Without the View Transitions API, or with reduced motion, the
 * update simply applies.
 */
export function startPixelTransition(
  update: () => void,
  { scope = 'page' }: PixelTransitionOptions = {},
): Promise<void> {
  const reduced =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof document === 'undefined' || !document.startViewTransition || reduced) {
    update();
    return Promise.resolve();
  }

  const root = document.documentElement;
  const run = ++latest;
  if (scope === 'page') root.dataset.pxlTransition = 'page';
  else delete root.dataset.pxlTransition;
  const transition = document.startViewTransition(() => flushSync(update));
  return transition.finished.finally(() => {
    // A newer transition skips this one; leave its attribute alone.
    if (run === latest) delete root.dataset.pxlTransition;
  });
}

export interface PixelTransitionProps extends ComponentPropsWithRef<'div'> {
  /** Unique `view-transition-name`. Generated when omitted. */
  name?: string;
}

/** Marks a region that dissolves through the pixel grid during `startPixelTransition`. */
export function PixelTransition({ name, className, style, ...rest }: PixelTransitionProps) {
  const id = useId();
  const transitionName = name ?? `pxl-${id.replace(/[^\w-]/g, '')}`;
  return (
    <div
      className={cx('pxl-pixel-transition', className)}
      style={{ viewTransitionName: transitionName, ...style } as CSSProperties}
      {...rest}
    />
  );
}
