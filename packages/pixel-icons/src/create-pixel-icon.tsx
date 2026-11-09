import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef, CSSProperties, JSX } from 'react';

export interface PixelIconProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  /** Rendered size in px. Multiples of 16 keep every pixel crisp. @default 16 */
  size?: number;
  /** Accessible name. Without it the icon is decorative (`aria-hidden`). */
  label?: string;
}

export type PixelIcon = ((props: PixelIconProps) => JSX.Element) & { displayName: string };

export interface AnimatedPixelIconOptions {
  /** Length of one full loop in ms. Override per instance with `--pxl-icon-duration`. @default 800 */
  duration?: number;
}

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

function buildIcon(
  name: string,
  d: string,
  frames?: { count: number; duration: number },
): PixelIcon {
  // biome-ignore lint/correctness/noComponentHookFactories: called once per icon at module scope, never during render
  const Icon = ({ size = 16, label, className, style, ...rest }: PixelIconProps) => (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      shapeRendering="crispEdges"
      className={cx('pxl-icon', frames && 'pxl-icon--animated', className)}
      style={
        frames
          ? ({
              '--pxl-icon-frames': frames.count,
              '--pxl-icon-duration': `${frames.duration}ms`,
              ...style,
            } as CSSProperties)
          : style
      }
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {frames ? (
        <g className="pxl-icon-frames">
          <path d={d} />
        </g>
      ) : (
        <path d={d} />
      )}
    </svg>
  );
  Icon.displayName = `${name}Icon`;
  return Icon;
}

/** Builds an icon component from a 16×16 bitmap. Use it to author your own icons. */
export function createPixelIcon(name: string, rows: readonly string[]): PixelIcon {
  return buildIcon(name, pixelPath(rows));
}

/**
 * Builds a looping icon from 16×16 frames, played frame by frame. The first
 * frame is the resting pose shown under `prefers-reduced-motion`.
 */
export function createAnimatedPixelIcon(
  name: string,
  frames: readonly (readonly string[])[],
  { duration = 800 }: AnimatedPixelIconOptions = {},
): PixelIcon {
  // pixel-icons.css steps the strip by 16px, so every frame must be exactly 16 wide.
  const strip = Array.from({ length: 16 }, (_, y) => frames.map((frame) => frame[y]).join(''));
  return buildIcon(name, pixelPath(strip), { count: frames.length, duration });
}
