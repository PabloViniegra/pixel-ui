import { cx, type PixelSize } from '@pablo-v/core';
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual style. @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: PixelSize;
  /** Shows loading dots, sets `aria-busy` and `aria-disabled` and blocks clicks while keeping focus. */
  loading?: boolean;
  /** Icon or node rendered before the label. */
  iconStart?: ReactNode;
  /** Icon or node rendered after the label. */
  iconEnd?: ReactNode;
}

function preventClick(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

/** Native `<button>` with variants, sizes, optional icons and a loading state. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconStart,
  iconEnd,
  disabled,
  onClick,
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
      aria-disabled={loading || undefined}
      disabled={disabled}
      onClick={loading ? preventClick : onClick}
      {...rest}
    >
      <span className="pxl-button__surface" aria-hidden="true" />
      {iconStart && <span className="pxl-button__icon">{iconStart}</span>}
      <span className="pxl-button__label">{children}</span>
      {iconEnd && <span className="pxl-button__icon">{iconEnd}</span>}
      {loading && (
        <span className="pxl-button__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </button>
  );
}
