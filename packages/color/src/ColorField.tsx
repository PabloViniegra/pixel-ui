'use client';

import { cx, type PixelSize } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import { type ComponentPropsWithRef, type CSSProperties, useState } from 'react';
import { parseHex, toCss, toHex } from './color.js';
import { type ColorValueProps, useColor } from './use-color.js';

export interface ColorFieldProps
  extends ColorValueProps,
    Omit<
      ComponentPropsWithRef<'input'>,
      'size' | 'value' | 'defaultValue' | 'onChange' | 'prefix'
    > {
  /** @default 'md' */
  size?: PixelSize;
  invalid?: boolean;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
}

/**
 * Hex text input with a live swatch. Valid input applies as you type; on
 * blur or Enter the text settles to the normalised hex.
 */
export function ColorField({
  value,
  defaultValue,
  onChange,
  size = 'md',
  invalid,
  className,
  style,
  onBlur,
  onKeyDown,
  ...rest
}: ColorFieldProps) {
  const { color, setColor } = useColor({ value, defaultValue, onChange });
  const [draft, setDraft] = useState<string | null>(null);
  const badDraft = draft != null && parseHex(draft) == null;
  const props = useFieldControl(rest, invalid || badDraft);

  return (
    <span
      className={cx('pxl-input', 'pxl-color-field', className)}
      style={style}
      data-size={size}
      data-invalid={props['aria-invalid'] ? true : undefined}
      data-disabled={props.disabled || undefined}
    >
      <span className="pxl-input__affix pxl-color-field__swatch" aria-hidden="true">
        <span style={{ '--_color': toCss(color) } as CSSProperties} />
      </span>
      <input
        type="text"
        autoComplete="off"
        spellCheck={false}
        maxLength={9}
        className="pxl-input__control pxl-color-field__control"
        {...props}
        value={draft ?? toHex(color)}
        onChange={(event) => {
          const text = event.currentTarget.value;
          setDraft(text);
          const parsed = parseHex(text);
          if (parsed) setColor(parsed);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setDraft(null);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === 'Enter') setDraft(null);
        }}
      />
    </span>
  );
}
