'use client';

import { cx, useIsomorphicLayoutEffect, useMergedRefs } from '@pixel-ui/core';
import { createPixelIcon } from '@pixel-ui/pixel-icons';
import { type ComponentPropsWithRef, type ReactNode, useId, useRef } from 'react';

const Mark = createPixelIcon('CheckboxMark', [
  '................',
  '................',
  '................',
  '................',
  '...........##...',
  '..........###...',
  '.........###....',
  '...##...###.....',
  '...###.###......',
  '....#####.......',
  '.....###........',
  '......#.........',
  '................',
  '................',
  '................',
  '................',
]);

const Dash = createPixelIcon('CheckboxDash', [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....########....',
  '....########....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> {
  /** Visible label next to the box. */
  label?: ReactNode;
  /** Secondary text under the label. */
  description?: ReactNode;
  /** Mixed state, e.g. for a "select all" box. */
  indeterminate?: boolean;
}

/** Native checkbox with a drawn pixel check mark. */
export function Checkbox({
  label,
  description,
  indeterminate = false,
  className,
  id,
  disabled,
  ref,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description != null ? `${inputId}-description` : undefined;
  const localRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(localRef, ref);

  useIsomorphicLayoutEffect(() => {
    if (localRef.current) localRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <span
      className={cx('pxl-checkbox', className)}
      data-indeterminate={indeterminate || undefined}
      data-disabled={disabled || undefined}
    >
      <span className="pxl-checkbox__box">
        <input
          ref={mergedRef}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          className="pxl-checkbox__input"
          {...rest}
          aria-describedby={cx(descId, rest['aria-describedby']) || undefined}
        />
        <Mark className="pxl-checkbox__mark" />
        <Dash className="pxl-checkbox__dash" />
      </span>
      {(label != null || description != null) && (
        <span className="pxl-checkbox__text">
          {label != null && (
            <label htmlFor={inputId} className="pxl-checkbox__label">
              {label}
            </label>
          )}
          {description != null && (
            <span id={descId} className="pxl-checkbox__description">
              {description}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
