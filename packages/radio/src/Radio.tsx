'use client';

import { cx, type Orientation, useControllableState } from '@pixel-ui/core';
import { type ComponentPropsWithRef, createContext, type ReactNode, use, useId } from 'react';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps
  extends Omit<ComponentPropsWithRef<'fieldset'>, 'onChange' | 'defaultValue'> {
  /** Group label, rendered as the `<legend>`. */
  label: ReactNode;
  /** Helper text under the label. */
  description?: ReactNode;
  /** Error message; marks every radio as invalid. */
  error?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shared `name`; generated when omitted. */
  name?: string;
  required?: boolean;
  /** @default 'vertical' */
  orientation?: Orientation;
}

/** A `<fieldset>` of native radios: arrow keys, form submission and labels work natively. */
export function RadioGroup({
  label,
  description,
  error,
  value,
  defaultValue,
  onValueChange,
  name,
  required = false,
  disabled = false,
  orientation = 'vertical',
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const autoId = useId();
  const [current, setValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onValueChange as ((v: string | undefined) => void) | undefined,
  });
  const invalid = error != null && error !== false;
  const messageId = `${autoId}-message`;
  const message = error ?? description;

  return (
    <fieldset
      className={cx('pxl-radio-group', className)}
      data-orientation={orientation}
      data-invalid={invalid || undefined}
      disabled={disabled}
      aria-describedby={message != null ? messageId : undefined}
      {...rest}
    >
      <legend className="pxl-radio-group__label">{label}</legend>
      <RadioGroupContext
        value={{
          name: name ?? autoId,
          value: current,
          setValue: setValue as (v: string) => void,
          disabled,
          required,
          invalid,
        }}
      >
        <div className="pxl-radio-group__items" role="presentation">
          {children}
        </div>
      </RadioGroupContext>
      {message != null && (
        <p
          id={messageId}
          className="pxl-radio-group__message"
          data-tone={invalid ? 'danger' : undefined}
        >
          {message}
        </p>
      )}
    </fieldset>
  );
}

export interface RadioProps
  extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'value' | 'size'> {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
}

export function Radio({
  value,
  label,
  description,
  className,
  id,
  disabled,
  onChange,
  ...rest
}: RadioProps) {
  const group = use(RadioGroupContext);
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description != null ? `${inputId}-description` : undefined;
  const isDisabled = disabled ?? group?.disabled;

  return (
    <span className={cx('pxl-radio', className)} data-disabled={isDisabled || undefined}>
      <input
        type="radio"
        id={inputId}
        className="pxl-radio__input"
        value={value}
        name={group?.name}
        required={group?.required}
        disabled={isDisabled}
        aria-invalid={group?.invalid || undefined}
        aria-describedby={descId}
        {...(group ? { checked: group.value === value } : {})}
        onChange={(event) => {
          onChange?.(event);
          if (!event.defaultPrevented && event.target.checked) group?.setValue(value);
        }}
        {...rest}
      />
      {(label != null || description != null) && (
        <span className="pxl-radio__text">
          {label != null && (
            <label htmlFor={inputId} className="pxl-radio__label">
              {label}
            </label>
          )}
          {description != null && (
            <span id={descId} className="pxl-radio__description">
              {description}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
