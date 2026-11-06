'use client';

import { cx, litCells, useControllableState } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import type { ComponentPropsWithRef, CSSProperties } from 'react';

export interface SliderProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'size'
  > {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Number of cells in the track. @default 20 */
  segments?: number;
  /** Shows the current value at the end of the track. */
  showValue?: boolean;
  /** Formats the visible value and `aria-valuetext`. */
  format?: (value: number) => string;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

/** Native range input drawn as a row of cells that light up to the thumb. */
export function Slider({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  segments = 20,
  showValue = false,
  format = String,
  className,
  style,
  onChange,
  ...rest
}: SliderProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });
  const props = useFieldControl(rest);
  const lit = litCells(value - min, max - min, segments);
  const ratio = max > min ? (value - min) / (max - min) : 0;
  const text = format(value);

  return (
    <span
      className={cx('pxl-slider', className)}
      style={{ '--_ratio': ratio, '--_segments': segments, ...style } as CSSProperties}
      data-disabled={props.disabled || undefined}
    >
      <span className="pxl-slider__body">
        <span className="pxl-slider__track" aria-hidden="true">
          {Array.from({ length: segments }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable cells
              key={i}
              className="pxl-slider__cell"
              data-lit={i < lit || undefined}
            />
          ))}
        </span>
        <input
          type="range"
          className="pxl-slider__control"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format === String ? undefined : text}
          onChange={(event) => {
            onChange?.(event);
            setValue(event.currentTarget.valueAsNumber);
          }}
          {...props}
        />
      </span>
      {showValue && (
        <output className="pxl-slider__value" htmlFor={props.id} aria-hidden="true">
          {text}
        </output>
      )}
    </span>
  );
}
