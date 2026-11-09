import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { parseHex, toCss, toHex } from './color.js';

export type ColorSwatchSize = 'sm' | 'md' | 'lg';

export interface ColorSwatchProps extends Omit<ComponentPropsWithRef<'span'>, 'color'> {
  /** Hex colour. An unparseable value renders as "no colour". */
  color: string;
  /** Accessible name. @default the hex value */
  label?: string;
  /** 24, 32 or 40px. @default 'md' */
  size?: ColorSwatchSize;
}

/** A square of colour over a checkerboard, so transparency stays visible. */
export function ColorSwatch({
  color,
  label,
  size = 'md',
  className,
  style,
  ...rest
}: ColorSwatchProps) {
  const parsed = parseHex(color);
  return (
    <span
      role="img"
      aria-label={label ?? (parsed ? toHex(parsed) : 'No color')}
      className={cx('pxl-color-swatch', className)}
      data-size={size}
      data-empty={parsed ? undefined : true}
      style={{ '--_color': parsed ? toCss(parsed) : 'transparent', ...style } as CSSProperties}
      {...rest}
    />
  );
}
