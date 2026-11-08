'use client';

import { cx, type PixelSize } from '@pablo-v/core';
import { CloseIcon } from '@pablo-v/pixel-icons';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface ChipProps extends Omit<ComponentPropsWithRef<'span'>, 'onClick'> {
  /** @default 'md' */
  size?: Exclude<PixelSize, 'lg'>;
  icon?: ReactNode;
  /**
   * Makes the chip a toggle button (`aria-pressed`). Leave undefined for a
   * static chip.
   */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Shows a remove button that calls it. Backspace and Delete on the chip call it too. */
  onRemove?: () => void;
  /** Accessible name of the remove button. @default 'Remove' + the chip text */
  removeLabel?: string;
  disabled?: boolean;
}

/** Compact pill for filters, tags and selected values. */
export function Chip({
  size = 'md',
  icon,
  selected,
  onSelectedChange,
  onRemove,
  removeLabel,
  disabled = false,
  className,
  children,
  ...rest
}: ChipProps) {
  const toggle = selected !== undefined;
  const label = typeof children === 'string' ? children : undefined;
  const content = (
    <>
      {icon != null && (
        <span className="pxl-chip__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="pxl-chip__label">{children}</span>
    </>
  );

  return (
    <span
      className={cx('pxl-chip', className)}
      data-size={size}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      data-removable={onRemove ? true : undefined}
      {...rest}
    >
      {toggle ? (
        <button
          type="button"
          className="pxl-chip__toggle"
          aria-pressed={selected}
          disabled={disabled}
          onClick={() => onSelectedChange?.(!selected)}
        >
          {content}
        </button>
      ) : (
        content
      )}
      {onRemove && (
        <button
          type="button"
          className="pxl-chip__remove"
          aria-label={removeLabel ?? (label ? `Remove ${label}` : 'Remove')}
          disabled={disabled}
          onClick={onRemove}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' || event.key === 'Delete') {
              event.preventDefault();
              onRemove();
            }
          }}
        >
          <CloseIcon size={12} />
        </button>
      )}
    </span>
  );
}
