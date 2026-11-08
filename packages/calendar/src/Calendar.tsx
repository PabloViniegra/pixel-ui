'use client';

import { cx, useControllableState, useIsomorphicLayoutEffect } from '@pablo-v/core';
import { ChevronLeftIcon, ChevronRightIcon } from '@pablo-v/pixel-icons';
import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addDays,
  addMonths,
  clampDate,
  compareDays,
  isOutOfRange,
  isSameDay,
  startOfDay,
  startOfMonth,
  weekStartOf,
} from './date.js';

export interface DateRange {
  start: Date;
  end: Date;
}

interface CalendarBaseProps
  extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Visible month (any day in it). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  /** Marks extra days as unavailable, e.g. weekends. */
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for month and weekday names. Defaults to the browser's. */
  locale?: string;
  /** 0 = Sunday … 6 = Saturday. Defaults to the locale's first day. */
  weekStartsOn?: number;
  /** Moves focus to the active day on mount. */
  autoFocus?: boolean;
  /** @default 'Previous month' */
  previousLabel?: string;
  /** @default 'Next month' */
  nextLabel?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** @default 'single' */
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  /** Called once both ends are picked; `start` is never after `end`. */
  onChange?: (range: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

const KEY_DAYS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

/**
 * Month grid following the WAI-ARIA date picker pattern: one tab stop, arrow
 * keys move by day and week, Page Up/Down by month (with Shift, by year).
 */
export function Calendar(props: CalendarProps) {
  const {
    mode = 'single',
    value: valueProp,
    defaultValue = null,
    onChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    min,
    max,
    isDateDisabled,
    locale,
    weekStartsOn,
    autoFocus = false,
    previousLabel = 'Previous month',
    nextLabel = 'Next month',
    className,
    ...rest
  } = props;

  const [value, setValue] = useControllableState<Date | DateRange | null>({
    value: valueProp,
    defaultValue,
    onChange: onChange as ((v: Date | DateRange | null) => void) | undefined,
  });
  const selectedDate = mode === 'single' ? (value as Date | null) : null;
  const selectedRange = mode === 'range' ? (value as DateRange | null) : null;

  const initialFocus = () =>
    clampDate(
      startOfDay(selectedDate ?? selectedRange?.start ?? defaultMonth ?? monthProp ?? new Date()),
      min,
      max,
    );
  const [focused, setFocused] = useState(initialFocus);
  const [month, setMonthState] = useControllableState({
    value: monthProp,
    defaultValue: startOfMonth(focused),
    onChange: onMonthChange,
  });
  const visible = startOfMonth(month);
  const inVisible = (date: Date) => isSameDay(startOfMonth(date), visible);
  const focusDay = inVisible(focused)
    ? focused
    : inVisible(startOfDay(new Date()))
      ? startOfDay(new Date())
      : visible;

  // An outside change of the value brings its day into view; picks made here are already visible.
  const selectedTime = (selectedDate ?? selectedRange?.start)?.getTime();
  const pickedTime = useRef(selectedTime);
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the timestamp, not the Date identity
  useEffect(() => {
    if (selectedTime === pickedTime.current) return;
    pickedTime.current = selectedTime;
    if (selectedTime === undefined) return;
    const next = clampDate(startOfDay(new Date(selectedTime)), min, max);
    setFocused(next);
    if (monthProp === undefined && !inVisible(next)) setMonthState(startOfMonth(next));
  }, [selectedTime]);

  const [anchor, setAnchor] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const moveFocus = useRef(autoFocus);
  const id = useId();

  const resolvedWeekStart = weekStartsOn ?? weekStartOf(locale);
  const formats = useMemo(
    () => ({
      title: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      day: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      weekdayShort: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
    }),
    [locale],
  );

  const offset = (visible.getDay() - resolvedWeekStart + 7) % 7;
  const first = addDays(visible, -offset);
  const weeks = Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)),
  );

  const isDisabled = (date: Date) => isOutOfRange(date, min, max) || !!isDateDisabled?.(date);

  useIsomorphicLayoutEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  });

  const goTo = (date: Date, focus: boolean) => {
    const next = clampDate(date, min, max);
    moveFocus.current = focus;
    setFocused(next);
    if (!inVisible(next)) setMonthState(startOfMonth(next));
  };

  const changeMonth = (delta: number) => {
    const next = addMonths(visible, delta);
    setMonthState(next);
    setFocused(clampDate(addMonths(focusDay, delta), min, max));
  };

  const select = (date: Date) => {
    if (isDisabled(date)) return;
    goTo(date, false);
    if (mode === 'single') {
      pickedTime.current = date.getTime();
      setValue(date);
      return;
    }
    if (!anchor) {
      setAnchor(date);
      return;
    }
    const [start, end] = compareDays(date, anchor) < 0 ? [date, anchor] : [anchor, date];
    setAnchor(null);
    pickedTime.current = start.getTime();
    setValue({ start, end });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    let next: Date | null = null;
    const weekday = (focusDay.getDay() - resolvedWeekStart + 7) % 7;
    if (event.key in KEY_DAYS) next = addDays(focusDay, KEY_DAYS[event.key] ?? 0);
    else if (event.key === 'Home') next = addDays(focusDay, -weekday);
    else if (event.key === 'End') next = addDays(focusDay, 6 - weekday);
    else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const step = event.key === 'PageUp' ? -1 : 1;
      next = addMonths(focusDay, event.shiftKey ? step * 12 : step);
    }
    if (!next) return;
    event.preventDefault();
    goTo(next, true);
    if (anchor) setHovered(clampDate(next, min, max));
  };

  const preview = hovered ?? focusDay;
  const range: DateRange | null = anchor
    ? compareDays(preview, anchor) < 0
      ? { start: preview, end: anchor }
      : { start: anchor, end: preview }
    : selectedRange;

  const today = startOfDay(new Date());
  const prevDisabled = min != null && compareDays(addDays(visible, -1), min) < 0;
  const nextDisabled = max != null && compareDays(addMonths(visible, 1), max) > 0;

  return (
    <div
      className={cx('pxl-calendar', className)}
      data-mode={mode}
      data-picking={anchor ? true : undefined}
      {...rest}
    >
      <div className="pxl-calendar__header">
        <button
          type="button"
          className="pxl-calendar__nav"
          aria-label={previousLabel}
          disabled={prevDisabled}
          onClick={() => changeMonth(-1)}
        >
          <ChevronLeftIcon />
        </button>
        <h2 id={`${id}-title`} className="pxl-calendar__title" aria-live="polite">
          {formats.title.format(visible)}
        </h2>
        <button
          type="button"
          className="pxl-calendar__nav"
          aria-label={nextLabel}
          disabled={nextDisabled}
          onClick={() => changeMonth(1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <table
        ref={gridRef}
        role="grid"
        className="pxl-calendar__grid"
        aria-labelledby={`${id}-title`}
        aria-multiselectable={mode === 'range' || undefined}
        onKeyDown={onKeyDown}
        onPointerLeave={() => setHovered(null)}
      >
        <thead>
          <tr>
            {weeks[0]?.map((day) => (
              <th
                key={day.getDay()}
                scope="col"
                abbr={formats.weekdayLong.format(day)}
                className="pxl-calendar__weekday"
              >
                {formats.weekdayShort.format(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]?.getTime()}>
              {week.map((day) => {
                const outside = day.getMonth() !== visible.getMonth();
                const disabled = isDisabled(day);
                const isStart = isSameDay(day, range?.start);
                const isEnd = isSameDay(day, range?.end);
                const inRange =
                  range != null &&
                  compareDays(day, range.start) >= 0 &&
                  compareDays(day, range.end) <= 0;
                const selected =
                  mode === 'single' ? isSameDay(day, selectedDate) : !anchor && inRange;
                return (
                  <td
                    key={day.getTime()}
                    role="gridcell"
                    aria-selected={selected}
                    className="pxl-calendar__cell"
                    data-in-range={mode === 'range' && inRange ? true : undefined}
                    data-range-start={mode === 'range' && isStart ? true : undefined}
                    data-range-end={mode === 'range' && isEnd ? true : undefined}
                  >
                    <button
                      type="button"
                      className="pxl-calendar__day"
                      tabIndex={isSameDay(day, focusDay) ? 0 : -1}
                      aria-label={formats.day.format(day)}
                      aria-current={isSameDay(day, today) ? 'date' : undefined}
                      aria-disabled={disabled || undefined}
                      data-outside={outside || undefined}
                      data-selected={
                        mode === 'single' ? selected || undefined : isStart || isEnd || undefined
                      }
                      onClick={() => select(day)}
                      onPointerEnter={() => {
                        if (anchor && !disabled) setHovered(day);
                      }}
                      onFocus={() => {
                        if (!isSameDay(day, focused)) setFocused(day);
                      }}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
