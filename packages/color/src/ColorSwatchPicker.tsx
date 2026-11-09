'use client';

import { cx, nextIndex } from '@pablo-v/core';
import type { ComponentPropsWithRef, CSSProperties, KeyboardEvent } from 'react';
import type { ColorSwatchSize } from './ColorSwatch.js';
import { parseHex, toCss, toHex } from './color.js';
import { type ColorValueProps, useColor } from './use-color.js';

export type ColorSwatchOption = string | { value: string; label: string };

export interface ColorSwatchPickerProps
  extends ColorValueProps,
    Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  colors: readonly ColorSwatchOption[];
  /** @default 'md' */
  size?: ColorSwatchSize;
  disabled?: boolean;
}

/** A radio group of preset colours. Arrow keys move and select. */
export function ColorSwatchPicker({
  colors,
  value,
  defaultValue,
  onChange,
  size = 'md',
  disabled,
  className,
  onKeyDown,
  ...rest
}: ColorSwatchPickerProps) {
  const { color, setColor } = useColor({ value, defaultValue, onChange });
  const current = toHex(color);
  const seen = new Set<string>();
  const options = colors.flatMap((option) => {
    const { value, label } = typeof option === 'string' ? { value: option, label: '' } : option;
    const parsed = parseHex(value);
    if (!parsed) return [];
    const hex = toHex(parsed);
    if (seen.has(hex)) return [];
    seen.add(hex);
    return [{ parsed, hex, label: label || hex }];
  });
  const selected = options.findIndex((o) => o.hex === current);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    const radios = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]'));
    const index = radios.indexOf(event.target as HTMLElement);
    if (index < 0) return;
    const none = options.map(() => false);
    const next =
      nextIndex(event.key, index, none, 'horizontal') ??
      nextIndex(event.key, index, none, 'vertical');
    const option = next == null ? undefined : options[next];
    if (next == null || !option) return;
    event.preventDefault();
    radios[next]?.focus();
    setColor(option.parsed);
  };

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled || undefined}
      className={cx('pxl-color-swatch-picker', className)}
      data-size={size}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {options.map((option, index) => {
        const checked = index === selected;
        return (
          <button
            key={option.hex}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.label}
            disabled={disabled}
            tabIndex={checked || (selected < 0 && index === 0) ? 0 : -1}
            className="pxl-color-swatch-picker__item"
            style={{ '--_color': toCss(option.parsed) } as CSSProperties}
            onClick={() => {
              if (!checked) setColor(option.parsed);
            }}
          />
        );
      })}
    </div>
  );
}
