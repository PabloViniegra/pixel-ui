'use client';

import { cx, useControllableState } from '@pablo-v/core';
import { useFieldControl } from '@pablo-v/field';
import { Input, type InputProps } from '@pablo-v/input';
import { EyeIcon, EyeOffIcon } from '@pablo-v/pixel-icons';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'suffix'> {
  /** Shows the password as plain text. Controlled when given; pair it with `onVisibleChange`. */
  visible?: boolean;
  /** Initial visibility when uncontrolled. @default false */
  defaultVisible?: boolean;
  /** Called when the toggle shows or hides the password. */
  onVisibleChange?: (visible: boolean) => void;
  /** Accessible name of the toggle, which reports its state with `aria-pressed`. @default 'Show password' */
  toggleLabel?: string;
}

/**
 * Password input with a button that shows or hides the text. Defaults to
 * `autoComplete="current-password"`; use `new-password` on sign-up forms.
 */
export function PasswordInput({
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  toggleLabel = 'Show password',
  autoComplete = 'current-password',
  className,
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useControllableState({
    value: visibleProp,
    defaultValue: defaultVisible,
    onChange: onVisibleChange,
  });
  const { disabled } = useFieldControl({ disabled: rest.disabled });
  const Icon = visible ? EyeOffIcon : EyeIcon;

  return (
    <Input
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      {...rest}
      className={cx('pxl-password-input', className)}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      suffix={
        <button
          type="button"
          className="pxl-input__affix-button pxl-password-input__toggle"
          aria-label={toggleLabel}
          aria-pressed={visible}
          disabled={disabled}
          onClick={() => setVisible(!visible)}
        >
          <Icon />
        </button>
      }
    />
  );
}
