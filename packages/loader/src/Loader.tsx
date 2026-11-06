import { cx, type PixelSize } from '@pixel-ui/core';
import type { ComponentPropsWithRef, CSSProperties } from 'react';

export type LoaderPattern = 'snake' | 'pulse' | 'scan';

export interface LoaderProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Animation pattern of the 3×3 pixel grid. @default 'snake' */
  pattern?: LoaderPattern;
  /** @default 'md' */
  size?: PixelSize;
  /** Text announced to screen readers. @default 'Loading' */
  label?: string;
}

/** Order in which cells light up for each pattern (index = cell 0..8, value = step). */
const ORDER: Record<LoaderPattern, readonly number[]> = {
  // clockwise around the border, centre last
  snake: [0, 1, 2, 7, 8, 3, 6, 5, 4],
  // centre, then the ring around it
  pulse: [1, 1, 1, 1, 0, 1, 1, 1, 1],
  // top-left to bottom-right diagonals
  scan: [0, 1, 2, 1, 2, 3, 2, 3, 4],
};

const STEPS: Record<LoaderPattern, number> = { snake: 8, pulse: 2, scan: 5 };

export function Loader({
  pattern = 'snake',
  size = 'md',
  label = 'Loading',
  className,
  ...rest
}: LoaderProps) {
  const order = ORDER[pattern];
  return (
    <span
      role="status"
      className={cx('pxl-loader', className)}
      data-pattern={pattern}
      data-size={size}
      style={{ '--_steps': STEPS[pattern] } as CSSProperties}
      {...rest}
    >
      <span className="pxl-loader__grid" aria-hidden="true">
        {order.map((step, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed 3×3 grid
            key={i}
            className="pxl-loader__cell"
            data-idle={pattern === 'snake' && step === 8 ? true : undefined}
            style={{ '--_step': step } as CSSProperties}
          />
        ))}
      </span>
      <span className="pxl-visually-hidden">{label}</span>
    </span>
  );
}
