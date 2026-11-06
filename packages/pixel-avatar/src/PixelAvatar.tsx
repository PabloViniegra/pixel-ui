import { cx } from '@pixel-ui/core';
import { pixelPath } from '@pixel-ui/pixel-icons';
import type { ComponentPropsWithRef, CSSProperties } from 'react';

/** FNV-1a with a murmur3 finaliser, so similar names still diverge. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

export interface Identicon {
  /** One string per row, `#` for a filled cell. */
  rows: string[];
  hue: number;
}

/** Deterministic, horizontally symmetric grid and hue for a name or email. */
export function identicon(seed: string, cells = 5): Identicon {
  const key = seed.trim().toLowerCase();
  const h = hash(key);
  const half = Math.ceil(cells / 2);
  let bits = h;
  let used = 0;
  const rows: string[] = [];
  for (let y = 0; y < cells; y++) {
    const left: string[] = [];
    for (let x = 0; x < half; x++) {
      if (used === 32) {
        bits = hash(`${key}:${y}`);
        used = 0;
      }
      left.push(bits & 1 ? '#' : '.');
      bits >>>= 1;
      used++;
    }
    const mirror = left.slice(0, cells - half).reverse();
    rows.push([...left, ...mirror].join(''));
  }
  return { rows, hue: hash(`${key}#hue`) % 360 };
}

export interface PixelAvatarProps extends Omit<ComponentPropsWithRef<'svg'>, 'name'> {
  /** Name, email or any stable id. The same input always draws the same avatar. */
  name: string;
  /** Rendered size in px. @default 32 */
  size?: number;
  /** Grid resolution. @default 5 */
  cells?: number;
  /** @default 'md' */
  shape?: 'md' | 'full';
  /** Accessible name. Defaults to `name`; pass `""` when the name is shown next to it. */
  label?: string;
}

/** GitHub-style symmetric identicon generated from a hash of `name`. */
export function PixelAvatar({
  name,
  size = 32,
  cells = 5,
  shape = 'md',
  label = name,
  className,
  style,
  ...rest
}: PixelAvatarProps) {
  const { rows, hue } = identicon(name, cells);
  const pad = cells / 10;
  const decorative = label === '';
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${cells + pad * 2} ${cells + pad * 2}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={cx('pxl-avatar', className)}
      data-shape={shape}
      style={{ '--_hue': hue, ...style } as CSSProperties}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      <path d={pixelPath(rows)} className="pxl-avatar__cells" />
    </svg>
  );
}
