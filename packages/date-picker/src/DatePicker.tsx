'use client';

import { Calendar, type CalendarSingleProps } from '@pablo-v/calendar';
import { type Align, useControllableState } from '@pablo-v/core';
import { DateField, type DateFieldProps } from '@pablo-v/date-field';
import { useFieldControl } from '@pablo-v/field';
import { type KeyboardEvent, useId, useRef } from 'react';
import { DatePickerPopover, DatePickerTrigger } from './DatePickerPopover.js';

export interface DatePickerProps extends Omit<DateFieldProps, 'suffix'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Marks extra days as unavailable in the calendar, e.g. weekends. */
  isDateDisabled?: (date: Date) => boolean;
  calendarProps?: Omit<CalendarSingleProps, 'mode' | 'value' | 'onChange'>;
  /** Accessible name of the calendar button and panel. @default 'Choose date' */
  pickerLabel?: string;
  /** @default 'end' */
  align?: Align;
}

/**
 * DateField with a calendar button. The field stays editable; the calendar
 * opens on the button or Alt+ArrowDown and closes after a pick.
 */
export function DatePicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  isDateDisabled,
  calendarProps,
  pickerLabel = 'Choose date',
  align,
  locale,
  min,
  max,
  disabled,
  readOnly,
  onKeyDown,
  ...rest
}: DatePickerProps) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const boxRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const inert = useFieldControl({ disabled }).disabled || readOnly;

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  return (
    <>
      <DateField
        {...rest}
        ref={boxRef}
        value={value}
        onChange={setValue}
        locale={locale}
        min={min}
        max={max}
        disabled={disabled}
        readOnly={readOnly}
        onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
          onKeyDown?.(event);
          if (event.altKey && event.key === 'ArrowDown' && !inert) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        suffix={
          <DatePickerTrigger
            ref={triggerRef}
            open={open}
            controls={id}
            aria-label={pickerLabel}
            disabled={inert}
            onClick={() => (open ? close(false) : setOpen(true))}
          />
        }
      />
      <DatePickerPopover
        id={id}
        aria-label={pickerLabel}
        open={open}
        onClose={close}
        anchorRef={boxRef}
        align={align}
      >
        <Calendar
          {...calendarProps}
          locale={locale}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          value={value}
          onChange={(date) => {
            setValue(date);
            close(true);
          }}
        />
      </DatePickerPopover>
    </>
  );
}
