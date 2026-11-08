'use client';

import {
  Calendar,
  type CalendarRangeProps,
  compareDays,
  type DateRange,
  isSameDay,
} from '@pablo-v/calendar';
import { type Align, cx, type PixelSize, useControllableState } from '@pablo-v/core';
import { DateSegments, type DateSegmentsProps } from '@pablo-v/date-field';
import { DatePickerPopover, DatePickerTrigger } from '@pablo-v/date-picker';
import { useFieldControl, useFieldLabelId } from '@pablo-v/field';
import { type CSSProperties, type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

export interface DateRangePickerProps
  extends Omit<
    DateSegmentsProps,
    'value' | 'onChange' | 'controlId' | 'name' | 'style' | 'ref' | 'defaultValue'
  > {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  /** Called with a complete, ordered range, or `null` once it is cleared or invalid. */
  onChange?: (range: DateRange | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default 'md' */
  size?: PixelSize;
  /** Id of the first segment. Inside a `Field` this is automatic. */
  id?: string;
  /** Names of hidden inputs that submit the ends as `YYYY-MM-DD`. */
  startName?: string;
  endName?: string;
  /** @default 'Start date' */
  startLabel?: string;
  /** @default 'End date' */
  endLabel?: string;
  /** Marks extra days as unavailable in the calendar. */
  isDateDisabled?: (date: Date) => boolean;
  calendarProps?: Omit<CalendarRangeProps, 'mode' | 'value' | 'onChange'>;
  /** Accessible name of the calendar button and panel. @default 'Choose dates' */
  pickerLabel?: string;
  /** @default 'end' */
  align?: Align;
  style?: CSSProperties;
}

/**
 * Start and end DateSegments in one box, with a calendar that picks both ends
 * in two clicks. Either end can also be typed.
 */
export function DateRangePicker({
  value: valueProp,
  defaultValue = null,
  onChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  size = 'md',
  id,
  startName,
  endName,
  startLabel = 'Start date',
  endLabel = 'End date',
  isDateDisabled,
  calendarProps,
  pickerLabel = 'Choose dates',
  align,
  invalid,
  locale,
  min,
  max,
  readOnly,
  className,
  style,
  onKeyDown,
  'aria-labelledby': labelledBy,
  ...rest
}: DateRangePickerProps) {
  const [range, setRange] = useControllableState({ value: valueProp, defaultValue, onChange });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [start, setStart] = useState<Date | null>(range?.start ?? null);
  const [end, setEnd] = useState<Date | null>(range?.end ?? null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Typed ends may be incomplete or reversed while `range` is null, so only a
  // range that differs from the last one emitted resyncs them.
  const emitted = useRef(range);
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the timestamps, not the Date identities
  useEffect(() => {
    const last = emitted.current;
    if (isSameDay(range?.start, last?.start) && isSameDay(range?.end, last?.end)) return;
    if (range == null && last == null) return;
    emitted.current = range;
    setStart(range?.start ?? null);
    setEnd(range?.end ?? null);
  }, [range?.start.getTime(), range?.end.getTime()]);

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
  const disabled = control.disabled ?? false;
  const reversed = start != null && end != null && compareDays(start, end) > 0;
  const isInvalid = !!control['aria-invalid'] || reversed;
  const fieldLabelId = useFieldLabelId();
  const groupLabel = labelledBy ?? fieldLabelId;

  const commit = (nextStart: Date | null, nextEnd: Date | null) => {
    setStart(nextStart);
    setEnd(nextEnd);
    const next =
      nextStart && nextEnd && compareDays(nextStart, nextEnd) <= 0
        ? { start: nextStart, end: nextEnd }
        : null;
    if (next == null && emitted.current == null) return;
    emitted.current = next;
    setRange(next);
  };

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const segmentProps = {
    ...rest,
    locale,
    min,
    max,
    readOnly,
    disabled,
    required: control.required,
    invalid: isInvalid || undefined,
    'aria-describedby': control['aria-describedby'],
  };

  return (
    <>
      <span
        ref={boxRef}
        className={cx('pxl-input', 'pxl-date-range-picker', className)}
        style={style}
        data-size={size}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
          onKeyDown?.(event);
          if (event.altKey && event.key === 'ArrowDown' && !disabled && !readOnly) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span id={`${panelId}-start`} hidden>
          {startLabel}
        </span>
        <span id={`${panelId}-end`} hidden>
          {endLabel}
        </span>
        <DateSegments
          {...segmentProps}
          aria-labelledby={cx(groupLabel, `${panelId}-start`)}
          controlId={control.id}
          name={reversed ? undefined : startName}
          value={start}
          onChange={(date) => commit(date, end)}
        />
        <span className="pxl-date-range-picker__dash" aria-hidden="true">
          –
        </span>
        <DateSegments
          {...segmentProps}
          aria-labelledby={cx(groupLabel, `${panelId}-end`)}
          name={reversed ? undefined : endName}
          value={end}
          onChange={(date) => commit(start, date)}
        />
        {reversed && startName && <input type="hidden" name={startName} value="" />}
        {reversed && endName && <input type="hidden" name={endName} value="" />}
        <span className="pxl-input__affix">
          <DatePickerTrigger
            ref={triggerRef}
            open={open}
            controls={panelId}
            aria-label={pickerLabel}
            disabled={disabled || readOnly}
            onClick={() => (open ? close(false) : setOpen(true))}
          />
        </span>
      </span>
      <DatePickerPopover
        id={panelId}
        aria-label={pickerLabel}
        open={open}
        onClose={close}
        anchorRef={boxRef}
        align={align}
      >
        <Calendar
          {...calendarProps}
          mode="range"
          locale={locale}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          value={start && end && !reversed ? { start, end } : null}
          onChange={(next) => {
            commit(next.start, next.end);
            close(true);
          }}
        />
      </DatePickerPopover>
    </>
  );
}
