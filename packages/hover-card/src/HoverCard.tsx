'use client';

import {
  type Align,
  cloneTrigger,
  cx,
  type Side,
  useControllableState,
  useDismiss,
  useFloating,
  usePresence,
} from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react';

export interface HoverCardProps extends Omit<ComponentPropsWithRef<'div'>, 'content' | 'children'> {
  /** Preview shown on hover or keyboard focus. */
  content: ReactNode;
  /** Usually a link. Must accept a ref and focus/pointer handlers. */
  children: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default 'bottom' */
  side?: Side;
  /** @default 'center' */
  align?: Align;
  /** ms before opening on hover. @default 500 */
  openDelay?: number;
  /** ms before closing once the pointer leaves. @default 250 */
  closeDelay?: number;
}

/**
 * Rich preview of what a link points to, on hover or keyboard focus. Supplementary
 * only: touch users never see it, so the link target must hold the same information.
 */
export function HoverCard({
  content,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  openDelay = 500,
  closeDelay = 250,
  className,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: HoverCardProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const anchorRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  useFloating({ open, anchorRef, floatingRef, side, align, offset: 8 });
  useDismiss(open, () => setOpen(false), [anchorRef, floatingRef]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const mounted = usePresence(open, floatingRef);

  const schedule = (next: boolean, wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), wait);
  };

  return (
    <>
      {cloneTrigger(children, {
        ref: anchorRef,
        'aria-describedby': open ? id : undefined,
        onPointerEnter: (event: PointerEvent) => {
          if (event.pointerType !== 'touch') schedule(true, openDelay);
        },
        onPointerLeave: () => schedule(false, closeDelay),
        onFocus: (event: FocusEvent) => {
          if ((event.target as HTMLElement).matches(':focus-visible')) schedule(true, 0);
        },
        onBlur: (event: FocusEvent) => {
          if (!floatingRef.current?.contains(event.relatedTarget as Node)) schedule(false, 0);
        },
      })}
      {mounted && (
        <div
          ref={floatingRef}
          id={id}
          popover="manual"
          data-closing={!open || undefined}
          className={cx('pxl-hover-card', className)}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            clearTimeout(timer.current);
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            schedule(false, closeDelay);
          }}
          {...rest}
        >
          {content}
        </div>
      )}
    </>
  );
}
