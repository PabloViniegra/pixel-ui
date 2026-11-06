import { cx } from '@pixel-ui/core';
import type { ComponentPropsWithRef, JSX } from 'react';

export interface PixelIconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  /** Rendered size in px. Multiples of 16 keep every pixel crisp. @default 16 */
  size?: number;
  /** Accessible name. Without it the icon is decorative (`aria-hidden`). */
  label?: string;
}

export type PixelIcon = ((props: PixelIconProps) => JSX.Element) & { displayName: string };

/**
 * Turns a 16×16 bitmap (`#` = lit pixel) into SVG path data, one horizontal
 * run per rectangle so the path stays short.
 */
export function pixelPath(rows: readonly string[]): string {
  let d = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== '#') {
        x++;
        continue;
      }
      const start = x;
      while (row[x] === '#') x++;
      d += `M${start} ${y}h${x - start}v1h${start - x}z`;
    }
  });
  return d;
}

/** Builds an icon component from a 16×16 bitmap. Use it to author your own icons. */
export function createPixelIcon(name: string, rows: readonly string[]): PixelIcon {
  const d = pixelPath(rows);
  // biome-ignore lint/correctness/noComponentHookFactories: called once per icon at module scope, never during render
  const Icon = ({ size = 16, label, className, ...rest }: PixelIconProps) => (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      shapeRendering="crispEdges"
      className={cx('pxl-icon', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
  Icon.displayName = `${name}Icon`;
  return Icon;
}
