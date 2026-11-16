'use client';

import { cx, type PixelSize, useControllableState } from '@pablo-v/core';
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';

export interface ToggleProps extends ComponentPropsWithRef<'button'> {
  /** Pressed state. Controlled when given. */
  pressed?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultPressed?: boolean;
  /** Called with the new state when pressed. */
  onPressedChange?: (pressed: boolean) => void;
  /** @default 'md' */
  size?: PixelSize;
  /** Node shown before the label, or alone with an `aria-label`. */
  icon?: ReactNode;
}

/** Two-state button (`aria-pressed`). Icon-only toggles need an `aria-label`. */
export function Toggle({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  size = 'md',
  icon,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ToggleProps) {
  const [pressed, setPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) setPressed(!pressed);
  };
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cx('pxl-toggle', className)}
      data-size={size}
      data-state={pressed ? 'on' : 'off'}
      onClick={handleClick}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
