import { cx } from '@pablo-v/core';
import type { ComponentPropsWithRef } from 'react';

export interface ScrollAreaProps extends ComponentPropsWithRef<'div'> {
  /** Axis that scrolls. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
}

/**
 * Scroll container with thin square-thumbed scrollbars. It is focusable so
 * keyboard users can scroll it; give it an `aria-label` to name the region.
 */
export function ScrollArea({
  orientation = 'vertical',
  className,
  tabIndex = 0,
  ...rest
}: ScrollAreaProps) {
  return (
    <div
      role={rest['aria-label'] || rest['aria-labelledby'] ? 'region' : undefined}
      tabIndex={tabIndex}
      data-orientation={orientation}
      className={cx('pxl-scroll-area', className)}
      {...rest}
    />
  );
}
