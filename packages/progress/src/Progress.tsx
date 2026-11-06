import { cx, type PixelTone } from '@pixel-ui/core';
import type { ComponentPropsWithRef, CSSProperties } from 'react';

export interface ProgressProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Current value. Omit for an indeterminate (looping) bar. */
  value?: number;
  /** @default 100 */
  max?: number;
  /** Number of pixel blocks. @default 24 */
  segments?: number;
  /** @default 'accent' */
  tone?: PixelTone;
  /** Accessible label (or use aria-labelledby). */
  label?: string;
  /** Shows the percentage next to the bar. @default false */
  showValue?: boolean;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/**
 * Segmented progress bar. Blocks light up one after another with a staggered
 * pop; without `value` a pixel comet runs along the track.
 */
export function Progress({
  value,
  max = 100,
  segments = 24,
  tone = 'accent',
  label,
  showValue = false,
  className,
  style,
  ...rest
}: ProgressProps) {
  const indeterminate = value === undefined;
  const ratio = indeterminate ? 0 : clamp(value / max, 0, 1);
  const lit = Math.round(ratio * segments);
  const percent = Math.round(ratio * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : clamp(value, 0, max)}
      data-state={indeterminate ? 'indeterminate' : percent === 100 ? 'complete' : 'loading'}
      data-tone={tone}
      className={cx('pxl-progress', className)}
      style={{ '--_segments': segments, ...style } as CSSProperties}
      {...rest}
    >
      <div className="pxl-progress__track">
        {Array.from({ length: segments }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable cells
            key={i}
            className="pxl-progress__cell"
            data-lit={(!indeterminate && i < lit) || undefined}
            style={{ '--_i': i } as CSSProperties}
          />
        ))}
      </div>
      {showValue && !indeterminate && (
        <span className="pxl-progress__value" aria-hidden="true">
          {String(percent).padStart(3, ' ')}%
        </span>
      )}
    </div>
  );
}
