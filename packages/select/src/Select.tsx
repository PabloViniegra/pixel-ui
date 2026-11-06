'use client';

import { cx, type PixelSize } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import { ChevronDownIcon } from '@pablo-v/pixel-icons';
import type { ComponentPropsWithRef, CSSProperties } from 'react';

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size' | 'multiple'> {
  /** @default 'md' */
  size?: PixelSize;
  /** Shows the error style. Inside a `Field` with `error` this is automatic. */
  invalid?: boolean;
  /** Text of an empty, unselectable first option. */
  placeholder?: string;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

/**
 * Native `<select>`: the OS picker, typeahead and form behaviour stay intact;
 * only the closed control is styled.
 */
export function Select({
  size = 'md',
  invalid,
  placeholder,
  className,
  style,
  children,
  defaultValue,
  value,
  ...rest
}: SelectProps) {
  const props = useFieldControl(rest, invalid);
  const showPlaceholder = placeholder != null && value === undefined && defaultValue === undefined;
  return (
    <span
      className={cx('pxl-select', className)}
      style={style}
      data-size={size}
      data-invalid={props['aria-invalid'] ? true : undefined}
      data-disabled={props.disabled || undefined}
    >
      <select
        className="pxl-select__control"
        value={value}
        defaultValue={showPlaceholder ? '' : defaultValue}
        {...props}
      >
        {placeholder != null && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDownIcon className="pxl-select__chevron" />
    </span>
  );
}
