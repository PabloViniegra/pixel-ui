import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface SeparatorProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** `pixel` draws a dotted line of square cells. @default 'solid' */
  variant?: 'solid' | 'pixel';
  /** Text in the middle of a horizontal separator, e.g. "or". */
  label?: ReactNode;
  /** Purely visual: hidden from assistive tech. Set false when it separates real sections. @default true */
  decorative?: boolean;
}

export function Separator({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  decorative = true,
  className,
  ...rest
}: SeparatorProps) {
  const a11y = decorative
    ? { role: 'none' as const }
    : { role: 'separator' as const, 'aria-orientation': orientation };
  return (
    <div
      className={cx('pxl-separator', className)}
      data-orientation={orientation}
      data-variant={variant}
      data-labelled={label != null || undefined}
      {...a11y}
      {...rest}
    >
      {label != null && <span className="pxl-separator__label">{label}</span>}
    </div>
  );
}
