'use client';

import { daysInMonth, isOutOfRange, isSameDay, toISODate } from '@pablo-v/calendar';
import { cx } from '@pablo-v/core';
import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type DateSegmentType = 'day' | 'month' | 'year';

type Parts = Record<DateSegmentType, number | null>;

const LIMITS: Record<DateSegmentType, { min: number; max: number; digits: number }> = {
  day: { min: 1, max: 31, digits: 2 },
  month: { min: 1, max: 12, digits: 2 },
  year: { min: 1, max: 9999, digits: 4 },
};

const DEFAULT_LABELS: Record<DateSegmentType, string> = {
  day: 'Day',
  month: 'Month',
  year: 'Year',
};
const DEFAULT_PLACEHOLDERS: Record<DateSegmentType, string> = {
  day: 'dd',
  month: 'mm',
  year: 'yyyy',
};

type Layout = ({ type: DateSegmentType } | { type: 'literal'; text: string })[];

function layoutFor(locale: string | undefined): Layout {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(new Date(2000, 10, 22));
  return parts.flatMap(
    (part): Layout =>
      part.type === 'day' || part.type === 'month' || part.type === 'year'
        ? [{ type: part.type }]
        : part.type === 'literal'
          ? [{ type: 'literal' as const, text: part.value }]
          : [],
  );
}

function partsOf(date: Date | null): Parts {
  return date
    ? { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }
    : { day: null, month: null, year: null };
}

function compose({ day, month, year }: Parts): Date | null {
  if (day == null || month == null || year == null) return null;
  if (day > daysInMonth(year, month - 1)) return null;
  const date = new Date(year, month - 1, day);
  date.setFullYear(year);
  return date;
}

export interface DateSegmentsProps
  extends Omit<ComponentPropsWithRef<'span'>, 'onChange' | 'defaultValue'> {
  value: Date | null;
  /** Called with a complete date, or `null` once the date is cleared or no longer valid. */
  onChange: (date: Date | null) => void;
  /** BCP 47 locale that decides the segment order and separators. */
  locale?: string;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Id of the first segment, so a `<label htmlFor>` can point at it. */
  controlId?: string;
  'aria-describedby'?: string;
  /** Name of a hidden input that submits the value as `YYYY-MM-DD`. */
  name?: string;
  /** Accessible names of the segments. */
  segmentLabels?: Partial<Record<DateSegmentType, string>>;
  placeholders?: Partial<Record<DateSegmentType, string>>;
}

/**
 * Day, month and year as separate spin buttons in the locale's order. Type
 * digits to fill a segment (focus moves on by itself), arrows to step,
 * Backspace to clear. Building block of DateField and the date pickers.
 */
