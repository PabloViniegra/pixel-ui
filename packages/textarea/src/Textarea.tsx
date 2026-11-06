'use client';

import { cx } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import type { ComponentPropsWithRef } from 'react';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  /** Shows the error style. Inside a `Field` with `error` this is automatic. */
  invalid?: boolean;
  /** Grows with its content (CSS `field-sizing`, where supported). @default false */
  autoResize?: boolean;
}

export function Textarea({
  invalid,
  autoResize = false,
  rows = 4,
  className,
  ...rest
}: TextareaProps) {
  const props = useFieldControl(rest, invalid);
  return (
    <textarea
      rows={rows}
      className={cx('pxl-textarea', className)}
      data-auto-resize={autoResize || undefined}
      {...props}
    />
  );
}
