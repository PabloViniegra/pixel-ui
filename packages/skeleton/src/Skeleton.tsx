import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef, CSSProperties } from 'react';

export interface SkeletonProps extends ComponentPropsWithRef<'span'> {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  /** @default 'md' */
  radius?: 'sm' | 'md' | 'full';
  /** Renders a paragraph placeholder with this many lines; the last one is shorter. */
  lines?: number;
}

/**
 * Placeholder for content that is still loading. Decorative: mark the loading
 * region with `aria-busy` and give it a text alternative.
 */
export function Skeleton({
  width,
  height,
  radius = 'md',
  lines,
  className,
  style,
  ...rest
}: SkeletonProps) {
  if (lines != null) {
    return (
      <span
        className={cx('pxl-skeleton-text', className)}
        style={{ width, ...style }}
        aria-hidden="true"
        {...rest}
      >
        {Array.from({ length: lines }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable lines
          <span key={i} className="pxl-skeleton" data-radius="sm" />
        ))}
      </span>
    );
  }
  return (
    <span
      className={cx('pxl-skeleton', className)}
      data-radius={radius}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}
