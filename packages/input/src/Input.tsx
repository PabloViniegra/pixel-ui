'use client';

import { cx, type PixelSize } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'> {
  /** @default 'md' */
  size?: PixelSize;
  /** Shows the error style. Inside a `Field` with `error` this is automatic. */
  invalid?: boolean;
  /** Icon or text inside the box, before the value. */
  prefix?: ReactNode;
  /** Icon or text inside the box, after the value. */
  suffix?: ReactNode;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

/**
 * Text input. `className` and `style` style the visible box; every other prop
 * goes to the native `<input>`.
 */
export function Input({
  size = 'md',
  invalid,
  prefix,
  suffix,
  className,
  style,
  type = 'text',
  ...rest
}: InputProps) {
  const props = useFieldControl(rest, invalid);
  return (
    <span
      className={cx('pxl-input', className)}
      style={style}
      data-size={size}
      data-invalid={props['aria-invalid'] ? true : undefined}
      data-disabled={props.disabled || undefined}
    >
      {prefix != null && <span className="pxl-input__affix">{prefix}</span>}
      <input type={type} className="pxl-input__control" {...props} />
      {suffix != null && <span className="pxl-input__affix">{suffix}</span>}
    </span>
  );
}
