import { cx, type PixelTone } from '@pixel-ui/core';
import type { ComponentPropsWithRef } from 'react';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  /** Colour intent. @default 'neutral' */
  tone?: PixelTone;
  /** `solid` fills with the tone colour, `subtle` uses a tinted background. @default 'subtle' */
  appearance?: 'solid' | 'subtle';
  /** Leading status dot. `'pulse'` makes it breathe a few times on mount, then hold steady. */
  dot?: boolean | 'pulse';
  /** Plays a short pop-in when mounted. @default false */
  animateIn?: boolean;
}

export function Badge({
  tone = 'neutral',
  appearance = 'subtle',
  dot = false,
  animateIn = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx('pxl-badge', className)}
      data-tone={tone}
      data-appearance={appearance}
      data-animate={animateIn || undefined}
      {...rest}
    >
      {dot && (
        <span
          className="pxl-badge__dot"
          data-pulse={dot === 'pulse' || undefined}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
