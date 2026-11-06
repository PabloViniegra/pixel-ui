import { cx, type PixelSize } from '@pixel-ui/core';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual style. @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: PixelSize;
  /** Shows a pixel loader, sets `aria-busy` and blocks interaction. */
  loading?: boolean;
  /** Icon or node rendered before the label. */
  iconStart?: ReactNode;
  /** Icon or node rendered after the label. */
  iconEnd?: ReactNode;
}

/**
 * Pixel button: notched corners, a hard offset shadow that lifts on hover and
 * collapses on press, and a stepped shine sweep.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconStart,
  iconEnd,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('pxl-button', className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      <span className="pxl-button__surface" aria-hidden="true" />
      {loading ? (
        <span className="pxl-button__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      ) : (
        iconStart && <span className="pxl-button__icon">{iconStart}</span>
      )}
      <span className="pxl-button__label">{children}</span>
      {iconEnd && !loading && <span className="pxl-button__icon">{iconEnd}</span>}
    </button>
  );
}
