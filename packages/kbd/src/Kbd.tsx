import { cx } from '@pixel-ui/core';
import type { ComponentPropsWithRef } from 'react';

export interface KbdProps extends ComponentPropsWithRef<'kbd'> {
  /** Renders a combination, one key cap per entry, e.g. `['⌘', 'K']`. */
  keys?: readonly string[];
  /** @default 'md' */
  size?: 'sm' | 'md';
}

/** Keyboard key or shortcut. */
export function Kbd({ keys, size = 'md', className, children, ...rest }: KbdProps) {
  if (keys) {
    return (
      <kbd className={cx('pxl-kbd-group', className)} data-size={size} {...rest}>
        {keys.map((key, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: keys may repeat; order is the identity
          <kbd key={i} className="pxl-kbd">
            {key}
          </kbd>
        ))}
      </kbd>
    );
  }
  return (
    <kbd className={cx('pxl-kbd', className)} data-size={size} {...rest}>
      {children}
    </kbd>
  );
}
