'use client';

import {
  type Align,
  cloneTrigger,
  cx,
  type Side,
  useControllableState,
  useDismiss,
  useFloating,
  useIsomorphicLayoutEffect,
  usePresence,
} from '@pablo-v/core';
import { type ComponentPropsWithRef, type ReactElement, useId, useRef } from 'react';

export interface PopoverProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Element that toggles the popover on click. */
  trigger: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default 'bottom' */
  side?: Side;
  /** @default 'center' */
  align?: Align;
  /** Accessible name of the panel, when it has no visible heading. */
  label?: string;
}

/**
 * Non-modal panel anchored to its trigger. It renders right after the trigger
 * in the DOM, so Tab flows from the trigger into the panel without a focus trap.
 */
export function Popover({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  label,
  className,
  children,
  ...rest
}: PopoverProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const anchorRef = useRef<HTMLElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useFloating({ open, anchorRef, floatingRef, side, align });
  useDismiss(open, () => {
    setOpen(false);
    if (floatingRef.current?.contains(document.activeElement)) anchorRef.current?.focus();
  }, [anchorRef, floatingRef]);
  useIsomorphicLayoutEffect(() => {
    if (open) floatingRef.current?.focus({ preventScroll: true });
  }, [open]);

  const mounted = usePresence(open, floatingRef);

  return (
    <>
      {cloneTrigger(trigger, {
        ref: anchorRef,
        onClick: () => setOpen(!open),
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        'aria-haspopup': 'dialog',
      })}
      {mounted && (
        <div
          ref={floatingRef}
          id={id}
          role="dialog"
          aria-label={label}
          tabIndex={-1}
          popover="manual"
          data-closing={!open || undefined}
          inert={!open || undefined}
          className={cx('pxl-popover', className)}
          {...rest}
        >
          {children}
        </div>
      )}
    </>
  );
}
