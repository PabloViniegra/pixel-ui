'use client';

import { cx, useControllableState } from '@pablo-v/core';
import { ChevronDownIcon } from '@pablo-v/pixel-icons';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface CollapsibleProps
  extends Omit<ComponentPropsWithRef<'details'>, 'title' | 'open' | 'onToggle'> {
  /** Content of the always-visible trigger row. */
  title: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A single show/hide section on native `<details>`, found by in-page search. */
export function Collapsible({
  title,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: CollapsibleProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  return (
    <details
      open={open}
      onToggle={(event) => {
        if (event.currentTarget.open !== open) setOpen(event.currentTarget.open);
      }}
      className={cx('pxl-collapsible', className)}
      {...rest}
    >
      <summary
        className="pxl-collapsible__trigger"
        onClick={(event) => {
          // React owns the state; a native toggle would drift from a controlled `open`.
          event.preventDefault();
          setOpen(!open);
        }}
      >
        <ChevronDownIcon className="pxl-collapsible__chevron" />
        {title}
      </summary>
      <div className="pxl-collapsible__content">{children}</div>
    </details>
  );
}
