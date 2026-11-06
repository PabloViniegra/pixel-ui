'use client';

import { cx } from '@pablo-v/core';
import { WarningIcon } from '@pablo-v/pixel-icons';
import { type ComponentPropsWithRef, createContext, type ReactNode, use, useId } from 'react';

interface FieldContextValue {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Visible label, linked to the control. */
  label?: ReactNode;
  /** Helper text under the control. Replaced by `error` while there is one. */
  description?: ReactNode;
  /** Error message. Marks the control as invalid. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Id given to the control. Generated when omitted. */
  controlId?: string;
  children: ReactNode;
}

/** Wraps one form control with a label, helper text and an error message. */
export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  controlId,
  className,
  children,
  ...rest
}: FieldProps) {
  const autoId = useId();
  const id = controlId ?? `${autoId}-control`;
  const messageId = `${autoId}-message`;
  const message = error ?? description;
  const invalid = error != null && error !== false;

  return (
    <div
      className={cx('pxl-field', className)}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      {...rest}
    >
      {label != null && (
        <label className="pxl-field__label" htmlFor={id}>
          {label}
          {required && (
            <span className="pxl-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <FieldContext
        value={{
          id,
          describedBy: message != null ? messageId : undefined,
          invalid,
          required,
          disabled,
        }}
      >
        {children}
      </FieldContext>
      {message != null && (
        <p id={messageId} className="pxl-field__message" data-tone={invalid ? 'danger' : undefined}>
          {invalid && <WarningIcon className="pxl-field__icon" />}
          {message}
        </p>
      )}
    </div>
  );
}

interface ControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  required?: boolean;
  disabled?: boolean;
}

/**
 * Fills in `id`, `aria-describedby`, `aria-invalid`, `required` and
 * `disabled` from the surrounding `Field`. Explicit props win.
 */
export function useFieldControl<P extends ControlProps>(props: P, invalid?: boolean): P {
  const field = use(FieldContext);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const describedBy = cx(field?.describedBy, props['aria-describedby']) || undefined;
  return {
    ...props,
    id: props.id ?? field?.id,
    'aria-describedby': describedBy,
    'aria-invalid': props['aria-invalid'] ?? (isInvalid || undefined),
    required: props.required ?? field?.required,
    disabled: props.disabled ?? field?.disabled,
  };
}