export function DateSegments({
  value,
  onChange,
  locale,
  min,
  max,
  disabled = false,
  readOnly = false,
  required,
  invalid,
  controlId,
  'aria-describedby': describedBy,
  name,
  segmentLabels,
  placeholders,
  className,
  ...rest
}: DateSegmentsProps) {
  const layout = useMemo(() => layoutFor(locale), [locale]);
  const [parts, setParts] = useState<Parts>(() => partsOf(value));
  const [yearPending, setYearPending] = useState(false);
  const typed = useRef('');
  const emitted = useRef<Date | null>(null);
  const inputs = useRef<Partial<Record<DateSegmentType, HTMLInputElement | null>>>({});
  const order = layout.flatMap((s) => (s.type === 'literal' ? [] : [s.type]));
  const firstType = order[0];

  const composed = yearPending ? null : compose(parts);
  // Only an outside change of `value` resyncs the segments; typing goes through `update`.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the timestamp, not the Date identity
  useEffect(() => {
    if (!isSameDay(value, compose(parts)) && (value != null || compose(parts) != null))
      setParts(partsOf(value));
  }, [value?.getTime()]);

  // A controlled parent that keeps its value after a complete date was typed rejected it.
  useEffect(() => {
    const date = emitted.current;
    if (!date) return;
    emitted.current = null;
    if (!isSameDay(value, date)) setParts(partsOf(value));
  });

  // While the year is still being typed, `2` or `20` are not dates yet, so nothing is emitted.
  const update = (next: Parts, pending = false) => {
    setParts(next);
    setYearPending(pending);
    const date = pending ? null : compose(next);
    if (!isSameDay(date, value) && (date != null || value != null)) {
      emitted.current = date;
      onChange(date);
    }
  };

  const focusSibling = (type: DateSegmentType, delta: number) => {
    const target = order[order.indexOf(type) + delta];
    if (target) inputs.current[target]?.focus();
  };

  const segmentMax = (type: DateSegmentType) =>
    type === 'day' && parts.month != null
      ? daysInMonth(parts.year ?? 2000, parts.month - 1)
      : LIMITS[type].max;

  const step = (type: DateSegmentType, delta: number) => {
    const { min: lo } = LIMITS[type];
    const hi = segmentMax(type);
    const current = parts[type];
    const start =
      current ?? (type === 'year' ? new Date().getFullYear() : delta > 0 ? lo - 1 : hi + 1);
    const next = type === 'year' ? start + (current == null ? 0 : delta) : start + delta;
    const wrapped = next > hi ? lo : next < lo ? hi : next;
    update({ ...parts, [type]: wrapped });
  };

  const onKeyDown = (type: DateSegmentType, event: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    switch (event.key) {
      case 'ArrowUp':
        step(type, 1);
        break;
      case 'ArrowDown':
        if (event.altKey) return;
        step(type, -1);
        break;
      case 'ArrowLeft':
        focusSibling(type, -1);
        break;
      case 'ArrowRight':
        focusSibling(type, 1);
        break;
      case 'Backspace':
      case 'Delete':
        if (typed.current) {
          typed.current = typed.current.slice(0, -1);
          update(
            { ...parts, [type]: typed.current ? Number(typed.current) : null },
            type === 'year' && typed.current !== '',
          );
        } else if (parts[type] != null) {
          update({ ...parts, [type]: null });
        } else if (event.key === 'Backspace') {
          focusSibling(type, -1);
        }
        break;
      default:
        if (/^[./\-\s,]$/.test(event.key) && parts[type] != null) {
          focusSibling(type, 1);
          break;
        }
        return;
    }
    event.preventDefault();
  };

  const onInput = (type: DateSegmentType, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const { digits } = LIMITS[type];
    const hi = type === 'year' ? LIMITS.year.max : segmentMax(type);
    let buffer = typed.current + digit;
    if (Number(buffer) > hi) buffer = digit;
    const number = Number(buffer);
    const done = buffer.length >= digits || number * 10 > hi;
    typed.current = done ? '' : buffer;
    if (type === 'year' || number > 0 || !done)
      update({ ...parts, [type]: number || null }, type === 'year' && !done);
    if (done && number > 0) focusSibling(type, 1);
  };

  const outOfRange = composed != null && isOutOfRange(composed, min, max);
  const impossible = !yearPending && composed == null && order.every((t) => parts[t] != null);
  const isInvalid = invalid || outOfRange || impossible;
  const labels = { ...DEFAULT_LABELS, ...segmentLabels };
  const holders = { ...DEFAULT_PLACEHOLDERS, ...placeholders };

  return (
    <span
      role="group"
      className={cx('pxl-date-segments', className)}
      data-disabled={disabled || undefined}
      {...rest}
    >
      {layout.map((segment, index) => {
        if (segment.type === 'literal')
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: the layout is static per locale
            <span key={index} className="pxl-date-segments__literal" aria-hidden="true">
              {segment.text}
            </span>
          );
        const type = segment.type;
        const current = parts[type];
        const { min: lo, digits } = LIMITS[type];
        return (
          <span
            key={type}
            className="pxl-date-segments__cell"
            data-placeholder={holders[type]}
            style={{ '--_chars': digits } as CSSProperties}
          >
            <input
              ref={(el) => {
                inputs.current[type] = el;
              }}
              id={type === firstType ? controlId : undefined}
              className="pxl-date-segments__segment"
              data-type={type}
              role="spinbutton"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="next"
              aria-label={labels[type]}
              aria-valuenow={current ?? undefined}
              aria-valuemin={lo}
              aria-valuemax={segmentMax(type)}
              aria-valuetext={current == null ? 'Empty' : String(current)}
              aria-describedby={describedBy}
              aria-invalid={isInvalid || undefined}
              aria-required={required || undefined}
              aria-readonly={readOnly || undefined}
              disabled={disabled}
              placeholder={holders[type]}
              value={
                current == null
                  ? ''
                  : type === 'year'
                    ? String(current)
                    : String(current).padStart(digits, '0')
              }
              onFocus={(event) => {
                typed.current = '';
                event.currentTarget.select();
              }}
              onBlur={() => {
                typed.current = '';
                if (type === 'year' && yearPending) update(parts);
              }}
              onKeyDown={(event) => onKeyDown(type, event)}
              onChange={(event) => {
                if (!readOnly) onInput(type, event.target.value);
              }}
            />
          </span>
        );
      })}
      {name && <input type="hidden" name={name} value={composed ? toISODate(composed) : ''} />}
    </span>
  );
}
