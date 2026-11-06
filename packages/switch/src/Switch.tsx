'use client';

import { cx, type PixelSize, useControllableState } from '@pixel-ui/core';
import { type ComponentPropsWithRef, type MouseEvent, type ReactNode, useId } from 'react';

export interface SwitchProps
  extends Omit<
    ComponentPropsWithRef<'button'>,
    'onChange' | 'value' | 'defaultValue' | 'children'
  > {
  /** Controlled state. */
  checked?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label rendered next to the switch. */
  label?: ReactNode;
  /** @default 'md' */
  size?: Exclude<PixelSize, 'lg'>;
}

/** `<button role="switch">` toggle, controlled or uncontrolled, with an optional label. */
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  size = 'md',
  disabled,
  className,
  id,
  onClick,
  ...rest
}: SwitchProps) {
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const autoId = useId();
  const switchId = id ?? autoId;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) setOn(!on);
  };

  const control = (
    <button
      type="button"
      role="switch"
      id={switchId}
      aria-checked={on}
      data-state={on ? 'on' : 'off'}
      data-size={size}
      disabled={disabled}
      className={cx('pxl-switch', className)}
      onClick={handleClick}
      {...rest}
    >
      <span className="pxl-switch__fill" aria-hidden="true" />
      <span className="pxl-switch__thumb" aria-hidden="true" />
    </button>
  );

  if (label == null) return control;

  return (
    <span className="pxl-switch-field" data-disabled={disabled || undefined}>
      {control}
      <label htmlFor={switchId} className="pxl-switch-field__label">
        {label}
      </label>
    </span>
  );
}
