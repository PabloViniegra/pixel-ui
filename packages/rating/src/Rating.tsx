'use client';

import { clamp, cx, useControllableState } from '@pablo-v/core';
import { StarIcon } from '@pablo-v/pixel-icons';
import { type ComponentPropsWithRef, type CSSProperties, useId, useState } from 'react';

export interface RatingProps
  extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  /** 0 means no rating. Fractions are shown only when `readOnly`. */
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** @default 5 */
  max?: number;
  /** Shows the value as an image instead of an input. */
  readOnly?: boolean;
  disabled?: boolean;
  /** Picking the current value again resets it to 0. @default true */
  clearable?: boolean;
  /** Form field name for the selected radio. */
  name?: string;
  /** @default 'md' */
  size?: 'md' | 'lg';
  /** Accessible name of each star. @default n => `${n} star(s)` */
  getLabel?: (value: number) => string;
  /** Accessible name in read-only mode. @default (v, max) => `${v} out of ${max} stars` */
  getValueText?: (value: number, max: number) => string;
}

const defaultLabel = (n: number) => `${n} ${n === 1 ? 'star' : 'stars'}`;
const defaultValueText = (v: number, max: number) => `${v} out of ${max} stars`;

/** Star rating on native radios, or a read-only score that can show fractions. */
export function Rating({
  value: valueProp,
  defaultValue = 0,
  onChange,
  max = 5,
  readOnly,
  disabled,
  clearable = true,
  name,
  size = 'md',
  getLabel = defaultLabel,
  getValueText = defaultValueText,
  className,
  ...rest
}: RatingProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange });
  const [hover, setHover] = useState<number | null>(null);
  const groupName = useId();
  const iconSize = size === 'lg' ? 32 : 16;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly) {
    return (
      <div
        role="img"
        aria-label={getValueText(value, max)}
        data-size={size}
        data-readonly=""
        className={cx('pxl-rating', className)}
        {...rest}
      >
        {stars.map((n) => (
          <span
            key={n}
            className="pxl-rating__star"
            style={{ '--_fill': `${clamp(value - n + 1, 0, 1) * 100}%` } as CSSProperties}
          >
            <StarIcon size={iconSize} />
            <span className="pxl-rating__fill">
              <StarIcon size={iconSize} />
            </span>
          </span>
        ))}
      </div>
    );
  }

  const shown = hover ?? Math.round(value);
  return (
    <div
      role="radiogroup"
      aria-disabled={disabled || undefined}
      data-size={size}
      className={cx('pxl-rating', className)}
      onPointerLeave={() => setHover(null)}
      {...rest}
    >
      {stars.map((n) => (
        <label
          key={n}
          className="pxl-rating__star"
          data-lit={n <= shown || undefined}
          onPointerEnter={() => !disabled && setHover(n)}
        >
          <input
            type="radio"
            className="pxl-rating__input"
            name={name ?? groupName}
            value={n}
            checked={Math.round(value) === n}
            disabled={disabled}
            aria-label={getLabel(n)}
            onChange={() => setValue(n)}
            onClick={() => {
              if (clearable && Math.round(value) === n) {
                setValue(0);
                setHover(null);
              }
            }}
          />
          <StarIcon size={iconSize} />
        </label>
      ))}
    </div>
  );
}
