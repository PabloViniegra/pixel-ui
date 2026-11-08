'use client';

import { cx, type PixelSize, useControllableState } from '@pablo-v/core';
import { useFieldControl, useFieldLabelId } from '@pablo-v/field';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { DateSegments, type DateSegmentsProps } from './DateSegments.js';

export interface DateFieldProps
  extends Omit<DateSegmentsProps, 'value' | 'onChange' | 'controlId' | 'style' | 'ref' | 'prefix'> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  /** @default 'md' */
  size?: PixelSize;
  /** Id of the first segment. Inside a `Field` this is automatic. */
  id?: string;
  /** Icon or text inside the box, before the date. */
  prefix?: ReactNode;
  /** Icon, text or button inside the box, after the date. */
  suffix?: ReactNode;
  /** Applied to the outer box; `className` goes there too. */
  style?: CSSProperties;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Keyboard-first date entry with one spin button per segment, ordered for the
 * locale. Shares the Input box, so import `@pablo-v/input/style.css` too.
 */
export function DateField({
  value: valueProp,
  defaultValue = null,
  onChange,
  size = 'md',
  id,
  invalid,
  prefix,
  suffix,
  className,
  style,
  ref,
  'aria-labelledby': labelledBy,
  ...rest
}: DateFieldProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const control = useFieldControl(
    {
      id,
      'aria-describedby': rest['aria-describedby'],
      'aria-invalid': rest['aria-invalid'],
      required: rest.required,
      disabled: rest.disabled,
    },
    invalid,
  );
  const fieldLabelId = useFieldLabelId();
  const disabled = control.disabled ?? false;

  return (
    <span
      ref={ref}
      className={cx('pxl-input', 'pxl-date-field', className)}
      style={style}
      data-size={size}
      data-invalid={control['aria-invalid'] ? true : undefined}
      data-disabled={disabled || undefined}
    >
      {prefix != null && <span className="pxl-input__affix">{prefix}</span>}
      <DateSegments
        {...rest}
        aria-labelledby={labelledBy ?? fieldLabelId}
        value={value}
        onChange={setValue}
        controlId={control.id}
        aria-describedby={control['aria-describedby']}
        required={control.required}
        disabled={disabled}
        invalid={control['aria-invalid'] ? true : undefined}
      />
      {suffix != null && <span className="pxl-input__affix">{suffix}</span>}
    </span>
  );
}
