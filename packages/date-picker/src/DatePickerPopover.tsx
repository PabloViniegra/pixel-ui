'use client';

import { type Align, cx, useDismiss, useFloating, useIsomorphicLayoutEffect } from '@pablo-v/core';
import { CalendarIcon } from '@pablo-v/pixel-icons';
import { type ComponentPropsWithRef, type RefObject, useRef } from 'react';

export interface DatePickerPopoverProps extends ComponentPropsWithRef<'div'> {
  open: boolean;
  /** Called on Escape or a press outside; `returnFocus` tells whether focus was inside. */
  onClose: (returnFocus: boolean) => void;
  /** The field box the panel is anchored to; presses inside it do not close the panel. */
  anchorRef: RefObject<HTMLElement | null>;
  /** @default 'end' */
  align?: Align;
}

/** Floating calendar panel shared by DatePicker and DateRangePicker. */
export function DatePickerPopover({
  open,
  onClose,
  anchorRef,
  align = 'end',
  className,
  children,
  ...rest
}: DatePickerPopoverProps) {
  const floatingRef = useRef<HTMLDivElement>(null);
  useFloating({ open, anchorRef, floatingRef, side: 'bottom', align, offset: 4 });
  useDismiss(open, () => onClose(!!floatingRef.current?.contains(document.activeElement)), [
    anchorRef,
    floatingRef,
  ]);
  // Runs after useFloating has shown the popover; a hidden popover cannot take focus.
  useIsomorphicLayoutEffect(() => {
    if (open)
      floatingRef.current?.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div
      ref={floatingRef}
      role="dialog"
      popover="manual"
      className={cx('pxl-date-picker__popover', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface DatePickerTriggerProps extends ComponentPropsWithRef<'button'> {
  open: boolean;
  /** Id of the open panel. */
  controls: string;
}

export function DatePickerTrigger({ open, controls, className, ...rest }: DatePickerTriggerProps) {
  return (
    <button
      type="button"
      className={cx('pxl-date-picker__trigger', className)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      {...rest}
    >
      <CalendarIcon />
    </button>
  );
}
