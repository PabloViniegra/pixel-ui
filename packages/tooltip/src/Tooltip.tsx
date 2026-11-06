'use client';

import { type Align, cloneTrigger, cx, type Side, useDismiss, useFloating } from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

const HOVER_GRACE_MS = 120;

export interface TooltipProps extends Omit<ComponentPropsWithRef<'div'>, 'content' | 'children'> {
  content: ReactNode;
  /** The element the tooltip describes. Must accept a ref and focus/pointer handlers. */
  children: ReactElement;
  /** @default 'top' */
  side?: Side;
  /** @default 'center' */
  align?: Align;
  /** Hover delay in ms. Keyboard focus shows it at once. @default 400 */
  delay?: number;
}

/**
 * Short, non-interactive hint on hover or keyboard focus. Not shown for touch:
 * anything a touch user needs must not live only in a tooltip.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 400,
  className,
  ...rest
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  useFloating({ open, anchorRef, floatingRef, side, align, offset: 6 });
  useDismiss(open, () => setOpen(false), [anchorRef, floatingRef]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  // WCAG 1.4.13: leave time to move the pointer onto the tooltip without it closing.
  const hideSoon = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), HOVER_GRACE_MS);
  };

  return (
    <>
      {cloneTrigger(children, {
        ref: anchorRef,
        'aria-describedby': open ? id : undefined,
        onPointerEnter: (event: PointerEvent) => {
          if (event.pointerType !== 'touch') show(delay);
        },
        onPointerLeave: hideSoon,
        onFocus: (event: FocusEvent) => {
          if ((event.target as HTMLElement).matches(':focus-visible')) show(0);
        },
        onBlur: hide,
      })}
      {open && (
        <div
          ref={floatingRef}
          id={id}
          role="tooltip"
          popover="manual"
          className={cx('pxl-tooltip', className)}
          onPointerEnter={() => clearTimeout(timer.current)}
          onPointerLeave={hideSoon}
          {...rest}
        >
          {content}
        </div>
      )}
    </>
  );
}
